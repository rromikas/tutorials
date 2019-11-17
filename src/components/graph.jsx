import React, { Component } from "react";
import {
  IoIosPlayCircle,
  IoIosRefreshCircle,
  IoIosEyeOff,
  IoIosEye
} from "react-icons/io";
import { thisExpression } from "@babel/types";

const colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF"
];

class Graph extends Component {
  state = {
    points: [],
    polyline: [],
    lines: [],
    colors: [],
    showLines: true
  };

  rastiVisusKelius = () => {
    var lines = [];
    for (var i = 0; i < this.state.points.length - 1; i++) {
      for (var j = i + 1; j < this.state.points.length; j++) {
        var a = this.state.points[i].x - this.state.points[j].x;
        var b = this.state.points[i].y - this.state.points[j].y;
        var kelias = Math.sqrt(a * a + b * b);
        var line = {
          x1: this.state.points[i].x,
          y1: this.state.points[i].y,
          x2: this.state.points[j].x,
          y2: this.state.points[j].y,
          kelias: kelias
        };
        lines.push(line);
      }
    }

    this.setState({ lines: lines });
  };

  sukurtiMatrica = () => {
    var matrica = [];
    for (var i = 0; i < this.state.points.length; i++) {
      var eile = [];

      for (var j = 0; j < this.state.points.length; j++) {
        var a = this.state.points[i].x - this.state.points[j].x;
        var b = this.state.points[i].y - this.state.points[j].y;
        var kelias = Math.sqrt(a * a + b * b);
        var obj = { eil: i, stulp: j, kelias: kelias };
        eile.push(obj);
      }

      matrica.push(eile);
    }

    return matrica;
  };

  rastiHamiltonoMarsruta = () => {
    if (this.state.points.length > 0) {
      var points = [];
      var colors = [];
      points.push({ x: this.state.points[0].x, y: this.state.points[0].y });
      var matrica = this.sukurtiMatrica();
      var current = 0;
      colors.push(colorArray[current]);
      var imtis = matrica[current]
        .filter(x => x.kelias !== 0 && x.stulp !== 0)
        .map(x => {
          return x.kelias;
        });

      while (imtis.length !== 0) {
        var min = Math.min.apply(null, imtis);

        var a = matrica[current].find(x => x.kelias === min);
        matrica.map(eilute => {
          eilute.map(x => {
            if (x.stulp === a.stulp) {
              x.kelias = 0;
            }
          });
        });

        current = a.stulp;

        colors.push(colorArray[current]);

        points.push({
          x: this.state.points[current].x,
          y: this.state.points[current].y
        });

        imtis = matrica[current]
          .filter(x => x.kelias !== 0 && x.stulp !== 0)
          .map(x => {
            return x.kelias;
          });
      }

      points.push({ x: this.state.points[0].x, y: this.state.points[0].y });

      colors.push(colorArray[0]);

      this.setState({
        polyline: points,
        calculated: true,
        colors: colors
      });

      console.log(matrica, points);
      this.rastiVisusKelius();
    }
  };

  render() {
    return (
      <div
        style={{
          width: "800px",
          height: "400px",
          border: "2px solid black",
          position: "relative"
        }}
      >
        <IoIosEyeOff
          onClick={() => {
            this.setState({ showLines: true });
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: "60px",
            display: this.state.showLines ? "none" : "block"
          }}
        ></IoIosEyeOff>
        <IoIosEye
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: "60px",
            display: this.state.showLines ? "block" : "none"
          }}
          onClick={() => {
            this.setState({ showLines: false });
          }}
        ></IoIosEye>
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          <IoIosRefreshCircle
            style={{ fontSize: "70px" }}
            onClick={() => {
              this.setState({
                points: [],
                polyline: [],
                calculated: false,
                lines: [],
                colors: []
              });
            }}
          ></IoIosRefreshCircle>
          <IoIosPlayCircle
            style={{ fontSize: "70px" }}
            onClick={() => {
              this.rastiHamiltonoMarsruta();
            }}
          ></IoIosPlayCircle>
        </div>
        <div
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
            left: 0
          }}
        >
          {this.state.colors.map(color => {
            return (
              <div
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: color
                }}
              ></div>
            );
          })}
        </div>
        <svg
          width="800px"
          height="400px"
          ref={el => {
            this.svg = el;
          }}
          xmlns="http://www.w3.org/2000/svg"
          onClick={e => {
            var position = this.svg.getBoundingClientRect();
            var left = position.left;
            var top = position.top;
            console.log(left, top);
            var x = e.screenX - left;
            var y = e.screenY - top - 70;
            var pnts = this.state.points;
            pnts.push({ x: x, y: y });
            this.setState({ points: pnts, calculated: false });
            this.rastiVisusKelius();
          }}
        >
          {this.state.lines.map((line, index) => {
            return (
              <text text-anchor="middle" dy="-10px">
                <textPath
                  startOffset="50%"
                  style={{ fontSize: "20px" }}
                  href={`#line-${index}`}
                >
                  {`${Math.floor(line.kelias)}`}
                </textPath>
              </text>
            );
          })}
          {this.state.showLines
            ? this.state.lines.map((line, index) => {
                return (
                  <path
                    style={{
                      strokeWidth: "4px",
                      strokeDasharray: "20",
                      stroke: "black"
                    }}
                    id={`line-${index}`}
                    d="M150 0 L75 200 L225 200 Z"
                    d={`M${line.x1} ${line.y1} L${line.x2} ${line.y2}`}
                  />
                );
                // return  <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} style="stroke:rgb(255,0,0);stroke-width:2" />
              })
            : ""}
          {
            <polyline
              className={this.state.calculated ? "path" : ""}
              style={{ fill: "none", stroke: "black", strokeWidth: "5px" }}
              points={this.state.polyline.map(a => `${a.x},${a.y}`).join(" ")}
            ></polyline>
          }
          {this.state.points.map((x, index) => {
            return (
              <g>
                <circle
                  cx={x.x}
                  cy={x.y}
                  r="20"
                  stroke="black"
                  stroke-width="3"
                  fill={colorArray[index]}
                ></circle>
                {index === 0 ? (
                  <text x={x.x - 5} y={x.y + 5} style={{ color: "white" }}>
                    1
                  </text>
                ) : (
                  ""
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
}

export default Graph;
