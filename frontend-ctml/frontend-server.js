import { serve } from "bun";
import fs from "fs";
// idea: add entire file hierarchy at path /etc/explore or so, so the thing has support for folders too...
serve({
  port: 80,
  fetch: (req) => {
    const pathname = new URL(req.url).pathname;

    const absolutePath = `/` + pathname;

    if (fs.existsSync(absolutePath)) {
      return new Response(Bun.file(absolutePath));
    }

    return new Response("404", { status: 404 });
  },
});
