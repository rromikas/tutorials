import React, { Component } from "react";
import firebase from "../firebase";

class Navbar extends Component {
  state = {
    newCategory: "",
    categories: {}
  };

  componentDidMount() {
    firebase
      .database()
      .ref("newsCategories")
      .limitToLast(10)
      .once("value", snapshot => {
        this.setState({ categories: snapshot.val() });
      });
  }

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
    if (this.state.newCategory !== "") {
      var updates = {};
      updates["news/" + this.state.newCategory + "/updated"] = 0;
      updates[
        "newsCategories/" + this.state.newCategory
      ] = this.state.newCategory;
      this.updateDatabase(updates);
    }
  };

  render() {
    return (
      <div
        style={{
          height: "50px",
          background: "darkcyan",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        <div className="input-group" style={{ width: "300px" }}>
          <input
            className="form-control"
            onChange={e => {
              this.setState({ newCategory: e.target.value });
            }}
          ></input>
          <button className="btn btn-danger" onClick={() => this.addCategory()}>
            Add category
          </button>
        </div>
        {Object.keys(this.state.categories).map(x => {
          return (
            <div style={{ color: "white" }}>{this.state.categories[x]}</div>
          );
        })}
      </div>
    );
  }
}

export default Navbar;
