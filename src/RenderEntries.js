import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import apiUrl from "./ApiUrl";
import update from "immutability-helper";
// import './w3.css';

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
            // console.log(this.state.entries);
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
    let overdue = entry.due_date && new Date(entry.due_date).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000 && !entry.done;
    //console.log(entry);
    return (
      <tr key={entry.id} className={(overdue ? "overdue " : "") + "w3-hover-indigo"}>
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
        <td className="tags"> {entry.tags.length ? truncateString(entry.tags.reduce( (s, tag) => s+", "+tag.content, "").slice(2), 30) : "-"}</td>
        <td> {overdue && <>overdue</> } </td>
      </tr>
    );
  }

  filterEntry(entry){
    var include = true;
    var combined = entry.content.toLowerCase() + entry.tags.reduce( (s, tag) => s+" "+tag.content.toLowerCase(), "");
    var searchTokens = this.state.search.toLowerCase().split(",");
    searchTokens.forEach(token => {
      include &= combined.includes(token.trim());
    });
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
              placeholder="Search in content or tags, search for multiple terms with commas"
              value={this.state.content}
              onChange={this.handleChange}
              required
              size="60"
              title=""
            />
          </form>
          <table className="entries-table">
            <tbody>
              {/* {console.log(this.state.search)} */}
              <tr>
                <th>Content</th>
                <th>Due</th>
                <th>{/* mark as done button */}</th>
                <th>{/* edit button */}</th>
                <th>Tags</th>
                <th>{/* overdue */}</th>
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
