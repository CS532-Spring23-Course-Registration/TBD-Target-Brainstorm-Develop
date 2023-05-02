import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

function DispaySearchedMajorList(props) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
    console.log(props);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOpen(false);
  };

  return (
    <Box mt={3} display="flex" flexDirection="column" alignItems="center">
      <Typography color="grey" variant="h5">
        Required Courses:
      </Typography>

      <Box
        display="flex"
        mt={1}
        justifyContent="center"
        sx={{
          padding: "10px",
          width: "100%",
          boxShadow: "inset 0px 0px 5px 2px rgba(0, 0, 0, 0.25)",
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            margin: "15px",
            width: "100%",
            height: "600px",
            overflowY: "scroll",
          }}
        >
          {props.returnedLists.majorList.map((item) =>
            item.requiredCourses.map((courseItem) => (
              <Card
                key={`${item.majorId}-${courseItem.courseId}`}
                sx={{
                  mb: 2,
                  "&:hover": { bgcolor: "#f5f5f5" },
                  borderRadius: "10px",
                  border: "1px solid lightgrey"
                }}
                onClick={() => handleClick(courseItem)}
              >
                <CardContent sx={{ mt: "5px" }}>
                  <Box display="flex" ml={3} flexDirection="row">
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      width="50%"
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {courseItem.courseTitle}
                        {":"} {courseItem.courseName}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      mr={3}
                      width="50%"
                      flexDirection="column"
                      alignItems="flex-end"
                      justifyContent="space-between"
                    ></Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
          {selectedItem && (
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <Box
                  width="400px"
                  height="500px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    border="1px solid grey"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="20%"
                  >
                    <Typography
                      align="center"
                      variant="h4"
                      sx={{ overflowY: "scroll" }}
                    >
                      {selectedItem.courseName}
                    </Typography>
                  </Box>
                  <Typography align="center" variant="subtitle1">
                    {selectedItem.courseTitle}
                  </Typography>

                  <Box
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    height="100%"
                    border="1px solid grey"
                    sx={{ overflowY: "scroll" }}
                  >
                    <Typography m={1} variant="body2">
                      {selectedItem.courseDescription}
                    </Typography>
                  </Box>
                  <Box mt={"10px"}>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="error"
                    >
                      Close
                    </Button>
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
              ></DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default DispaySearchedMajorList;
