import React, { useState } from "react";
import CRegHome from "./CRegHome";
import { makeStyles } from "@mui/styles";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

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
    justifyContent: "center",
    padding: "20px",
    width: "80%",
    border: "1px solid",
    borderRadius: "5px",
    boxShadow: `3px 3px 3px`,
  },
  input: {
    margin: "10px",
  },
  button: {
    marginTop: "20px",
  },
  courseList: {
    display: "block",
    margin: "0 auto",
    maxWidth: "1200px",
    width: "80%",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const Courses = [
    { name: "Course A", description: "This is course A" },
    { name: "Course B", description: "This is course B" },
    { name: "Course C", description: "This is course C" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/courses/personal_course_report?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.courses);
        console.log(data);
      });
  };

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>
        <form className={classes.form} onSubmit={handleSearch}>
          <TextField
            className={classes.input}
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="error"
            type="submit"
          >
            Search
          </Button>
        </form>
        {Courses.length > 0 && (
          <List className={classes.courseList}>
            {Courses.map((result, i) => (
              <ListItem
                key={i}
                className={classes.courseItem}
                component={Link}
                to="/cinfo/${result.id}"
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
