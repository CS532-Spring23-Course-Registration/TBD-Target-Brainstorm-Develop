import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import HelpButton from "./HelpButton";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuCard from "./MenuCard";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100px",
    height: "100%",
    marginLeft: "200px",
    boxSizing: "border-box",
  },
  contents: {
    padding: "10px",
  },
});

// contents for menu card
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

const studentId = Cookies.get("user_id");
const sessionId = Cookies.get("session_id");

function MajorList() {
  const classes = useStyles();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "personalCourseReport",
        courseSemester: "Winter 2023",
        studentId: parseInt(studentId),
        sessionId: sessionId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // setData(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  //Need to add a function here that loops through all returned elements,
  //and creates a new array that stores classes that the student is 'Enrolled' in
  //Then print out that array of classes in a card list

  return (
    <div className={classes.root}>
      <MenuCard content={content} />
      <div className={classes.contents}>MajorList</div>
      <HelpButton selectedOption="Currently Enrolled Courses" />
    </div>
  );
}

export default MajorList;
