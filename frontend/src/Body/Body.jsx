import React from "react";
import styled from "styled-components";

function Body(props) {
  return (
    <div {...props}>
      {props.children}
    </div>
  )
}

export default styled(Body)`
    display: block;
    text-align: center;
    margin: auto;
    padding: 16px;
    background: #F7F7F7;
`;

