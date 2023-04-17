import React, { useState } from "react";
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
  TextField,
  Button,
} from "@mui/material";

function Profile() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    id: "",
  });
  const [address, setAddress] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [contacts, setContacts] = useState({
    homePhone: "",
    cellPhone: "",
    email: "",
    personalEmail: "",
  });
  const [addresses, setAddresses] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const handlePersonalInfoChange = (event) => {
    const { name, value } = event.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContactsChange = (event) => {
    const { name, value } = event.target;
    setContacts((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddAddress = () => {
    setAddresses((prevState) => [...prevState, address]);
    setAddress({
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  const renderOptionContent = () => {
    switch (selectedOption) {
      case "Personal Information":
        return (
          <Box>
            <TextField
              label="Name"
              name="name"
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
            />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              value={personalInfo.dateOfBirth}
              onChange={handlePersonalInfoChange}
            />
            <TextField
              label="Gender"
              name="gender"
              value={personalInfo.gender}
              onChange={handlePersonalInfoChange}
            />
            <TextField
              label="ID"
              name="id"
              value={personalInfo.id}
              onChange={handlePersonalInfoChange}
            />
          </Box>
        );
      case "Address":
        return (
          <Box>
            <TextField
              label="Street Address"
              name="streetAddress"
              value={address.streetAddress}
              onChange={handleAddressChange}
            />
            <TextField
              label="City"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
            />
            <TextField
              label="State"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
            />
            <TextField
              label="Zip Code"
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleAddAddress}
            >
              Add Address
            </Button>
            {addresses.map((address, index) => (
              <Box key={index}>
                <Typography>Address {index + 1}</Typography>
                <Typography>Street Address: {address.streetAddress}</Typography>
                <Typography>City: {address.city}</Typography>
                <Typography>State: {address.state}</Typography>
                <Typography>Zip Code: {address.zipCode}</Typography>
              </Box>
            ))}
          </Box>
        );
      case "Contacts":
        return (
          <Box>
            <TextField
              label="Home Phone"
              name="homePhone"
              value={contacts.homePhone}
              onChange={handleContactsChange}
            />
            <TextField
              label="Cell Phone"
              name="cellPhone"
              value={contacts.cellPhone}
              onChange={handleContactsChange}
            />
            <TextField
              label="Email"
              name="email"
              value={contacts.email}
              onChange={handleContactsChange}
            />
            <TextField
              label="Personal Email"
              name="personalEmail"
              value={contacts.personalEmail}
              onChange={handleContactsChange}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const options = ["Personal Information", "Address", "Contacts"];

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" align="left">
            Profile
          </Typography>
        </Box>
        <Box display="flex">
          <Card>
            <CardContent>
              <List>
                {options.map((option, index) => (
                  <div key={index}>
                    <ListItem button onClick={() => setSelectedOption(option)}>
                      <ListItemText primary={option} />
                    </ListItem>
                    {index !== options.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
          <Box flexGrow={1} ml={4}>
            {renderOptionContent()}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
