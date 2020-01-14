export const ContentPortName = "content-port";
class Content {
  port = chrome.runtime.connect({ name: ContentPortName });
}
// port.onMessage.addListener(function(message, sender) {
//   console.log("from content");
//   if (message.greeting === "lklo") {
//   }
// });
