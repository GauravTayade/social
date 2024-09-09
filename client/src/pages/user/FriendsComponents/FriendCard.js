import React, {useEffect, useState} from 'react'
import {Card, Button, CardContent, Typography, CardMedia, CardActions, Grid} from "@material-ui/core";
import {Link} from 'react-router-dom';

import {makeStyles} from "@material-ui/core/styles";
import CancelIcon from '@material-ui/icons/Cancel';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {CameraFront} from "@material-ui/icons";

import AlertSnackbar from "../../utility/AlertSnackbar";

const friendCardStyle = makeStyles({
  card: {
    margin: 10,
    boxShadow: '#e8e8e8 0px 0px 10px 3px'
  },
  cardMedia: {
    height: 250,
    width: 250,
    backgroundSize: 'contain'
  },
  textDecorationNone: {
    textDecoration: 'none'
  }
});

const FriendCard = (props) => {

  const [userid, setUserid] = useState(null);

  useEffect(() => {
    if (props.user) {
      setUserid(props.user._id)
    }
  }, [])


  const classes = friendCardStyle();
  return (
    <Card className={classes.card} key={userid}>
      <CardMedia
        className={classes.cardMedia}
        image="/assets/images/profile-girl-2.jpg"
        title="profile image"/>
      <CardContent>
        <Typography variant="h5" component="h5">
          {props.user.name.toUpperCase()}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container direction="row" alignItems="center" justify="center">
          <Grid item container justify="center" xs={4}>
            {props.requestType ?
              props.requestType === process.env.REACT_APP_FRIEND_REQUEST_TYPE_SENT ?
                <Button variant="contained" color="secondary" onClick={() => props.rollbackRequest(userid)}>
                  <CancelIcon/>
                </Button>
                :
                <Button variant="outlined" color="secondary" onClick={() => props.declineRequest(userid)}>
                  <CancelIcon/>
                </Button>
              :
              <Button variant="outlined" data-id={userid} color="secondary"
                      onClick={() => props.sendFriendRequest(userid)}>
                <CameraFront/>
              </Button>
            }
          </Grid>
          {props.requestType === process.env.REACT_APP_FRIEND_REQUEST_TYPE_RECEIVED ?
            <Grid item container justify="center" xs={4}>
              <Button variant="outlined" color="secondary" onClick={() => props.acceptRequest(userid)}>
                <CheckCircleIcon/>
              </Button>
            </Grid>
            :
            <Grid item xs={4}>
            </Grid>
          }
          <Grid item container justify="center" xs={4}>
            <Link to={`/user/${props.user._id}/profile`} className={classes.textDecorationNone}>
              <Button variant="outlined" color="secondary">
                <AccountCircleIcon/>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardActions>
      <AlertSnackbar status={props.showSnackbar} message={props.message} onclose={props.closeSnackbar}/>
    </Card>
  )

}

export default FriendCard;
