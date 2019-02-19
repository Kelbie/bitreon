import React, { useState, useEffect, useRef, useCallback } from "react";

import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import async from "async";

import Avatar from "react-avatar";

import QRCode from "qrcode.react";

import generateName from "sillyname";

import Paper from "../Components/Paper/Paper";

import { Button, ButtonB } from "../Components/Button/Button";
import DropDown from "../Components/DropDown/DropDown";
import A from "../Components/A/A";
import Label from "../Components/Label/Label";
import TextArea from "../Components/TextArea/TextArea";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faPlus } from "@fortawesome/free-solid-svg-icons";

library.add(faPlus);
library.add(faCaretDown);

const Icons = styled(FontAwesomeIcon)``;

function Head(props) {
  return (
    <Paper {...props}>
      <div className="top">
        <div className="img-container">
          <Avatar name={props.user.username} size="100%" />
        </div>
      </div>
      <div className="bottom">
        <div className="tabs">
          <div className="tab">
            <div className="text">FEED</div>
            <div className="underline" />
          </div>
        </div>
      </div>
    </Paper>
  );
}

Head = styled(Head)`
  width: 100%;
  border-radius: 8px;

  .top {
    position: relative;
    background: #eeeff1; /* Old browsers */
    background: -moz-linear-gradient(
      top,
      #eeeff1 0%,
      #9d9e9e 100%
    ); /* FF3.6-15 */
    background: -webkit-linear-gradient(
      top,
      #eeeff1 0%,
      #9d9e9e 100%
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
      to bottom,
      #eeeff1 0%,
      #9d9e9e 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#EEEFF1', endColorstr='#9D9E9E',GradientType=0 ); /* IE6-9 */
    width: 100%;
    height: 200px;
    border-radius: 8px 8px 0px 0px;

    > .img-container {
      overflow: hidden;
      position: absolute;
      width: 128px;
      height: 128px;
      border-radius: 100%;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.33);
      left: 32px;
      bottom: 0;
      transform: translateY(25%);
      background: #ffffff;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    > .username {
      font-family: "Open Sans";
      font-weight: normal;
      position: absolute;
      left: 136px;
      bottom: 8px;
      color: white;
      font-weight: bold;
      font-size: 24px;
    }
  }

  .bottom {
    background: white;
    width: 100%;
    height: 50px;
    border-radius: 8px;

    > .tabs {
      display: flex;
      margin-left: 136px;
      max-width: 500px;
      height: 100%;

      > .tab {
        position: relative;
        padding: 0px 24px;
        color: #f48322;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;

        > .text {
          font-family: "Open Sans";
        }

        > .underline {
          position: absolute;
          width: 100%;
          height: 4px;
          background: #f48322;
          left: 0;
          bottom: 0;
        }
      }
    }
  }
`;

function Info(props) {
  return (
    <div {...props}>
      <h1>{props.user.display_name}</h1>
      <h2>@{props.user.username}</h2>
      <p className="desc" />
    </div>
  );
}

Info = styled(Info)`
  border-radius: 8px;
  padding: 24px;
  text-align: left;

  > h1 {
    font-size: 20px;
    color: #3b3b3b;
  }

  > h2 {
    font-size: 14px;
    color: #939393;
  }

  > .desc {
    margin-top: 8px;
    font-size: 12px;
    color: #333333;
  }
`;

