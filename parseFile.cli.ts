#!/bun

import { parseFile } from "./parseFile";

const [filename] = process.argv.slice(2);

await parseFile(filename);
