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
} from "@mui/material";
import InfoCard from "./InfoCard";
import Cookies from "js-cookie";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import PdfTable from "./PDF";

function Profile() {
  const [selectedOption, setSelectedOption] = useState(null);
  const Pinfo = ["ID:", "Name:", "Date of Birth:", "Address:"];
  const [pValues, setPvalues] = useState({});
  const [studentData, setStudentData] = useState({});

  const sessionId = Cookies.get("session_id");
  const studentId = Cookies.get("user_id");




  const testData = {
    id: "123",
    name: "jon",
    dob: "07/14",
    address: "1111",
  };

  const formatTestData = (data) => {
    return [
      { label: "ID:", value: data.id },
      { label: "Name:", value: data.name },
      { label: "Date Of Birth:", value: data.dob },
      { label: "Address:", value: data.address },
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
          sessionId: sessionId
         }),
      });

      if (response.status === 401) {
        console.log("Authentication Failed.");
      } else if (response.status === 200) {
        console.log("Successful query.");
        const data = await response.json();
        setStudentData(data.student);
        const updatedPvalues = [
          studentData.id,
          studentData.name,
          studentData.dob,
          studentData.address,
        ];
        setPvalues(updatedPvalues);
      }
    };

    fetchStudentData();
  }, []);

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Personal Information":
        return <InfoCard labels={Pinfo} values={pValues} />;
      case "Academics":
        return <InfoCard labels={Pinfo} values={pValues} />;
      case "Student Records":
        return <InfoCard labels={Pinfo} values={pValues} />;
      default:
        return <InfoCard labels={Pinfo} values={pValues} />;
    }
  };

  const options = ["Personal Information", "Academics", "Student Records"];

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ ml: 2, mt: 4, mb: 4 }}>
          <Typography color="grey" variant="h5" align="left">
            Profile
          </Typography>
        </Box>
        <Box display="flex">
          <Card sx={{ width: "20%", height: "80%" }}>
            <CardContent>
              <List>
                {options.map((option, index) => (
                  <div key={index}>
                    <ListItem onClick={() => setSelectedOption(option)}>
                      <ListItemText primary={option} />
                    </ListItem>
                    {index !== options.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
          <Box flexGrow={1} display="flex" flexDirection="column">
            <Box flexGrow={1} ml={2}>
              {renderOptionContent()}
            </Box>
            <PdfTable data={testData} formatData={formatTestData} />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
