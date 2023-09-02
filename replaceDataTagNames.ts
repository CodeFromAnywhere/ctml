import { load } from "cheerio";
import fs from "fs";
import { getObjectKeysArray } from "js-util";
import path from "path";
import { tryParseCsv } from "csv-util";
import { readJsonFileSync } from "read-json-file";
import { root } from "./project";

export const getDataFilePath = (tag: string) => {
  if (tag.endsWith(".json")) {
    const absolutePath = path.join(root, tag);
    if (fs.existsSync(absolutePath)) {
      return { absolutePath, type: "json" };
    }
    return;
  }

  if (tag.endsWith(".csv")) {
    const absolutePath = path.join(root, tag);
    if (fs.existsSync(absolutePath)) {
      return { absolutePath, type: "csv" };
    }
    return;
  }

  const csvPath = path.join(root, tag + ".csv");

  if (fs.existsSync(csvPath)) {
    return { absolutePath: csvPath, type: "csv" };
  }
  const jsonPath = path.join(root, tag + ".json");
  if (fs.existsSync(jsonPath)) {
    return { absolutePath: jsonPath, type: "json" };
  }

  return;
};
export const replaceDataTagNames = (html: string, dataTagNames: string[]) => {
  if (dataTagNames.length === 0) {
    return html;
  }

  const $ = load(html);

  dataTagNames.map((tag) => {
    const result = getDataFilePath(tag);
    if (!result) {
      return;
    }
    // get tag datafile json

    const json =
      result.type === "csv"
        ? tryParseCsv(result.absolutePath)
        : readJsonFileSync<{ [key: string]: string }[]>(result.absolutePath);

    if (!json) {
      return;
    }
    // get children's html
    const children = $(tag).html();

    if (!children) {
      return;
    }

    const results = json
      .map((item) => {
        let result = `<span>${children}</span>`;
        getObjectKeysArray(item).map((key) => {
          result = result.replaceAll("${" + key + "}", item[key]);
        });

        return result;
      })
      .join("\n\n");

    // remove tag + children
    $(tag).replaceWith(results);
  });

  const finalHtml = $.html();

  return finalHtml;
};
