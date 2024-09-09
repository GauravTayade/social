import React, {useEffect, useState, useContext} from 'react';
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import axios from 'axios';
import Carousel from 'react-elastic-carousel';
import PollCardCarousel from "./PollCardCarousel";
import UserContext from "../../../contexts/UserContext";


const poolStyle = makeStyles(theme => ({

  btnRounded: {
    border: '1px solid #e8e8e8',
    borderRadius: '25px',
    padding: '0.5rem 1rem'
  },
  cardShadow: {
    boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px'
  }
}));

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

const PollComponent = (props) => {

  const [pollsData, setPollsData] = useState(null);
  const user = useContext(UserContext);

  useEffect(() => {
    getPolls();
  }, [])

  const pollUpdateVote = (pollId,option) => {
    axios.post(process.env.REACT_APP_API_URL+`/poll/updateVote`,{
      userid: user.userInfo.id,
      pollid:pollId,
      option:option
    })
      .then(response => {
        if(response.data.status ===1){
          getPolls();
        }
      })
      .catch(error => {

      })
  }

  const getPolls = () => {
    axiosClient.get(`/poll/all?userid=${user.userInfo.id}`)
      .then(response => {
        setPollsData(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const classes = poolStyle();

  return (
    <>
      <Box pt={4} pb={2}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h4">
              Pools
            </Typography>
          </Grid>
          <Grid container xs={2} justify="center">
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={props.openDialog} className={classes.btnRounded}>Create Pool</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {pollsData ?
        <Carousel itemsToShow={4} outerSpacing={0} pagination={false} showArrows={true}
                  preventDefaultTouchmoveEvent={false}>
          {pollsData.polls.map(poll => {
            return <PollCardCarousel pollUpdateVote={pollUpdateVote} pollData={poll}/>
          })
          }
        </Carousel>
        :
        ''
      }
    </>
  )
}

export default PollComponent;


