import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
  },
  table: {
    marginBottom: "20px",
  },
}));

const gpa = "3.65";

function AcademicRecord(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Academic Record
      </Typography>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Course ID</TableCell>
            <TableCell>Course Title</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.values.map((courses) =>
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.grade}</TableCell>
                <TableCell>{course.id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Typography textAlign={"center"} variant="h6">
        Current GPA: {gpa}
      </Typography>
    </Paper>
  );
}

export default AcademicRecord;
