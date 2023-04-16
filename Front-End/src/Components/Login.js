import React from "react";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";
import styled from "@mui/system/styled";

const LoginButton = styled(Button)`
  background-color: lightcoral;
  &:hover {
    background-color: lightcoral;
    opacity: 0.8;
  }
`;

function Login({ onLogin }) {
  return (
    <div>
      <Container maxWidth="xs">
        <Card variant="outlined" color="error">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" align="center">
              Login
            </Typography>
          </Box>
          <form onSubmit={onLogin}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              autoFocus
            />
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
            />
            <Box sx={{ mt: 2 }}>
              <LoginButton
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
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
