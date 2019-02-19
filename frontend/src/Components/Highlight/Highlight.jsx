import React, { Component } from "react";

import styled from "styled-components";

function Highlight(props) {
  return <div {...props}>{props.children}</div>;
}

export default styled(Highlight)`
  display: inline-block;
  padding: 4px;
  border-radius: 4px;
  background: #6699ff;
`;
