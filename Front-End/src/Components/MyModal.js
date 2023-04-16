import React, { useState } from "react";
import { Modal } from "@mui/material";
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
      <PDF />
    </Modal>
  );
};

export default MyModal;
