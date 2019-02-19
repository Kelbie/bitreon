import React, { Suspense, useState, useEffect } from "react";
import async from "async";
import styled from "styled-components";

import generateName from "sillyname";

import theme from "../theme";

import Paper from "../Components/Paper/Paper";

import Avatar from "react-avatar";

function Filters(props) {
  return (
    <div {...props}>
      {/* <FilterButton>Politics</FilterButton>
      <FilterButton>Music</FilterButton>
      <FilterButton>Film</FilterButton>
      <FilterButton>Video</FilterButton>
      <FilterButton>Comics & Illustration</FilterButton>
      <FilterButton>Arts</FilterButton>
      <FilterButton>Gaming</FilterButton>
      <FilterButton>Animation</FilterButton> */}
    </div>
  );
}

Filters = styled(Filters)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
`;

function FilterButton(props) {
  return <div {...props}>{props.children}</div>;
}

FilterButton = styled(FilterButton)`
  cursor: pointer;
  background: white;
  flex-grow: 1;
  color: #c1c1c1;
  padding: 8px 32px;
  border: 2px solid #efefef;
`;

function Element(props) {
  return (
    <Paper
      withPadding={false}
      {...props}
      onClick={() => (window.location.href = `user/${props.username}`)}
    >
      <div className="cover-container">
        <div className="logo-container">
          <Suspense fallback={"<h1>test</h1>"}>
            <Avatar name={props.username} size="100%" />
          </Suspense>
        </div>
        <div className="username">@{props.username}</div>
      </div>
      <div className="footer">
        {/* <div className="supporters">{props.supporters.toLocaleString()} supporters</div> */}
      </div>
    </Paper>
  );
}

Element = styled(Element)`
  transition: 0.2s ease 0s;
  width: 300px;
  cursor: pointer;
  margin: auto;
  &:hover > .cover-container > .logo-container > img {
    transform: scale(1.05);
  }

  &:hover {
    transform: scale(1.03);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.15);
  }

  > .cover-container {
    position: relative;
    width: 100%;
    height: 80px;
    background: #152744;

    > .logo-container {
      position: absolute;
      width: 64px;
      height: 64px;
      border: 2px solid white;
      border-radius: 100%;
      background: white;
      bottom: 0;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
      left: 16px;
      transform: translateY(50%);
      overflow: hidden;
    }

    > .username {
      position: absolute;
      color: white;
      bottom: 4px;
      margin-right: 8px;
      left: 88px;
    }
  }

  > .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    margin-left: 88px;
    height: 48px;

    > .supporters {
      color: black;
      font-weight: bold;
      font-size: 14px;
      margin-right: 8px;
    }
  }
`;

function Creators(props) {
  const [users, setUsers] = useState([]);

  useEffect(async () => {

    const response = await fetch(`${process.env.REACT_APP_HOST}`, {
      credentials: "include",
      cache: "no-cache"
    });
    const data = await response.json();
    const users = data.users;
    setUsers(users);
  }, []);

  console.log(process.env)

  return (
    <div {...props}>
      {process.argv}
      {
        users.map(user => {
          return <Element username={user.username} supporters={user.supporters} img={user.img}/>
        })
      }
    </div>
  );
}

Creators = styled(Creators)`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
  margin: auto;

  @media only screen and (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }

  @media only screen and (max-width: 660px) {
    grid-template-columns: 1fr;
  }
`;

function Explore(props) {
  return (
    <div {...props}>
      <Filters />
      <Creators />
    </div>
  );
}

export default styled(Explore)`
  ${Creators} {
    margin-top: 16px;
  }
`;
