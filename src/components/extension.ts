interface Message {
  value: any;
}
export class Extension {
  constructor(private port: chrome.runtime.Port) {}
  postMessage(msg: any) {
    this.port.postMessage(msg);
  }
  onMessage<T>(cb: (msg: T) => void) {
    this.port.onMessage.addListener(msg => cb(msg));
  }
  startRecording() {
    this.postMessage("start_recording");
  }
}
