import React, { useState } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  TextField,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

const FacultyAndCourses = () => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
  
    const handleDrawerToggle = () => {
      setOpen(!open);
    };
  
    const handleListItemClick = (item) => {
      setSelectedItem(item);
    };
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
    };
  
    const options = ["Courses", "Faculty"];
  
    return (
      <div>
  <Box display="flex">
        <Box sx={{
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          width: '300px',
          margin: '20px',
          padding: '10px'
        }}>
          <Typography variant="h6" component="div">
            Select an Option
          </Typography>
          <List>
            {options.map((option, index) => (
              <div key={index}>
                <ListItem button onClick={() => handleListItemClick(option)}>
                  <ListItemText primary={option} />
                </ListItem>
              </div>
            ))}
          </List>
        </Box>
        <Box sx={{ margin: '20px' }}>
          <TextField
            id="search-bar"
            label={`Search ${selectedItem}`}
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              marginTop: '20px',
              width: '60%'
            }}
          />
        </Box>
        </Box>
      </div>
    );
  };
  
  export default FacultyAndCourses;