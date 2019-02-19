import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import autosize from "autosize";

function Label(props) {
  const textEl = useRef();
  useEffect(() => {
    setHeight();
  }, [textEl])

  const setHeight = () => {
    textEl.current.style.height = "0px";
    textEl.current.style.height = textEl.current.scrollHeight + "px";
  }

  return (
    <textarea {...props } 
              ref={textEl} 
              onChange={event => { setHeight(); props.onChange(event) }}
              /> 
  )
}

export default styled(Label)`
  outline: none !important;
  overflow: hidden;
  resize: none;
  width: 100%;
  padding: 8px;
  max-width: 100%;
  border: solid 1px;
  width: 100%;
  border-color: ${props => props.error ? "red" : "#e5e5e5"};
  &:focus {
    border-color: #6eb3ef;
  }
`;
