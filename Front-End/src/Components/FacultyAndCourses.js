import React, { useState, useEffect } from "react";
import HelpButton from "./Register/HelpButton";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Box,
  Card,
  Divider,
  CardContent,
} from "@mui/material";
import Cookies from "js-cookie";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "10px",
    boxSizing: "border-box",
    width: "80%",
  },
  contents: {
    display: "flex",
    padding: "10px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  optionsContainer: {
    backgroundColor: "#fff",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    width: "200px",
    padding: "20px",
  },
  searchContainer: {
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  searchField: {
    marginTop: "20px",
    width: "100%",
  },
  departmentField: {
    marginTop: "20px",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    width: "100px",
    marginTop: "20px",
  },
}));

const FacultyAndCourses = () => {
  const sessionId = Cookies.get("session_id");

  const [selectedItem, setSelectedItem] = useState("Courses");
  const selectedOption = selectedItem; // added this for the HelpButton Component

  //States for the search boxes
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentQuery, setDepartmentQuery] = useState("");

  //Params for requests
  const [reportType, setReportType] = useState("courseInfo");
  const [reportParameter, setReportParameter] = useState("course");
  const [reportFilters, setReportFilters] = useState(
    "allFacultyAllDepartments"
  );

  //Updates the state when user clicks an option from the side menu
  const handleListItemClick = (item) => {
    setSelectedItem(item);
    if (selectedItem !== "Courses") {
      setReportType("courseInfo");
      setReportParameter("course");
    } else {
      setReportType("facultyInfo");
      setReportParameter("faculty");
    }
  };

  //Updates the state for the main search bar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  //Updates the state for the department search bar
  const handleDepartmentSearchChange = async (event) => {
    setDepartmentQuery(event.target.value);
  };

  //Function for making API call when the submit button is pressed
  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: reportType,
        reportFilters: reportFilters,
        [reportParameter]: searchQuery,
        department: departmentQuery,
        sessionId: sessionId,
      }),
    });

    if (response.status === 401) {
      console.log("Authentication Failed.");
    } else if (response.status === 200) {
      console.log("Successful query.");
      const data = await response.json();
    }
  };

  //Every time a state changes, this checks if the report filter should be changed based
  //off what the user has entered in their search boxes.
  useEffect(() => {
    if (
      searchQuery === "" &&
      departmentQuery === "" &&
      reportType === "facultyInfo"
    ) {
      setReportFilters("allFacultyAllDepartments");
    } else if (
      searchQuery === "" &&
      departmentQuery === "" &&
      reportType === "courseInfo"
    ) {
      setReportFilters("allCoursesAllDepartments");
    } else if (
      searchQuery === "" &&
      departmentQuery.length > 0 &&
      reportType === "courseInfo"
    ) {
      setReportFilters("allCoursesByDepartment");
    } else if (
      searchQuery === "" &&
      departmentQuery.length > 0 &&
      reportType === "facultyInfo"
    ) {
      setReportFilters("allFacultyByDepartment");
    } else {
      setReportFilters("");
    }
  }, [searchQuery, departmentQuery, reportType]);

  const options = ["Courses", "Faculty"];

  const classes = useStyles();

  return (
    <div>
      <Box sx={{ ml: 3, mt: 3, mb: 1 }}>
        <Typography color="grey" variant="h5" align="left">
          Faculty & Course Info
        </Typography>
      </Box>
      <Box className={classes.root}>
        <Card sx={{ width: "200px", height: "200px", marginRight: "100px" }}>
          <CardContent>
            <List>
              {options.map((option, index) => (
                <div key={index}>
                  <ListItem onClick={() => handleListItemClick(option)}>
                    <ListItemText primary={option} />
                  </ListItem>
                  {index !== options.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
        <div className={classes.contents}>
          <Box className={classes.searchContainer}>
            <Box className={classes.searchContainer}>
              <TextField
                id="search-bar"
                label={`Search ${selectedItem}`}
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                className={classes.searchField}
              />
            </Box>
            <Box>
              <TextField
                id="department-search-bar"
                label="Department"
                variant="outlined"
                fullWidth
                value={departmentQuery}
                onChange={handleDepartmentSearchChange}
                className={classes.departmentField}
              />
            </Box>
            <Box className={classes.submitButton}>
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                variant="contained"
                className={classes.submitButton}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </div>
      </Box>
      <HelpButton selectedOption={selectedOption} />
    </div>
  );
};

export default FacultyAndCourses;
