import { ContentPortName } from "~/content/content";
import { PopupPortName } from "~/popup/popup";
import { Action } from "~/actions";

const _messagesCallbacks = new Map<Action, Set<(message: Message) => void>>();

interface Message {
  action: Action;
}

interface Ports {
  content: chrome.runtime.Port | null;
  popup: chrome.runtime.Port | null;
  // devtools: chrome.runtime.Port | null;
}

interface Config {
  port: string;
  action: Action;
}

function onMessage(action: Action) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const set = _messagesCallbacks.get(action) || new Set();
    set.add(descriptor.value);
    _messagesCallbacks.set(action, set);
  };
}

class Bridge {
  private ports: Ports = {
    content: null,
    popup: null
    // devtools: null
  };
  constructor() {
    chrome.runtime.onConnect.addListener(port => {
      this.setPort(port);
    });
  }
  private setPort(port: chrome.runtime.Port) {
    switch (port.name) {
      case ContentPortName: {
        this.ports.content = port;
        port.onDisconnect.addListener(() => (this.ports.content = null));
        break;
      }
      case PopupPortName: {
        this.ports.popup = port;
        port.onDisconnect.addListener(() => (this.ports.popup = null));
        break;
      }
      default:
        throw new Error(`${port.name} is not registered port`);
    }
    port.onMessage.addListener((message: Message) => {
      const messages = _messagesCallbacks.get(message.action);
      if (!messages) return;
      messages.forEach(cb => cb(message));
    });
  }
  @onMessage(Action.START_RECORDING)
  doSomething(message: Message) {
    console.log("action!!!");
  }
}

const bridge = new Bridge();
