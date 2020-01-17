import { Controller, Bundle, computedAlive } from "mstb";
import {
  types,
  SnapshotIn,
  IStateTreeNode,
  IAnyStateTreeNode,
  applySnapshot,
  getSnapshot,
  onSnapshot,
  SnapshotOut
} from "mobx-state-tree";
import { action } from "mobx";
import uuid from "uuid";
import "babel-polyfill";

export function syncLocalStorage<Store extends IStateTreeNode>(
  storeKey: string,
  store: Store
) {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log("change", changes);
  });

  onSnapshot(store, snap => {
    chrome.storage.local.set(storeKey, snap);
  });

  // const holders = keys
  //   ? keys.map(key => ({
  //       name: `${prefix}-${key}`,
  //       store: storesContainer[key] as IAnyStateTreeNode
  //     }))
  //   : [{ name: prefix, store: storesContainer }];
  // holders.forEach(({ name, store }) => {
  //   ls.on(name, () => {
  //     const parsed = ls.get(name);
  //     applySnapshot(store, parsed);
  //   });
  //   if (ls.get(name)) {
  //     applySnapshot(store, ls.get(name));
  //   } else {
  //     ls.set(name, getSnapshot(store));
  //   }
  //   onSnapshot(store, (snapshot: SnapshotOut<Store>) => {
  //     ls.set(name, snapshot);
  //   });
  // });
  // return storesContainer;
}

class RecordController extends Controller({
  url: types.string,
  timeStamp: types.number,
  path: types.string
}) {}
export class Record extends Bundle(RecordController) {
  @computedAlive public get uuid() {
    return this.$model.uuid;
  }
}

class DataBaseController extends Controller({
  records: types.map(Record.Store)
}) {}
export class DataBase extends Bundle(DataBaseController) {
  @computedAlive public get records(): Record[] {
    return Array.from(this.$model.records.values()).map(
      record => record["$controller"]
    ) as Record[];
  }
  @action setRecord(record: SnapshotIn<typeof Record["Store"]>): void {
    this.$model.records.set(record.uuid || uuid(), record);
    console.log(this.records);
  }
  $modelAfterCreate() {
    syncLocalStorage(`e2e.db`, this.$model);
  }
}
