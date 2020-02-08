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
      entry: entry,
      entryId: entry.id,
      content: entry.content,
      due_date: entry.due_date,
      done: entry.done,
      updated: false,
      updateMessage: "",
      redirectMessage: "",
      tags: entry.tags,
      tagDeleteMessage: "",
      tagCreatedMessage: "",
      tagContent: ""
    };
    this.updateEntry = this.updateEntry.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createTag = this.createTag.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    //console.log(this.state);
  }
  deleteEntry() {
    if (
      !window.confirm(
        "Are you sure you want to delete this entry? You can mark it as done instead"
      )
    ) {
      return;
    }
    this.setState({
      updateMessage: "Deleting entry"
    });
    const {entry} = this.state;
    console.log("deleting entry");
    axios
      .delete(apiUrl + "/entries/" + entry.id, { withCredentials: true })
      .then(response => {
        // console.log(response);
        if (response.status == 200) {
          console.log("Successful, redirecting");
          this.setState({
            updated: true,
            redirectMessage: "Entry deleted successfully"
          });
        }
      })
      .catch(error => {
        console.log("delete entry error");
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
  createTag(event) {
    const { entryId, tagContent } = this.state;
    this.setState({
      tagCreatedMessage: "Adding tag"
    });
    axios
      .post(
        apiUrl+"/entries/" + entryId + "/tags",
        {
          content: tagContent
        },
        { withCredentials: true }
      )
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          console.log("Successfully added tag");
          this.setState({
            tags: [...this.state.tags, response.data],
            tagCreatedMessage: "Successfully added tag",
            tagDeleteMessage: ""
          });
        }
      })
      .catch(error => {
        console.log("tag creation error");
        console.log(error.response);
        if(error.response.data.errors){
          this.setState({
            tagCreatedMessage: error.response.data.errors.join("\n")
          });
        } else{
          this.setState({
            tagCreatedMessage: error.response.data.error
          });
        }
      });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  updateEntry(event) {
    this.setState({
      updateMessage: "Updating entry"
    });
    const { content, due_date, done, entryId} = this.state;
    console.log(this.state);
    axios
      .patch(
        apiUrl+"/entries/"+entryId,
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
            updated: true,
            redirectMessage: "Entry updated successfully"
          });
        }
      })
      .catch(error => {
        console.log("entry update error");
        console.log(error.response);
        if(error.response.data.errors){
          this.setState({
            updateMessage: error.response.data.errors.join("\n")
          });
        } else{
          this.setState({
            updateMessage: error.response.data.error
          });
        }
      });
    event.preventDefault();
  }

  renderTag(tag, index) {
    function deleteTag() {
      console.log("deleting tag");
      axios
        .delete(
          apiUrl+"/entries/" + tag.entry_id + "/tags/" + tag.id,
          { withCredentials: true })
        .then(response => {
          // console.log(response);
          // console.log(this.state.tags);
          if (response.status == 200) {
            console.log("Delete successful");
            this.setState({
              tags: this.state.tags.filter(
                stateTag => stateTag.id != tag.id
              ),
              tagDeleteMessage: "Tag Deleted Successfully",
              tagCreatedMessage: ""
            });
            console.log(this.state.tags);
          }
        })
        .catch(error => {
          console.log("delete tag error");
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
    deleteTag = deleteTag.bind(this);

    return (
      <tr key={tag.id}>
        <td>{tag.content}</td>
        {/*console.log(new Date(new Date().getTime() + (24 * 60 * 60 * 1000)) > new Date(entry.due_date))*/}
        <td><button onClick={deleteTag}>delete</button></td>
      </tr>
    );
  }

  render() {
    if (this.state.updated == true) {
      return (
        <div>
          {console.log("redirecting")}
          <Redirect to={{
            pathname: '/dashboard',
            state: { redirectMessage: this.state.redirectMessage}
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
        <button onClick={this.deleteEntry}>Delete this entry permanently</button>
        <form onSubmit={this.updateEntry}>
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
          {this.state.updateMessage}
          <button type="submit">Update Entry</button>
        </form>
        {this.state.registrationErrors &&
          <h1>Registration error: {"\n" + this.state.registrationErrors}</h1>
        }
        <h1> Tags: </h1>
        {/* {console.log(this.state.tags)} */}
        <table>
          <tbody>
            {/* {console.log("render entries: ", this.props.entries, this.state.entries)} */}
            {this.state.tags.map(this.renderTag)}
          </tbody>
        </table>
        {this.state.tagDeleteMessage}
        <br></br>
        <div>
          {/* appears to rerender page when form calls handleChange */}
          <form onSubmit={this.createTag}>
            <label>
              Add a tag:
              <br></br>
              <input
                type="tagContent" 
                name="tagContent"
                value={this.state.tagContent}
                onChange={this.handleChange}
              />
            </label>
            <button type="submit">add tag</button>
          </form>
          {this.state.tagCreatedMessage}
        </div>
        <br></br>
        <Link to="/dashboard">Cancel, go back to the dashboard</Link>
      </div>
    );
  }
}