import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StudentGrades from './StudentGrades';

function CourseGrades() {

    const [selectedOption, setSelectedOption] = useState(null);

    const testData = [
      {
        name: 'test1'
      },
      {
        name: 'test2'
      },
      {
        name: 'test3'
      }
    ];



    return (
      <div>
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="left"> Course Grades </Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" height="500px" width="150px" sx={{ overflowY: 'scroll', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
              <Card variant="contained" height="100%" sx={{ width: '100%' }}>
                <CardContent>
                  <List>
                    {testData.map((item, index) => (
                      <div key={index}>
                        <ListItem button onClick={() => setSelectedOption(item.name)}>
                          <ListItemText primary={item.name} />
                        </ListItem>
                        {index !== testData.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
            <Box flexGrow={1} ml={4}>
              <StudentGrades />
            </Box>
          </Box>
        </Container>
      </div>
    );
}
    
    export default CourseGrades;
      
