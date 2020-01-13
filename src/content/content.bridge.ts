import { Bridge } from "~/components";
console.log("!!");
export class Content extends Bridge {
  constructor() {
    super();
    this.setPort(chrome.runtime.connect());
  }
}
