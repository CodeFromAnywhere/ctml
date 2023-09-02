import fs from "fs";
import path from "path";
import { root } from ".";

export default (context: {
  author: string;
  summary: string;
  title: string;
}) => {
  const { author, summary, title } = context;

  // append the array
  const jsonString = fs.readFileSync(path.join(root, "books.json"), "utf8");

  const json = JSON.parse(jsonString);
  const newJson = json.concat([{ author, summary, title }]);

  fs.writeFileSync(
    path.join(root, "books.json"),
    JSON.stringify(newJson),
    "utf8",
  );

  return { isSuccessful: true, message: "Book added" };
};
