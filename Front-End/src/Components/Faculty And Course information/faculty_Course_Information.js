import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function FacultyCourseInfo() {
  //Faculty Data
  const facultyData = [
    {
      id: 'Id_Of_Faculty',
      name: 'Name_Of_Faculty',
      position: 'e.g. Professor',
      phone: '(619)000-0000',
      office: '101',
      officeHours: 'M/W 2-4pm',
      department: 'Computer Science',
      courses: ['CS101', 'CS102'],
    },
  ];

  //Course Data
  const courseData = [
    {
      courseId: 'CS 101',
      title: 'Intro to Computer Science',
      description: 'An introduction to computer science concepts.',
      prerequisites: ['MATH 110'],
      units: 3,
      faculty: ['Name_Of_Faculty'],
    },
  ];


  //Search input state for faculty and couurse
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const renderOptionContent = () => {
    const filteredFacultyData = facultyData.filter(
      (faculty) =>
        faculty.id.includes(searchInput) || faculty.name.includes(searchInput)
    );

    const filteredCourseData = courseData.filter(
      (course) =>
        course.courseId.includes(searchInput) ||
        course.title.includes(searchInput)
    );

    // Functionality for the Navigation 'Home', 'Faculty', and 'Courses'
    switch (selectedOption) {
      case 'Home':
        navigate('/');
        return null;
      case 'Faculty':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Office Hours</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Courses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFacultyData.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>{faculty.id}</TableCell>
                    <TableCell>{faculty.name}</TableCell>
                    <TableCell>{faculty.position}</TableCell>
                    <TableCell>{faculty.phone}</TableCell>
                    <TableCell>{faculty.office}</TableCell>
                    <TableCell>{faculty.officeHours}</TableCell>
                    <TableCell>{faculty.department}</TableCell>
                    <TableCell>{faculty.courses.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'Courses':
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Prerequisites</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Qualified Faculty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourseData.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.id}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>{course.prerequisites.join(', ')}</TableCell>
                    <TableCell>{course.units}</TableCell>
                    <TableCell>{course.faculty.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return null;
    }
  };

  const options = ['Home', 'Faculty', 'Courses'];

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login'); // Assuming the Login page is at the '/login' path
  };

  return (
    <div>
      <AppBar position="static" color="error">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            Faculty and Course Information
          </Typography>
          <Button
            variant="contained"
            style={{ backgroundColor: 'white', color: 'black' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
            Faculty and Course Information
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
            <TextField
              label="Search by ID or Name"
              variant="outlined"
              fullWidth
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <Box mt={2}>{renderOptionContent()}</Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default FacultyCourseInfo;




