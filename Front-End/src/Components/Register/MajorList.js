import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import CRegHome from "./CRegHome";
import Cookies from 'js-cookie'
import HelpButton from "./HelpButton";

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
        reportName: "courses",
        reportFilter: "currentlyEnrolled",
        studentId: parseInt(studentId),
        sessionId: sessionId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // setData(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>MajorList</div>
      <HelpButton selectedOption="Currently Enrolled Courses" />
    </div>
  );
}

export default MajorList;
