import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Feed from "./components/feed";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Feed></Feed>
    </div>
  );
}

export default App;