function Post(props) {
  const [dropDownActive, setDropDownActive] = useState(false);

  async function del() {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/user/${props.username}/posts/${
        props.id
      }/delete`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    props.del(props.id);
    setDropDownActive(false);
  }

  return (
    <div {...props}>
      <div className="left">
        <A href="">
          <div className="img-container">
            <img src={``} alt="" />
          </div>
        </A>
      </div>
      <div className="right">
        <div className="inline">
          <A href="">
            <div className="display-name">{props.displayName}</div>
            <div className="handle">@{props.username}</div>
          </A>
          {props.authenticated ? (
            <>
              <Icons
                icon="caret-down"
                onClick={action => setDropDownActive(!dropDownActive)}
              />
              <DropDown show={dropDownActive}>
                <div onClick={action => del()}>Delete</div>
              </DropDown>
            </>
          ) : (
            ""
          )}
        </div>
        <h1 className="title">{props.title}</h1>
        <ReactMarkdown className="content" source={props.content} />
        <div className="timestamp">
          <A href="">{new Date(props.time * 1000).toUTCString()}</A>
        </div>
      </div>
    </div>
  );
}

Post = styled(Post)`
  display: grid;
  grid-template-columns: max-content 1fr;

  .left {
    padding-right: 4px;
    .img-container {
      width: 32px;
      height: 32px;
      border-radius: 100%;
      overflow: hidden;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .right {
    padding-left: 4px;
    text-align: left;

    .inline {
      display: flex;
      flex-direction: row;
      position: relative;

      > ${Icons} {
        width: auto;
        cursor: pointer;
        margin-left: auto;
      }

      > ${DropDown} {
        position: absolute;
        top: 24px;
        right: 0;
      }
    }

    .display-name {
      font-size: 14px;
      font-weight: bold;
    }

    .handle {
      font-size: 12px;
    }

    .title {
      margin-top: 8px;
      font-size: 20px;
    }

    .content {
      margin-top: 8px;
    }

    p {
      margin: 8px 0px;
    }

    .timestamp {
      margin-top: 8px;
      font-size: 12px;
    }
  }
`;

function MakePost(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [time, setTime] = useState(0);

  async function MakeTimestamp() {
    const time = await Math.round(new Date().getTime() / 1000);
    console.log(time);
    return time;
  }

  const post = async () => {
    const time = await MakeTimestamp();
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/${props.user.username}/post`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          content: content,
          username: props.user.username,
          time: time
        })
      }
    );
    const value = await response.json();
    await props.add(value.id, title, content, time);
  };

  return (
    <div class="makePost" {...props}>
      {/* <TextArea name="title" 
                id=""
                placeholder="Title"
                onChange={value => { setTitle(value.target.value) }}></TextArea> */}
      <TextArea
        name="contents"
        id=""
        placeholder=""
        onChange={value => {
          setContent(value.target.value);
        }}
      />

      <div class="inline">
        <Button
          border
          primary
          onClick={() => {
            post();
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}

MakePost = styled(MakePost)`
  width: 100%;
  margin-bottom: 16px;

  > .inline {
    display: flex;
    flex-direction: row;

    width: 100%;
    > ${Button} {
      width: auto;
      margin: 8px;
      margin-left: auto;
    }
  }
`;

function Feed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(async () => {
    if (props.user.username != undefined) {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/user/${props.user.username}/posts`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();
      const posts = data.posts;

      setPosts(posts);
    }
  }, [props.user.username]);

  return (
    <Paper {...props} withPadding>
      {props.authenticated ? (
        <MakePost
          {...props}
          add={(id, title, content, time) => {
            setPosts([
              { id: id, title: title, content: content, time: time },
              ...posts
            ]);
          }}
          del={id => {
            setPosts([]);
          }}
        />
      ) : (
        ""
      )}

      {posts.map(post => {
        return (
          <>
            <Post
              username={props.user.username}
              displayName={props.user.display_name}
              type={"text"}
              title={post.title}
              content={post.content}
              id={post.id}
              time={post.time}
              authenticated={props.authenticated}
              del={id => {
                setPosts(posts.filter(item => item.id != id));
              }}
            />
            <hr />
          </>
        );
      })}
      {posts.length == 0 && !props.authenticated ? (
        <div>This user has not posted yet.</div>
      ) : (
        ""
      )}
    </Paper>
  );
}

Feed = styled(Feed)`
  border-radius: 8px;

  hr {
    width: 100%;
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-top: 24px;
    margin-bottom: 24px;
    border: 2px solid #eeeff1;
  }
`;

function Tier(props) {
  const [dropDownActive, setDropDownActive] = useState(false);
  const [id, setId] = useState(props.id);
  const [title, setTitle] = useState(props.title);
  const [tempTitle, setTempTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.desc);
  const [tempDesc, setTempDesc] = useState(props.desc);
  const [amount, setAmount] = useState(props.amount);
  const [tempAmount, setTempAmount] = useState(props.amount);
  const [editable, setEditable] = useState(false || props.editable);

  let direction = "row";
  if (editable) {
    direction = "column";
  }

  async function del() {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/${props.user.username}/tier`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, action: "delete" })
      }
    );
    props.del(id);
  }

  async function test() {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/${props.user.username}/tier`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: props.user.id,
          id: id,
          price: tempAmount,
          title: tempTitle,
          content: tempDesc
        })
      }
    );
  }

  async function go_to_invoice() {
    console.log(id);
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/invoice/${props.user.username}/${id}`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    const response_json = await response.json();
    console.log(process.env.REACT_APP_HOST);
    window.location.href = `/invoice/${response_json.invoice}`;
  }

  return (
    <div {...props}>
      <div className={`${direction}`}>
        {editable ? (
          <>
            <Label>Title</Label>
            <TextArea
              name="title"
              defaultValue={title}
              onChange={function(ta) {
                setTempTitle(ta.target.value);
              }}
            />
          </>
        ) : (
          <Label>{title}</Label>
        )}

        {props.authenticated ? (
          <div className="options">
            {editable ? (
              <></>
            ) : (
              <Icons
                icon="caret-down"
                onClick={action => setDropDownActive(!dropDownActive)}
              />
            )}
            <DropDown show={dropDownActive}>
              <div
                onClick={action => {
                  setEditable(true);
                  setDropDownActive(false);
                }}
              >
                Edit
              </div>
              <div
                onClick={action => {
                  del();
                  setDropDownActive(false);
                }}
              >
                Delete
              </div>
            </DropDown>
          </div>
        ) : (
          <></>
        )}
      </div>
      {editable ? (
        <>
          <Label>Amount</Label>
          <TextArea
            defaultValue={amount}
            onChange={function(value) {
              setTempAmount(value.target.value);
            }}
          />
        </>
      ) : (
        ""
      )}

      {editable ? (
        <>
          <Label>Description</Label>
          <TextArea
            defaultValue={desc}
            onChange={function(value) {
              setTempDesc(value.target.value);
            }}
          />
        </>
      ) : (
        <ReactMarkdown source={desc} />
      )}

      {editable ? (
        <div className="row">
          <Button
            border
            secondary
            onClick={event => {
              setEditable(false);
            }}
          >
            Cancel
          </Button>
          <Button
            border
            primary
            onClick={event => {
              setEditable(false);
              test();
              setTitle(tempTitle);
              setDesc(tempDesc);
              setAmount(tempAmount);
            }}
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <ButtonB border value={amount} onClick={() => go_to_invoice()} />
        </>
      )}
    </div>
  );
}

