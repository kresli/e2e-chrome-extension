import * as React from "react";
import ReactDOM from "react-dom";

console.log("Hello from tsx!");

ReactDOM.render(<p>Hello</p>, document.getElementById("root"));

console.log("hello from devtools");
chrome.devtools.panels.create(
  "ColdFire",
  "coldfusion10.png",
  "dist/panel.html",
  function(panel) {
    console.log("hello from callback");
  }
);
