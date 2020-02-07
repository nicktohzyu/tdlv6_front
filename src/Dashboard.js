import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import apiUrl from "./ApiUrl";

import RenderEntries from "./RenderEntries"


/*
TODO: styling, authentication
*/
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: ""
    };
  }
  
  componentDidMount() {
    this.getEntries();
  }

  getEntries() {
    // console.log("getting entries from " + apiUrl + "/entries");
    axios
      .get(apiUrl + "/entries", { withCredentials: true })
      .then(response => {
          //console.log(response.data);
          this.setState({
            entries: response.data
          });
      })
      .catch(error => {
        console.log("get entries error", error);
      });
  }

  render() {
    if (this.props.loggedInStatus === "NOT_LOGGED_IN") {
      return (
        <div>
          {console.log("redirecting")}
          <Redirect to={{
            pathname: '/',
            state: { redirectMessage: "You must log in first to view the dashboard"}
          }} />
        </div>
      )
    }
    return (
        <div>
          <button onClick={() => this.props.handleLogoutClick()}>Logout</button>
          &emsp;
          <Link to="/">
            <button type="button" color="info" outlined rounded size="large">
              Login Page
            </button>
          </Link>
          <h1>Dashboard</h1>
          <this.props.showRedirectMessage location={this.props.location}/>
          {/*<h1>Status: {this.props.loggedInStatus}</h1>*/}
          {this.state.entries && <RenderEntries entries={this.state.entries.filter(entry => !entry.done)
            .sort((a, b) => a.due_date ? new Date(a.due_date) - new Date(b.due_date) : 1)}/>}
          <br></br>
          <Link to="/CompletedEntries">
            <button type="button">
              View your completed entries
            </button>
          </Link>
          <br></br>
          <Link to="/newEntry">
            <button type="button">
              Create New Entry
            </button>
          </Link>
        </div>
    );
  }
}
