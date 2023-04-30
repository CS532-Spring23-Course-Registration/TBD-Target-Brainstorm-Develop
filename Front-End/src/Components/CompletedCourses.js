
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

function CompletedCourses(props) {
    const [data, setData] = useState([]);
  
    return (
      <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }}>
        {props.data.map(item => (
          <Card color="red" key={item.id} sx={{ mb: 2, bgcolor: '#FFCCCB' }}>
            <CardContent>
              <Typography variant="h5">{item.name}</Typography>
              <Typography variant="body2">{item.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  export default CompletedCourses;