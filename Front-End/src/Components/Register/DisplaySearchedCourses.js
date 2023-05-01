import { useState, useEffect } from 'react';
import { 
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    Grid,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from "@mui/material";

function DisplaySearchedCourses(props) {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
    var courses = [];
    
    const handleClick = item => {
      setSelectedItem(item);
      setOpen(true);
    };
  
    const handleClose = () => {
      setSelectedItem(null);
      setOpen(false);
    };
  
    // useEffect(() => {
    //   props.returnedCourses.forEach((item) => {
    //     var newCourse = {
    //       department: item.name
    //     }

    //     item.coursesInDepartment.forEach((courseItem) => {
    //       newCourse[]
    //     });
    //   });



    // }, []);



    return (
      <Box display="flex" mt={2} justifyContent="center" sx={{ padding: "10px", width: "85%", boxShadow: "inset 0px 0px 5px 2px rgba(0, 0, 0, 0.25)", borderRadius: "10px" }}>
        <Box sx={{ margin: "15px", width:"100%", height: "600px", overflowY: 'scroll' }}>
          {props.returnedCourses.departments.map((item) => (
            item.coursesInDepartment.map (courseItem => 
              <Card key={item.id} sx={{ mb: 2, '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: "10px" }} onClick={() => handleClick(courseItem)}>
              <CardContent sx={{ mt: "5px" }}>
                <Box display="flex" ml={3} flexDirection="row">
                  <Box display="flex" flexDirection="column" justifyContent="space-between" width="50%">
                    <Typography variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{courseItem.name}</Typography>
                    <Typography variant="subtitle2" color="grey">{item.name}</Typography>
                  </Box>
                  <Box display="flex" mr={3} width="50%" flexDirection="column" alignItems="flex-end" justifyContent="space-between">
                    <Typography>{courseItem.courseDateTime}</Typography>
                    <Typography>{courseItem.courseLocation}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            )
          ))}
          {selectedItem && (
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <Box width="400px" height="500px" display="flex" flexDirection="column">
                  <Box display="flex" border="1px solid grey" flexDirection="column" justifyContent="center" alignItems="center" width="100%" height="20%">
                    <Typography align="center" variant="h4" sx={{ overflowY: "scroll"}}>{selectedItem.name}</Typography>
                  </Box>
                  <Typography align="center" variant="subtitle1">{selectedItem.title}</Typography>
                  <Box display="flex" flexDirection="row" width="100%" height="80%" mt={3}>
                    <Box display="flex" flexDirection="column" width="50%" height="100%">
                    <Box display="flex" width="100%" m={1}>
                      <Typography variant="body1" sx={{ textDecoration: 'underline' }}>Location:</Typography>
                      <Typography variant="body1" ml={1}>{selectedItem.courseLocation}</Typography>
                    </Box>
                    <Box display="flex" width="100%" m={1}>
                      <Typography variant="body1" sx={{ textDecoration: 'underline' }}>Time: </Typography>
                      <Typography variant="body1" ml={1}>{selectedItem.courseDateTime}</Typography>
                    </Box>
                    <Box display="flex" width="100%" m={1}>
                      <Typography variant="body1" sx={{ textDecoration: 'underline' }}>Prof: </Typography>
                      <Typography variant="body1" ml={1}>{selectedItem.instructorName}</Typography>
                    </Box>
                    <Box display="flex" width="100%" m={1}>
                      <Typography variant="body1" sx={{ textDecoration: 'underline' }}>Seats: </Typography>
                      <Typography variant="body1" ml={1}>{selectedItem.seatsAvailable} / {selectedItem.maxSeats}</Typography>
                    </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" width="50%" height="100%" border="1px solid grey" sx={{ overflowY: "scroll" }}>
                      <Typography m={1} variant="body2">{selectedItem.description}</Typography>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{display: "flex", flexDirection: "row", justifyContent: "space-around", mb: "15px"}}>
                <Button variant="contained" color="error">Add Class</Button>
                <Button onClick={handleClose} variant="outline">Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    );
  }

  export default DisplaySearchedCourses;