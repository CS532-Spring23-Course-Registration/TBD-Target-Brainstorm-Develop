
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

function CourseOutlineHistory(props) {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
  
    useEffect(() => {
      fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => setData(data));
    }, []);
  
    const handleClick = item => {
      setSelectedItem(item);
      setOpen(true);
    };
    const handleClose = () => {
      setSelectedItem(null);
      setOpen(false);
    };
  
    return (
      <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {props.data.map(item => (
          <Card key={item.id} sx={{ mb: 2, '&:hover': { bgcolor: '#f5f5f5' } }} onClick={() => handleClick(item)}>
            <CardContent>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="body2">{item.name}</Typography>
            </CardContent>
          </Card>
        ))}
        {selectedItem && (
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedItem.title}</DialogTitle>
            <DialogContent>
              <div>display outline here</div>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    );
  }

  export default CourseOutlineHistory;