import React, { useState } from "react";

import styled from "styled-components";
import sha256 from "sha256";

import Form from "../Components/Form/Form";

import Label from "../Components/Label/Label";
import Input from "../Components/Input/Input";
import { Button } from "../Components/Button/Button";
import A from "../Components/A/A";

function Signin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  async function post() {
    const response = await fetch(`${process.env.REACT_APP_HOST}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: sha256(password)}),
      credentials: "include"
      });
    const data = await response.json();
    console.log(data);
    if (data.status == "success") {
      window.location.href=`/user/${username}`;
    } else if (data.status == "error") {
      console.log(data.errors);
      setErrors(data.errors);
    }
  }

  return (
    <div {...props}>
      <Form>
        <h3>SIGN IN</h3>
        <div className="errorMsg">{errors.main}</div>
        <Label>Username:</Label>
        <Input
          className={errors.username ? "error" : ""}
          value={username}
          placeholder={"Username"}
          onChange={input => setUsername(input.target.value)}
        />
        <div className="errorMsg">{errors.username}</div>
        <Label>Password:</Label>
        <Input
          className={errors.password ? "error" : ""}
          value={password}
          placeholder={"Password"}
          type={"password"}
          onChange={input => setPassword(input.target.value)}
        />
        <div className="errorMsg">{errors.password}</div>
        <Button border onClick={() => { post(); }}>SIGN IN!</Button>
        <Button onClick={event => { window.location.href="/signup" }}>or sign up!</Button>
      </Form>
    </div>
  );
}

export default styled(Signin)`
  .errorMsg {
    font-size: 12px;
    color: red;
  }

  ${Input}.error {
    border: 1px red solid;
  }
`;
