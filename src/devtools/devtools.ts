chrome.devtools.panels.create(
  "E2E",
  "coldfusion10.png",
  "devtools/panel.html",
  function(panel) {
    console.log("hello from callback");
  }
);
