import { RecipeAction, PortName } from "~/actions";
import { Recipe, BridgePort, PortListener } from "~/components";
import Dexie from "dexie";
import "babel-polyfill";
interface Record {
  timeStamp: number;
  path: string;
}

class DB extends Dexie {
  public records: Dexie.Table<Record, number>;
  constructor() {
    super("DB");
    this.version(1).stores({
      records: "timeStamp,path"
    });
  }
}

const db = new DB();

// db.transaction("rw", db.records, async () => {
//   // // Make sure we have something in DB:
//   // if ((await db.friends.where('name').equals('Josephine').count()) === 0) {
//   //     let id = await db.friends.add({name: "Josephine", age: 21});
//   //     alert (`Addded friend with id ${id}`);
//   // }

//   // Query:
//   let youngFriends = await db.friends
//     .where("age")
//     .below(25)
//     .toArray();

//   // Show result:
//   alert("My young friends: " + JSON.stringify(youngFriends));
// }).catch(e => {
//   alert(e.stack || e);
// });

class Bridge {
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

class Background extends Bridge {
  constructor() {
    super();
    this.registerListener(this.delegate.bind(this));
    this.registerListener(this.onAddRecord.bind(this));
  }

  private delegate(recipe: Recipe) {
    this.ports.forEach(port => port.postRecipe(recipe));
  }

  private onAddRecord(recipe: Recipe) {
    if (recipe.action !== RecipeAction.ADD_RECORD) return;
    console.log("1. onAddRecord");
    db.transaction("rw", db.records, async () => {
      console.log("2. transaction");
      let id = await db.records.add(recipe.message);
      alert(`Addded friend with id ${id}`);
    });
  }
}

new Background();
