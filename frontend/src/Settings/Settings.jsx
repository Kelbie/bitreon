import React, { useState, useEffect } from "react";
import async from "async";

import styled from "styled-components";

import Form from "../Components/Form/Form";

import Paper from "../Components/Paper/Paper";
import Label from "../Components/Label/Label";
import Input from "../Components/Input/Input";
import { Button } from "../Components/Button/Button";
import A from "../Components/A/A";
import { renderers } from "react-markdown";

function Account(props) {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState(username);
  const [displayName, setDisplayName] = useState("");
  const [tempDisplayName, setTempDisplayName] = useState(displayName);

  useEffect(async() => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/user/${props.match.params.username}`, {
      credentials: "include",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    setUsername(data.user.username);
    setDisplayName(data.user.display_name);
    setTempUsername(data.user.username);
    setTempDisplayName(data.user.display_name);
    console.log(data);
  }, [])

  const save = async () => {
    console.log(props)
    const response = await fetch(`${process.env.REACT_APP_HOST}/settings/${props.match.params.username}/account`, {
      credentials: "include",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: tempUsername, displayName: tempDisplayName})
    });
    const data = await response.json();
  }

  return (
    <div {...props}>
      <Label>Display Name:</Label>
      <Input defaultValue={displayName} onChange={(value) => setTempDisplayName(value.target.value)}/>
      <br />
      <Label>Username:</Label>
      <Input defaultValue={username} onChange={(value) => setTempUsername(value.target.value)}/>
      <p className="link">{process.env.REACT_APP_HOST}/user/{tempUsername}</p>
      <br />
      <Button border onClick={() => save()}>Save</Button>
    </div>
  )
}

Account = styled(Account)`
  .link {
    font-size: 12px;
  }
`

function Wallet(props) {
  const [defaultPubKey, setDefaultPubKey] = useState("");
  const [defaultPrivKey, setDefaultPrivKey] = useState("");

  const [showPubKey, setShowPubKey] = useState(false);

  useEffect(async() => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/settings/${props.match.params.username}/wallet`, {
      credentials: "include",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    setDefaultPubKey(data.key.public_key);
    setDefaultPrivKey(data.key.private_key);
  }, [])

  return (
    <div {...props}>
      <h3>Wallet</h3>
      <Input defaultValue="0.00000001 BTC" readonly="" />
      <Label>Destination Address:</Label>
      <Input defaultValue="" />
      <Label>Fee:</Label>
      <select name="fee">
        <option value="high">High (100 sat / byte)</option>
        <option value="normal">Normal (10 sat / byte)</option>
        <option value="low">Low (1 sat / byte)</option>
      </select> 
      <Button border>Cash Out All</Button>
      <h3>Advanced</h3>
      <Label>Public Key:</Label>
      <Input defaultValue="Click to reveal" onClick={(value) => {value.target.value=`${defaultPubKey}`} } readonly="" />
      <Label>Private Key:</Label>
      <Input defaultValue="Click to reveal" onClick={(value) => {value.target.value=`${defaultPrivKey}`} } readonly="" />
    </div>
  );
}

Wallet = styled(Wallet)`
  text-align: left;
  * {
    margin-bottom: 8px;
  }

  ${Label} {
    margin-bottom: 2px;
  }

`

function Settings(props) {
  const [row, setRow] = useState(0);

  var {["className"]: classNames, ...propsWithoutStyleNames} = props;
  return (
    <div {...props}>
      <Paper className="options">
        <div className="row" onClick={() => setRow(0)}>Account</div>
        <div className="row" onClick={() => setRow(1)}>Wallet</div>
      </Paper>
      <Paper withPadding className="main">
        <div style={row != 0 ? {display: "none"} : {}} className="container">
          <Account {...propsWithoutStyleNames} />
        </div>
        <div style={row != 1 ? {display: "none"} : {}} className="container">
          <Wallet {...propsWithoutStyleNames} />
        </div>
      </Paper>
    </div>
  );
}

export default styled(Settings)`
  display: flex;
  max-width: 500px;
  margin: auto;

  .options {
    height: 100%;
    .row {
      text-align: left;
      padding: 8px 16px;

      &:hover {
        background: #F0F0F0;
        cursor: pointer;
      }
    }
  }

  .options, .main {
    width: 200px;
    margin: 4px;
  }

  .main {
    flex-grow: 1;
  }
`;
