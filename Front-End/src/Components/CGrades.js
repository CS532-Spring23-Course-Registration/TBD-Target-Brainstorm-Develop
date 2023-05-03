import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import StudentGrades from "./StudentGrades";
import Cookies from "js-cookie";

function CourseGrades(props) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [data, setData] = useState(null);

  const userId = Cookies.get("user_id");
  const sessionId = Cookies.get("session_id");

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
    {
      name: "test4",
    },
    {
      name: "test5",
    },
    {
      name: "test6",
    }
  ];

  useEffect(() => {
      fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: "courseGradesList",
          facultyId: parseInt(userId),
          courseSemester: "Fall 2023",
          sessionId: sessionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
          if (data.courseList[0]) {
            setSelectedCourse(data.courseList[0]);
          }
        })
        .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography color="grey" variant="h5" align="left">
            Course Grades
          </Typography>
        </Box>
        <Box display="flex">
          <Box
            display="flex"
            height="250px"
            width="150px"
            sx={{
              overflowY: "scroll",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
              border: "1px solid lightgrey"
            }}
          >
            <Card variant="contained" sx={{ width: "100%", overflowY: "scroll" }}>
              <CardContent>
                <List>
                  {data && data.courseList.map((course, index) => (
                    <div key={index}>
                      <ListItem
                        button
                        onClick={() => setSelectedCourse(course)}
                        sx={{
                          border: selectedCourse?.courseTitle === course.courseTitle ? "1px solid red" : "inherit"
                        }}
                      >
                        <ListItemText primary={course.courseTitle} />
                      </ListItem>
                      {index !== testData.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
          <Box flexGrow={1} ml={4}>
            <StudentGrades course={selectedCourse}/>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default CourseGrades;
