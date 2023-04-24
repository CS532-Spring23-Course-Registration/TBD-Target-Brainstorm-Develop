import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  box_container: {
    display: "flex",
    margin: "20px",
    padding: "20px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px",
  },
  input: { marginTop: "20px" },
  inputBox: { paddingTop: "30px" },

  submitButton: { marginTop: "20px" },
}));

function SignUp() {
  const classes = useStyles();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      reportName: "student_info",
      id: id,
      name: name,
      address: address,
      dateOfBirth: dateOfBirth,
      major: major,
      minor: minor,
    };

    axios
      .post("/api/signup", formData)
      .then((response) => {
        console.log(response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box className={useStyles.box_container} mt={10}>
      <Container maxWidth="sm">
        <Card variant="outlined" color="error">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" align="center">
              Signup
            </Typography>
          </Box>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Box className={classes.input}>
              {" "}
              <TextField
                label="ID"
                variant="outlined"
                value={id}
                onChange={(event) => setId(event.target.value)}
              />
            </Box>

            <Box className={classes.input}>
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Address"
                variant="outlined"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Date of Birth"
                variant="outlined"
                type="date"
                value={dateOfBirth}
                InputProps={{ className: classes.inputBox }}
                onChange={(event) => setDateOfBirth(event.target.value)}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Major"
                variant="outlined"
                value={major}
                onChange={(event) => setMajor(event.target.value)}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Minor"
                variant="outlined"
                value={minor}
                onChange={(event) => setMinor(event.target.value)}
              />
            </Box>
            <Box className={classes.submitButton}>
              <Button type="submit" variant="contained" color="primary">
                Sign Up
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}

export default SignUp;
