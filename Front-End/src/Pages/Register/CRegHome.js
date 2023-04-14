import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import BookIcon from "@material-ui/icons/Book";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    height: "100%",
    position: "fixed",
    left: "0",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    boxSizing: "border-box",
  },
  link: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
    margin: "5px 0",
    padding: "5px 10px",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#ccc",
    },
  },
  icon: {
    marginRight: "10px",
  },
});

function CRegHome() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Link to="/search" className={classes.link}>
        <SearchIcon className={classes.icon} />
        Search
      </Link>
      <Link to="/majorlist" className={classes.link}>
        <BookIcon className={classes.icon} />
        Major Courses
      </Link>
      <Link to="/mycourses" className={classes.link}>
        <CalendarTodayIcon className={classes.icon} />
        View Courses
      </Link>
    </div>
  );
}

export default CRegHome;
