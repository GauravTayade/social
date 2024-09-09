import React, {useEffect, useState, useContext} from 'react'
import {
  Box,
  Grid,
  Typography,
  Button
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";

import PollCardComponent from "./dashboardComponents/PollCardComponenet";
import AlertSnackbar from "../utility/AlertSnackbar";
import UserContext from "../../contexts/UserContext";
import {Link} from "react-router-dom";
import Menu from "./Menu";

const profileStyle = makeStyles(theme => ({
  profilePicture: {
    height: '256px',
    width: '256px',
    border: '5px solid white',
    borderRadius: '1rem',
    position: 'absolute',
    bottom: '2rem',
    transitionProperty: 'bottom',
    transitionDuration: '0.4s',
    transitionTimingFunction: 'ease-in',
    '&:hover': {
      bottom: '2.5rem',
    }
  },
  profileHeader: {
    minHeight: '35rem',
    position: 'relative',
    backgroundImage: 'url("/assets/images/profile-background.jpg")',
    backgroundPosition: 'center top',
    backgroundAttachment: 'fixed',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  btnCommon: {
    marginTop: '1rem',
    padding: '0.5rem 1rem'
  },
  linkStyle: {
    textDecoration: 'none'
  },
  pollCard: {
    maxWidth: '345px',
    boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px'
  }
}))

const ProfilePage = (props) => {

  const user = useContext(UserContext);

  const classes = profileStyle();
  const [polls, setPolls] = useState();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [response, setResponse] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
  }

  const closeSnackbar = () => {
    setShowSnackbar(false)
  }

  const pollUpdateVote = (pollId, option) => {
    axios.post(process.env.REACT_APP_API_URL + `/poll/updateVote`, {
      userid: user.userInfo.id,
      pollid: pollId,
      option: option
    })
      .then(response => {
        if (response.data.status === 1) {
          getPolls();
        }
      })
      .catch(error => {

      })
  }

  const deletePoll = (pollid) => {
    axios.post(process.env.REACT_APP_API_URL + '/poll/delete', {'pollId': pollid})
      .then(response => {
        if (response.data.status === 1) {
          setResponse(response.data)
          setShowSnackbar(true);
          getPolls();
        }
      })
      .catch(error => {
        setResponse({message: 'Something went wrong! Please try again.'})
        setShowSnackbar(true);
      })
  }

  const getPolls = () => {
    axios.get(process.env.REACT_APP_API_URL + `/poll/all?userid=${user.userInfo.id}`)
      .then(response => {
        setPolls(response.data);
        console.log(response.data);
      })
      .catch(error => {
        setResponse({message: 'Something went wrong! Please try again.'})
        setShowSnackbar(true);
      })
  }

  const getUser = () => {
    axios.get(process.env.REACT_APP_API_URL + `/user/get/${props.match.params.user_id}`)
      .then(response => {
        if (response.data.status === 1) {
          setUserProfile(response.data.response)
        }
      })
      .catch(error => {
        setResponse({message: 'Something went wrong! Please try again.'})
        setShowSnackbar(true);
      })
  }

  const sendFriendRequest = (friend) => {
    axios.post(process.env.REACT_APP_API_URL + '/friend/add', {friendid: friend._id, userid: user.userInfo.id})
      .then(result => {
        if (result.data.status === 1) {
          setResponse({message: result.data.response})
          setShowSnackbar(true);
        } else {
          setResponse({message: 'Something went wrong! Please try again.'})
          setShowSnackbar(true);
        }
      })
      .catch(error => {
        setResponse({message: 'Something went wrong! Please try again.'})
        setShowSnackbar(true);
      })
  }

  useEffect(() => {
    if (user.userInfo.id === props.match.params.user_id) {
      getPolls();
      console.log(user);
    } else {
      getUser();
    }
  }, [])

  return (
    <>
      <Menu openDialog={openDialog} dialogStatus={isDialogOpen} closeDialog={closeDialog}/>
      {user.login && user.userInfo.id === props.match.params.user_id ?
        <Box>
          <Grid container>
            <Grid container xs={12} className={classes.profileHeader} justify="center">
              <img alt="profile" className={classes.profilePicture}
                   src="https://image.freepik.com/free-vector/profile-icon-male-avatar-hipster-man-wear-headphones_48369-8728.jpg"/>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
              <Typography variant="h2" component="h2" align="center">
                {user.userInfo.name}
              </Typography>
              <Typography variant="h5" component="h5" align="center">
                Oakville, ON
              </Typography>
              <Grid container xs={12} justify="center">
                <Link className={classes.linkStyle} to='/user/dashboard'>
                  <Button className={classes.btnCommon} variant="contained" color="primary">Dashboard</Button>
                </Link>
              </Grid>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
          <Grid container xs={12} justify="center">
            {polls ?
              polls.polls.map(poll => {
                return <PollCardComponent pollUpdateVote={pollUpdateVote} poll={poll} deletePoll={deletePoll}/>
              })
              :
              'no polls'
            }
          </Grid>
        </Box>
        :
        <Box>
          {userProfile ?
            <Grid container>
              <Grid item container xs={12} className={classes.profileHeader} justify="center">
                <img alt="profile" className={classes.profilePicture}
                     src="https://www.pearsoncollege.ca/wp-content/uploads/2019/12/placeholder-profile.jpg"/>
              </Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <Typography variant="h2" component="h2" align="center">
                  {userProfile.name}
                </Typography>
                <Typography variant="h5" component="h5" align="center">
                  {userProfile.email}
                </Typography>
              </Grid>
              <Grid item xs={3}></Grid>
              <Grid item container xs={12} justify="center">
                <Button className={classes.btnCommon} onClick={() => sendFriendRequest(userProfile)} variant="contained"
                        color="primary">Send Friend Request</Button>
              </Grid>
              <Grid container xs={12} justify="center">
                <Button className={classes.btnCommon} variant="contained" color="primary">Send Message</Button>
              </Grid>
            </Grid>
            :
            ''
          }
        </Box>
      }
      <AlertSnackbar status={showSnackbar} message={response.message} onclose={closeSnackbar}/>
    </>
  )
}

export default ProfilePage;
