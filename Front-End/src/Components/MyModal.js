import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import PDF from "./PDF";

const MyModal = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
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
  );
};

export default MyModal;
