
import { useState, useEffect } from 'react';
import { 
    Typography,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    Table,
    TableRow,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    TextField,
    Paper,
    Button,
    Card,
    CardContent,
    Box,
    Grid,
    Dialog,
    DialogContent,
    DialogTitle
} from "@mui/material";




function StudentGrades(props) {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
  
    // useEffect(() => {
    //   fetch('https://api.example.com/data')
    //     .then(response => response.json())
    //     .then(data => setData(data));
    // }, []);

      // Add more students if you want...
    const students = [
        { id: '001', name: 'Student 1' },
        { id: '002', name: 'Student 2' },
    ];

    const [grades, setGrades] = useState(Array(students.length).fill(''));

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
                  <TableCell></TableCell>
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
                    <TableCell>
                      <Button color="error" variant="contained">
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box>
            <Box mt={4}>
              <Typography variant="h6">General Note:</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={generalNote} onChange={handleGeneralNoteChange}
                />
            </Box>
            <Box mt={3} display="flex" flexDirection="column" alignItems="center">
              <Button color="error" variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
      </Box>
      );
  }

  export default StudentGrades;