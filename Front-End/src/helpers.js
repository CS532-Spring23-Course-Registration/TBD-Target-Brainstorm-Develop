import React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useState } from 'react';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, 
  TableBody, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';


// PDFButton.js
const useStyles = makeStyles(() => ({
    button: {
      margin: "10px",
    },
  }));
  
  export const PrintPDFButton = () => {
    const classes = useStyles();
  
    const handlePrintPDF = () => {
      window.print();
    };
  
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrintPDF}
          className={classes.button}
        >
          Print PDF
        </Button>
      </>
    );
  };


// App.js
export const updateAuthentication = (newStatus, setIsAuthenticated) => {
setIsAuthenticated(newStatus);
};

export const updatePrintState = (newStatus, setPrintable) => {
  setPrintable(newStatus);
};

// AdminPanel.js
export const handleSubmit = async (menuSelect) => {
  const sessionId = Cookies.get("session_id");

  try {
    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "users",
        granularity: menuSelect,
        sessionId: sessionId,
      }),
    });

    if (response.status === 401) {
      // handle unauthorized error
    } else if (response.status === 200) {
      const users = await response.json();
      return users;
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleMenuChange = (event, setMenuSelect) => {
  setMenuSelect(event.target.value);
};

// CGrades.js
export const handleGradeChange = (event, index, grades, setGrades) => {
  const newGrades = [...grades];
  newGrades[index] = event.target.value;
  setGrades(newGrades);
};

export const handleNoteChange = (event, index, notes, setNotes) => {
  const newNotes = [...notes];
  newNotes[index] = event.target.value;
  setNotes(newNotes);
};

export const handleGeneralNoteChange = (event, generalNote, setGeneralNote) => {
  setGeneralNote(event.target.value);
};

// FacultyAndCourses.js
export const updateSelectedItem = (item, selectedItem, setReportType, setReportParameter) => {
  if (selectedItem !== item) {
    setReportType("courseInfo");
    setReportParameter("course");
  } else {
    setReportType("facultyInfo");
    setReportParameter("faculty");
  }
  return item;
};

export const makeApiCall = async (reportType, reportFilters, reportParameter, searchQuery, departmentQuery, sessionId) => {
  try {
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
    const data = await response.json();
    return data.data; // only return the data property from the response object
  } catch (error) {
    console.log(error);
    return null;
  }
};

//Navigation.js
export const getModifiedOptions = (permission) => {
  const options = [
    { title: "Profile", path: "/profile" },
    { title: "Course Register", path: "/search" },
    { title: "Major Requirements", path: "/Major-Requirements" },
    { title: "Faculty And Course Information", path: "/faculty-and-course-info" }
  ];

  if (permission === "faculty" || permission === "admin") {
    options.push({ title: "Course Grades", path: "/grades" });
  }

  return options;
}