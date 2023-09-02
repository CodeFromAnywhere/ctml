If you want to serve your ctml code, it needs to be parsed to html first. For this, the parser is used. It traverses your code recursively from your `index.htm` file down to the last element.

Once it's done you'll end up with your html files in the same directory because it is saved as `.html` while your ctml code must be saved as `.htm`.

# Parsetime

Parsing before deploying would create a static website. But what if we parse lazily, jit? This makes it possible for edge-sites to become dynamic.

## Building static sites

If you want to serve html and other static files rather than a server, you can do so. This removes the possibility for receiving post requests because there won't be a server to receive them. Other than that, it works the same.

## Building dynamic sites

If you serve your server (via `bun run server.cli.ts`) your pages are regenerated when needed and you can also send post-requests.

# Speed

Once we have html on the edge, things will be fast. But imagine this: we use https://web.dev/link-prefetch/ to prefetch the entire website so everything is literally instant.
