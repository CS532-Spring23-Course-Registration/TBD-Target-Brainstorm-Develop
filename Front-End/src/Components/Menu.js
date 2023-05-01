import React from "react";
import { AppBar, Toolbar, Button, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

function Menu(props) {
  const classes = useStyles();
  var permissionCheck = false;


  const handleLogout = (event) => {
    const cookies = Object.keys(Cookies.get());
  
    cookies.forEach(cookie => {
      Cookies.remove(cookie, { path: '/' });
    });
  
    props.setUser({
      auth: false, 
      permission: "",
      id: ""
    });
  };

  console.log("Permission: " +props.permission)

  if (props.permission === "admin") {
    permissionCheck = true;
  }


  return (
    <div className={classes.root}>
      <AppBar position="static" color="error">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Course Registration</Typography>
          <Button variant="contained" color="error" component={Link} to="/">
            Home
          </Button>
          {permissionCheck ? (
            <Button
            variant="contained"
            color="error"
            component={Link}
            to="/signup"
          >
            Register User
          </Button>
          ) : null}
          {permissionCheck ? (
            <Button
            variant="contained"
            color="error"
            component={Link}
            to="/adminpanel"
          >
            Admin Panel
          </Button>
          ) : null}
          <Button
            variant="contained"
            color="error"
            component={Link}
            to="/login"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Menu;
