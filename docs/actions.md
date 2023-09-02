# Actions

If you want to have a website where the user can perform actions (e.g. crud actions into a db) you need a way to receive events from your webpage.

A good way to do this with html is - and always has been - the `<form>` element.

An example can be found [here](books.html). If you go there and click through to "add book" you'll find a form to add a book into the list.

The code for adding a book consists of [add-book.htm](add-book.htm) and [add-book.ts](add-book.ts).

How it works, is that every post request on the server is catched, processed, and the result is posted back to the user via a page redirect. The response of the backend function will be available in the query parameters of the url of the page where the user goes to via the form action.

E.g. if I add a book I end up here: `/books.html?isSuccessful=true&message=Book%20Added`. You can use regular javascript to do anything you want with this response.
