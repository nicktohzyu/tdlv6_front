import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import apiUrl from "../ApiUrl";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      registrationErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data);
    this.props.history.push("/dashboard");
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { email, name, password, password_confirmation } = this.state;

    axios
      .post(
        apiUrl+"/registrations",
        {
          user: {
            email: email,
            name: name,
            password: password,
            password_confirmation: password_confirmation
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response.data.status === "created") {
          this.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        if(error.response && error.response.data && error.response.data.errors){
          this.setState({
            registrationErrors: error.response.data.errors.join("\n")
          });
        }
        console.log("registration error");
        console.log(error.response);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <br></br>
          <input
            type="name"
            name="name"
            placeholder="Your name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <br></br>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <br></br>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Password confirmation"
            value={this.state.password_confirmation}
            onChange={this.handleChange}
            required
          />
          <br></br>
          <button type="submit">Register</button>
        </form>
        {this.state.registrationErrors &&
          <h1>Registration error: {"\n" + this.state.registrationErrors}</h1>
        }
        <br></br>
        <Link to="/">Back to login page</Link>
      </div>
    );
  }
}
