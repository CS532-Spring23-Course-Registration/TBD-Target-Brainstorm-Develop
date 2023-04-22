import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Link } from "react-router-dom";

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

function Menu() {
  const classes = useStyles();
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
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Menu;
