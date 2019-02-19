import React from "react";
import ReactDOM from "react-dom";

import Router from "./Router/Router";

function App() {
  return (
      <Router />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
