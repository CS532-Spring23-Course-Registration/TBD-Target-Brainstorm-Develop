import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CRegHome from "./CRegHome";

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

function MajorList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>MajorList</div>
    </div>
  );
}

export default MajorList;
