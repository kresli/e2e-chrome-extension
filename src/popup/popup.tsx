import React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { PopupBridge } from "~/popup/popup.bridge";
@observer
export class Popup extends React.Component {
  private bridge = new PopupBridge();
  private setIsRecording = (isRecording: boolean) => () =>
    this.bridge.setIsRecording(isRecording);
  render() {
    if (!this.bridge) return <div>Loading...</div>;
    return (
      <div>
        {!this.bridge.isRecording && (
          <button
            onClick={this.setIsRecording(true)}
            style={{ fontSize: "2em" }}
          >
            start
          </button>
        )}
        {this.bridge.isRecording && (
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
