import React, {useContext, useState, useEffect} from "react";
import {Box, List, ListItem, Typography, Grid} from "@material-ui/core";
import axios from "axios";

import AvatarComponent from "./AvatarComponent";
import {makeStyles} from "@material-ui/core/styles";
import UserContext from "../../../contexts/UserContext";

const avatarStyle = makeStyles(theme => ({
  avatarItem: {
    marginLeft: '0px',
    paddingLeft: '0px'
  }
}));

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

const FriendsListComponent = (props) => {

  const classes = avatarStyle();
  //const imagPath = "/assets/photos/65338712f1d88aa91c7d53e73f1596addb4caad7.png";
  const imagPathFemale = "https://i.pinimg.com/736x/51/53/f7/5153f7f7d0f0e8ef433373eab718ad23.jpg";
  const imagPathMale = "https://i.pinimg.com/564x/ef/42/ed/ef42ed49271887346ddec0663aa3a6ce.jpg";
  const imagPath = "https://i.pinimg.com/564x/ef/d0/ed/efd0ede96927ce2d55c91316e0b695ac.jpg";
  const [friendsList,setFriendList] = useState(0);
  const user = useContext(UserContext);

  useEffect(() => {
    axiosClient.get(`/friend/getOnline?userid=${user.userInfo.id}`)
      .then(response => {
        setFriendList(response.data.friends);
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return (
    <Box ml={6}>
      <Grid container justify="left">
        <Box pt={3} pb={2}>
          <Typography variant="h4">
            Friends
          </Typography>
        </Box>
      </Grid>
      <Grid container justify="left">
        <List>
          {friendsList?
            friendsList.map(friend=>{
              return(
                <ListItem className={classes.avatarItem}>
                  {friend.gender==="Male"?
                    <AvatarComponent imageUrl={imagPathMale} username={friend.name}/>
                    :
                    friend.gender === "Female"?
                      <AvatarComponent imageUrl={imagPathFemale} username={friend.name}/>
                      :
                      <AvatarComponent imageUrl={imagPath} username={friend.name}/>
                  }

                </ListItem>)
            })
            :
            'No Friends'
          }
        </List>
      </Grid>
    </Box>
  )

}

export default FriendsListComponent;
