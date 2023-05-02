import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
} from "@mui/material";

function HelpButton({ selectedOption }) {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleHelpClick = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
  };

  const renderHelpContent = () => {
    switch (selectedOption) {
      // These two are for the Course Register  ---ADD more if you like---
      case "Search Courses":
        return "This tab displays two search bars one for classes/courses and the other is department(e.g. Computer Science). You ennter what you desire to search and then click on search.";
      case "Currently Enrolled Courses":
        return "This tab shows the courses the student is currently enrolled in. When you register and add a course then you will be able to see the enrolled courses that you are in.";
      //-----------------------------------------------
      // These two below are for the Major Requirements  ---ADD more if you like---
      case "Courses by Major":
        return "This tab will allow you to search for majors that you desire and it will display the courses assoicated with the major you searched after you press on 'Search' Button.";
      case "Student Outlines":
        return "Student Outlines";
      //-----------------------------------------------
      // These two below are for the Faculty And Course Information ---ADD more if you like---
      case "Courses":
        return "Courses: In this tab you will be able search for faculty(e.g. instructors) and Courses based on the Course you enter in the search bar or search by 'Department.'";
      case "Faculty":
        return "Faculty: In this tab you will be able to search based on faculty(e.g. instructors) name or 'Department.' Then after you press 'SUBMIT' it wil display the courses that faculty teach.";
      //-----------------------------------------------
      default:
        return "";
    }
  };


  return (
    <>
      <Box
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
        }}
      >
        <Button variant="contained" color="error" onClick={handleHelpClick}>
          Help
        </Button>
      </Box>
      <Dialog
        open={helpDialogOpen}
        onClose={handleHelpClose}
        aria-labelledby="help-dialog-title"
        aria-describedby="help-dialog-description"
      >
        <DialogTitle id="help-dialog-title">{"Help"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="help-dialog-description">
            {renderHelpContent()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HelpButton;
