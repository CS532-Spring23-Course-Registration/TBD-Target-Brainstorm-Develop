import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import HelpButton from "./HelpButton";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuCard from "./MenuCard";
import DisplayCurrentlyEnrolled from "./DisplayCurrentlyEnrolled";
import {
  Box
} from "@mui/material";

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


function MajorList() {
  const classes = useStyles();
  const [returnedCourses, setReturnedCourses] = useState(null);
  const [dropFlag, setDropFlag] = useState(null);

  const studentId = Cookies.get("user_id");
  const sessionId = Cookies.get("session_id");

  const handleDrop = () => {
    setDropFlag(!dropFlag);
  }

  useEffect(() => {

    console.log("Currently Enrolled Call");

    fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "personalCourseReport",
        courseSemester: "Fall 2023",
        studentId: parseInt(studentId),
        sessionId: sessionId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReturnedCourses(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, [dropFlag]);

  //Need to add a function here that loops through all returned elements,
  //and creates a new array that stores classes that the student is 'Enrolled' in
  //Then print out that array of classes in a card list

  return (
    <Box display="flex" flexDirection="row" width="100%">
      <Box width="20%" height="300px" display="flex">
        <MenuCard content={content} />
      </Box>
      <Box width="80%" display="flex" justifyContent="center">
        {returnedCourses ? (
          <DisplayCurrentlyEnrolled returnedCourses={returnedCourses} onDrop={handleDrop}/>
        ) : null }
      </Box>
      <HelpButton selectedOption="Currently Enrolled Courses" />
    </Box>
  );
}

export default MajorList;
