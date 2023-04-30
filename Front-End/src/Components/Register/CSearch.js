import React, { useState, useEffect } from "react";
import CRegHome from "./CRegHome";
import { makeStyles } from "@mui/styles";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "90%-200px",
    height: "100%",
    marginLeft: "200px",
    boxSizing: "border-box",
  },
  contents: {
    display: "flex",
    padding: "10px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    width: "75%",
    border: "1px solid",
    borderRadius: "5px",
    boxShadow: `1px 1px 1px`,
  },
  input: {
    margin: "10px",
    width: "77%",
  },
  department_input: {
    margin: "10px",
    width: "50%",
  },
  button: {
    margin: "30px",
  },
  courseList: {
    display: "block",
    margin: "0 auto",
    maxWidth: "1200px",
  },
  courseItem: {
    position: "relative",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
    },
    marginBottom: "24px", // add spacing between course items
  },
}));

function CSearch() {
  const classes = useStyles();

  //Parameters for the API call
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [reportFilter, setReportFilter] = useState();

  const [click, setClick] = useState(false);
  const [data, setData] = useState(null);

  const sessionId = Cookies.get("session_id");
  const studentId = Cookies.get("user_id");

  // const [searchResults, setSearchResults] = useState([]);
  const Courses = [
    { name: "Course A", description: "This is course A" },
    { name: "Course B", description: "This is course B" },
    { name: "Course C", description: "This is course C" },
  ];

  const handleCheckBox = () => {
    var temp = checkBoxValue;
    setCheckBoxValue(!temp);
  };

  const handleSearch = (event) => {
    fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "courses",
        course: searchQuery,
        reportFilters: reportFilter,
        department: departmentQuery,
        studentId: studentId,
        sessionId: sessionId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (searchQuery === "" && departmentQuery === "" && !checkBoxValue) {
      setReportFilter("allClassesAllDepartments");
    } else if (searchQuery === "" && departmentQuery === "" && checkBoxValue) {
      setReportFilter("openClassesAllDepartments");
    } else if (searchQuery === "" && departmentQuery !== "" && !checkBoxValue) {
      setReportFilter("allClassesByDepartment");
    } else if (searchQuery === "" && departmentQuery !== "" && checkBoxValue) {
      setReportFilter("openClassesByDepartment");
    } else {
      setReportFilter("");
    }
  }, [searchQuery, departmentQuery, checkBoxValue]);

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>
        <form className={classes.form}>
          <TextField
            className={classes.input}
            label="Class"
            variant="outlined"
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Box display="flex" alignItems="center" justifyContent="center">
            <TextField
              className={classes.department_input}
              label="Department"
              variant="outlined"
              margin="normal"
              value={departmentQuery}
              onChange={(e) => setDepartmentQuery(e.target.value)}
            />
            <Box display="flex" alignItems="center" marginLeft="10px">
              <input type="checkbox" onClick={() => handleCheckBox()} />
              <label>Show Open Classes</label>
            </Box>
          </Box>

          <Button
            className={classes.button}
            variant="contained"
            color="error"
            onClick={() => handleSearch()}
          >
            Search
          </Button>
        </form>
        {/* {data !== null && ( */}
        {click === !true && (
          <List className={classes.courseList}>
            {Courses.map((result, i) => (
              <ListItem
                key={i}
                className={classes.courseItem}
                component={Link}
                to={`/cinfo/${result.id}`}
              >
                <ListItemText
                  primary={result.name}
                  secondary={result.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

export default CSearch;
