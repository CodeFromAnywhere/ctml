# Parsing Rules

1. html is holy. All html tags are reserved.
2. overwriting an html tag can be done in order to make it act differently everywhere, for example if you want to apply a style.
3. every tag that is not official html refers to (and will 'include') the closest filename that has the same name as the tag, regardless of its extension
4. you can specify the extension in the tagname if you want to be explicit but by default, the priority order is used: htm, json, md, ts, js. html is never included as it is the extension used after parsing.
5. variables can be used with `${variable}` syntax (like in js) and can be passed into html tags as its attributes.
6. included markdown is parsed to html. markdown can also use html and ctml
7. inluded json is mapped if an array, and its object properties become available as variables (item is main value if it's not an object). csv is also a first-class citizen and works the same.
