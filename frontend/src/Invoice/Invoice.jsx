import React, { useState, useEffect } from "react";

import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";

import styled from "styled-components";
import Paper from "../Components/Paper/Paper";
import Label from "../Components/Label/Label";

let Invoice = (props) => {
  const [invoiceId, setInvoiceId] = useState("id");
  const [address, setAddress] = useState("address");
  const [amount, setAmount] = useState("amount");
  const [timeLeft, setTimeLeft] = useState(0);
  const [expiry, setExpiry] = useState(0);

  const { data, error } = useQuery(gql`
    query {
      transaction {
        txid
      }
    }
  `);

  useEffect(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/invoice/${props.match.params.invoice}`,
      {
        credentials: "include",
        method: "GET"
      }
    );
    const res_json = await response.json();
    setExpiry(res_json.expiry);
  }, []);

  useEffect(() => {
    let id;

    if (true) {
      id = setInterval(() => {
        const now = new Date();
        setTimeLeft(expiry - now.getTime() / 1000);
      }, 1000);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, []);

  return (
      <Paper withPadding {...props}>
        <Label>Awaiting Payment:</Label>
        <p>{new Date(timeLeft * 1000).toISOString("MM:SS").substr(11, 8)}</p>
        <Label>Payment Method:</Label>
        <p>Bitcoin</p>
        {JSON.stringify(data)}
      </Paper>
  );
};

Invoice = styled(Invoice)`
  text-align: left;
  p {
    font-weight: bold;
  }
`;

export default Invoice;