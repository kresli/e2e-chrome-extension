import $ from "jquery";
import { PortName, RecipeAction } from "~/actions";
import { BridgePort, Recipe, RecipeAddRecord } from "~/components";
import { action } from "mobx";

const MouseEvents = [
  "auxclick",
  "click",
  "contextmenu",
  "dblclick",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseover",
  "mouseout",
  "mouseup",
  "pointerlockchange",
  "pointerlockerror",
  "select",
  "wheel"
];

type QMouseEvent = JQuery.TriggeredEvent<
  HTMLElement,
  undefined,
  HTMLElement,
  HTMLElement
>;

function generateSelector(el: HTMLElement) {
  let elems: Array<HTMLElement> = [el];
  while (elems[0].tagName !== "BODY" || !elems[0].parentElement) {
    elems.unshift(elems[0].parentElement!);
  }
  return elems
    .map(el => {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const classNames =
        el.classList.length !== 0
          ? [...el.classList].map(c => `.${c}`).join("")
          : "";
      return `${tag}${id}${classNames}`;
    })
    .join(" ");
}

class Content {
  private port = new BridgePort({
    port: chrome.runtime.connect({ name: PortName.CONTENT })
  });
  constructor() {
    this.port.setListeners([
      this.onStartRecording.bind(this),
      this.onStopRecording.bind(this)
    ]);
  }
  private observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      if (addedNodes === null) return;
      $(Array.from(addedNodes) as HTMLElement[]).on(...this.onEvent);
    });
  });
  private isRecording = false;
  private onEvent: [string, (ev: QMouseEvent) => void] = [
    "click",
    ({ target, currentTarget, timeStamp }: QMouseEvent) => {
      console.log("click");
      if (target !== currentTarget || !this.isRecording) return;
      const path = generateSelector(target);
      this.port.postRecipe(
        new RecipeAddRecord({ path, timeStamp, url: window.location.href })
      );
    }
  ];
  private onStartRecording(recipe: Recipe) {
    console.log("received ", recipe);
    if (recipe.action !== RecipeAction.START_RECORDING) return;
    this.isRecording = true;
    this.observer.observe(document, {
      attributes: false,
      childList: true,
      subtree: true
    });
    $("*").on(...this.onEvent);
  }
  private onStopRecording(recipe: Recipe) {
    if (recipe.action !== RecipeAction.STOP_RECORDING) return;
    this.isRecording = false;
    console.log("stop");
  }
}
new Content();
