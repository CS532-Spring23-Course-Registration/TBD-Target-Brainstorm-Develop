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
import { Link } from "react-router-dom";

// import Cookies from "js-cookie";

function Profile(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const Pinfo = ["Name:", "Date of Birth:", "Gender:", "ID:"];
  const Ainfo = ["Street Address:", "City:", "State:", "Zip Code:"];
  const Cinfo = ["Home Phone:", "Cell Phone:", "Email:", "Personal Email:"];

  const Pvalues = ["John Doe", "01/01/2000", "Male", "123456"];
  // const Avalues = ["1234 sdsu blvd", "San Diego", "California", "123456"];
  // const Cvalues = [
  //   "000-000-0000",
  //   "000-000-0000",
  //   "example@gmail.com",
  //   "example@gmail.com",
  // ];
  const [pValues, setPvalues] = useState({});
  const [aValues, setAvalues] = useState({});
  const [cValues, setCvalues] = useState({});

  // const [data, setData] = useState([]);
  // const sessionId = Cookies.get("session_id");

  const test = "test";

  const params = {
    session_id: test,
    reportName: "studentInfo",
  };

  //Causing Infinite Loop

  useEffect(() => {
    fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        // setData(data);
        const updatedPvalues = [data.name, null, null, data.id];
        setPvalues(updatedPvalues);
        const updatedAvalues = [data.address, null, null, null];
        setAvalues(updatedAvalues);
        const updatedCvalues = [data.phone_number, null, null, null];
        setCvalues(updatedCvalues);
      })
      .catch((error) => console.log(error));
  }, []);

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Personal Information":
        return <InfoCard labels={Pinfo} values={pValues} />;
      case "Address":
        return <InfoCard labels={Ainfo} values={aValues} />;
      case "Contacts":
        return <InfoCard labels={Cinfo} values={cValues} />;
      case "Academics":
        return <InfoCard labels={Cinfo} values={cValues} />;
      case "Student Records":
        return <InfoCard labels={Cinfo} values={cValues} />;
      default:
        return <InfoCard labels={Pinfo} values={Pvalues} />;
    }
  };

  const handleClick = () => {
    props.updatePrintState(false);
  };

  const options = [
    "Personal Information",
    "Address",
    "Academics",
    "Student Records",
    "Contacts",
  ];

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
            Profile
          </Typography>
        </Box>
        <Box display="flex">
          <Card sx={{ width: 400 }}>
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
          <Box flexGrow={1} ml={2}>
            {renderOptionContent()}
          </Box>
        </Box>

        <Button
          variant="contained"
          color="error"
          component={Link}
          to="/print"
          onClick={handleClick}
        >
          Print Results
        </Button>
      </Container>
    </div>
  );
}

export default Profile;
