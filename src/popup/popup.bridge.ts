import { Bridge } from "~/components";
import { observable, action } from "mobx";

export class PopupBridge extends Bridge {
  @observable isRecording = false;

  constructor() {
    super();
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab.id) return;
      this.setPort(chrome.tabs.connect(tab.id));
    });
  }
  @action setIsRecording(isRecording: boolean) {
    this.isRecording = isRecording;
    this.postMessage("recording");
  }
}
