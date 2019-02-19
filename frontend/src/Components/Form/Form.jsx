import React from "react";
import styled from "styled-components";

import Paper from "../Paper/Paper";

function Form(props) {
  return (
    <Paper withPadding={true} {...props}>
      <div>{props.children}</div>
    </Paper>
  );
}

export default styled(Form)`
  width: 100%;
  max-width: 350px;
  display: block;
  text-align: center;
  margin: auto;
  text-align: left;
  * {
    margin: 8px 8px 8px 0px;
  }
`;
