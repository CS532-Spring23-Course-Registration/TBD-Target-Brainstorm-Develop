import React from "react";
import { makeStyles } from "@mui/styles";
import CRegHome from "./MenuCard";

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

function MyCourses() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>CSearch</div>
    </div>
  );
}

export default MyCourses;
