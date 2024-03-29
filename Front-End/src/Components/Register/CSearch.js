import React, { useState, useEffect } from "react";
import HelpButton from "./HelpButton";
import { makeStyles } from "@mui/styles";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Cookies from "js-cookie";
import DisplaySearchedCourses from "./DisplaySearchedCourses";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuCard from "./MenuCard";

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
    borderRadius: "5px",
    boxShadow: `0px 0px 5px 2px rgba(0, 0, 0, 0.25)`,
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

// Contents for menu card
const content = [
  {
    text: "Search Courses",
    to: "/search",
    icon: <SearchIcon />,
  },
  {
    text: "Currently Enrolled Courses",
    to: "/majorlist",
    icon: <LibraryBooksIcon />,
  },
];

function CSearch() {
  const classes = useStyles();

  //Parameters for the API call
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [reportFilter, setReportFilter] = useState();
  const [semesterQuery, setSemesterQuery] = useState("Fall");
  const [yearQuery, setYearQuery] = useState(2023);
  const [returnedCourses, setReturnedCourses] = useState(null);

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

  const handleSearch = async (event) => {
    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "courses",
        course: searchQuery,
        reportFilters: reportFilter,
        department: departmentQuery,
        studentId: parseInt(studentId),
        sessionId: sessionId,
        courseSemester: semesterQuery + " " + yearQuery,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setReturnedCourses(data);
    }
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
      <MenuCard content={content} />
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
          <Box display="flex" width="40%" flexDirection="row">
            <Box width="100%" display="flex" justifyContent="center">
              <FormControl sx={{ width: "75%" }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  label="Semester"
                  value={semesterQuery}
                  onChange={(event) => setSemesterQuery(event.target.value)}
                >
                  <MenuItem value={"Fall"}>Fall</MenuItem>
                  <MenuItem value={"Winter"}>Winter</MenuItem>
                  <MenuItem value={"Summer"}>Summer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              <FormControl sx={{ width: "75%" }}>
                <InputLabel>Year</InputLabel>
                <Select
                  label="Year"
                  value={yearQuery}
                  onChange={(event) => setYearQuery(event.target.value)}
                >
                  <MenuItem value={"2023"}>2023</MenuItem>
                  <MenuItem value={"2024"}>2024</MenuItem>
                </Select>
              </FormControl>
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
        {returnedCourses !== null && (
          <DisplaySearchedCourses returnedCourses={returnedCourses} />
        )}

        <HelpButton selectedOption="Search Courses" />
      </div>
    </div>
  );
}

export default CSearch;
