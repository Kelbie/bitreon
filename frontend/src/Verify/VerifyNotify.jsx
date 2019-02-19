import React, { Suspense, useState, useEffect, useRef } from "react";
import async from "async";

import styled from "styled-components";

import Paper from "../Components/Paper/Paper";
import { Button } from "../Components/Button/Button";
import Label from "../Components/Label/Label";
import TextArea from "../Components/TextArea/TextArea";
import Input from "../Components/Input/Input";

function Verify(props) {
  return(
    <Paper {...props} withPadding>
      <h3>Verify your email</h3>
      <p>Thanks for registering your account! To complete registration click on the link we emailed to you.</p>
    </Paper>
  );
}

export default styled(Verify)`
  max-width: 500px;
`;
