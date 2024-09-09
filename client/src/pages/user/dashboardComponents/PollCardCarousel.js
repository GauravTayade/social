import React from 'react';
import {Box, Card, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import {makeStyles} from "@material-ui/core/styles";
import FavoriteIcon from "@material-ui/icons/Favorite";

const pollCardCarousalStyle = makeStyles({
  cardShadow: {
    boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px'
  },
  cardPoll: {
    maxWidth: '420px',
    margin: '10px'
  },
  imgSize:{
    height:'200px',
    width:'200px',
    objectFit:'scale-down'
  }
});

const PollCardCarousel = (props) => {

  const poll = props.pollData;

  const classes = pollCardCarousalStyle();
  return (
    <Grid item xs={12}>
      <Box className={[classes.cardShadow, classes.cardPoll]}>
        <Card elevation="0">
          <Box pt={4} pb={1} justifyContent="center">
            <Typography variant="h6" component="h6" align="center">
              {poll.poll.pollQuestion}
            </Typography>
            <Typography variant="subtitle1" component="h6" color="textSecondary" align="center">
              { poll.votes?
                parseInt(poll.votes.count1)  + parseInt(poll.votes.count2)
                :
                0
              } Answers
            </Typography>
          </Box>
          <Box px={4}>
            <Grid container>
              {
                poll.poll.images.map(image => {
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
                })
              }
            </Grid>
          </Box>
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center">
                  {poll.votes && poll.votes.option1.length > 0 ?
                    <Box>
                      <Grid item container justify="center">
                        <Grid item xs={3}>
                          <Box>
                            <FavoriteIcon onClick={()=>props.pollUpdateVote(poll.poll._id,1)} style={{color: '#EE1289'}}/>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box mr={10}>
                            {poll.votes.count1}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    :
                    <FavoriteBorderIcon onClick={()=>props.pollUpdateVote(poll.poll._id,1)}/>
                  }
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="center">
                  {poll.votes && poll.votes.option2.length > 0 ?
                    <Box>
                      <Grid item container justify="center">
                        <Grid item xs={3}>
                          <Box>
                            <FavoriteIcon onClick={()=>props.pollUpdateVote(poll.poll._id,2)} style={{color: '#EE1289'}}/>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box mr={10}>
                            {poll.votes.count2}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    :
                    <FavoriteBorderIcon onClick={()=>props.pollUpdateVote(poll.poll._id,2)}/>
                  }
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Grid>

  )

}

export default PollCardCarousel;
