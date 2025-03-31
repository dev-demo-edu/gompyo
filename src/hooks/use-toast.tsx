import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<ToastProps>({
    title: "",
    description: "",
  });

  const toast = (props: ToastProps) => {
    setMessage(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    toast,
    ToastComponent: () => (
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={message.variant === "destructive" ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          <div className="font-semibold">{message.title}</div>
          <div>{message.description}</div>
        </Alert>
      </Snackbar>
    ),
  };
}
