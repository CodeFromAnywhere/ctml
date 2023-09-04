# Roadmap

I aim to make my own blog website in ctml, but also some other simple websites that I will host on several domains. I aim to make it easy for myself to quickly ship a simple website, as quick as buying a domain, basically.

## Bugs

Fix menu persistence

## Integration

See [migration](migration.html). The initial goal would be to integrate it with my own server so it's served from a domain based on my `ManagedDomain` database table. If it's turned on for a `ManagedDomain` entry, it should take priority over React SSR but not completely turn it off necessarily.

## Parsing:

- ability to scrape routes that need to be built rather than building all and rather than building only by specifying
- attach all parameters that weren't used as variables to the outer element of the component
- support for folders while location of a file isn't important as the page is served without folder prefix
- functionality to match against most nearby file with name (unique naming not enforced)
- parser performance
- add difference between dev and prod
- only inject auto refresh in dev-mode
- in prod, it only rebuilds stuff after it's stale

## Markdown

- ensure that generated html from `.md` is still parsed again
- exposing code files in `.md` and `.htm` using `<code src="filename.ts"></code>`
- ability to specify the wrapper for markdown specifically
- frontmatter in markdown as variables for the wrapper
- listen to other standardised markdown variables too in the wrapper like `isPublic/isDraft` but also `header`
- markdown-in-html with special tag `<markdown>` or so
- ability to add custom md parser to the server

**Once I get here... I can build a very nice blog for karsens.com**
