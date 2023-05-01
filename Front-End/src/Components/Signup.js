import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [fields, setFields] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    major: "",
    minor: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    phoneNumber: false,
    address: false,
    dateOfBirth: false,
    major: false,
    minor: false,
  });

  /* Limit input length of date */
  const handleDate = (event) => {
    const { name, value } = event.target;
    if (value.length <= 10) {
      setFields( {...fields, dateOfBirth: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value === "",
      }));
    }
  };

  /* Only accept numeric values in Phone Number field */
  const handleNumber = (event) => {
    const { name, value } = event.target;
    setFields( {...fields, phoneNumber: value.replace(/\D/g, "") });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.length !== 11,
    }));
  }

  /* Triggers error if a specified required field has no values */
  const handleRequiredFields = (event) => {
    const { name, value } = event.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value === "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      reportName: "student_info",
      name: fields.name,
      phoneNumber: fields.phoneNumber,
      address: fields.address,
      dateOfBirth: fields.dateOfBirth,
      major: fields.major,
      minor: fields.minor,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data  = await response.json();
        console.log(data);

        navigate('/');
      }
      } catch (error) {
        console.log(error);
      }
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
                name="name"
                variant="outlined"
                value={fields.name}
                onChange={handleRequiredFields}
                required
                error={errors.name}
                helperText={errors.name ? "Name field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Phone number"
                name="phoneNumber"
                variant="outlined"
                value={fields.phoneNumber}
                inputProps={{ 
                  maxLength: 11,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                onChange={handleNumber}
                required
                error={errors.phoneNumber}
                helperText={errors.phoneNumber ? "11 digit phone number is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                value={fields.address}
                onChange={handleRequiredFields}
                required
                error={errors.address}
                helperText={errors.address ? "Address field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                variant="outlined"
                type="date"
                value={fields.dateOfBirth}
                InputProps={{ className: classes.inputBox }}
                onChange={handleDate}
                required
                error={errors.dateOfBirth}
                helperText={errors.dateOfBirth ? "Field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Major"
                name="major"
                variant="outlined"
                value={fields.major}
                onChange={handleRequiredFields}
                required
                error={errors.major}
                helperText={errors.major ? "Field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Minor"
                name="minor"
                variant="outlined"
                onChange={handleRequiredFields}  
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
