import { RecipeAction } from "~/actions";
import { Recipe, DataBase } from "~/components";
import { Bridge } from "~/background/bridge";
// import "babel-polyfill";

class Background extends Bridge {
  constructor() {
    super();
    this.registerListener(this.delegate.bind(this));
    this.registerListener(this.onAddRecord.bind(this));
  }

  private db: DataBase = DataBase.Store.create().$controller as DataBase;

  private delegate(recipe: Recipe) {
    console.log("delegate", recipe);
    this.ports.forEach(port => port.postRecipe(recipe));
  }

  private onAddRecord(recipe: Recipe) {
    if (recipe.action !== RecipeAction.ADD_RECORD) return;
    this.db.setRecord(recipe.message);
  }
}

new Background();
