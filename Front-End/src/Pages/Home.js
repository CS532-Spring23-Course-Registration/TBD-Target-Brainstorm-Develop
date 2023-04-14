import React, { useState } from "react";
import { Grid, Button, Modal, Box } from "@material-ui/core";
import PDF from "../Components/PDF";
import { Link } from "react-router-dom";

function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Grid
        container
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Open Modal
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/signup"
          >
            Back
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "90vw",
            height: "90vh",
          }}
        >
          <PDF />
        </Box>
      </Modal>
    </div>
  );
}
export default Home;
