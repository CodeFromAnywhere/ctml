// The server should simply serve html files

import fs from "fs";
import path from "path";
import { root } from "./project";
import { redirectWithResponse } from "../redirectWithResponse";
import { extensionPriorityOrder } from "./parseFileRecursive";
import { Serve } from "bun";
import { spawn } from "child_process";

export default {
  fetch: async (req) => {
    // post requests should be completely handled first
    if (req.method === "POST") {
      try {
        const formData = await req.formData();
        const formDataObject: { [key: string]: string | undefined } = {};
        Array.from(formData.keys()).map((key) => {
          formDataObject[key] = formData.get(key)?.toString();
        });
        const referer = req.headers.get("referer");
        const page = referer ? path.parse(referer).name : null;

        const fn = page
          ? (await import(path.join(root, page))).default
          : undefined;

        const response = await fn(formDataObject);

        // NB: Executed functions will be responded to by putting it in the query string of the url the user is redirected to
        return redirectWithResponse(req.url, response);
      } catch (e: any) {
        console.log("ERRIE", e);
        return redirectWithResponse(req.url, {
          isSuccessful: false,
          message: e.toString(),
        });
      }
    }

    const pathname = new URL(req.url).pathname;
    const name = path.parse(pathname).name;
    const ext = path.parse(pathname).ext;
    const realName = name === "" ? "index" : name;

    if (ext !== ".html") {
      if (fs.existsSync(path.join(root, pathname))) {
        return new Response(Bun.file(path.join(root, pathname)));
      }

      return new Response("404", {
        status: 404,
        statusText: "File could not be found",
      });
    }

    await Promise.all(
      extensionPriorityOrder.map(async (extension) => {
        const filename = realName + "." + extension;
        const extPath = path.join(root, filename);
        if (fs.existsSync(extPath)) {
          // console.log("exists", { extPath });

          // Cork error: https://github.com/oven-sh/bun/issues/3480 (to quickfix, just spawn it so it's not done from the same process)
          //   await parseFile(filename);
          await new Promise<void>((resolve) => {
            spawn(`bun run parseFile.cli.ts ${filename}`, {
              cwd: import.meta.dir,
              shell: "zsh",
            })
              .addListener("error", (err) => console.log("ERR"))
              .addListener("spawn", () => console.log("SPAWN"))
              .addListener("close", (code) => {
                // console.log(`close`, code);
                resolve();
              });
          });
        }
      }),
    );

    const htmlPath = path.join(root, realName + "." + "html");

    if (fs.existsSync(htmlPath)) {
      return new Response(Bun.file(htmlPath), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("404", {
      status: 404,
      statusText: "File could not be found",
    });
  },
} satisfies Serve;
