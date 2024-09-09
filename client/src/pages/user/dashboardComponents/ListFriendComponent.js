import React from 'react'
import {Box, Card, CardContent, Grid, List, ListItem, Typography, Button} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import {DeleteForever} from "@material-ui/icons";
import {Close} from "@material-ui/icons";
import AvatarComponent from "./AvatarComponent";
import {makeStyles} from "@material-ui/core/styles";

const ListComponentStyle = makeStyles(theme => ({
  avatarSm: {
    width: '35px',
    height: '35px'
  },
  btnClose: {
    paddingRight: '1rem',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  btnSettings: {
    margin: 'auto',
    color: 'rgba(0,0,0,0.54)'
  },
  cardShadow: {
    boxShadow: 'rgba(0,0,0,0.24) 0px 3px 8px'
  },
  friendlistCard:{
    marginRight:'3rem ',
  }
}))

const ListFriendComponent = (props) =>{

  const classes = ListComponentStyle();
  const imagPath = "/assets/photos/65338712f1d88aa91c7d53e73f1596addb4caad7.png";

  return(
    <Grid item xs={3} className={classes.friendlistCard}>
      <Box className={classes.cardShadow}>
        <Card xs={4} elevation="0">
          <Box px={3} py={1} borderBottom={1}>
            <Grid container>
              <Grid item xs={9}>
                <Typography variant="h5" component="h5">
                  {props.listData.name}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" component="h6">
                  {props.listData.friends.length} friends
                </Typography>
              </Grid>
              <Grid item xs={3} mx={2} className={classes.btnSettings}>
                <Grid container>
                  <Grid item xs={6}>
                    <Button>
                      <SettingsIcon/>
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button onClick={()=>props.deleteFriendList()}>
                      <DeleteForever/>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <CardContent>
            <List>
              {props.listData.friends.map(friend=>{
                return (
                  <ListItem>
                  <Close className={classes.btnClose}/>
                  <AvatarComponent imageUrl={imagPath} username={friend.name}/>
                </ListItem>
                )
              })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  )

}

export default  ListFriendComponent;
