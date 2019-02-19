import React from "react";
import styled from "styled-components";

function Input(props) {
  return <input {...props} />;
}

export default styled(Input)`
  display: block;
  padding: 8px;
  border: solid 1px;
  width: 100%;
  border-color: ${props => props.error ? "red" : "#e5e5e5"};
  &:focus {
    border-color: #6eb3ef;
  }
`;
