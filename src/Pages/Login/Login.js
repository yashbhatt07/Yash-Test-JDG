import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { getToken } from "@firebase/messaging";
import { messaging } from "../../Firebase/Firebase";

const Login = () => {
  const navigate = useNavigate();
  const allUsers = useSelector(state => state.users);
  var token;
  getToken(messaging).then(tokenNum => {
    token = tokenNum;
  });
  console.log("Login -> token", token);

  var dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        // console.log(response.data);

        response.data.forEach(user => {
          
          if (allUsers.length <= 0) {
            dispatch({
              type: "STORE_USER",
              payload: {
                id: user?.id,
                email: user.email,
                userName: user.username,
                password: user.website,
                token:token
              }
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);
  console.log("allUsers here", allUsers);

  const loginHandler = async event => {
    event.preventDefault();

    const enteredEmail = email;
    const enteredPassword = password;

    if (!enteredEmail.trim()) {
      setEmailError("Please enter email");
      return;
    }

    if (!enteredPassword.trim()) {
      setPasswordError("Please Enter Password");
      return;
    }
    if (enteredPassword.length > 15) {
      setPasswordError("Password length must be less then 15 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enteredEmail)) {
      setEmailError("Please enter a valid email address");
      console.log("Please enter a valid email address");
      return;
    }

    const userToLogin = allUsers.find(user => user.email === enteredEmail);

    if (userToLogin && userToLogin.password === enteredPassword) {
      const userData = JSON.stringify({
        email: userToLogin?.email,
        password: userToLogin?.website,
        userName: userToLogin?.userName,
        id: userToLogin?.id,
        token: token
      });
      dispatch({
        type: "UPDATE_USER",
        payload: userData
      });

      localStorage.setItem("auth", true);
      localStorage.setItem("userData", userData);
      navigate(`/feed/${userToLogin.id}`);
      console.log("Login successful");
      setError("Login Successfully");
    } else {
      console.log("Login failed");
      setError("Wront Credential");
    }
  };

  return (
    <div className="login w-100 m-auto ">
      <Form className="container" onSubmit={loginHandler}>
        <h4 className="text-white text-center">Login</h4>
        <hr className="text-white" />
        <Form.Group controlId="email" className="mb-4">
          <Form.Label className="text-white">Email*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <span className="text-danger">{emailError}</span>
        </Form.Group>
        <Form.Group controlId="password" className="mb-5">
          <Form.Label className="text-white">Password*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span className="text-danger">{passwordError}</span>
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-dark text-end"
          disabled={email.length <= 0 || !email.trim()}
        >
          Login
        </Button>
        <br />
        <span className="text-danger">{error}</span>
      </Form>
    </div>
  );
};

export default Login;
