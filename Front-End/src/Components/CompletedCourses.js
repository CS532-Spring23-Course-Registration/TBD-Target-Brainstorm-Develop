
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
import Cookies from 'js-cookie';

function CompletedCourses(props) {
    const [studentOutlineData, setStudentOutlineData] = useState([]);

    const sessionId = Cookies.get('session_id');
    const userId = Cookies.get('user_id');

    useEffect(() => {

        fetch("http://127.0.0.1:5000/query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reportName: "studentMajorOutline",
              studentId: parseInt(userId),
              sessionId: sessionId
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              setStudentOutlineData(data);
            })
            .catch((error) => console.log(error));
    }, []);





  
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