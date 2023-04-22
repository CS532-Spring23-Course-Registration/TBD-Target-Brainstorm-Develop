import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent,Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CRegHome from "./CRegHome";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "90%-200px",
    height: "100%",
    marginLeft: "200px",
    boxSizing: "border-box",
  },
  contents: {
    display: "flex",
    padding: "10px",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  card: {
    width: "100%",
  }
  
}));

function Cinfo() {
  const classes = useStyles();
  const { id } = useParams();
  const [course, setCourse] = useState({});

  useEffect(() => {
    fetch(`/cinfo/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
      });
  }, [id]);

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>
      <Card className={classes.card}>
        <CardContent className={classes.cardcontent}>
          <Typography variant="h4" >
            {course.title}
          </Typography>
          <Typography variant="body1" >
            {course.description}
          </Typography>
          <Typography variant="body2">Instructor: {course.instructor}</Typography>
          <Typography variant="body2">Start Date: {course.startDate}</Typography>
          <Typography variant="body2">End Date: {course.endDate}</Typography>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}


export default Cinfo;
