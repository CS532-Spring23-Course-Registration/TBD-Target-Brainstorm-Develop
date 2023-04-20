import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

function CGrades() {
  const [courseDetails, setCourseDetails] = useState({
    courseID: "CS 101",
    department: "Computer Science",
    schedule: "123456",
    date: "Fall 2023",
    instructor: "John Smith",
    units: 3,
  });

  useEffect(() => {
    axios
      .get("/api/courses/123")
      .then((response) => setCourseDetails(response.data))
      .catch((error) => console.error(error));
  }, []);

  const studentList = courseDetails.students || [];

  return (
    <div>
      <h1>Course Details</h1>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Schedule Number</TableCell>
            <TableCell>Date/Time</TableCell>
            <TableCell>Instructor</TableCell>
            <TableCell>Units</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{courseDetails.courseID}</TableCell>
            <TableCell>{courseDetails.department}</TableCell>
            <TableCell>{courseDetails.schedule}</TableCell>
            <TableCell>{courseDetails.date}</TableCell>
            <TableCell>{courseDetails.instructor}</TableCell>
            <TableCell>{courseDetails.units}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default CGrades;
