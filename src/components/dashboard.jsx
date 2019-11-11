import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";

const height = 350;
const width = "100%";
const gradProps = {
  gradientUnits: "userSpaceOnUse",
  x1: "0",
  y1: "0",
  x2: "0",
  y2: height
};

const theme = {
  background: "#222222",
  axis: {
    fontSize: "14px",
    tickColor: "#eee",
    ticks: {
      line: {
        stroke: "#555555"
      },
      text: {
        fill: "#ffffff"
      }
    },
    legend: {
      text: {
        fill: "#aaaaaa",
        fontFamily: "poppins"
      }
    }
  },
  grid: {
    line: {
      stroke: "#555555"
    }
  }
};

class MyResponsiveLine extends Component {
  state = {
    data: [
      {
        color: "hsl(128, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 215
          },
          {
            x: "helicopter",
            y: 216
          },
          {
            x: "boat",
            y: 134
          },
          {
            x: "train",
            y: 224
          },
          {
            x: "subway",
            y: 267
          },
          {
            x: "bus",
            y: 100
          },
          {
            x: "car",
            y: 205
          },
          {
            x: "moto",
            y: 205
          },
          {
            x: "bicycle",
            y: 89
          },
          {
            x: "horse",
            y: 283
          },
          {
            x: "skateboard",
            y: 199
          },
          {
            x: "others",
            y: 285
          }
        ]
      }
    ]
  };

  render() {
    return (
      <div
        style={{
          height: "350px",
          padding: "20px",
          background: "#231f1f",
          boxSizing: "content-box",
          maxWidth: "800px",
          margin: "auto"
        }}
      >
        <div style={{ height, width }}>
          <svg style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="someGradientId" {...gradProps}>
                <stop offset="25%" stopColor="#0000FF" />
                <stop offset="70%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>
          <ResponsiveLine
            data={this.state.data}
            keys={["react", "vue", "elm"]}
            curve={"catmullRom"}
            lineWidth={5}
            pointSize={10}
            pointBorderWidth={10}
            pointColor="#231f1f"
            pointBorderColor="blue"
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", stacked: true, min: "auto", max: "auto" }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendOffset: 36,
              legendPosition: "middle"
            }}
            axisLeft={{
              format: v => `${v / 1000}K`,
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Balance",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            colors={["url(#someGradientId)"]}
            pointLabel="y"
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.45}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                color: "white",
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            theme={theme}
          />
        </div>
      </div>
    );
  }
}

class Dashboard extends Component {
  state = {};

  // make sure parent container have a defined height when using
  // responsive component, otherwise height will be 0 and
  // no chart will be rendered.
  // website examples showcase many properties,
  // you'll often use just a few of them.

  render() {
    return <MyResponsiveLine></MyResponsiveLine>;
  }
}

export default Dashboard;
