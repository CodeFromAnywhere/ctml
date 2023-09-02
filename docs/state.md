There are many different ways to handle state.

CTML encourages the following:

# DOM as SOT:

The DOM is your source of truth for local unpersisted state. For example, removing a property from an html element can be done like so:

```html
<div onclick="document.getElementById('some-element-id')?.remove();">...</div>
```

As an example, try clicking the discord icon on the menu, and it will be hidden (after the alert).

# Local persistence

If you want the user to keep certain state persisted, it's easy enough to use `localStorage` directly. Here is an exammple where two functions are created that alter the dom and persist this behavior using `localStorage`

```html
<script>
  const closeMenu = () => {
    document.getElementById("menu")?.style.setProperty("visibility", "hidden");
    document.getElementById("open-menu")?.removeAttribute("style");
    localStorage.setItem("isMenuHidden", "true");
  };

  const openMenu = () => {
    document.getElementById("menu")?.style.setProperty("visibility", "visible");
    document
      .getElementById("open-menu")
      ?.style.setProperty("visibility", "hidden");
    localStorage.removeItem("isMenuHidden");
  };

  window.onload = () => {
    console.log(localStorage.getItem("isMenuHidden"));
    if (localStorage.getItem("isMenuHidden")) {
      closeMenu();
    }
  };
</script>
```

To see this example in action, click the (X) on the menu, and referesh your page.

# Shared state

State that must be shared between users is usually stored in your backend server or in some remote database. CTML encourages to share state right on your edge using static files. How these files get there and how they are altered is up to you.

Consider you have `movies.json` in your static files:

```json
[
  {
    "title": "The Matrix",
    "author": "Wachowski Brothers",
    "summary": "Blue pill red pill"
  },
  {
    "title": "The Terminator",
    "author": "Some guy",
    "summary": "Arnold ist macho ja"
  },
  {
    "title": "Lord of the Rings",
    "author": "Some other guy",
    "summary": "It's also a movie"
  }
]
```

You can now render this in your html by doing something like this in `movies.htm`

```html
<wrapper title="Movies">
  <h1>Movies page</h1>
  <movies>
    <p><b>${title}</b> by <i>${author}</i></p>
    <pre markdown>${summary}</pre>
  </movies>
</wrapper>
```

See the result [here](movies.html).
