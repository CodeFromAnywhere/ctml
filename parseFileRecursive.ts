import path from "path";
import fs from "fs/promises";
import { Converter } from "showdown";
import { load } from "cheerio";
import { getObjectKeysArray } from "js-util";
import { format } from "prettier";
import { replaceDataTagNames } from "./replaceDataTagNames";
const converter = new Converter();

/* todo:
1. load all non-html files in memory
2. start with index.htm and replace tags with the files representing them, recursively
3. open index.html and see what happens
*/
export const extensionPriorityOrder = ["htm", "md", "json", "csv", "ts", "js"];
export const root = path.join(import.meta.dir, "docs");
export const files = await fs.readdir(root);
export const nonHtmlFiles = files.filter((p) => path.parse(p).ext !== ".html");

export const parseFileRecursive = async (config: {
  filename: string;
  stack: string[];
  customHtml?: string;
  attributes: [string, string][];
}) => {
  const { attributes, filename, stack, customHtml } = config;

  const extension = path.parse(filename).ext;
  const absolutePath = path.join(root, filename);

  const fileUrl = path.join("file://", absolutePath);
  const response = customHtml ? new Response(customHtml) : await fetch(fileUrl);

  if (extension === ".md" && !customHtml) {
    // support md by converting it into html
    const md = await response.text();
    let html = converter.makeHtml(md);

    // get file and replace variables we got in attributes
    attributes.map(([key, value]) => {
      html = html.replaceAll("${" + key + "}", value);
    });

    return html;
  }

  if (extension !== ".htm" && !customHtml) {
    return;
  }

  // every a href needs to be insta-crawled (until lazy). this means also parsing this htm (or any ext) into an html

  const dataTagNames: string[] = [];

  let rewriter = new HTMLRewriter().on("*", {
    async element(element: HTMLRewriterTypes.Element) {
      // here we need to open the file, and go into recursion until it's html
      // if the file exists, replace the content
      // todo: find the first suitable ext based on stack (if i need it at all)

      // collect attributes
      const elementAttributes = Array.from(element.attributes).map(
        ([key, value]) => {
          return [key, value] as [string, string];
        },
      );

      // console.log({ name: element.tagName, elementAttributes });

      // NB: look if the htm file exists but it's not the file we're reading now
      if (
        filename !== element.tagName + ".htm" &&
        files.includes(element.tagName + ".htm")
      ) {
        const html = await parseFileRecursive({
          attributes: elementAttributes,
          filename: element.tagName + ".htm",
          stack: stack.concat(filename),
        });
        if (html) {
          const [prefix, suffix] = html.split("${children}") as (
            | string
            | undefined
          )[];
          if (!suffix) {
            //replace everything including children because included element uses no children
            element.replace(html, { html: true });
          } else if (prefix && suffix) {
            // replace tag its meaning, but keep children
            element
              .removeAndKeepContent()
              .append(suffix, { html: true })
              .prepend(prefix, { html: true });
          }
        }

        return;
      }

      // NB: look if the md file exists but it's not the file we're reading now
      if (
        (filename !== element.tagName + ".md" || !!customHtml) &&
        files.includes(element.tagName + ".md")
      ) {
        const html = await parseFileRecursive({
          attributes: elementAttributes,
          filename: element.tagName + ".md",
          stack: stack.concat(filename),
        });
        // console.log(element.tagName + ".md", html);

        if (html) {
          // NB: no support for .md with children atm, don't think it's needed.
          // No support for self-closing atm either, maybe bun bug
          element.replace(html, { html: true });
        }

        return;
      }

      if (
        (element.tagName.endsWith(".csv") && files.includes(element.tagName)) ||
        (element.tagName.endsWith(".json") &&
          files.includes(element.tagName)) ||
        files.includes(element.tagName + ".csv") ||
        files.includes(element.tagName + ".json")
      ) {
        dataTagNames.push(element.tagName);
        //collect the data tagname so we can later find and replace it with copies of its children filled with data
        return;
      }

      // TODO: js, ts

      // if not, leave as-is
    },
  });

  let transformed = await rewriter.transform(response).text();

  // get file and replace variables we got in attributes
  attributes.map(([key, value]) => {
    transformed = transformed.replaceAll("${" + key + "}", value);
  });

  const htmlWithData = replaceDataTagNames(transformed, dataTagNames);
  // TODO: Fix bug where it adds quotes
  return format(htmlWithData, { parser: "html", singleQuote: true });
};
