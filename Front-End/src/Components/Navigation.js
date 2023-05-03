import React from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  List,
  ListItem,
} from "@mui/material";
import styled from "@mui/system/styled";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DomainVerificationIcon from "@mui/icons-material/DomainVerification";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import GradingIcon from "@mui/icons-material/Grading";

// Imported Dialog, DialogTitle, DialogContent for Help-Function

const NavigationHeader = styled(Typography)`
  background-color: gray;
  color: white;
  padding: 16px;
  text-align: center;
`;

const NavigationCard = styled(Card)`
  background-color: lightcoral;
  &:hover {
    background-color: red;
    opacity: 0.8;
  }
`;

const WhiteText = styled(Typography)`
  color: white;
`;

const StyledLink = styled(RouterLink)`
  text-decoration: none;
`;

const options = [
  { title: "Profile", path: "/profile" },
  { title: "Course Register", path: "/search" },
  { title: "Major Requirements", path: "/Major-Requirements" },
  {
    title: "Faculty And Course Information",
    path: "/faculty-and-course-info",
  },
];

function Navigation(props) {
  //online help-function const state variable
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  console.log();

  const modifiedOptions =
    props.permission === "faculty" || props.permission === "admin"
      ? [...options, { title: "Course Grades", path: "/grades" }]
      : options;

  const handleHelpClick = () => {
    setHelpDialogOpen(true);
  };

  const handleHelpClose = () => {
    setHelpDialogOpen(false);
  };

  const renderOptionContent = (selectedOption) => {
    switch (selectedOption) {
      case "Profile":
        return <AccountBoxIcon style={{ color: "white", fontSize: 40 }} />;
      case "Course Register":
        return <AppRegistrationIcon style={{ color: "white", fontSize: 40 }} />;
      case "Major Requirements":
        return (
          <DomainVerificationIcon style={{ color: "white", fontSize: 40 }} />
        );

      case "Faculty And Course Information":
        return (
          <SupervisedUserCircleIcon style={{ color: "white", fontSize: 40 }} />
        );
      case "Course Grades":
        return <GradingIcon style={{ color: "white", fontSize: 40 }} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 8 }}>
          <NavigationHeader variant="h4">Menu</NavigationHeader>
          <Box
            sx={{
              position: "fixed",
              right: 16,
              bottom: 16,
            }}
          >
            <Button variant="contained" color="error" onClick={handleHelpClick}>
              Help
            </Button>
          </Box>
        </Box>
        <Dialog open={helpDialogOpen} onClose={handleHelpClose}>
          <DialogTitle>Help</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <Typography>
                  <strong>Profile:</strong> This tab will open a page that will
                  have access to the student's general information.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Course Register:</strong> This tab will allow students
                  to register/search through the courses.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Major Requirements:</strong> This tab will allow
                  students to search through the Majors and it's courses.
                  Students will also be able to view outlines.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  <strong>Faculty And Course Information:</strong> This tab will
                  allow students to search/lookup faculty/courses information by
                  seraching for instructor name or course.
                </Typography>
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
        <Grid container spacing={10}>
          {modifiedOptions.map((option, index) => (
            <Grid item key={index} sm={12} md={6} xs={4}>
              <StyledLink to={option.path}>
                <NavigationCard>
                  <CardContent sx={{ padding: "24px" }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid mr={5} item>
                        {renderOptionContent(option.title)}
                      </Grid>
                      <Grid item>
                        <WhiteText variant="h5" align="center">
                          {option.title}
                        </WhiteText>
                      </Grid>
                    </Grid>
                  </CardContent>
                </NavigationCard>
              </StyledLink>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default Navigation;
