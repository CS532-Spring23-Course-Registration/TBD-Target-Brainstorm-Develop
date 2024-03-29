import React, { useEffect, useState } from "react";
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
import MenuItem from '@mui/material/MenuItem';

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

  const [departments, setDepartments] = useState([]);
  
  /* Get list of departments, need to make route */
  useEffect(() => {
    fetch("http://127.0.0.1:3000/departments", {
      method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(data =>setDepartments(data));
  });
  console.log(departments)

  const initialFields = {
    name: "",
    password: "",
    jobTitle: "",

    officeNumber: "",
    officeHours: "",
    assignedDepartment: "",
    
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    major: "",
    minor: "",
  }

  const [fields, setFields] = useState(initialFields);

  const resetFields = () => {
    setFields({ ...initialFields })
  };

  const initialErrors = {
    name: false,
    password: false,
    jobTitle: false,

    officeNumber: false,
    officeHours: false,
    assignedDepartment: false,

    phoneNumber: false,
    address: false,
    dateOfBirth: false,
    major: false,
    minor: false,
  }

  const [errors, setErrors] = useState(initialErrors);

  const resetErrors = () => {
    setErrors({ ...initialErrors})
  };

  const [selectedOption, setSelectedOption] = useState("");
  const handleOption = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    resetFields();
    resetErrors();
    if (value === "student" || value === "gradstudent") {
      setFields( {...fields, jobTitle: value });
    }
  };

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
      password: fields.password,
      jobTitle: fields.jobTitle,
      permissions: fields.permissions,

      officeNumber: fields.officeNumber,
      officeHours: fields.officeHours,
      assignedDepartment: fields.assignedDepartment,

      phoneNumber: fields.phoneNumber,
      address: fields.address,
      dateOfBirth: fields.dateOfBirth,
      major: fields.major,
      minor: fields.minor,
    };

    /* Send formData, maybe PUT routing */
    try {
      const response = await fetch("http://127.0.0.1:3000/signup", {
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
      <Container maxWidth="sm" >
        <Card variant="outlined" color="error">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" align="center">
              Register User
            </Typography>
          </Box>

          <form className={classes.form} onSubmit={handleSubmit}>

          <Box className={classes.input}>
            <TextField
              select
              label="Select User Type"
              name="userType"
              value={selectedOption}
              onChange={handleOption}
              variant="outlined"
              style={{minWidth: 200 }}
              required
              >
              <MenuItem value="select"></MenuItem>        
              <MenuItem value="admin" divider>Admin</MenuItem>
              <MenuItem value="faculty" divider>Faculty</MenuItem>
              <MenuItem value="student" divider>Student</MenuItem>
              <MenuItem value="gradstudent" divider>Graduate Student</MenuItem>
            </TextField>
          </Box>
    
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
                label="Password"
                name="password"
                variant="outlined"
                value={fields.password}
                onChange={handleRequiredFields}
                required
                error={errors.password}
                helperText={errors.password ? "Password field is required" : ""}
              />
              </Box>
              <Box className={classes.input}>
              <TextField
                label="Job Title"
                name="jobTitle"
                variant="outlined"
                value={fields.jobTitle}
                onChange={handleRequiredFields}
                required
                error={errors.jobTitle}
                helperText={errors.jobTitle ? "Job title field is required" : ""}
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
                required={selectedOption !== "admin"}
                error={errors.phoneNumber}
                disabled={selectedOption === "admin"}
                helperText={errors.phoneNumber ? "11 digit phone number is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Office Number"
                name="officeNumber"
                variant="outlined"
                value={fields.officeNumber}
                onChange={handleRequiredFields}
                required={selectedOption === "faculty"}
                error={errors.officeNumber}
                disabled={ selectedOption !== "faculty" }
                helperText={errors.address ? "Address field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Office Hours"
                name="officeHours"
                variant="outlined"
                value={fields.officeNumber}
                onChange={handleRequiredFields}
                required={selectedOption === "faculty"}
                error={errors.officeNumber}
                disabled={ selectedOption !== "faculty" }
                helperText={errors.address ? "Address field is required" : ""}
              />
            </Box>
            
            <Box className={classes.input}>
              <TextField
              select
              label="Assigned Department"
              name="assignedDepartment"
              value={fields.assignedDepartment}
              //onChange={}
              variant="outlined"
              style={{minWidth: 200 }}
              required={selectedOption === "faculty"}
              disabled={ selectedOption !== "faculty" }
              error={errors.assignedDepartment}
              >
                {departments.map((department) => (
                  <MenuItem value={department}>{department}</MenuItem>
                ))}

            </TextField>
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                value={fields.address}
                onChange={handleRequiredFields}
                required={selectedOption !== "admin" && selectedOption !== "faculty"}
                error={errors.address}
                disabled={ ((selectedOption !== "student") && (selectedOption !== "gradstudent")) }
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
                required={selectedOption === "student"}
                error={errors.dateOfBirth}
                disabled={ ((selectedOption !== "student") && (selectedOption !== "gradstudent")) }
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
                required={selectedOption === "student" || selectedOption === "gradstudent"}
                error={errors.major}
                disabled={ ((selectedOption !== "student") && (selectedOption !== "gradstudent")) }
                helperText={errors.major ? "Field is required" : ""}
              />
            </Box>
            <Box className={classes.input}>
              <TextField
                label="Minor"
                name="minor"
                variant="outlined"
                disabled={ ((selectedOption !== "student") && (selectedOption !== "gradstudent")) }
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
