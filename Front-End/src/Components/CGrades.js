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
  ];

  useEffect(() => {
    if (props.user.permission === "faculty") {
      fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: "courseGradesList",
          facultyId: parseInt(userId),
          sessionId: sessionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
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
            height="200px"
            width="150px"
            sx={{
              overflowY: "scroll",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Card variant="contained" height="100%" sx={{ width: "100%" }}>
              <CardContent>
                <List>
                  {testData.map((item, index) => (
                    <div key={index}>
                      <ListItem
                        button
                        onClick={() => setSelectedCourse(item.name)}
                      >
                        <ListItemText primary={item.name} />
                      </ListItem>
                      {index !== testData.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
          <Box flexGrow={1} ml={4}>
            <StudentGrades />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default CourseGrades;
