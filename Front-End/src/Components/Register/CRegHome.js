import { React } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Card, Box, CardContent, List, ListItem, Divider } from "@mui/material";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    height: "100%",
    position: "fixed",
    left: "0",
    padding: "10px",
    boxSizing: "border-box",
    marginLeft: "30px"
  },
  link: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "black",
    margin: "5px 0",
    padding: "5px 10px",
    borderRadius: "5px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#ccc",
    },
  },
  icon: {
    marginRight: "10px",
  },
});

function CRegHome() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <Box>
      <Card>
          <CardContent>
            <List>
              <ListItem>
                <Link to="/search" className={classes.link}>
                  <SearchIcon className={classes.icon} />
                  Search Courses
                </Link>
              </ListItem>
              <Divider />
              <ListItem>
                {" "}
                <Link to="/majorlist" className={classes.link}>
                  <LibraryBooksIcon className={classes.icon} />
                  Currently Enrolled Courses
                </Link>
              </ListItem>
            </List>
          </CardContent>
        </Card>
    </Box>

    </div>
  );
}

export default CRegHome;
