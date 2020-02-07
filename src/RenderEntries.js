import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import apiUrl from "./ApiUrl";
import update from "immutability-helper";

// import { Button, Field, Input } from 'react-bulma-components/dist';

export default class RenderEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      entries: this.props.entries,
    };
    this.renderEntry = this.renderEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterEntry = this.filterEntry.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  renderEntry(entry, index) {
    
    function toggleDone() {
      //console.log("marking entry as done");
      //console.log(this.state.entries);
      axios
        .patch(
          apiUrl + "/entries/" + entry.id,
          {
            done: !entry.done
          },
          { withCredentials: true }
        )
        .then(response => {
          // console.log(response);
          // console.log(this.state.entries);
          if (response.status == 200) {
            // if(!entry.done){
            //   console.log("Marked as done");
            // } else{
            //   console.log("Marked as not done");
            // }
            this.setState({
              entries: update(this.state.entries, {
                [index]: {
                  marked: { $set: !entry.marked },
                  done: { $set: !entry.done }
                }
              })
            });
            console.log(this.state.entries);
          }
        })
        .catch(error => {
          console.log("toggle done error");
          console.log(error);
          console.log(error.response);
          if (error.response.data.errors) {
            // this.setState({
            //   registrationErrors: error.response.data.errors.join("\n")
            // });
          } else {
            // this.setState({
            //     registrationErrors: error.response.data.error
            // });
          }
        });
      //event.preventDefault();
    }
    toggleDone = toggleDone.bind(this);
    function showToggleDone() {
      //console.log(entry);
      let buttonText;
      if (entry.marked) {
        //change css for undo button
        return (
          <td>
            <button onClick={toggleDone}>
              {"Marked as " + (entry.done ? "done " : "not done") + "(undo)"}
            </button>
          </td>
        );
      } else {
        return (
          <td>
            <button onClick={toggleDone}>
              {"Mark as " + (entry.done ? "not done " : "done")}
            </button>
          </td>
        );
      }
    }

    function truncateString(str, len) {
      if (str.length <= len) {
        return str;
      }
      return str.slice(0, len) + "...";
    }

    //console.log(entry);
    return (
      <tr key={entry.id}>
        <td>{truncateString(entry.content, 30)}</td>
        <td>{entry.due_date}</td>
        {showToggleDone()}
        <td>
          {/* {console.log(entry)} */}
          <Link
            to={{
              pathname: "/showEntry",
              state: { entry: entry }
            }}
          >
            <button type="button">Edit</button>
          </Link>
        </td>
        <td> {entry.tags.reduce( (s, tag) => s+", "+tag.content, "").slice(2)}</td>
        {/* {console.log(new Date(entry.due_date).getTime() , new Date().getTime() - 24 * 60 * 60 * 1000)} */}
        {entry.due_date && new Date(entry.due_date).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000 && !entry.done && 
          <td> overdue </td>}
        {/*console.log(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)) > new Date(entry.due_date))*/}
      </tr>
    );
  }

  filterEntry(entry){
    var include = true;
    var combined = entry.content.toLowerCase() + entry.tags.reduce( (s, tag) => s+" "+tag.content, "");
    //console.log(combined);
    //tokenize search terms
    var searchTokens = this.state.search.toLowerCase().split(",");
    searchTokens.forEach(token => {include &= combined.includes(token.trim());});
    return include;
  }
  render() {
    if (this.props.entries.length > 0) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="search"
              name="search"
              placeholder="Search in content or tags, separate with commas"
              value={this.state.content}
              onChange={this.handleChange}
              required
            />
          </form>
          <table>
            <tbody>
              {/* {console.log(this.state.search)} */}
              <tr>
                <th>Content</th>
                <th>Due</th>
                <th>Done</th>
                <th>{/* edit button */}</th>
                <th>Tags</th>
              </tr>
              {/* {console.log("render entries: ", this.props.entries, this.state.entries)} */}
              {this.state.entries
                .filter(this.filterEntry)
                .map(this.renderEntry)}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <h2>there are no entries!</h2>;
    }
  }
}
