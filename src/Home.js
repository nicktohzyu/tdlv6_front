import React, { Component } from "react";
import { Link } from 'react-router-dom';

import Login from "./auth/Login";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectMessage: this.props.location.state 
      
    };
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/dashboard");
  }
  dashboardLink(){
    if(this.props.loggedInStatus === "LOGGED_IN"){
      return(
        <React.Fragment>
          <h2>You are already logged in!</h2>
          <Link to="/dashboard">
            <button type="button">
              Go to your dashboard
            </button>
          </Link>
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <div>
        {/*<h1>build: {process.env.NODE_ENV}</h1>
        <h1>API: {this.props.api_url}</h1>*/}
        <h1>Home</h1>
        <h1>Status: {this.props.loggedInStatus}</h1>
        <button onClick={() => this.props.handleLogoutClick()}>Logout</button>
        <Login {...this.props} handleSuccessfulAuth={this.handleSuccessfulAuth} />
        {this.dashboardLink()}
        <this.props.showRedirectMessage props={this.state.redirectMessage}/>
        <br></br>
        <Link to="/registration">Register</Link>
      </div>
    );
  }
}
