import { Recipe } from "~/components";

export type PortListener = (recipe: Recipe) => void;

export class BridgePort {
  private registeredListeners = new Set<PortListener>();
  constructor(
    private config: {
      port: chrome.runtime.Port;
      onDisconnect?: () => void;
    }
  ) {
    config.port.onDisconnect.addListener(() => {
      if (config.onDisconnect) config.onDisconnect();
    });
    config.port.onMessage.addListener((recipe: Recipe) => {
      this.registeredListeners.forEach(listener => listener(recipe));
    });
  }
  public setListeners(listener: PortListener[]) {
    this.registeredListeners = new Set(listener);
  }
  public postRecipe({ action, message }: Recipe) {
    this.port.postMessage({ action, message });
  }
  private get port() {
    return this.config.port;
  }
}
