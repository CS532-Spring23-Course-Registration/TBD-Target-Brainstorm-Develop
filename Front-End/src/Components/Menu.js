import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
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
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/reghome"
          >
            Register
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/home"
          >
            Home
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/search"
          >
            Search
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Menu;
