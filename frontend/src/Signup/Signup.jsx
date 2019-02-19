import React, { useState, useEffect } from "react";
import async from "async";

import sha256 from "sha256";

import styled from "styled-components";

import Form from "../Components/Form/Form";

import Label from "../Components/Label/Label";
import Input from "../Components/Input/Input";
import { Button } from "../Components/Button/Button";
import A from "../Components/A/A";

function Signup(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(async () => {
    if (submitted) {
      console.log(process.env.REACT_APP_HOST);
      const response = await fetch(`${process.env.REACT_APP_HOST}/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, username: username, password: sha256(password)})
      });
      const data = await response.json();
      if (data.status == "success") {
        window.location.href=`/verify`;
      } else if (data.status == "error") {
        setSubmitted(false);
        setErrors(data.errors);
      }
    }
  }, [submitted])

  return (
    <div {...props}>
      <Form>
        <h3>SIGN UP</h3>
        <div className="errorMsg">{errors.main}</div>
        <Label>Email:</Label>
        <Input
          className={`${errors.email ? "error" : ""}`}
          value={email}
          placeholder={"Email"}
          type="email"
          onChange={input => setEmail(input.target.value)}
        />
        <div className="errorMsg">{errors.email}</div>
        <Label>Username:</Label>
        <Input
          className={`${errors.username ? "error" : ""}`}
          value={username}
          placeholder={"Username"}
          primary
          onChange={input => setUsername(input.target.value)}
        />
        <div className="errorMsg">{errors.username}</div>
        <Label>Password:</Label>
        <Input
          value={password}
          className={`${errors.password ? "error" : ""}`}
          placeholder={"Password"}
          type={"password"}
          onChange={input => setPassword(input.target.value)}
        />
        <div className="errorMsg">{errors.password}</div>
        <Button border onClick={() => { setSubmitted(true) } }>SIGN UP!</Button>
        <Button onClick={event => { window.location.href="/signin" }}>or sign in</Button>
      </Form>
    </div>
  );
}

export default styled(Signup)`
  .errorMsg {
    font-size: 12px;
    color: red;
  }

  ${Input}.error {
    border: 1px red solid;
  }
`;
