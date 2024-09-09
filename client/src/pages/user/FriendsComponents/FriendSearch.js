import React, {useState} from 'react'
import {AppBar, Box, Dialog, Grid, TextField, Button} from "@material-ui/core";
import axios from "axios";

import CloseIcon from "@material-ui/icons/Close";

import FriendCard from "./FriendCard";


const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

const FriendSearch = (props) => {

  const [searchUser, setSearchUser] = useState(null);

  const getUsers = (e) => {
    if (e.target.value.length > 3) {
      axiosClient.get(`/user/search?key=${e.target.value}`)
        .then(result => {
          if (result.data.status === 1) {
            setSearchUser(result.data.response);
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <Dialog open={props.showDialog} fullScreen color="primary">
      <AppBar color="default" position="static">
        <Grid container>
          <Grid item xs={11}>
            <Box display="flex" justifyContent="center">
              <TextField
                required
                fullWidth
                id="outlined-required"
                placeholder="Search Friend"
                variant="outlined"
                onChange={getUsers}
              />
            </Box>
          </Grid>
          <Grid container item xs={1} justify="flex-end">
            <Button fullWidth variant="contained" color="secondary" onClick={props.handleClick}>
              <CloseIcon/>
            </Button>
          </Grid>
        </Grid>
      </AppBar>
      <Grid container>
        <Grid item xs={12} container alignContent="center" justify="center">
          {searchUser ?
            searchUser.map(user => {
              return <FriendCard
                rollbackRequest={props.rollbackRequest}
                declineRequest={props.declineRequest}
                sendFriendRequest={props.sendFriendRequest}
                acceptRequest={props.acceptRequest}
                showSnackbar={props.showSnackbar}
                closeSnackbar={props.closeSnackbar}
                message={props.message}
                user={user}/>
            })
            :
            ''
          }
        </Grid>
      </Grid>
    </Dialog>
  )

}

export default FriendSearch;
