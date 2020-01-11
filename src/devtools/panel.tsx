import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<p>hi</p>, document.getElementById("root"));

chrome.browserAction.onClicked.addListener(function(tab) {
  alert("test");
});
