import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import InfoCard from "./InfoCard";
import Cookies from "js-cookie";
import PdfTable from "./PDF";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: "20px 0",
  },
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    boxSizing: "border-box",
    width: "80%",
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "min-content",
    height: "fit-content",
    marginRight: "50px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: "90%",
    marginBottom: "20px",
  },
  listItem: {
    cursor: "pointer",
  },
}));

function Profile() {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState(null);
  const Pinfo = ["ID:", "Name:", "Date of Birth:", "Address:"];
  const [pValues, setPvalues] = useState({});
  const [studentData, setStudentData] = useState({});
  const [cValues, setCvalues] = useState({});
  const [pdfData, setPDF] = useState({});
  const Cinfo = ["Courses"];

  const sessionId = Cookies.get("session_id");
  const studentId = Cookies.get("user_id");

  // Added For the Help-Function Const state variable
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  // supporting functions that will help handle the Help Button
  const handleHelpClick = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
  };

  const testData = {
    id: "123",
    name: "jon",
    dob: "07/14",
    address: "1111",
  };

  // format for the pdf generator
  const formatTestData = (data) => {
    return [
      { label: "ID:", value: data.ID },
      { label: "Name:", value: data.Name },
      { label: "Date Of Birth:", value: data.DateOfBirth },
      { label: "Address:", value: data.Address },
      { label: "Phone Number:", value: data.PhoneNumber },
      { label: "Major:", value: data.Major },
      { label: "Minor:", value: data.Minor },
    ];
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const session_key = Cookies.get("session_key");
      const response = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportName: "studentInfo",
          studentId: parseInt(studentId),
          sessionId: sessionId,
        }),
      });

      if (response.status === 401) {
        console.log("Authentication Failed.");
      } else if (response.status === 200) {
        console.log("Successful query.");
        const data = await response.json();
        // data passed for the pdf generator
        const updatedPDF = {
          ID: data.id.toString(),
          Name: data.name,
          DateOfBirth: data.dateOfBirth,
          Address: data.address,
          PhoneNumber: data.phoneNumber,
          Major: data.major,
          Minor: data.minor,
        };

        // data passed for the card
        const updatedPvalues = [
          data.id,
          data.name,
          data.dateOfBirth,
          data.address,
          data.phoneNumber,
          data.major,
          data.minor,
        ];
        const updatedCvalues = [data.courses];
        setPvalues(updatedPvalues);
        setCvalues(updatedCvalues);
        setPDF(updatedPDF);
      }
    };

    fetchStudentData();
  }, []);

  // Right Column Contents
  const options = ["Personal Information", "Academics"];

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Personal Information":
        return <InfoCard labels={Pinfo} values={pValues} />;
      case "Academics":
        return <InfoCard labels={Cinfo} values={cValues} />;
      default:
        return <InfoCard labels={Pinfo} values={pValues} />;
    }
  };

  // This was added since it can be used by the incoprating it to the function above which allows is to press help when one of the options above are selected and it will return the text below
  // const renderHelpContent = () => {
  //   switch (renderOptionContent) {
  //     case 'Personal Information':
  //       return "This tab displays the student's personal information.";
  //     case 'Academics':
  //       return "This tab shows the student's academic information.";
  //     case 'Student Records':
  //       return "This tab contains the student's records.";
  //     default:
  //       return '';
  //   }
  // };

  return (
    <div>
      <Container>
        <Box className={classes.title}>
          <Typography color="grey" variant="h5" align="left">
            Profile
          </Typography>
        </Box>
        <Box className={classes.root}>
          <Box>
            <Card className={classes.leftColumn}>
              <CardContent>
                <List>
                  {options.map((option, index) => (
                    <div key={index}>
                      <ListItem
                        className={classes.listItem}
                        onClick={() => setSelectedOption(option)}
                      >
                        <ListItemText primary={option} />
                      </ListItem>
                      {index !== options.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          <Box className={classes.rightColumn}>
            <Card className={classes.card}>
              <Box>{renderOptionContent()}</Box>
            </Card>
            <PdfTable data={pdfData} formatData={formatTestData} />
          </Box>
        </Box>

        <Box sx={{ position: "fixed", right: 16, bottom: 16 }}>
          <Button variant="contained" color="error" onClick={handleHelpClick}>
            Help
          </Button>
        </Box>
        {/* <Dialog open={helpDialogOpen} onClose={handleHelpClose}>
          <DialogTitle>Help</DialogTitle>
          <DialogContent>
            <Typography>{renderHelpContent()}</Typography>
          </DialogContent>
        </Dialog> */}
        <Dialog open={helpDialogOpen} onClose={handleHelpClose}>
          <DialogTitle>Help</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <Typography>
                  <strong>Personal Information:</strong> This tab displays the
                  student's personal information.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Academics:</strong> This tab shows the student's
                  academic information.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Student Records:</strong> This tab contains the
                  student's records.
                </Typography>
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}

export default Profile;
