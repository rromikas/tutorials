import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Graph from "./components/graph";
import Feed from "./components/feed";
import Navbar from "./components/navbar";
import Dashboard from "./components/dashboard";
import io from "socket.io-client";

const socket = io("http://localhost:3000/bananas");

socket.on("connect", socket => {});

function App() {
  return (
    <div
      style={{
        width: "100%",
        position: "fixed",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Graph></Graph>
      {/* <Navbar></Navbar> */}
      {/* <Feed></Feed> */}
    </div>
  );
}

export default App;
