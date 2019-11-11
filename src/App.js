import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Feed from "./components/feed";
import Navbar from "./components/navbar";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Feed></Feed>
    </div>
  );
}

export default App;
