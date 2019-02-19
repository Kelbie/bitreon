import React, {useState, useEffect} from "react";
import styled from "styled-components";
import A from "../Components/A/A";
import Highlight from "../Components/Highlight/Highlight";
import { Button } from "../Components/Button/Button";
import DropDown from "../Components/DropDown/DropDown";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

library.add(faCaretDown)

const Icons = styled(FontAwesomeIcon)``;

function Header(props) {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropDownActive, setDropDownActive] = useState(false);

  useEffect(async() => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/loggedIn` , {
      credentials: "include",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const res_json = await response.json();
    setLoggedIn(res_json.loggedIn)
    setUser(res_json.user);
  }, [])

  const logout = async () => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/logout`, {
      credentials: "include",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    window.location.reload();
  }

  return (
    <div {...props}>
      <h2>Bitreon<Highlight>[beta]</Highlight></h2>
      <div className="buttons">
        <Button onClick={click => window.location.href="/"}>Home</Button>
        {
          loggedIn ?
            <div className="container" onClick={() => setDropDownActive(!dropDownActive)}>
              <Icons icon="caret-down" color="white"></ Icons>
              <DropDown show={dropDownActive}>
                {/* <div onClick={() => window.location.href=`/settings/${user.username}` }>Settings</div> */}
                <div onClick={() => logout()}>Logout</div>
              </DropDown>
            </div>
            :
            <>
              <Button onClick={click => window.location.href="/signin"}>Login</Button>
              <Button onClick={click => window.location.href="/signup"}>Signup</Button>
            </>
        }
      </div>
    </div>
  );
}

export default styled(Header)`
  position: fixed;
  display: flex;
  z-index: 1000;
  width: 100%;
  background: #012E46;
  padding: 8px 64px;
  
  ${Button} {
    color: white;
  }

  .buttons {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  justify-content: center;

    > .container {
      position: relative;
      padding: 8px;
      cursor: pointer;
      border-radius: 8px;

      ${DropDown} {
        position: absolute;
        right: 0;
      }

      &:hover {
        background: rgba(0,0,0,0.2);
      }
    }

    ${Button} {
      background: none;
      width: fit-content;
      border-radius: 8px;

      &:hover {
        background: rgba(0,0,0,0.2);
      }
    }
  }

  h2 {
    display inline-block;
    font-family: "Roboto Slab";
    color: white;
  }

  ${Highlight} {
    font-size: 10px;
  }
`;
