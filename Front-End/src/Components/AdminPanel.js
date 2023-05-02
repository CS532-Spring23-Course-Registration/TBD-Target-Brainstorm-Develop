import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  FormControl,
  Select,
  InputLabel,
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
    padding: "2px"
  },
  card: {
    padding: "10px",
    margin: "10px"
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [menuSelect, setMenuSelect] = useState("user");
  const [newPassword, setNewPassword] = useState("");


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

  const passwordRef = useRef(null);

  const formatData = (data) => {
    return data.map((item) => {
      return {
        label: `${item.name} (${item.jobTitle})`,
        value: `Employee Number: ${item.employeeNumber} , Allowed Access: ${item.allowedAccess}`,
      };
    });
  };

  const sessionId = Cookies.get("session_id");
  console.log("Session: " + sessionId);

  const handleChangePassword = (user) => {
    console.log('User');
    console.log(user);
    console.log('Password');
    console.log(passwordRef.current.value);
  }

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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuChange = (event) => {
    setMenuSelect(event.target.value);
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
          <Paper className={classes.rightColumn} sx={{ height: "700px", overflowY: "scroll"}}>
            {testData.map((user) => (
              <Box m={3}>
                <Card>
                  <CardContent>
                    <Box key={user.id} height="100px" width="100%" display="flex">
                      <Box display="flex" flexDirection="column" alignContent="center" width="50%">
                        <Typography variant="h5">{user.name}</Typography>
                        <Typography variant="caption">Employee Number: {user.employeeNumber}</Typography>
                        <Typography variant="caption">Job Title: {user.jobTitle}</Typography>
                        <Typography variant="caption">Allowed Access: {user.allowedAccess ? "Yes" : "No"}</Typography>
                      </Box>
                      <Box display="flex" flexDirection="row" width="50%" alignItems="center" border="1px solid green" justifyContent="space-around">
                          <form border="1px solid blue" onSubmit={() => handleChangePassword(user)}>
                            <TextField required size="small" label="New Password" inputRef={passwordRef}/>
                            <Button 
                              size="small" 
                              variant="contained" 
                              color="error" 
                              onClick={() => handleChangePassword(user)}
                              sx={{ height: "50%", width: "30%" }}
                              >
                                Change Password
                            </Button>
                          </form>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Paper>
          <PdfTable data={testData} formatData={formatData}/>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanel;