Tier = styled(Tier)`
  text-align: right;
  font-size: 16px;

  .row {
    display: flex;
    flex-direction: row;
  }
  .column {
    display: flex;
    flex-direction: column;
  }

  ${Button} {
    margin: 4px;
    width: fit-content;
    font-size: 12px;
  }

  ${ButtonB} {
    margin: 0px;
    margin-left: auto;
    width: fit-content;
    font-size: 12px;
  }
  .options {
    text-align: left;
    position: relative;

    ${Icons} {
      cursor: pointer;
      margin-left: 8px;
    }

    ${DropDown} {
      position: absolute;
      right: 0;
    }
    margin-left: auto;
  }

  ol {
    padding-left: 1em;
  }

  .monthly-amount {
    font-size: 14px;
    color: #b9b9b9;
  }

  p {
    margin: 4px;
    text-align: left;
  }
`;

function Tiers(props) {
  const [tiers, setTiers] = useState([]);

  useEffect(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/user/${props.match.params.username}/tiers`,
      {
        credentials: "include"
      }
    );
    const data = await response.json();

    const tiers = data.tiers;
    setTiers(tiers);
  }, []);

  const addTier = async () => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/key`, {
      credentials: "include"
    });
    const status = await response.status;
    if (status == 200) {
      setTiers([...tiers, { title: "", amount: 0, desc: "", editable: true }]);
    } else if (status == 404) {
      window.location.href = "/seed";
    }
  };

  return (
    <Paper {...props} withPadding>
      <div className="top">
        <h3>Tiers</h3>
        {props.authenticated ? (
          <Button
            onClick={event => {
              addTier();
            }}
          >
            <Icons icon="plus" />Add Tier
          </Button>
        ) : (
          ""
        )}
      </div>
      <Button
        onClick={event => {
          addTier();
        }}
      >
        <Icons icon="plus" />Add Tier
      </Button>{" "}
      : ""
      {tiers.map((tier, i) => {
        return (
          <>
            <Tier
              authenticated={props.authenticated}
              title={tier.title}
              id={tier.id}
              amount={tier.price}
              desc={tier.contents}
              user={props.user}
              editable={tier.editable || false}
              del={id => {
                setTiers(tiers.filter(item => item.id != id));
              }}
            />
            <hr />
          </>
        );
      })}
    </Paper>
  );
}

