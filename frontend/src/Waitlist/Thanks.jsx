import React, { Suspense, useState, useEffect, useRef } from "react";
import async from "async";

import styled from "styled-components";

import Paper from "../Components/Paper/Paper";
import Button from "../Components/Button/Button";
import Label from "../Components/Label/Label";
import TextArea from "../Components/TextArea/TextArea";
import Input from "../Components/Input/Input";

function Waitlist(props) {
  return (
    <div {...props}>
      <Paper className="container" withPadding>
        <Label>Thank you for joining the waiting list!</Label>
        <p>We will email you with updates when we launch :)</p>
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
