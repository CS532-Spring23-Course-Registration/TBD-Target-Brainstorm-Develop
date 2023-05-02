import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import CourseOutlineHistory from "./CourseOutlineHistory";
import CompletedCourses from "./CompletedCourses";
import StudentOutlines from "./StudentOutlines";
import DispaySearchedMajorList from "./DispaySearchedMajorList";
import HelpButton from "../Register/HelpButton";

function MajorRequirements(props) {
  const [selectedOption, setSelectedOption] = useState("Courses by Major");
  const [majorQuery, setMajorQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [outlineData, setOutlineData] = useState(null);
  const [displayStudentOutline, setDisplayStudentOutline] = useState(false);
  const [returnedLists, setReturnedLists] = useState(null);

  const userId = Cookies.get("user_id");
  const sessionId = Cookies.get("session_id");

  var isStudent = false;
  if (props.user.permission === "student") {
    isStudent = true;
  }

  const testData = [
    {
      name: "test1",
    },
    {
      name: "test2",
    },
    {
      name: "test3",
    },
  ];

  //Preloads the information of the user on this page.
  //If a student, gets information regarding their outline
  //If a faculty, gets information of their students
  useEffect(() => {
    var reportName = "";
    if (props.user.permission === "student") {
      reportName = "studentMajorOutline";
    } else {
      reportName = "advisorStudentOutlines";
    }

    fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: reportName,
        userId: parseInt(userId),
        sessionId: sessionId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUserData(data);
      })
      .catch((error) => console.log(error));
  }, []);

  //Handle the submit of the course outline general search button
  const handleSubmit = async (event) => {
    if (!majorQuery) {
      alert("Please enter a major to search for.");
      return;
    }
    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportName: "coursesByMajor",
        major: majorQuery,
        sessionId: sessionId,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setReturnedLists(data);
    } else {
      alert(
        "There was an error with your search. Please try again with a valid major."
      );
    }
  };

  const handleOption = (option) => {
    setSelectedOption(option);
    setReturnedLists(null);
  };

  //If you are a student, your course outline will be fetched when you click on this page
  //Instead of making another API call to get your information, this boolean should
  //simply decide whether your courses get displayed or not
  const handleDisplayStudentOutline = () => {
    setDisplayStudentOutline(true);
  };

  //Different pages on right side for which button you select
  //Pages should probably be transfered into their own components
  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Courses by Major":
        //This whole block of HTML should be moved into its own component
        return (
          <div>
            <Container maxWidth="lg">
              <Box>
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mr: 2,
                        width: isStudent ? "75%" : "100%",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        margin="normal"
                        size="small"
                        placeholder="Search Majors"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setMajorQuery(e.target.value)}
                        sx={{ width: "85%" }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ mt: 2, width: "25%" }}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Search
                      </Button>
                    </Box>
                    {isStudent ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ width: "75%", height: "45%", mt: 2, mb: 1 }}
                          onClick={() => {
                            handleDisplayStudentOutline();
                          }}
                        >
                          Display Your Courses
                        </Button>
                        <Box
                          sx={{
                            typography: "subtitle2",
                          }}
                        >
                          [User's Major]
                        </Box>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              </Box>
            </Container>
            {returnedLists !== null && (
              <DispaySearchedMajorList returnedLists={returnedLists} />
            )}
          </div>
        );
      case "Completed Courses":
        return <CompletedCourses data={testData} />;
      case "Course Outline History":
        return <CourseOutlineHistory data={testData} />;
      case "Student Outlines":
        return <StudentOutlines data={testData} />;
      default:
        return null;
    }
  };

  var options;

  if (props.user.permission === "student") {
    options = [
      "Courses by Major",
      "Completed Courses",
      "Course Outline History",
    ];
  } else {
    options = ["Courses by Major", "Student Outlines"];
  }

  return (
    <div>
      <Container maxWidth="lg" m={0}>
        <Box sx={{ ml: 1, mt: 3, mb: 3 }}>
          <Typography color="grey" variant="h5" align="left">
            Major Requirements
          </Typography>
        </Box>
        <Box display="flex">
          <Box width={"200px"} height={"150px"} mr={5}>
            <Card>
              <CardContent>
                <List>
                  {options.map((option, index) => (
                    <div key={index}>
                      <ListItem onClick={() => handleOption(option)}>
                        <ListItemText primary={option} />
                      </ListItem>
                      {index !== options.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box flexGrow={1}>{renderOptionContent()}</Box>
        </Box>
      </Container>
      <HelpButton selectedOption={selectedOption} />
    </div>
  );
}

export default MajorRequirements;
