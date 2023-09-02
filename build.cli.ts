import { parseFile } from "./parseFile";

const parseFiles = (filenames: string[]) => {
  filenames.map(parseFile);
};
// build isn't needed as the server will also build, unless you don't want to have your own server and just serve static stuff

const docs = [
  "index.htm",
  "speed.md",
  "story.md",
  "parser.md",
  "serving.md",
  "state.md",
  "parsetime.md",
  "books.htm",
  "movies.htm",
  "add-book.htm",
];

parseFiles(docs);
/*["welcome.md", "index.htm", "rolf-vid-gen.md"]*/
