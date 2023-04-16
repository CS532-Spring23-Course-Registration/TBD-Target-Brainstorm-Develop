import React, { useState } from "react";
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
