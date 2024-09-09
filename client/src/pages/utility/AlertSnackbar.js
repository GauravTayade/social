import React from "react";

import {Snackbar, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const AlertSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      open={props.status}
      autoHideDuration={6000}
      message={props.message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={props.onclose}>
            <CloseIcon fontSize="small"/>
          </IconButton>
        </React.Fragment>
      }
    />
  )
}

export default AlertSnackbar;
