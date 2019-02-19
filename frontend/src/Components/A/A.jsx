import React from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

function A(props) {
  return (
    <Link to={props.href} className={props.className}>
      {props.children}
    </Link>
  );
}

export default styled(A)`
  color: #1f3d6d;
  text-decoration: none;
`;
