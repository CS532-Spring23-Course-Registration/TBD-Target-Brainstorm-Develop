
import { useState, useEffect } from 'react';
import { 
    Typography,
    TableContainer,
    TableCell,
    TableHead,
    TableBody,
    Table,
    TableRow,
    DialogActions,
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
import Cookies from 'js-cookie';




function StudentGrades(props) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentGrade, setSelectedStudentGrade] = useState(null);
    const [selectedStudentNote, setSelectedStudentNote] = useState(null);
    const [open, setOpen] = useState(false);

    const sessionId = Cookies.get("session_id");

    const handleUpdateStudent = (student) => {
      console.log(student);
      console.log(selectedStudentGrade);
      console.log(selectedStudentNote);

      fetch("http://127.0.0.1:5000/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updateType: "changeGrade",
          studentId: parseInt(student.studentId),
          courseSemesterId: 123,
          sessionId: sessionId,
          newGrade: selectedStudentGrade,
          newNote: selectedStudentNote
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));

        setOpen(false);
    }

    const handleGradeChange = (event) => {
      setSelectedStudentGrade(event.target.value);
    };
    
    const handleNoteChange = (event) => {
      setSelectedStudentNote(event.target.value)
    };

    const handleClick = (student) => {
      setSelectedStudent(student);
      setSelectedStudentGrade(student.courseGrade);
      setOpen(true);
    }

    const handleClose = () => {
      setSelectedStudent(null);
      setSelectedStudentGrade(null);
      setSelectedStudentNote(null);
      setOpen(false);
    }
  
    return (
        <Box>
          {props.course && props.course.studentList && props.course.studentList.length > 1 ? (
            <TableContainer component={Paper} sx={{border: "1px solid lightgrey", height: "40rem"}}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e74c3c"}}>
                  <TableCell sx={{ color: "white", fontWeight: "bold"}}>Student ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold"}}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold"}}>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.course && props.course.studentList && props.course.studentList.map((student, index) => (
                  <TableRow key={student.studentId}
                    sx={{"&:hover": { bgcolor: "#f5f5f5"}}}
                    onClick={() => handleClick(student)}
                    >
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>
                      {student.courseGrade}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          ): (
            <Typography>No Students Enrolled Yet</Typography>
          )}
          {selectedStudent && (
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <Box
                width="500px"
                height="300px"
                display="flex"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="20%"
                >
                  <Typography
                    align="center"
                    variant="h6"
                    sx={{ overflowY: "scroll" }}
                  >
                    {selectedStudent.studentName}
                  </Typography>
                  <Typography align="center" variant="subtitle1">
                  ID: {selectedStudent.studentId}
                </Typography>
                </Box>
                <Box height="100%" mt={4} display="flex" justifyContent="center" flexDirection="column">
                    <Box display="flex" height="20%" width="100%" justifyContent="space-evenly" alignItems="center">
                      <Typography>New Grade: </Typography>
                      <Select
                          value={selectedStudentGrade}
                          onChange={(event) => handleGradeChange(event)}
                          sx={{ width: "25%"}}
                        >
                          <MenuItem value="A">A</MenuItem>
                          <MenuItem value="B">B</MenuItem>
                          <MenuItem value="C">C</MenuItem>
                          <MenuItem value="D">D</MenuItem>
                          <MenuItem value="F">F</MenuItem>
                          <MenuItem value="IP">IP</MenuItem>
                      </Select>
                    </Box>
                    <Box height="80%" mt={5} alignItems="center" justifyContent="center">
                      <Typography align="center" mb={1}>Student Note:</Typography>
                      <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={selectedStudentNote}
                          onChange={(event) => handleNoteChange(event)}
                        />
                    </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                mb: "15px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => handleUpdateStudent(selectedStudent)}
              >
                Update Student
              </Button>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
      );
  }

  export default StudentGrades;