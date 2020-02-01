import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import axios from "axios";
import apiUrl from "./ApiUrl";

export default class ShowEntry extends Component {
  constructor(props) {
    super(props);
    let entry = this.props.location.state.entry;
    this.state = {
      entryId: entry.id,
      content: entry.content,
      due_date: entry.due_date,
      done: entry.done,
      updated: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    //console.log(this.state);
  }

  handleChange(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { content, due_date, done } = this.state;
    console.log(this.state);
    axios
      .patch(
        apiUrl+"/entries/"+this.state.entryId,
        {
          content: content,
          due_date: due_date,
          done: done
        },
        { withCredentials: true }
      )
      .then(response => {
        //console.log(response);
        if (response.status == 200) {
          console.log("Successful, redirecting");
          this.setState({
            updated: true
          });
        }
      })
      .catch(error => {
        console.log("entry update error");
        console.log(error.response);
        if(error.response.data.errors){
          this.setState({
            registrationErrors: error.response.data.errors.join("\n")
          });
        } else{
          this.setState({
              registrationErrors: error.response.data.error
          });
        }
      });
    event.preventDefault();
  }

  render() {
    if (this.state.updated == true) {
      return (
        <div>
          {console.log("redirecting")}
          <Redirect to={{
            pathname: '/dashboard',
            state: { redirectMessage: "Entry updated successfully"}
          }} />
        </div>
      )
    }
    const doneOptions = [
      { value: false, label: 'Not Done' },
      { value: true, label: 'Done' },
    ];
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Content:
            <br></br>
            <textarea
              type="content"
              name="content"
              placeholder="Content here"
              value={this.state.content}
              onChange={this.handleChange}
              required
            />
          </label>
          <br></br>
          <label>
            Due Date:
            <br></br>
            <input
              type="date" 
              name="due_date"
              value={this.state.due_date}
              onChange={this.handleChange}
            />
          </label>
          <br></br>
          <label>
            Done?
            <br></br>
            {/* <select>
              <option value="grapefruit">Grapefruit</option>
              <option value="lime">Lime</option>
              type="date" 
              name="done"
              value={this.state.done}
              onChange={this.handleChange}
            </select> */}
            <Select 
              name="done"
              defaultValue={doneOptions[this.state.done? 1: 0]}
              onChange={(selected) => this.setState({done: selected.value})
              }
              options={doneOptions}
            ></Select>
          </label>
          <br></br>
          <button type="submit">Update Entry</button>
        </form>
        {this.state.registrationErrors &&
          <h1>Registration error: {"\n" + this.state.registrationErrors}</h1>
        }
        <Link to="/dashboard">Dashboard</Link>
      </div>
    );
  }
}