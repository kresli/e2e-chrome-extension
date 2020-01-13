import React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { Extension } from "~/components";
@observer
export class Popup extends React.Component {
  @observable isRecording = false;
  extension = new Extension(chrome.runtime.connect());
  private setIsRecording = action((isRecording: boolean) => () => {
    this.extension.startRecording();
    this.isRecording = isRecording;
  });
  render() {
    return (
      <div>
        {!this.isRecording && (
          <button onClick={this.setIsRecording(true)}>start</button>
        )}
        {this.isRecording && (
          <button onClick={this.setIsRecording(false)}>stop</button>
        )}
      </div>
    );
  }
}
