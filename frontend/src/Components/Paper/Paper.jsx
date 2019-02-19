import React from "react";
import styled from "styled-components";

function Paper(props) {
  return <div {...props}>{props.children}</div>;
}

export default styled(Paper)`
  display: inline-block;
  background: white;
  padding: ${props => (props.withPadding ? "16px" : "0px")};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
`;
