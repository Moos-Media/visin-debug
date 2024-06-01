import React from "react";
import { useState } from "react";
import Login from "./Components/Login";

const App = () => {
  const [authenticated, changeAuthentication] = useState("false");

  const authentication = () => {
    changeAuthentication(!authenticated);
  };

  return authenticated ? (
    <Login onAuthentication={authentication} />
  ) : (
    LoggedInView()
  );
};

const LoggedInView = () => {
  return <div>Logged In</div>;
};

export default App;
