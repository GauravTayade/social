import React from 'react';
import {Link, useLocation} from 'react-router-dom';

import {AppBar, Typography, Toolbar} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

const menuStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  iconImage: {
    width: '68px',
    height: '68px'
  },
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  loginButton: {
    border: '1px solid #FF5D5D',
    borderRadius: '50px',
    fontSize: '1rem',
    padding: '0.5rem 2rem',
    color: '#FF5D5D',
    textDecoration: 'none'
  },
  title: {
    flexGrow: 1,
  },
}));

const Menu = () => {

  const classes = menuStyles();

  const uselocation = useLocation();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img alt="logo" className={classes.iconImage} src="./assets/photos/icon.jpg"/>
          </Typography>
          {uselocation.pathname.split("/").pop() === 'login' ?
            <Link className={classes.loginButton} to="/">Singnup</Link>
            :
            <Link className={classes.loginButton} to="/login">Login</Link>
          }
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Menu;
