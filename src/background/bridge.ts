import { PortName } from "~/actions";
import { BridgePort, PortListener, Recipe } from "~/components";

export class Bridge {
  protected ports = new Map<PortName, BridgePort>();
  private allListeners: Set<PortListener> = new Set();
  constructor() {
    chrome.runtime.onConnect.addListener(port => {
      this.setPort(port);
    });
  }
  private setPort(port: chrome.runtime.Port) {
    const portName = port.name as PortName;
    if (!Object.values(PortName).includes(portName as PortName))
      throw new Error(`${portName} is not registered port`);
    this.ports.set(
      portName,
      new BridgePort({
        port,
        onDisconnect: () => this.ports.delete(portName)
      })
    );
    this.ports.get(portName)?.setListeners([...this.allListeners]);
  }

  protected registerListener(listener: (recipe: Recipe) => void) {
    this.allListeners.add((recipe: Recipe) => listener(recipe));
    this.ports.forEach(port => port.setListeners([...this.allListeners]));
  }
}
