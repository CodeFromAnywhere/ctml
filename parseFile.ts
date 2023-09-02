import fs from "fs/promises";
import path from "path";
import { parseFileRecursive } from "./parseFileRecursive";
import { root } from "./project";

export const parseFile = async (filename: string) => {
  const name = path.parse(filename).name;
  const customHtml = filename.endsWith(".md")
    ? `<wrapper title="Page: ${filename}"><${name}></${name}></wrapper>`
    : undefined;

  const html = await parseFileRecursive({
    attributes: [],
    filename,
    stack: [],
    customHtml,
  });

  if (!html) {
    return;
  }

  await fs.writeFile(path.join(root, name + ".html"), html, "utf8");
};
