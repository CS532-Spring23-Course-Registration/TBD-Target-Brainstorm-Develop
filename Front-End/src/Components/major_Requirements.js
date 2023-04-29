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
import Cookies from 'js-cookie';

function MajorRequirements() {
  const [selectedOption, setSelectedOption] = useState("Courses by Major");
  const [data, setData] = useState(null);

  var sessionId = Cookies.get('session_id');
  sessionId = "test";


  useEffect(() => {
      fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: "student_major_outline",
          studentId: 1, 
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

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Home":
        navigate("/");
        return null;
      case "Courses by Major":
        return (
          <div>
            <Container maxWidth="lg">
              <Box>
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2, width: "75%" }}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        size="small"
                        placeholder="Search Majors"
                        InputLabelProps={{ shrink: true }}
                        sx={{width: "85%"}}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ mt: 2, width: "25%" }}
                      >
                        Search
                      </Button>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ width: "75%", height: "45%", mt: 2, mb: 1 }}
                        onClick={() => {} /* handleDisplayCourses() */}
                      >
                        Display Your Courses
                      </Button>
                      <Box sx={{
                        typography: "subtitle2"
                      }}>
                        [User's Major]
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          </div>
        );
      case "Completed Courses":
        return <div>Completed Courses</div>;
      case "Course Outline History":
        return ;
      default:
        return null;
    }
  };

  const options = [
    "Courses by Major",
    "Completed Courses",
    "Course Outline History"
  ];

  const navigate = useNavigate();

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ml: 1, mt: 3, mb: 3 }}>
          <Typography color="grey" variant="h5" align="left">
            Major Requirements
          </Typography>
        </Box>
        <Box display="flex">
          <Card>
            <CardContent>
              <List>
                {options.map((option, index) => (
                  <div key={index}>
                    <ListItem onClick={() => setSelectedOption(option)}>
                      <ListItemText primary={option} />
                    </ListItem>
                    {index !== options.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
          <Box flexGrow={1} ml={4}>
            {renderOptionContent()}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default MajorRequirements;
