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
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const LoginButton = styled(Button)`
  background-color: lightcoral;
  &:hover {
    background-color: lightcoral;
    opacity: 0.8;
  }
`;

const useStyles = makeStyles((theme) => ({
  box_container: {
    display: "flex",
    margin: "20px",
    padding: "20px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  }
}));

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Send POST request for User Authentication
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401) {
        console.log("Authentication Failed.");
      } else {
        console.log("Successful Login.");

        const data = await response.json();

        Cookies.set("session_key", data.sessionId, { expires: 12 / 24, path: "/" });
        props.updateAuthentication(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Box className={useStyles.box_container} mt={10}>
        <Container maxWidth="sm">
          <Card variant="outlined" color="error">
            <Box sx={{ mt: 8, mb: 4 }}>
              <Typography variant="h4" align="center">
                Login
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
            <Box m={4}>
              <Box>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={username}
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>
                <Box>
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
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LoginButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Sign In
                  </LoginButton>
                  <Typography component={Link} to="/signup">
                    Sign up?
                  </Typography>            
                </Box>
              </Box>
            </form>
          </Card>
        </Container>
      </Box>
    </div>
  );
}

export default Login;
