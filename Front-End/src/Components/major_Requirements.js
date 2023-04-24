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
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function MajorRequirements() {
  const [selectedOption, setSelectedOption] = useState(null);
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
      case "Major Required Courses":
        return <div>Major Required Courses </div>;
      case "Completed Courses":
        return <div>Completed Courses</div>;
      case "Student Status":
        return <div>Status content</div>;
      case "Student History":
        return <div>History content</div>;
      default:
        return null;
    }
  };

  const options = [
    "Home",
    "Major Required Courses",
    "Completed Courses",
    "Student Status",
    "Student History",
  ];

  const navigate = useNavigate();

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
            Major Subsystem
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
