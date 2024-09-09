import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import UserContext from "../../contexts/UserContext";

import {
  Toolbar,
  AppBar,
  Button,
  IconButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem, ListItemIcon
} from "@material-ui/core";

import FaceIcon from '@material-ui/icons/Face';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {makeStyles} from "@material-ui/core/styles";
import DialogCreatePoll from "./dashboardComponents/DialogCreatePoll";

const menuStyle = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    width: '100%',
  },
  iconImage: {
    width: '68px',
    height: '68px'
  },
  navDisplayFlex: {
    display: "flex",
    justifyContent: "space-between"
  },
  linkText: {
    textDecoration: "none",
    textTransform: "uppercase",
    color: "#000"
  },
  menuOptions: {
    alignItems: "center",
    justifyContent: "end",
    display: "inline-flex"
  },
  linkStyle: {
    textDecoration: 'none',
    color: '#000',
    margin: '0rem 4rem'
  },
  btnRounded: {
    border: '1px solid #e8e8e8',
    borderRadius: '25px',
    padding: '0.5rem 1rem'
  },
  menuAvatar: {
    padding: '0rem 1rem'
  }
}));

const MenuPage = (props) => {

  const classes = menuStyle();
  const userContext = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar fluid position="static" className={classes.appBar}>
        <Toolbar>
          <Container maxWidth="false" className={classes.navDisplayFlex}>
            <IconButton edge="start">
              <Link to='/user/dashboard'>
                <img alt="logo" className={classes.iconImage} src="/assets/photos/icon.jpg"/>
              </Link>
            </IconButton>
            <Box className={classes.menuOptions}>
              <Button>
                <Link className={classes.linkStyle} to='/user/friends'>Friends</Link>
              </Button>
              <Button>
                <Link className={classes.linkStyle} to='/user/friends-pool'>Friends Pool</Link>
              </Button>
              <Button>
                <Link className={classes.linkStyle} to='/user/opinion'>Opinion</Link>
              </Button>
              <Button onClick={props.openDialog} className={[classes.btnRounded, classes.linkStyle]}>
                Create Pool
              </Button>
              <div p={2}>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <Avatar alt={userContext.userInfo.name}
                          src="/assets/photos/610f7a940f59d5cef71f3de7754a70a1411d8bb8.png"/>
                  <span className={classes.menuAvatar}>{userContext.userInfo.name}</span>
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                  transformOrigin={{vertical: "top", horizontal: "right"}}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <Link to={`/user/${userContext.userInfo.id}/profile`}>
                      <ListItemIcon>
                        <FaceIcon fontSize="small"/>
                      </ListItemIcon>
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small"/>
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
      <DialogCreatePoll
        dialogStatus={props.dialogStatus}
        closeDialog={props.closeDialog}/>
    </>
  )

}

export default MenuPage;
