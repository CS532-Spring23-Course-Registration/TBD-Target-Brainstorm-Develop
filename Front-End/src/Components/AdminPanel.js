import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogContent,
  MenuItem,
  CardContent,
  Container,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CardHeader,
  Typography,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Cookies from "js-cookie";
import PdfTable from "./PDF";
import ChangePassAP from "./ChangePassAP";

const useStyles = makeStyles((theme) => ({
  leftColumn: {
    flex: "1 1 20%",
    padding: "2px",
    height: "100%",
  },
  userBox: {
    backgroundColor: "grey",
    padding: "2px",
    height: "100%",
  },
  userTable: {
    marginBottom: "40px",
  },
  printButton: {
    margin: "10px",
  },
  rightColumn: {
    flex: "1 1 80%",
    padding: "2px",
  },
  card: {
    padding: "10px",
    margin: "10px",
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [users, setUsers] = useState(null);
  const [menuSelect, setMenuSelect] = useState("user");
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(null);

  const sessionId = Cookies.get("session_id");

  const testData = [
    {
      id: 1,
      name: "Jon",
      employeeNumber: 123,
      jobTitle: "Engineer",
      allowedAccess: true,
    },
    {
      id: 2,
      name: "Jane",
      employeeNumber: 456,
      jobTitle: "Designer",
      allowedAccess: false,
    },
    {
      id: 3,
      name: "Jake",
      employeeNumber: 789,
      jobTitle: "Manager",
      allowedAccess: true,
    },
  ];

  const formatData = (data) => {
    return data.userList.map((item) => {
      return {
        label: `${item.username} (${item.jobTitle})`,
        value: `Employee Number: ${item.userId} , Permission: ${item.permissions}`,
      };
    });
  };

  const handleClick = (user) => {
    setSelectedItem(user);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setOpen(false);
  };

  const handleMenuChange = (event) => {
    setMenuSelect(event.target.value);
  };

  const handlePasswordChange = (selectedItem) => {
    //NEED TO CHANGE selectedItem.id to correct data once users actually get returned
    fetch("http://127.0.0.1:5000/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateType: "changePassword",
        sessionId: sessionId,
        userBeingModified: selectedItem.userId,
        newPassword: newPassword,
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));

    console.log(selectedItem);
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: "users",
          granularity: menuSelect,
          sessionId: sessionId,
        }),
      });

      if (response.status === 401) {
      } else if (response.status === 200) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} mt={3}>
        {/* Left Column */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent style={{ display: "flex", flexDirection: "column" }}>
              <TableContainer>
                <Table className={classes.userTable} size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Name:</TableCell>
                      <TableCell>John Smith</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Employee Number:</TableCell>
                      <TableCell>12345</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Job Title:</TableCell>
                      <TableCell>Software Engineer</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Password:</TableCell>
                      <TableCell>**********</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Allowed Access:</TableCell>
                      <TableCell>Yes</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <FormControl fullWidth>
                <Select value={menuSelect} onChange={handleMenuChange}>
                  <MenuItem value={"user"}>All Users</MenuItem>
                  <MenuItem value={"student"}>Students</MenuItem>
                  <MenuItem value={"faculty"}>Faculty</MenuItem>
                  <MenuItem value={"admin"}>Admin</MenuItem>
                </Select>
              </FormControl>
              <Button
                color="error"
                className={classes.printButton}
                onClick={() => handleSubmit()}
                variant="contained"
              >
                Display Users
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Right Column */}
        <Grid item xs={12} md={9}>
          <Paper
            className={classes.rightColumn}
            sx={{ height: "700px", overflowY: "scroll" }}
          >
            {users !== null &&
              users.userList.map((user) => (
                <Box m={3} key={user.userId}>
                  <Card
                    key={user.userId}
                    sx={{
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                    onClick={() => handleClick(user)}
                  >
                    <CardContent>
                      <Box
                        key={user.userId}
                        height="50px"
                        width="100%"
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-around"
                        alignItems="center"
                      >
                        <Box mt={1} width="50%">
                          <Typography variant="h5">{user.username}</Typography>
                        </Box>
                        <Box
                          mt={1}
                          width="50%"
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                        >
                          <Typography variant="caption">
                            Employee Number: {user.userId}
                          </Typography>
                          <Typography variant="caption">
                            Job Title: {user.jobTitle}
                          </Typography>
                          <Typography variant="caption">
                            Permission: {user.permissions}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
          </Paper>
          {selectedItem && (
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box m={1}>
                    <Typography variant="h6">
                      Change Password For {selectedItem.name}:{" "}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <TextField
                      required
                      size="small"
                      label="New Password"
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handlePasswordChange(selectedItem)}
                      sx={{
                        height: "35px",
                        width: "30%",
                        textTransform: "none",
                        lineHeight: "15px",
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Box>
              </DialogContent>
            </Dialog>
          )}
          <PdfTable data={users} formatData={formatData} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;
