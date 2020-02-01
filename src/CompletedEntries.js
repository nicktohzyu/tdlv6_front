import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import apiUrl from "./ApiUrl";

import RenderEntries from "./RenderEntries"

export default class CompletedEntries extends Component {
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
      );
    }
    return (
      <div>
        <h1>Completed entries</h1>
        {this.state.entries && <RenderEntries entries={this.state.entries.filter(entry => entry.done)}/>}
        <br></br>
        <Link to="/dashboard">
          <button type="button">
            Back to your dashboard
          </button>
        </Link>
      </div>
    );
  }
}