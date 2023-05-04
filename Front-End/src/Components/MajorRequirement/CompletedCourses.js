import { useState } from "react";
import { Typography, Card, CardContent, Box, Grid } from "@mui/material";

function CompletedCourses(props) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (item) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const testData = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      instructor: "John Smith",
      credits: 3,
      grade: "A",
      year: 2021,
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      instructor: "Jane Doe",
      credits: 3,
      grade: "B+",
      year: 2022,
    },
    {
      id: 3,
      title: "Database Systems",
      instructor: "Bob Johnson",
      credits: 3,
      grade: "A-",
      year: 2022,
    },
  ];

  return (
    <Box sx={{ maxHeight: "600px", overflowY: "scroll" }}>
      {testData.map((item) => (
        <Card
          key={item.id}
          sx={{
            mb: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
            border: "1px solid lightgrey",
          }}
          onClick={() => handleClick(item)}
        >
          <CardContent>
            <Typography variant="h5">{item.title}</Typography>
            <Typography variant="body2">
              Instructor: {item.instructor}
            </Typography>
            <Typography variant="body2">Credits: {item.credits}</Typography>
            <Typography variant="body2">Grade: {item.grade}</Typography>
            <Typography variant="body2">Year: {item.year}</Typography>
          </CardContent>
        </Card>
      ))}
      {selectedItem && (
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                mb: 2,
                border: "1px solid lightgrey",
              }}
              onClick={() => handleClose()}
            >
              <CardContent>
                <Typography variant="h5">{selectedItem.title}</Typography>
                <Typography variant="body2">
                  Instructor: {selectedItem.instructor}
                </Typography>
                <Typography variant="body2">
                  Credits: {selectedItem.credits}
                </Typography>
                <Typography variant="body2">
                  Grade: {selectedItem.grade}
                </Typography>
                <Typography variant="body2">
                  Year: {selectedItem.year}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default CompletedCourses;
