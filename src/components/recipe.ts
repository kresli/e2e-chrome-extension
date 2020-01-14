import { RecipeAction } from "~/actions";

interface Config {
  action: RecipeAction;
  message: any;
}
export class Recipe<C extends Config = Config> {
  constructor(private config: C) {}
  public get action() {
    return this.config.action;
  }
  public get message() {
    return this.config.message;
  }
}

export class RecipeAddRecord extends Recipe {
  constructor(message: { path: string; timeStamp: number }) {
    super({
      action: RecipeAction.ADD_RECORD,
      message: message
    });
  }
}
