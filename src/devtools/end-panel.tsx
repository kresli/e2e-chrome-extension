import React from "react";
import { DataBase } from "~/components";

export class EndPanel extends React.Component {
  private db = DataBase.Store.create().$controller;
  componentDidMount() {
    this.getRecords();
  }

  async getRecords() {
    // const records = await this.db.records.toArray();
    // console.log(records);
  }

  render() {
    return <div></div>;
  }
}
