import React, { Suspense, useState, useEffect, useRef } from "react";
import async from "async";

import styled from "styled-components";

import Paper from "../Components/Paper/Paper";
import { Button } from "../Components/Button/Button";
import Label from "../Components/Label/Label";
import TextArea from "../Components/TextArea/TextArea";
import Input from "../Components/Input/Input";

function Verify(props) {
  useEffect(async () => {
    const user = await fetch(`${process.env.REACT_APP_HOST}/verify/${props.match.params.token}`, {
      credentials: "include",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const username_json = await user.json()
    window.location.href=`/user/${username_json.username}`
  }, [])


  return(<>test</>);
}

export default styled(Verify)``;
