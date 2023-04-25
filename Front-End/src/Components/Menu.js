import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
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


  return (
    <div className={classes.root}>
      <AppBar position="static" color="error">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Course Registration</Typography>
          <Button variant="contained" color="error" component={Link} to="/">
            Home
          </Button>
          <Button
            variant="contained"
            color="error"
            component={Link}
            to="/search"
          >
            Register
          </Button>

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
