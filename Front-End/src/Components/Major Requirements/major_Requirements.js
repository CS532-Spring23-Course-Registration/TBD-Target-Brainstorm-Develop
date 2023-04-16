import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MajorRequirements() {
  const [selectedOption, setSelectedOption] = useState(null);

  const renderOptionContent = () => {
    switch (selectedOption) {
      case 'Home':
        navigate('/');
        return null;
      case 'Major Required Courses':
        return <div>Major Required Courses </div>;
      case 'Completed Courses':
        return <div>Completed Courses</div>;
      case 'Student Status':
        return <div>Status content</div>;
      case 'Student History':
        return <div>History content</div>;
      default:
        return null;
    }
  };

  const options = [
    'Home',
    'Major Required Courses',
    'Completed Courses',
    'Student Status',
    'Student History',
  ];

  const navigate = useNavigate();

  return (
    <div>
      <AppBar position="static" color="error">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>Course Registration</Typography>
          {/* Add the Logout button here */}
        </Toolbar>
      </AppBar>
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

export default MajorRequirements;
