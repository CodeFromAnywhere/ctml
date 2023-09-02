import { pagesToBuild } from "./project";
import { parseFile } from "./parseFile";

const parseFiles = (filenames: string[]) => {
  filenames.map(parseFile);
};
// build isn't needed as the server will also build, unless you don't want to have your own server and just serve static stuff

parseFiles(pagesToBuild);
/*["welcome.md", "index.htm", "rolf-vid-gen.md"]*/
