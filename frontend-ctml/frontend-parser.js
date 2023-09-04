const templates = {};

const replaceHtml = async (firstElement) => {
  let next = firstElement;

  while (true) {
    console.log(`doing`, next.tagName);

    let newChild = next;

    if (templates[next.tagName] === undefined) {
      try {
        console.log(`fetch:`, next.tagName);
        const result = await fetch(`${next.tagName.toLowerCase()}.htm`);
        if (result.status === 200) {
          const content = await result.text();
          console.log({ content });
          templates[next.tagName] = content;
        } else {
          templates[next.tagName] = null;
        }
      } catch {
        templates[next.tagName] = null;
      }
    }

    if (templates[next.tagName] !== null) {
      // NB: it's something

      console.log(next.tagName, ` has template`);
      const content = templates[next.tagName];

      // example: https://stackoverflow.com/questions/50279138/passing-an-element-after-changing-outerhtml

      const sibling = next.nextElementSibling;
      const parent = next.parentElement;

      try {
        newChild.outerHTML = content;
      } catch {
        newChild.innerHTML = content;
      }
      newChild = sibling
        ? sibling.previousElementSibling
        : parent?.lastElementChild;

      console.log({ parent, newChild });

      // console.log({ content, outer: child.outerHTML, childr: child.children, newChild, ch: newChild.children });
    }

    if (newChild.children.item(0)) {
      replaceHtml(newChild.children.item(0));
    }

    next = next.nextElementSibling;

    if (!next) {
      break;
    }
  }
};

window.addEventListener("load", (e) => {
  const href = window.location.href;
  const filePrefix = "file:///";
  const path = href.slice(filePrefix.length);

  if (href.startsWith(filePrefix)) {
    window.document.firstElementChild.innerHTML = `<meta http-equiv="refresh" content="0; url=http://localhost:3000/${path}" />`;
  } else {
    replaceHtml(window.document.children.item(0));
  }
});