Tiers = styled(Tiers)`
  border-radius: 8px;

  hr {
    width: 100%;
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-top: 24px;
    margin-bottom: 24px;
    border: 2px solid #eeeff1;
  }

  .top {
    display: flex;
    flex-direction: row;
    width: calc(100% + 32px);
    margin-top: -16px;
    margin-left: -16px;
    margin-bottom: 24px;
    padding: 16px;

    background: #eeeff1;

    > ${Button} {
      padding: 0px;
      margin: 0px;
      width: auto;
      margin-left: auto;

      > ${Icons} {
        margin-right: 4px;
      }
    }
  }

  h3 {
    color: #606060;
    font-size: 14px;
    text-align: left;
  }
  hr {
    border: 2px solid #eff2f5;
  }
`;

function Tip(props) {
  const [address, setAddress] = useState("");

  useEffect(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/user/${props.match.params.username}/tip`,
      {
        credentials: "include"
      }
    );
    const data = await response.json();
    console.log(123, data);
    const address = data.address;

    setAddress(address);
  }, []);

  return (
    <Paper withPadding {...props}>
      <div className="top">
        <h3>Tip</h3>
        {
           props.authenticated & address == "" ?
            <Button onClick={event => {
              document.location.href="/seed"
            }}>
            <Icons icon="plus" />Start Accepting Bitcoin
           </Button> : ""
        }
      </div>
      {address ? (
        <>
          <QRCode value={address} />
          <br />
          <br />
          <p>{address}</p>
        </>
      ) : (
        <p>This user has not enabled payments yet</p>
      )}
    </Paper>
  );
}

Tip = styled(Tip)`
  border-radius: 8px;

  hr {
    width: 100%;
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-top: 24px;
    margin-bottom: 24px;
    border: 2px solid #eeeff1;
  }

  .top {
    display: flex;
    flex-direction: row;
    width: calc(100% + 32px);
    margin-top: -16px;
    margin-left: -16px;
    margin-bottom: 24px;
    padding: 16px;

    background: #eeeff1;

    > ${Button} {
      padding: 0px;
      margin: 0px;
      width: auto;
      margin-left: auto;

      > ${Icons} {
        margin-right: 4px;
      }
    }
  }

  h3 {
    color: #606060;
    font-size: 14px;
    text-align: left;
  }
  hr {
    border: 2px solid #eff2f5;
  }
`;

function CreatorPage(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({ supporters: 0, authenticated: false });

  useEffect(async () => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/user/${props.match.params.username}`,
      {
        credentials: "include"
      }
    );
    const data = await response.json();

    const user = data.user;

    setAuthenticated(data.authenticated);
    setUser(user);
  }, []);

  return (
    <div {...props}>
      <Head user={user} authenticated={authenticated} />
      <div className="columns">
        <Info user={user} authenticated={authenticated} />
        <Feed user={user} authenticated={authenticated} />
        <Tip {...props} authenticated={authenticated} />
        {/* <Tiers {...props} user={user} authenticated={authenticated} /> */}
      </div>
    </div>
  );
}

export default styled(CreatorPage)`
  margin: auto;

  @media only screen and (min-width: 750px) {
    max-width: 750px;
  }

  .columns {
    display: flex;
    justify-content: center;

    > * {
      width: 100%;
      margin-top: 16px;
    }

    > div {
      align-self: flex-start;
      margin: 16px 8px;
    }

    @media only screen and (max-width: 750px) {
      flex-direction: column;
    }

    @media only screen and (min-width: 750px) {
      flex-direction: row;
      ${Info} {
        max-width: 100px;
      }
      ${Feed} {
        max-width: 500px;
      }
      ${Tiers} {
        max-width: 300px;
      }
    }
  }
`;
