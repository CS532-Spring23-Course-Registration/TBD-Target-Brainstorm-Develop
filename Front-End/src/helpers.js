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

export const renderOptionContent = (students, grades, notes, generalNote, handleGradeChange, handleNoteChange, handleGeneralNoteChange) => {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel id={`grade-label-${index}`}>Grade</InputLabel>
                    <Select
                      labelId={`grade-label-${index}`}
                      id={`grade-select-${index}`}
                      value={grades[index]}
                      onChange={(event) => handleGradeChange(event, index, grades, setGrades)}
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="B">B</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                      <MenuItem value="D">D</MenuItem>
                      <MenuItem value="F">F</MenuItem>
                      <MenuItem value="CR">Credit</MenuItem>
                      <MenuItem value="NC">No Credit</MenuItem>
                      <MenuItem value="AU">Audit</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={notes[index]}
                    onChange={(event) => handleNoteChange(event, index, notes, setNotes)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={4}>
        <Typography variant="h6">General Note:</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={generalNote}
          onChange={(event) => handleGeneralNoteChange(event, generalNote, setGeneralNote)}
        />
      </Box>
    </Box>
  );
};