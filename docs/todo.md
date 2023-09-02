# TODO

# Docs

- concepts overview (in `md`)
- add short tutorial
- try hosting it on cloudflares edge in a way that it runs the server

# Markdown

- exposing code files in `.md`
- frontmatter in markdown as variables for the wrapper
- markdown-in-html with special tag `<markdown>` or so
- ability to add custom md parser to the server
- ensure that generated html from `.md` is still parsed again

# Parsing:

- support for folders while location of a file isn't important as the page is served without folder prefix
- functionality to match against most nearby file with name (unique naming not enforced)
- parser performance
- add difference between dev and prod
- only inject auto refresh in dev-mode
- in prod, it only rebuilds stuff after it's stale
