import { useState, useEffect } from 'react';
import { 
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Dialog,
    DialogContent,
    DialogTitle
} from "@mui/material";

function DisplaySearchedCourses(props) {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
    
    const handleClick = item => {
      setSelectedItem(item);
      setOpen(true);
    };
  
    const handleClose = () => {
      setSelectedItem(null);
      setOpen(false);
    };
  
    return (
      <Box display="flex" mt={2} justifyContent="center" sx={{ padding: "10px", width: "85%", boxShadow: "inset 0px 0px 5px 2px rgba(0, 0, 0, 0.25)", borderRadius: "10px" }}>
        <Box sx={{ margin: "15px", width:"100%", height: "600px", overflowY: 'scroll' }}>
          {props.returnedCourses.departments.map(item => (
            <Card key={item.id} sx={{ mb: 2, '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: "10px" }} onClick={() => handleClick(item)}>
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="body2">{item.name}</Typography>
              </CardContent>
            </Card>
          ))}
          {selectedItem && (
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogContent>
                <div>display outline here</div>
              </DialogContent>
            </Dialog>
          )}
        </Box>
      </Box>

    );
  }

  export default DisplaySearchedCourses;