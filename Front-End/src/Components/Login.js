import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";
import styled from "@mui/system/styled";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const LoginButton = styled(Button)`
  background-color: lightcoral;
  &:hover {
    background-color: lightcoral;
    opacity: 0.8;
  }
`;

function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Send POST request for User Authentication
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      const sessionKey = data.session_key;

      if (sessionKey != null) {
        console.log("Successful Login!");
        Cookies.set('session_key', sessionKey, { expires : 12/24, path: '/'});
        props.updateAuthentication(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Container maxWidth="xs">
        <Card variant="outlined" color="error">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" align="center">
              Login
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              autoComplete="email"
              margin="normal"
              variant="outlined"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ mt: 2 }} >
              <LoginButton
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                component={Link}
                to="/"
              >
                Sign In
              </LoginButton>
            </Box>
          </form>
        </Card>
      </Container>
    </div>
  );
}

export default Login;