import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import apiUrl from "./ApiUrl";
// import { Field, Control, Label, Input, Textarea, Select, Checkbox, Radio, Help, InputFile } from 'react-bulma-components/lib/components/form';

export default class NewEntry extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        content: "",
        due_date: "",
        created: false,
        newEntryErrors: ""
      };
  
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  
    handleSubmit(event) {
      const { content, due_date } = this.state;
  
      axios
        .post(
          apiUrl+"/entries",
          {
            content: content,
            due_date: due_date,
            done: false
          },
          { withCredentials: true }
        )
        .then(response => {
          //console.log(response);
          if (response.status == 200) {
            console.log("Successful, redirecting");
            this.setState({
              created: true
            });
          }
        })
        .catch(error => {
          console.log("entry creation error");
          console.log(error.response);
          if(error.response.data.errors){
            this.setState({
              newEntryErrors: error.response.data.errors.join("\n")
            });
          } else{
            this.setState({
                newEntryErrors: error.response.data.error
            });
          }
        });
      event.preventDefault();
    }
  
    render() {
      if (this.state.created == true) {
        return (
          <div>
            {console.log("redirecting")}
            <Redirect to={{
              pathname: '/dashboard',
              state: { redirectMessage: "Entry created successfully"}
            }} />
          </div>
        )
      }
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <textarea
              type="content"
              name="content"
              placeholder="Content here"
              value={this.state.content}
              onChange={this.handleChange}
              required
            />
            <br></br>
            <input
              type="date" 
              name="due_date"
              value={this.state.due_date}
              onChange={this.handleChange}
            />
            <br></br>
            <button type="submit">Create Entry</button>
          </form>
          {this.state.newEntryErrors &&
            <h1>Registration error: {"\n" + this.state.newEntryErrors}</h1>
          }
          <Link to="/dashboard">Cancel, go back to the dashboard</Link>
        </div>
      );
    }
  }