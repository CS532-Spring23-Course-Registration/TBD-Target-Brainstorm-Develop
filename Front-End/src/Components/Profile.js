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

function Profile() {
  const [selectedOption, setSelectedOption] = useState(null);
  const Pinfo = ["ID:", "Name:", "Date of Birth:", "Address:"];
  const [pValues, setPvalues] = useState({});
  const [studentData, setStudentData] = useState({});
  const testData = {
    id: "123",
    name: "jon",
    dob: "07/14",
    address: "1111",
  };

  const formatTestData = (data) => {
    return [
      { label: "ID", value: data.id },
      { label: "Name", value: data.name },
      { label: "Date Of Birth", value: data.dob },
      { label: "Address", value: data.address },
    ];
  };

  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const formattedData = formatTestData(testData);
    const cellWidth = width / 2;
    const cellHeight = 25;
    const textHeight = 14;
    let x = 50;
    let y = height - 50;

    const underlineWidth = width * 0.8;
    const underlineHeight = 1;

    formattedData.forEach(({ label, value }) => {
      page.drawText(label, { x, y, size: textHeight, font: timesRomanFont });
      page.drawText(value, {
        x: x + cellWidth,
        y,
        size: textHeight,
        font: timesRomanFont,
      });

      const underlineY = y - 5;
      page.drawRectangle({
        x,
        y: underlineY,
        width: underlineWidth,
        height: underlineHeight,
        color: rgb(0, 0, 0),
        fillOpacity: 1,
      });

      y -= cellHeight + 20;
    });

    const pdfBytes = await pdfDoc.save();
    const pdfUrl = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
    window.open(pdfUrl);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const session_key = Cookies.get("session_key");
      const response = await fetch("http://127.0.0.1:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: session_key }),
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
  });

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
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
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
            <Button onClick={generatePdf}>Generate PDF</Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
