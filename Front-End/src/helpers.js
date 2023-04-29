import React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

const useStyles = makeStyles(() => ({
    button: {
      margin: "10px",
    },
  }));
  
  export const PrintPDFButton = () => {
    const classes = useStyles();
  
    const handlePrintPDF = () => {
      window.print();
    };
  
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrintPDF}
          className={classes.button}
        >
          Print PDF
        </Button>
      </>
    );
  };

export const updateAuthentication = (newStatus, setIsAuthenticated) => {
  setIsAuthenticated(newStatus);
};

export const updatePrintState = (newStatus, setPrintable) => {
  setPrintable(newStatus);
};