import React, { Component } from "react";
import firebase from "../firebase";

class CategoryNews extends Component {
  state = {
    articles: [],
    scale: 1,
    height: 0,
    letMove: false,
    movable: { x: 0, y: 0, index: -1, zIndex: 2 },
    static: { x: 0, y: 0, zIndex: 0 },
    mouseX: 0,
    mouseY: 0
  };

  domArticles = [];
  staticDomArticles = [];
  articleMoveInt = false;

  requestNews = () => {
    return new Promise((resolve, reject) => {
      console.log("category", this.props.category);
      var q = encodeURI(this.props.category);
      console.log("Q", q);
      var a = new Date(Date.now());
      var year = a.getFullYear();
      var month = a.getMonth();
      var fMonth = ("0" + month).slice(-2);
      var day = a.getDate();
      var fDay = ("0" + day).slice(-2);
      var date =
        year.toString() + "-" + fMonth.toString() + "-" + fDay.toString();

      console.log(date);

      fetch(
        `/v2/everything?qInTitle="${q}"&from=${date}&sortBy=publishedAt&language=en&apiKey=cf5f4e280b214b5285aa823a72b896cc`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(data => {
          return data.json();
        })
        .then(data => {
          this.getFromDatabase(
            "news/" + this.props.category + "/articles"
          ).then(articles => {
            console.log("data", data);
            var articles1 = data.articles.filter(
              x =>
                x.urlToImage !== undefined &&
                x.urlToImage !== null &&
                x.urlToImage !== ""
            );
            var arr3 = [];
            if (articles !== null && articles !== undefined) {
              var c = articles.concat(articles1);
              arr3 = c.filter(
                (item, pos) => c.findIndex(x => x.url === item.url) === pos
              );
            } else {
              arr3 = articles1.filter(
                (item, pos) =>
                  articles1.findIndex(x => x.url === item.url) === pos
              );
            }

            arr3.sort(function(a, b) {
              return new Date(b.publishedAt) - new Date(a.publishedAt);
            });

            if (this.props.proportion < 0.7) {
              var arr = arr3.filter((x, index) => {
                return index < 6;
              });
              this.setState({ articles: arr });
            } else {
              this.setState({ articles: arr3 });
            }

            var updates = {};
            updates["news/" + this.props.category + "/updated"] = Date.now();
            updates["news/" + this.props.category + "/articles"] = arr3;
            this.updateDatabase(updates).then(ans => {
              resolve(ans);
            });
          });
        });
    });
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

  componentWillReceiveProps(nextProps) {
    this.getNews(nextProps.category);
  }

  componentWillUnmount() {}

  componentDidMount() {
    this.getNews(this.props.category);
    var scale = (window.innerWidth / 1500) * this.props.proportion;
    this.setState({
      scale: scale
    });
    window.addEventListener("resize", () => {
      var scale = (window.innerWidth / 1500) * this.props.proportion;
      this.setState({
        scale: scale,
        height: this.newParent.getBoundingClientRect().height + 65
      });
    });
  }

  componentWillMount() {}

  setParentReference = el => {
    if (el !== null) {
      this.newParent = el;
      this.setState({
        height: this.newParent.getBoundingClientRect().height + 65
      });
    }
  };

  setReference = (el, index) => {
    if (el !== null) {
      this.domArticles[index] = el;
    }
  };

  getNews = category => {
    this.getFromDatabase("news/" + category + "/updated").then(data => {
      console.log(Date.now(), data, Date.now() - data > 3600 * 4 * 1000);
      if (Date.now() - data > 3600 * 4 * 1000) {
        this.requestNews().then(ans => {
          this.setState({
            height: this.newParent.getBoundingClientRect().height + 65
          });
        });
      } else {
        this.getFromDatabase("news/" + category + "/articles").then(
          articles => {
            if (articles !== null) {
              if (this.props.proportion < 0.7) {
                var arr = articles.filter((x, index) => {
                  return index < 6;
                });
                this.setState({ articles: arr });
              } else {
                this.setState({ articles: articles });
              }
            }

            this.setState({
              height: this.newParent.getBoundingClientRect().height + 65
            });
            console.log(this.newParent.getBoundingClientRect());
          }
        );
      }
    });
  };

  MoveArticle = index => {
    if (!this.articleMoveInt) {
      this.staticDomArticles = [];
      this.domArticles.forEach(x => {
        var pos = x.getBoundingClientRect();
        this.staticDomArticles.push(pos);
      });

      this.setState({ movable: { x: 0, y: 0, index: index, zIndex: 2 } });
      var x = this.state.mouseX;
      var y = this.state.mouseY;

      this.articleMoveInt = setInterval(() => {
        var xx = (x - this.state.mouseX) / this.state.scale;
        var yy = (y - this.state.mouseY) / this.state.scale;
        this.setState({
          movable: {
            x: this.state.movable.x - xx,
            y: this.state.movable.y - yy,
            index: index,
            zIndex: 2
          }
        });
        x = this.state.mouseX;
        y = this.state.mouseY;
      }, 10);
    }
  };

  StopMoveArticle = index => {
    if (this.articleMoveInt) {
      var pos = this.domArticles[index].getBoundingClientRect();

      var nr = this.staticDomArticles.findIndex(x => {
        return (
          Math.abs(x.x - pos.x) <= 200 * this.state.scale &&
          Math.abs(x.y - pos.y) <= 200 * this.state.scale
        );
      });

      if (nr > -1) {
        var arr = JSON.parse(JSON.stringify(this.state.articles));
        var temp = JSON.parse(JSON.stringify(arr[nr]));
        arr[nr] = arr[index];
        arr[index] = temp;
        this.setState({ articles: arr });

        // temp = this.domArticles[nr]; // sukeiciu adresus realaus laiko article
        // this.domArticles[nr] = this.domArticles[index];
        // this.domArticles[index] = temp;
      }
      this.setState({ movable: { x: 0, y: 0, index: -1, zIndex: 2 } });
      clearInterval(this.articleMoveInt);
      this.articleMoveInt = false;
    }
  };

  render() {
    return (
      <div
        style={{
          display: "inline-block",
          height: `${this.state.height}px`,
          position: "relative",
          overflow: "hidden",
          width: `${window.innerWidth * this.props.proportion}px`
        }}
        onMouseMove={e => {
          this.setState({ mouseX: e.screenX, mouseY: e.screenY });
        }}
        // onMouseUp={() => this.StopMoveEverything()}
        // onMouseLeave={() => {
        //   this.StopMoveEverything();
        // }}
      >
        <div
          className="category-header"
          style={{
            width: `${1500 * this.state.scale}px`
          }}
        >
          <h1 style={{ textTransform: "capitalize" }}>{this.props.category}</h1>
        </div>
        <div
          ref={el => {
            this.newParent = el;
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: `1500px`,
            transform: `scale(${this.state.scale})`,
            transformOrigin: "top left"
          }}
        >
          {this.state.articles.map((x, index) => {
            return (
              <div
                ref={el => this.setReference(el, index)}
                onMouseDown={() => {
                  this.MoveArticle(index);
                }}
                onMouseUp={() => {
                  this.StopMoveArticle(index);
                }}
                onMouseLeave={() => {
                  this.StopMoveArticle(index);
                }}
                onClick={() => {
                  this.StopMoveArticle(index);
                }}
                key={index}
                style={
                  (index + 5) % 5 === 0 || this.props.proportion < 0.7
                    ? {
                        flex: "100%",
                        marginBottom: "50px",
                        textAlign: "left",
                        transform:
                          this.state.movable.index === index
                            ? `translate(${this.state.movable.x}px,
                              ${this.state.movable.y}px)`
                            : `translate(${this.state.static.x}px,
                              ${this.state.static.y}px)`,
                        zIndex:
                          this.state.movable.index === index
                            ? this.state.movable.zIndex
                            : this.state.static.zIndex
                      }
                    : {
                        width: "730px",
                        marginBottom: "50px",
                        textAlign: "left",
                        transform:
                          this.state.movable.index === index
                            ? `translate(${this.state.movable.x}px,
                              ${this.state.movable.y}px)`
                            : `translate(${this.state.static.x}px,
                              ${this.state.static.y}px)`,
                        zIndex:
                          this.state.movable.index === index
                            ? this.state.movable.zIndex
                            : this.state.static.zIndex
                      }
                }
              >
                <div
                  style={{
                    backgroundImage: `url("${x.urlToImage}")`,
                    backgroundSize: "cover",
                    width:
                      (index + 5) % 5 === 0 || this.props.proportion < 0.7
                        ? `1500px`
                        : `730px`,
                    height:
                      (index + 5) % 5 === 0 || this.props.proportion < 0.7
                        ? "800px"
                        : "450px"
                  }}
                ></div>

                <a
                  href={x.url}
                  style={{
                    fontSize:
                      this.props.proportion < 0.7 ? `${2.8 * 2}em` : `${2.8}em`,
                    marginBottom: "20px"
                  }}
                >
                  {x.title}
                </a>
                <br></br>

                <a
                  href={x.url}
                  style={{
                    fontSize:
                      this.props.proportion < 0.7 ? `${2.8}em` : `${1.4}em`
                  }}
                >
                  {x.author} published on {x.source.name} /{" "}
                  <time dateTime={x.publishedAt}>
                    {x.publishedAt.replace("Z", " ").replace("T", " ")}
                  </time>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CategoryNews;
