import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CourseGrades() {
  const [selectedOption, setSelectedOption] = useState(null);

  // Add more students if you want...
  const students = [
    { id: '001', name: 'Student 1' },
    { id: '002', name: 'Student 2' },
  ];

  const [grades, setGrades] = useState(Array(students.length).fill(''));

  // useEffect(() => {
  //   axios
  //     .get("/api/courses/123")
  //     .then((response) => setCourseDetails(response.data))
  //     .catch((error) => console.error(error));
  // }, []);


  const handleGradeChange = (event, index) => {
    const newGrades = [...grades];
    newGrades[index] = event.target.value;
    setGrades(newGrades);
  };

  const [notes, setNotes] = useState(Array(students.length).fill(''));

  const handleNoteChange = (event, index) => {
    const newNotes = [...notes];
    newNotes[index] = event.target.value;
    setNotes(newNotes);
  };

  const [generalNote, setGeneralNote] = useState('');

  const handleGeneralNoteChange = (event) => {
    setGeneralNote(event.target.value);
  };

  const renderOptionContent = () => {
    switch (selectedOption) {
      case 'Home':
        navigate('/');
        return null;
      case 'Course Grades':
        return (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <InputLabel id={`grade-label-${index}`}>Grade</InputLabel>
                          <Select
                            labelId={`grade-label-${index}`}
                            id={`grade-select-${index}`}
                            value={grades[index]}
                            onChange={(event) => handleGradeChange(event, index)}
                          >
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                            <MenuItem value="C">C</MenuItem>
                            <MenuItem value="D">D</MenuItem>
                            <MenuItem value="F">F</MenuItem>
                            <MenuItem value="CR">Credit</MenuItem>
                            <MenuItem value="NC">No Credit</MenuItem>
                            <MenuItem value="AU">Audit</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={notes[index]}
                          onChange={(event) => handleNoteChange(event, index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={4}>
                <Typography variant="h6">General Note:</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={generalNote} onChange={handleGeneralNoteChange}
                />
            </Box>
        </Box>
        );
            default:
                return null;
        }   
    };

    const options = ['Home', 'Course Grades'];
    
    const navigate = useNavigate();
    
    return (
    <div>
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="left"> Course Grades </Typography>
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
    
    export default CourseGrades;
      
