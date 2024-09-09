import React, {useState, useContext, useEffect} from 'react';
import UserContext from "../../contexts/UserContext";
import axios from 'axios';

import MenuPage from "./Menu";
import {Grid, Typography, Button, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';

import Nothing from "../utility/Nothing";
import FriendSearch from "./FriendsComponents/FriendSearch";
import FriendCard from "./FriendsComponents/FriendCard";

const friendsStyle = makeStyles({
  marginX: {
    margin: '2rem 0'
  }
})

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

const FriendsPage = () => {

  const classes = friendsStyle();
  const user = useContext(UserContext);
  const [receivedRequests, setReceivedRequests] = useState(null);
  const [sentRequests, setSentRequests] = useState(null);
  const [showFriendSearchDialog, setShowFriendSearchDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState(null);

  const rollbackRequest = (userid) => {
    axios.post(process.env.REACT_APP_API_URL + '/friend/cancel', {userid: user.userInfo.id, friendid: userid})
      .then(result => {
        if (result.data.status === 1) {
          setMessage(result.data.response);
          setShowSnackbar(true)
          getReceivedFriendRequests()
          getSentFriendRequests()
        } else {
          setMessage(result.data.response);
          setShowSnackbar(true)
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const acceptRequest = (userid) => {
    axios.post(process.env.REACT_APP_API_URL + '/friend/accept', {friendid: user.userInfo.id, userid: userid})
      .then(result => {
        if (result.data.status === 1) {
          setMessage(result.data.response);
          setShowSnackbar(true)
          getReceivedFriendRequests()
          getSentFriendRequests()
        } else {
          setMessage(result.data.response);
          setShowSnackbar(true)
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const declineRequest = (userid) => {
    axios.post(process.env.REACT_APP_API_URL + '/friend/remove', {friendid: userid, userid: user.userInfo.id})
      .then(result => {
        if (result.data.status === 1) {
          setMessage(result.data.response);
          setShowSnackbar(true)
          getReceivedFriendRequests()
          getSentFriendRequests()
        } else {
          setMessage(result.data.response);
          setShowSnackbar(true)
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const sendFriendRequest = (userid) => {
    axios.post(process.env.REACT_APP_API_URL + '/friend/add', {friendid: userid, userid: user.userInfo.id})
      .then(result => {
        if (result.data.status === 1) {
          setMessage(result.data.response);
          setShowSnackbar(true);
          getReceivedFriendRequests()
          getSentFriendRequests()
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const handleFriendSearchDialog = () => {
    setShowFriendSearchDialog(false)
  }

  const getReceivedFriendRequests = async () => {
    await axiosClient.get(`/friend/requests/received?userid=${user.userInfo.id}`)
      .then(result => {
        if (result.data.status === 1) {
          setReceivedRequests(result.data.receivedRequests)
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const getSentFriendRequests = () => {
    axiosClient.get(`/friend/requests/sent?userid=${user.userInfo.id}`)
      .then(result => {
        if (result.data.status === 1) {
          setSentRequests(result.data.sentRequests)
        }
      })
      .catch(error => {
        setMessage('Unable to complete request!');
        setShowSnackbar(true)
      })
  }

  const closeSnackbar = () => {
    setShowSnackbar(false)
  }

  useEffect(() => {
    getReceivedFriendRequests()
    getSentFriendRequests()
  }, [])

  const searchFriend = () => {
    setShowFriendSearchDialog(true);
  }

  return (
    <>
      <MenuPage/>
      <Grid container>
        <Grid item container xs={12} justify="flex-end">
          <Button variant="contained" color="secondary" onClick={searchFriend}>
            <SearchIcon/>
          </Button>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={12} className={classes.marginX}>
          <Typography variant="h4" align="center">
            Received Requests
          </Typography>
        </Grid>
        <Grid item xs={12} justify="center">
          <Grid container alignContent="center" justify="center">
            {receivedRequests !== null && receivedRequests.length > 0 ?
              <Box>
                <Grid container spacing={5} alignContent="center" justify="center">
                  {receivedRequests.map(user => {
                    return <FriendCard
                      requestType={process.env.REACT_APP_FRIEND_REQUEST_TYPE_RECEIVED}
                      rollbackRequest={rollbackRequest}
                      declineRequest={declineRequest}
                      sendFriendRequest={sendFriendRequest}
                      acceptRequest={acceptRequest}
                      showSnackbar={showSnackbar}
                      closeSnackbar={closeSnackbar}
                      message={message}
                      user={user}
                    />
                  })
                  }
                </Grid>
              </Box>
              :
              <Nothing/>
            }
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.marginX}>
          <Typography variant="h4" align="center">
            Sent Requests
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignContent="center" justify="center">
            {sentRequests !== null && sentRequests.length > 0 ?
              <Box>
                <Grid container spacing={5} alignContent="center" justify="center">
                  {sentRequests.map(user => {
                    return <FriendCard
                      requestType={process.env.REACT_APP_FRIEND_REQUEST_TYPE_SENT}
                      rollbackRequest={rollbackRequest}
                      declineRequest={declineRequest}
                      sendFriendRequest={sendFriendRequest}
                      acceptRequest={acceptRequest}
                      showSnackbar={showSnackbar}
                      closeSnackbar={closeSnackbar}
                      message={message}
                      user={user}
                    />
                  })
                  }
                </Grid>
              </Box>
              :
              <Nothing/>
            }
          </Grid>
        </Grid>
      </Grid>
      <FriendSearch
        rollbackRequest={rollbackRequest}
        declineRequest={declineRequest}
        sendFriendRequest={sendFriendRequest}
        acceptRequest={acceptRequest}
        showSnackbar={showSnackbar}
        closeSnackbar={closeSnackbar}
        message={message}
        showDialog={showFriendSearchDialog}
        handleClick={handleFriendSearchDialog}/>
    </>
  )
}

export default FriendsPage;
