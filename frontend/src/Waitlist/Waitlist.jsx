import React, { Suspense, useState, useEffect, useRef } from "react";
import async from "async";

import styled from "styled-components";

import Paper from "../Components/Paper/Paper";
import { Button } from "../Components/Button/Button";
import Label from "../Components/Label/Label";
import TextArea from "../Components/TextArea/TextArea";
import Input from "../Components/Input/Input";

function Waitlist(props) {
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [type, setType] = useState("");

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsValidEmail(re.test(email));
  }

  async function post() {
    const response = await fetch(`${process.env.REACT_APP_HOST}/waitlist`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, username: username, type: type})
    });
    window.location.href="/thanks"
  }

  return (
    <div {...props}>
      <Paper className="container" withPadding>
        <Label>Join the waiting list!</Label>
        <div className="form">
          <Label>Email</Label>
          <Input error={error} onChange={value => {setEmail(value.target.value); validateEmail(value.target.value); } }></Input>
          <Label>Username</Label>
          <Input onChange={value => {setUsername(value.target.value)}}></Input>
          <div className="type">
            <div className="creator" className={selected == "creator" ? "selected" : ""}>
              <p>I am a creator</p>
              <input type="radio" name="type" value="creator" onChange={value => { setSelected(value.target.value); setType(value.target.value) } } />
            </div>
            <div className="donator" className={selected == "donator" ? "selected" : ""}>
              <p>I am a donator</p>
              <input type="radio" name="type" value="donator" onChange={value => { setSelected(value.target.value); setType(value.target.value) } } />
            </div>
          </div>
          <Button primary onClick={event => { isValidEmail == false ? setError(true) : post() } }>JOIN</Button>
        </div>
      </Paper>
    </div>
  );
}

export default styled(Waitlist)`

  ${Paper} {
    > ${Label} {
      font-size: 20px;
      margin-bottom: 8px;
    }
    > ${TextArea} {
      margin-bottom: 16px;
    }

    > .form > .type {
      display: flex;
      flex-direction: row;
    }
  }

  .invalid {
    border: 1px red solid;
  }

  .type > * {
    position: relative;
    padding: 16px;
    margin: 8px;
    box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.1);
    border-radius: 8px;
    background: white;
    transition: 0.2s ease 0s;
  }

  .selected {
    box-shadow: 0px 0px 5px 1px rgb(12.2, 23.9, 42.7, 0.2);

    > p {
      font-weight: bold;
    }
  }

  input[type="radio"] {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    top: 0;
    left: 0;
    margin: 0; padding: 0; border: 0;
    display: block;
  }
`;
