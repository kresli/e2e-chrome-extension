import { Extension } from "~/components";

console.log("hello");
class Background extends Extension {
  constructor(port: chrome.runtime.Port) {
    super(port);
    this.onMessage(msg => {
      console.log("huasdfdsray", msg);
    });
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const background = new Background();
  chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(
    response
  ) {
    console.log(response.farewell);
  });
});
