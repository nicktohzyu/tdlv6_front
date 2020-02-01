import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import apiUrl from "./ApiUrl";
import update from 'immutability-helper';

export default class RenderEntries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: this.props.entries
    };
    this.renderEntry = this.renderEntry.bind(this);
  }
  renderEntry(entry, index) {
    function deleteEntry(){
      if (!window.confirm("Are you sure you want to delete this entry? You can mark it as done instead")) {
        return;
      }
      console.log("deleting entry");
      axios
        .delete(
          apiUrl+"/entries/" + entry.id,
          { withCredentials: true }
        )
        .then(response => {
          // console.log(response);
          // console.log(this.state.entries);
          if (response.status == 200) {
            //console.log("Delete successful");
            this.setState({
                entries: this.state.entries.filter(stateEntry => stateEntry.id != entry.id)
            });
            //console.log(this.state.entries);
          }
        })
        .catch(error => {
          console.log("delete entry error");
          console.log(error.response);
          if(error.response.data.errors){
            // this.setState({
            //   registrationErrors: error.response.data.errors.join("\n")
            // });
          } else{
            // this.setState({
            //     registrationErrors: error.response.data.error
            // });
          }
        });
      //event.preventDefault();
    }
    deleteEntry = deleteEntry.bind(this);
    function toggleDone(){
      //console.log("marking entry as done");
      //console.log(this.state.entries);
      axios
        .patch(
          apiUrl+"/entries/" + entry.id,
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
              entries: update(this.state.entries, {[index]: {marked: {$set: !entry.marked}, done: {$set: !entry.done}}})
            });
            console.log(this.state.entries);
          }
        })
        .catch(error => {
          console.log("toggle done error");
          console.log(error);
          console.log(error.response);
          if(error.response.data.errors){
            // this.setState({
            //   registrationErrors: error.response.data.errors.join("\n")
            // });
          } else{
            // this.setState({
            //     registrationErrors: error.response.data.error
            // });
          }
        });
      //event.preventDefault();
    }
    toggleDone = toggleDone.bind(this);
    function showToggleDone(){
      //console.log(entry);
      let buttonText;
      if(entry.marked){
        //change css for undo button
        return(
          <td><button onClick={toggleDone}>{"Marked as " + (entry.done ? "done " : "not done") + "(undo)"}</button></td>
        )
      } else{
        return(
          <td><button onClick={toggleDone}>{"Mark as " + (entry.done ? "not done " : "done")}</button></td>
        )
      }
    }
    return (
      <tr key={entry.id}>
        <td>{entry.content}</td>
        <td>{entry.due_date}</td>
        {showToggleDone()}
        <td>
          {/* {console.log(entry)} */}
          <Link to={{
            pathname: '/showEntry',
            state: { entry: entry }
          }}>
            <button type="button">
              Edit
            </button>
          </Link>
        </td>
        {/*<td><button onClick={deleteEntry}>delete</button></td>*/}
      </tr>
    );
  }
  render() {
    //console.log(this.props.entries);
    if(this.props.entries.length > 0){
      return (
        <table>
          <tbody>
            {/*console.log(this.props.entries)*/}
            <tr>
              <th>Content</th>
              <th>Due</th>
              <th>Done</th>
            </tr>
            {this.state.entries.map(this.renderEntry)}
          </tbody>
        </table>
      );
    } else{
      return (
        <h2>there are no entries!</h2>
      )
    }
  }
}
