import React from "react";
import styled from "styled-components";

function Button(props) {
  return <button {...props}>{props.children}</button>;
}

Button = styled(Button)`
  cursor: pointer;
  font-family: "Roboto";
  font-weight: bolder;
  padding: 8px 16px;
  background: none;
  /* background: ${props => props.primary ? "#1f3d6d" : "rgb(209, 209, 209)" }; */
  color: #159DE4;
  width: 100%;
  border: ${props => props.border ? "2px solid #159DE4" : "none" };
  border-radius: 8px;
  font-weight: bold;
`;

function ButtonB(props) {
  return (
    <button {...props}>
      <span>${props.value}</span>
      <span>UNLOCK</span>
    </button>
  )
}

ButtonB = styled(ButtonB)`
  display: flex;
  cursor: pointer;
  font-family: "Roboto";
  font-weight: bolder;
  
  background: none;
  /* background: ${props => props.primary ? "#1f3d6d" : "rgb(209, 209, 209)" }; */
  color: #159DE4;
  width: 100%;
  border: ${props => props.border ? "2px solid #159DE4" : "none" };
  border-radius: 8px;
  font-weight: bold;

  > span {
    text-align: center;
    padding: 8px 16px;
    flex: 1;

    :first-child {
      background: #159DE4;
      color: white;
    }
  }
`;

export { Button, ButtonB };