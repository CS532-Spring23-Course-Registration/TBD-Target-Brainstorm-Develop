import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Card,
} from "@mui/material";

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
  const navigate = useNavigate();

  const classes = useStyles();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");

  /* Limit input length of date */
  const handleChange = (event) => {
    const { value } = event.target;
    if (value.length <= 10) {
      setDateOfBirth(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      reportName: "student_info",
      name: name,
      address: address,
      dateOfBirth: dateOfBirth,
      major: major,
      minor: minor,
    };

    // try {
    //   const response = await fetch("http://127.0.0.1:5000/signup", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.status === 200) {
    //     const data  = await response.json();
    //     console.log(data);

    //     navigate('/');
    //   }
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  return (
    <Box className={useStyles.box_container} mt={10}>
      <Container maxWidth="sm">
        <Card variant="outlined" color="error">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" align="center">
              Register User
            </Typography>
          </Box>
          <form className={classes.form} onSubmit={handleSubmit}>
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
                onChange={handleChange}
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
