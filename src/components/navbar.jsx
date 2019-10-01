import React, { Component } from "react";
import firebase from "../firebase";

class Navbar extends Component {
  state = {
    newCategory: ""
  };

  updateDatabase = updates => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => resolve(true));
    });
  };

  getFromDatabase = path => {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .once("value")
        .then(snapshot => {
          resolve(snapshot.val());
        });
    });
  };

  addCategory = () => {
    var updates = {};
    updates["news/" + this.state.newCategory + "/updated"] = 0;
    updates[
      "newsCategories/" + this.state.newCategory
    ] = this.state.newCategory;
    this.updateDatabase(updates);
  };

  render() {
    return (
      <div
        style={{
          height: "50px",
          background: "darkcyan",
          display: "flex",
          alignItems: "center"
        }}
      >
        <input
          className="form-control"
          style={{ width: "200px" }}
          onChange={e => {
            this.setState({ newCategory: e.target.value });
          }}
        ></input>
        <button className="btn btn-danger" onClick={() => this.addCategory()}>
          Add category
        </button>
      </div>
    );
  }
}

export default Navbar;
