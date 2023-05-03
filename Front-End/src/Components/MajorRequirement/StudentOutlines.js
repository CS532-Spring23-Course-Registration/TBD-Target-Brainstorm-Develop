import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function StudentOutlines(props) {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   fetch('https://api.example.com/data')
  //     .then(response => response.json())
  //     .then(data => setData(data));
  // }, []);

  const handleClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOpen(false);
  };

  console.log(props.userData);

  return (
    <Box sx={{ maxHeight: "400px", overflowY: "scroll" }}>
      {props.userData && props.userData.studentList.map((item) => (
        <Card
          key={item.departmentId}
          sx={{ mb: 2, "&:hover": { bgcolor: "#f5f5f5" }, border: "1px solid lightgrey" }}
          onClick={() => handleClick(item)}
        >
          <CardContent>
            <Typography variant="h5">{item.studentName} (ID: {item.studentId})</Typography>
            <Typography variant="body2">Major: {item.majorTitle}</Typography>
          </CardContent>
        </Card>
      ))}
      {selectedItem && (
        <Dialog open={open} onClose={handleClose} maxWidth="xl">
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Student Name: {selectedItem.studentName}
          </DialogTitle>
          <DialogContent sx={{ width: 600, height: 600, overflowY: "scroll" }}>
            <div>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
                color={"Gray"}
              >
                Required Units:{" "}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
                color={"Gray"}
                mt={3}
              >
                Completed Courses:{" "}
                {selectedItem.studentOutline.majorCompletedUnits}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
                color={"red"}
                mt={5}
              >
                Required Courses:{" "}
              </Typography>
              <br />
              {selectedItem.studentOutline.requiredCourses.map((course) => (
                <Box
                  key={course.courseId}
                  sx={{
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    padding: "16px",
                    margin: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Course Title: {course.courseTitle}
                  </Typography>
                  <br />

                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Course Name: {course.courseName}
                  </Typography>
                  <br />

                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Prerequisites: {course.coursePrerequisites.join(", ")}
                  </Typography>
                  <br />

                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Course ID: {course.courseId}
                  </Typography>
                  <br />

                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Status: {course.status}
                  </Typography>
                  <br />

                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Change Date:{" "}
                    {new Date(course.changeDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
              <Typography
                mt={5}
                sx={{ fontWeight: "bold" }}
                variant="h5"
                color={"blue"}
              >
                Elective Courses:
              </Typography>
              {/* {selectedItem.electiveCourses.map((course) => (
                <div key={course.courseId}>
                  <Typography variant="body1">{course.courseName}</Typography>
                  <Typography variant="body2">
                    Status: {course.status}
                  </Typography>
                  <Typography variant="body2">Major: {course.major}</Typography>
                  <Typography variant="body2">
                    Department: {course.department}
                  </Typography>
                  <Typography variant="body2">
                    Course Completed: {course.courseCompleted.toString()}
                  </Typography>
                  <Typography variant="body2">
                    Prerequisites: {course.coursePrerequisites.join(", ")}
                  </Typography>
                </div>
              ))} */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default StudentOutlines;
