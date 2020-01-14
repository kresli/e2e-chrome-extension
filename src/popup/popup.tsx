import React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { Action } from "~/actions";

export const PopupPortName = "popup-port";

@observer
export class Popup extends React.Component {
  @observable isRecording = false;
  port = chrome.runtime.connect({ name: PopupPortName });
  private setIsRecording = action((isRecording: boolean) => () => {
    this.isRecording = isRecording;
    this.port.postMessage({ action: Action.STOP_RECORDING });
  });
  render() {
    return (
      <div>
        {!this.isRecording && (
          <button
            onClick={this.setIsRecording(true)}
            style={{ fontSize: "2em" }}
          >
            start
          </button>
        )}
        {this.isRecording && (
          <button
            onClick={this.setIsRecording(false)}
            style={{ fontSize: "2em" }}
          >
            stop
          </button>
        )}
      </div>
    );
  }
}
