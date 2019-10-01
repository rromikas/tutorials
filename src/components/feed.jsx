import React, { Component } from "react";
import CatgeroyNews from "./category-news";
import firebase from "../firebase";
const apiKey = "cf5f4e280b214b5285aa823a72b896cc";

class Feed extends Component {
  state = { main: "", categories: {} };

  categories = {};

  changeCategory = cat => {
    var main = cat;
    var cats = JSON.parse(JSON.stringify(this.categories));
    delete cats[main];
    this.setState({ main: main, categories: cats });
    window.scrollTo(0, 0);
  };

  componentDidMount() {
    if (this.state.main === "") {
      this.getFromDatabase("newsCategories").then(cats => {
        if (
          cats !== null &&
          cats !== undefined &&
          Object.keys(cats).length !== 0
        ) {
          this.categories = JSON.parse(JSON.stringify(cats));
          var main = cats[Object.keys(cats)[0]];
          delete cats[Object.keys(cats)[0]];
          this.setState({ categories: cats, main: main });
        }
      });
    }
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

  render() {
    return (
      <table style={{ width: "100%" }}>
        <tr>
          <td style={{ width: "70%", verticalAlign: "top" }}>
            {this.state.main !== "" ? (
              <CatgeroyNews
                category={this.state.main}
                proportion={0.7}
              ></CatgeroyNews>
            ) : (
              ""
            )}
          </td>
          <td style={{ width: "30%", verticalAlign: "top" }}>
            {Object.keys(this.state.categories).map(x => {
              return (
                <div>
                  <CatgeroyNews category={x} proportion={0.2}></CatgeroyNews>
                  <button
                    className="btn-block btn"
                    style={{
                      borderBottom: "10px solid darkcyan",
                      borderRadius: "unset",
                      margin: "20px",
                      width: "70%",
                      margin: "0 auto 50px auto",
                      fontSize: "1.4em"
                    }}
                    onClick={() => {
                      this.changeCategory(x);
                    }}
                  >
                    > {x}
                  </button>
                </div>
              );
            })}
          </td>
        </tr>
      </table>
    );
  }
}

export default Feed;
