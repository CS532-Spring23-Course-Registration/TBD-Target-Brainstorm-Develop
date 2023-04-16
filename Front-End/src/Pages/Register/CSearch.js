import React, { useState, useEffect } from "react";
import CRegHome from "./CRegHome";
import { makeStyles } from "@mui/styles";
import { TextField, Button } from "@mui/material";

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
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    width: "80%",
    border: "1px solid",
    borderRadius: "5px",
    boxShadow: `3px 3px 3px`,
  },
  input: {
    margin: "10px",
  },
  button: {
    marginTop: "20px",
  },
  results: {
    marginTop: "20px",
  },
}));

function CSearch() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/courses?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.courses);
        console.log(data);
      });
  };

  return (
    <div className={classes.root}>
      <CRegHome />
      <div className={classes.contents}>
        <form className={classes.form} onSubmit={handleSearch}>
          <TextField
            className={classes.input}
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="error"
            type="submit"
          >
            Search
          </Button>
        </form>
        {searchResults.length > 0 && (
          <div className={classes.results}>
            {searchResults.map((result, i) => (
              <p key={i}>{result}</p>
            ))}
          </div>
        )}{" "}
      </div>
    </div>
  );
}

export default CSearch;
