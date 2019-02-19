import React from "react";
import styled from "styled-components";

function DropDown(props) {
  return (
    <div {...props}>
      {props.children}
    </div>
  );
}

export default styled(DropDown)`
  cursor: pointer;
  background: white;
  width: 100px;
  box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.1);
  
  display: ${props => props.show ? 'block' : 'none'};

  > div {
    width: 100%;
    padding: 8px;

    &:hover {
      background: rgba(0,0,0,0.1);
    }
  }
`;
