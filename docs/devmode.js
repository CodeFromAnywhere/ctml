//  @ts-check

// useful little script to ensure the page refreshes when we go there again.
// especially useful as "devmode"
window.onblur = function () {
  window.onfocus = function () {
    window.location = self.location;
  };
};
