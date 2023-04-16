import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AcademicRecord() {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Home":
        return <Typography>Home Content</Typography>;
      case "Academics":
        return <Typography>Academics Content</Typography>;
      case "Student Records":
        return <Typography>Student Records Content</Typography>;
      case "Contact":
        return <Typography>Contact Content</Typography>;
      default:
        return null;
    }
  };

  const options = ["Home", "Academics", "Student Records", "Contact"];

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
            Academic Record
          </Typography>
        </Box>
        <Box display="flex">
          <Card>
            <CardContent>
              <List>
                {options.map((option, index) => (
                  <div key={index}>
                    <ListItem button onClick={() => setSelectedOption(option)}>
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

export default AcademicRecord;
