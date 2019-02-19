import React from "react";
import styled from "styled-components";

function Label(props) {
  return <label className={props.className}>{props.children}</label>;
}

export default styled(Label)`
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #1f3d6d;
  text-align: left;
`;
