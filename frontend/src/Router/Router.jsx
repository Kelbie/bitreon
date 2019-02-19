import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import styled, { createGlobalStyle } from "styled-components";

import Body from "../Body/Body";
import Header from "../Header/Header";
import Waitlist from "../Waitlist/Waitlist";
import Thanks from "../Waitlist/Thanks";
import Seed from "../Seed/Seed";
import Invoice from "../Invoice/Invoice";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo-hooks';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Arial;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

const Explore = lazy(() => import("../Explore/Explore"));
const CreatorPage = lazy(() => import("../CreatorPage/CreatorPage"));
const Signup = lazy(() => import("../Signup/Signup"));
const Signin = lazy(() => import("../Signin/Signin"));
const Verify = lazy(() => import("../Verify/Verify"));
const VerifyNotify = lazy(() => import("../Verify/VerifyNotify"));
const Settings = lazy(() => import("../Settings/Settings"));

function Router(props) {
  return (
    <ApolloProvider client={client}>
      <div {...props}>
        <GlobalStyle />
        <BrowserRouter>
          <Switch>
              <div className="content">
                <Route component={Header} />
                <Body>
                  <Suspense fallback={"<h1>Test</h1>"}>
                    <Route exact path="/list" component={Waitlist} />
                    <Route exact path="/thanks" component={Thanks} />
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/signin" component={Signin} />
                    <Route exact path="/" component={Explore} />
                    <Route exact path="/user/:username" component={CreatorPage} />
                    <Route exact path="/verify" component={VerifyNotify} />
                    <Route exact path="/verify/:token" component={Verify} />
                    <Route exact path="/settings/:username" component={Settings} />
                    <Route exact path="/seed" component={Seed} />
                    <Route exact path="/invoice/:invoice" component={Invoice} />
                  </Suspense>
                </Body>
              </div>
            </Switch>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

Router = styled(Router)`
  ${Body} {
    min-height: 100vh;
  }

  ${Body} > div:first-child {
    margin-top: 48px;
  }
`;

export default Router;
