//@ts-check

// open the menu with this function
const closeMenu = () => {
  document.getElementById("menu")?.style.setProperty("visibility", "hidden");
  document.getElementById("open-menu")?.removeAttribute("style");
  localStorage.setItem("isMenuHidden", "true");
};

// close it with this one
const openMenu = () => {
  document.getElementById("menu")?.style.setProperty("visibility", "visible");
  document
    .getElementById("open-menu")
    ?.style.setProperty("visibility", "hidden");
  localStorage.removeItem("isMenuHidden");
};

// listen to the persisted state
window.addEventListener("load", () => {
  if (!window.localStorage) {
    return;
  }
  if (!window.localStorage.getItem("isMenuHidden")) {
    openMenu();
  }
});
