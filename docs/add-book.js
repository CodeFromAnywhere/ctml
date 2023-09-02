import { fs } from "fs-util";

const json = fs.readFileSync("books.json", "utf8");
// append the array
const newJson = json
  .slice(json.length - 1)
  // the variables should be provided at the top-level upon executing this file
  .concat(JSON.stringify({ author, summary, title }))
  .concat("]");
fs.writeFileSync("books.json", newJson, "utf8");
