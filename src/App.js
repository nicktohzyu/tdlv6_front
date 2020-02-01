import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import apiUrl from "./ApiUrl";

import Home from "./Home";
import Dashboard from "./Dashboard";
import CompletedEntries from "./CompletedEntries";
import Registration from "./auth/Registration";
import NewEntry from "./NewEntry";
import ShowEntry from "./ShowEntry";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInStatus: "Contacting API",
      user: {}
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.showRedirectMessage = this.showRedirectMessage.bind(this);
  }

  checkLoginStatus() {
    axios
      .get(apiUrl + "/logged_in", { withCredentials: true })
      .then(response => {
        if (
          response.data.logged_in// &&
          //this.state.loggedInStatus === "NOT_LOGGED_IN"
        ) {
          //console.log(response.data.user);
          this.setState({
            loggedInStatus: "LOGGED_IN",
            user: response.data.user
          });
        } else if (
          !response.data.logged_in //&&
          //(this.state.loggedInStatus === "LOGGED_IN")
        ) {
          this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: {}
          });
        }
      })
      .catch(error => {
        console.log("check login error", error);
        this.setState({
          loggedInStatus: "LOG IN ERROR",
          user: {}
        });
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  handleLogoutClick() {
    axios
      .delete(apiUrl + "/logout", { withCredentials: true })
      .then(response => {
        this.handleLogout();
      })
      .catch(error => {
        console.log("logout error", error);
      });
  }

  handleLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    });
    //redirect here
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      user: data.user
    });
  }

  showRedirectMessage(props){
    //console.log(props);
    if(props){
      if(props.props){
        //console.log("showing redirect message");
        return (<h1>{props.props.redirectMessage}</h1>);
      } else{
        return null;
      }
    } else{
      return null;
    }
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={props => (
                <Home
                  {...props}
                  handleLogin={this.handleLogin}
                  handleLogoutClick={this.handleLogoutClick}
                  loggedInStatus={this.state.loggedInStatus}
                  showRedirectMessage={this.showRedirectMessage}
                />
              )}
            />
            <Route
              exact
              path={"/registration"}
              render={props => (
                <Registration
                  {...props}
                  handleLogin={this.handleLogin}
                  handleLogoutClick={this.handleLogoutClick}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />
            <Route
              exact
              path={"/dashboard"}
              render={props => (
                <Dashboard
                  {...props}
                  handleLogoutClick={this.handleLogoutClick}
                  loggedInStatus={this.state.loggedInStatus}
                  showRedirectMessage={this.showRedirectMessage}
                />
              )}
            />
            <Route
              exact
              path={"/CompletedEntries"}
              render={props => (
                <CompletedEntries
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />
            <Route
            exact
            path={"/newEntry"}
            render={props => (
              <NewEntry
                {...props}
                loggedInStatus={this.state.loggedInStatus}
              />
            )}
          />
          <Route
          exact
          path={"/showEntry"}
          render={props => (
            <ShowEntry
              {...props}
              loggedInStatus={this.state.loggedInStatus}
            />
          )}
        />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App