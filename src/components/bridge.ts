const MissingPortError = new Error(
  `Cannot establish connection. Port wasn't initialized`
);

interface Config {
  listener: boolean;
}

export class Bridge {
  protected port?: chrome.runtime.Port;
  protected listeners: Array<(msg: any) => void> = [];
  constructor() {
    chrome.runtime.onConnect.addListener(() => {
      console.log("connecxted");
      this.onConnect();
    });
  }
  onConnect() {}
  postMessage(msg: any) {
    if (!this.port) throw MissingPortError;
    this.port.postMessage(msg);
  }
  onMessage<T>(cb: (msg: T) => void) {
    if (!this.port) {
      this.listeners.push(msg => cb(msg));
    } else {
      this.port.onMessage.addListener(msg => cb(msg));
    }
  }
  setPort(port: chrome.runtime.Port) {
    this.port = port;
  }
}
