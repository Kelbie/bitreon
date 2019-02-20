import React, { useState, useEffect } from "react";
import async from "async";
import bitcoin from "bitcoinjs-lib";
import bs58check from "bs58check";
import bip39 from "bip39";
import bip32 from 'bip32';

import styled from "styled-components";

import Form from "../Components/Form/Form";

import Paper from "../Components/Paper/Paper";
import Label from "../Components/Label/Label";
import Input from "../Components/Input/Input";
import { Button } from "../Components/Button/Button";
import A from "../Components/A/A";
import { renderers } from "react-markdown";

function Write(props) {
  return (
    <>
      <h3>Backup your seed!</h3>
      <p>To backup your seed, grab a piece of paper and write down the following words. Keep this seed in a safe place and don't share it with anyone! Bitreon will never ask you to reveal your seed.</p>
      <br />
      <Label>Seed:</Label>
      <Input defaultValue={props.seed} readonly="" /> 
      <Button border onClick={() => props.finish()}>Next</Button>
    </>
  )
}

function Verify(props) {
  const [wordIndexs, setWordIndexs] = useState([]);
  const [seedWordErrors, setSeedWordErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(async() => {
    var nums = [1,2,3,4,5,6,7,8,9,10,11,12],
      ranNums = [],
      i = 5,
      j = 0;
    
    while (i--) {
      j = Math.floor(Math.random() * (nums.length));
      ranNums.push(nums[j]);
      nums.splice(j,1);
    }
    
    setWordIndexs(ranNums.sort(function(a, b) {
      return a - b;
    }));

    setSeedWordErrors(ranNums.map(i => {
      return true
    }));

  }, [])


  const send = async () => {
    setShowErrors(true);
    const seed = bip39.mnemonicToSeed(props.seed)
    const node = bip32.fromSeed(seed)
    const bip32_x = node.derivePath(`m/0`).neutered().toBase58() // Import this
    const bip44_x = node.derivePath(`m/44'/0'/0'`).neutered().toBase58() // Import this
    const bip49_x = node.derivePath(`m/49'/0'/0'`).neutered().toBase58() // Import this
    const bip84_x = node.derivePath(`m/84'/0'/0'`).neutered().toBase58() // Import this
    const bip141_x = node.derivePath(`m/0`).neutered().toBase58() // Import this
    
    // const bip32_node = bip32.fromBase58(bip32_x);
    // console.log(p2pkh(bip32_node.derive(0), network))

    // function p2pkh(node, network) {
    //   return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
    // }

    // const bip44_node = bip32.fromBase58(bip44_x);
    // console.log(p2pkh(bip44_node.derive(0).derive(0), network));

    // function p2pkh(node, network) {
    //   return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
    // }

    // const bip49_node = bip32.fromBase58(bip49_x);
    // console.log(p2sh_p2wpkh(bip49_node.derive(0).derive(0), network))
    
    // function p2sh_p2wpkh (node, network) {
    //     const { address } = bitcoin.payments.p2sh({
    //         redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }),
    //         network: network
    //     })
    //     return address;
    // }

    // const bip84_node = bip32.fromBase58(bip84_x)
    // console.log(p2wpkh(bip84_node.derive(0).derive(0), network))

    // function p2wpkh(node, network) {
    //   return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address
    // }

    // const bip141_node = bip32.fromBase58(bip141_x);
    // console.log(p2sh_p2wpkh(bip141_node.derive(0), network))
    // console.log(JSON.stringify({bip32_x, bip44_x, bip49_x, bip84_x, bip141_x}))
    // console.log(seedWordErrors);

    if (!seedWordErrors.includes(true)) {
      const response = await fetch(`${process.env.REACT_APP_HOST}/key`, {
        credentials: "include",
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({bip32_x, bip44_x, bip49_x, bip84_x, bip141_x})
      });
      const data = await response.json();
      window.location.href="/"

    }

    
  }


  return (
    <>
      <h3>Verify your seed!</h3>
      {
        showErrors & seedWordErrors.includes(false) ? 
        <p>One or more words are incorrect</p> : ""
      }
      {
        wordIndexs.map((v, i) => {
          return (<>
            <Label>Seed Word {v}:</Label>
            <Input error={seedWordErrors[i] & showErrors} onChange={value => setSeedWordErrors(seedWordErrors.map((error, j) => {
              if (i == j) {
                return value.target.value == props.seed.split(" ")[wordIndexs[j]-1] ? false: true
              } else {
                return seedWordErrors[j]
              }
            })) } /> 
          </> )
        })
      }
      <Button border onClick={() => props.back()}>Back</Button>
      <Button border onClick={() => send()}>Verify</Button>
    </>
  )
}

function Seed(props) {
  const [seed, setSeed] = useState(bip39.generateMnemonic());
  const [index, setIndex] = useState(0);

  return (
    <Paper withPadding {...props}>
      {
        index == 0 ? <Write seed={seed} finish={() => setIndex(1)}/> : ""
      }
      {
        index == 1 ? <Verify {...props} seed={seed} back={() => setIndex(0)}/> : ""
      }
    </Paper>
  );
}

export default styled(Seed)`
  width: 500px;
  text-align: right;
  h3, p {
    text-align: left;
  }

  ${Button} {
    margin-top: 4px;
    width: max-content;
    :first-of-type {
      margin-right: 8px;
    }
  }
`;

