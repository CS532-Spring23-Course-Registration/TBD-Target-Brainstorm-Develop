import React, { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import InfoCard from "./InfoCard";
import PrintPDFButton from "../PDFButton";

// import Cookies from "js-cookie";

function Print() {
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
    reportName: "student_info",
  };

  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(true);
    console.log("clicked");
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
        <Box flexGrow={1} ml={2}>
          <InfoCard labels={Pinfo} values={pValues} />
          <InfoCard labels={Ainfo} values={aValues} />
          <InfoCard labels={Cinfo} values={cValues} />
          <InfoCard labels={Cinfo} values={cValues} />
          <InfoCard labels={Cinfo} values={cValues} />
        </Box>
      </Container>
      <PrintPDFButton />
    </div>
  );
}

export default Print;