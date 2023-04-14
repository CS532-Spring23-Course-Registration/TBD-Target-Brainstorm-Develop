import React from "react";
import CRegHome from "./CRegHome";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100px",
    height: "100%",
    marginLeft: "200px",
    boxSizing: "border-box",
  },
  contents: {
    padding: "10px",
  },
});

function Cinfo() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>
        <Link to="/register">Cinfo</Link>
      </div>
    </div>
  );
}

export default Cinfo;
