import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import CRegHome from "./CRegHome";

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

const studentId = "test1";
const sessionId = "test2";

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
        studentId: studentId,
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
    </div>
  );
}

export default MajorList;
