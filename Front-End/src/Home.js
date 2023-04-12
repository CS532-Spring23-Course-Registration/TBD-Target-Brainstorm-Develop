import React, { useState } from "react";
import { Button, Modal } from "@material-ui/core";
import Test from "./Test";

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
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{
          display: "block",
          margin: "0 auto",
        }}
      >
        Open Modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Test></Test>
      </Modal>
    </div>
  );
}
export default Home;
