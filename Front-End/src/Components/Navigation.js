import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import styled from "@mui/system/styled";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NavigationHeader = styled(Typography)`
  background-color: lightcoral;
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
  { title: "Academic Record", path: "/Academic-Record" },
  { title: "Course Register", path: "/Course-Register" },
  { title: "Major Requirements", path: "/Major-Requirements" },
  {
    title: "Faculty And Course Information",
    path: "/Faculty-And-Course-Information",
  },
  { title: "Course Grades", path: "/Course-Grades" },
];

function Navigation() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 8 }}>
          <NavigationHeader variant="h4">Navigate</NavigationHeader>
        </Box>
        <Grid container spacing={10}>
          {options.map((option, index) => (
            <Grid item key={index} sm={12} md={6} xs={4}>
              <StyledLink to={option.path}>
                <NavigationCard>
                  <CardContent>
                    <WhiteText variant="h5" align="center">
                      {option.title}
                    </WhiteText>
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
