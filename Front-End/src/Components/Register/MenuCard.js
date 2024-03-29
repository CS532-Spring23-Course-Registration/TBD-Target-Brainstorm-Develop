import { React } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HelpButton from "./HelpButton";
import { Card, Box, CardContent, List, ListItem, Divider } from "@mui/material";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "200px",
    height: "100%",
    position: "fixed",
    left: "1rem",
    padding: "10px",
    boxSizing: "border-box",
    marginLeft: "20px",
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

function MenuCard({ content }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Card>
          <CardContent>
            <List>
              {content.map((item, index) => (
                <div key={index}>
                  <ListItem>
                    <Link to={item.to} className={classes.link}>
                      {item.icon}
                      {item.text}
                    </Link>
                  </ListItem>
                  {index !== content.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default MenuCard;
