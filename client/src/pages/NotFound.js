import React from 'react';

import {Box, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const notFoundStyle = makeStyles(theme => ({
  pageBackground: {
    backgroundColor: '#fff',
    color: '#000'
  },
  container: {
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  }
}))

const NotFound = (props) => {

  const classes = notFoundStyle();

  return (
    <>
      <Box className={classes.pageBackground}>
        <Grid Container className={classes.container}>
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1" align="center">
                Are You Lost?
              </Typography>
            </Grid>
            <Grid container xs={12} justify="center">
              <img alt='404Cat' src='/assets/photos/404.png'/>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )

}

export default NotFound;
