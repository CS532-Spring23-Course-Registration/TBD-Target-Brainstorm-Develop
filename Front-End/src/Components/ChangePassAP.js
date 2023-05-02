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

function ChangePassAP(props) {
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
  );
}

export default ChangePassAP;
