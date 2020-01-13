import { Bridge } from "~/components";

export class BackgroundBridge extends Bridge {
  constructor() {
    super();
    this.onMessage(msg => {
      console.log("eduard", msg);
    });
  }
  onConnect() {
    this.setPort(chrome.runtime.connect());
    console.log(this.port);
    // this.listeners.forEach(li => this.port?.onMessage.addListener(li));
    this.listeners = [];
  }
}
