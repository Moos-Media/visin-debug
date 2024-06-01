import React from "react";
import { useState } from "react";
import Button from "./Button";

const Login = ({ onAuthentication }) => {
  const [username, updateUser] = useState("");
  const [passkey, updatePasskey] = useState("");

  const authenticate = async (e) => {
    //Prevent default button behavior
    e.preventDefault();

    const data = { username, passkey };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch("/api/login", options);
    const json = await response.json();
    if (json.result) onAuthentication();
  };

  const generateLogin = () => {
    return (
      <div class="bg-white text-black items-center justify-center">
        <form>
          <label>Nutzername</label> <br></br>
          <input
            type="text"
            onInput={(e) => updateUser(e.target.value)}
          ></input>{" "}
          <br></br>
          <label>Passwort</label> <br></br>
          <input
            type="password"
            onInput={(e) => updatePasskey(e.target.value)}
          ></input>{" "}
          <br></br>
          <Button text="Anmelden" onClick={authenticate} />
        </form>
      </div>
    );
  };
  return generateLogin();
};

export default Login;
