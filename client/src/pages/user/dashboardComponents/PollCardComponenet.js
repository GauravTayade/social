import React, {useState} from 'react';
import {Box, Button, Card, CardContent, CardMedia, Grid, Typography, CardActions} from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {makeStyles} from "@material-ui/core/styles";
import axios from 'axios';
import '../../utility/AlertSnackbar';
import DialogCreatePoll from "./DialogCreatePoll";


const poolStyle = makeStyles(theme => ({
  cardShadow: {
    boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px'
  },
  imgSize:{
    height:'200px',
    width:'200px',
    objectFit:'scale-down'
  }
}));

const PollCardComponent = (props) => {

  const classes = poolStyle();
  const [pollData, setPollData] = useState();
  const [dialogStatus, setDialogStatus] = useState(false);

  const closeDialog = () => {
    setDialogStatus(false)
  }

  const openDialog = () => {
    setDialogStatus(true)
  }

  const getPollData = (pollId) => {
    axios.get(process.env.REACT_APP_API_URL + `/poll/get/` + pollId)
      .then(response => {
        setPollData(response.data);
        openDialog()
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <React.Fragment>
      <Grid item xs={3} spacing={2}>
        <Box className={classes.cardShadow} ml={2} my={4}>
          <Card elevation={0}>
            <Box pt={4} pb={1} justifyContent="center">
              <Typography variant="subtitle1" component="h6" color="textSecondary" align="center">
                { props.poll.votes?
                  parseInt(props.poll.votes.count1)  + parseInt(props.poll.votes.count2)
                  :
                  0
                }
                &nbsp; Answers
              </Typography>
              <Typography variant="h6" className={classes.capfirst} component="h6" align="center">
                {props.poll.poll.pollQuestion}
              </Typography>
            </Box>
            <Box px={4}>
              <Grid container>
                {props.poll.poll.images.map(image => {
                  return (
                    <Grid item xs={6}>
                      <Box pr={1}>
                        <CardMedia
                          className={classes.imgSize}
                          component="img"
                          image={image}/>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
            <CardContent>
              <Grid container>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    {props.poll.votes && props.poll.votes.option1.length > 0 ?
                      <Box>
                        <Grid item container justify="center">
                          <Grid item xs={3}>
                            <Box>
                              <FavoriteIcon onClick={()=>props.pollUpdateVote(props.poll.poll._id,1)} style={{color: '#EE1289'}}/>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box mr={10}>
                              {props.poll.votes.count1}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      :
                      <FavoriteBorderIcon onClick={()=>props.pollUpdateVote(props.poll.poll._id,1)}/>
                    }
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center">
                    {props.poll.votes && props.poll.votes.option2.length > 0 ?
                      <Box>
                        <Grid item container justify="center">
                          <Grid item xs={3}>
                            <Box>
                              <FavoriteIcon onClick={()=>props.pollUpdateVote(props.poll.poll._id,2)} style={{color: '#EE1289'}}/>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box mr={10}>
                              {props.poll.votes.count2}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      :
                      <FavoriteBorderIcon onClick={()=>props.pollUpdateVote(props.poll.poll._id,2)}/>
                    }
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center" mb={3}>
                    <Button onClick={() => getPollData(props.poll.poll._id)} color="secondary" variant="outlined">
                      Update
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" justifyContent="center" mb={3}>
                    <Button color="secondary" variant="outlined"
                            onClick={() => props.deletePoll(props.poll.poll._id)}>
                      Delete
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Box>
      </Grid>
      <DialogCreatePoll
        dialogStatus={dialogStatus}
        closeDialog={closeDialog}
        data={pollData}/>
  </React.Fragment>
  )
}

export default PollCardComponent;


