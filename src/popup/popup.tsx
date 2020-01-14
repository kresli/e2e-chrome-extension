import React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { RecipeAction, PortName } from "~/actions";

@observer
export class Popup extends React.Component {
  @observable isRecording = false;
  port = chrome.runtime.connect({ name: PortName.POPUP });
  private setIsRecording = action((isRecording: boolean) => () => {
    this.isRecording = isRecording;
    const action = isRecording
      ? RecipeAction.START_RECORDING
      : RecipeAction.STOP_RECORDING;
    this.port.postMessage({ action });
  });
  render() {
    return (
      <div>
        <button onClick={this.setIsRecording(true)} style={{ fontSize: "2em" }}>
          start
        </button>

        <button
          onClick={this.setIsRecording(false)}
          style={{ fontSize: "2em" }}
        >
          stop
        </button>
      </div>
    );
  }
}
