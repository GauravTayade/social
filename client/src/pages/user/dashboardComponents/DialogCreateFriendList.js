import React, {useEffect, useState,useContext} from 'react';
import axios from "axios";
import AvatarComponent from "./AvatarComponent";
import AlertSnackbar from "../../utility/AlertSnackbar";
import UserContext from "../../../contexts/UserContext";
import {makeStyles} from "@material-ui/core/styles";

import {Dialog, DialogContent, DialogTitle, Grid, DialogActions, Button, Typography, Box, TextField, FormControl,
  ListItem, List} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
})

const dialogStyle = makeStyles(theme => ({
  root: {
    overflow: "hidden",
  },
  label: {
    marginBottom: "0.3rem",
    display: "inline-block"
  },
  dialogBottom: {
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  btnBlack: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '25px',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    paddingRight: '2rem',
    paddingLeft: '2rem'
  },
  btnCloseDialog: {
    right: '5px',
    position: 'absolute',
    top: '5px'
  },
  btnAdd: {
    marginLeft: '1rem',
    borderRadius: '1rem',
  },
  avatarSm: {
    width: '35px',
    height: '35px'
  },
  btnClose: {
    paddingRight: '1rem',
    color: 'rgba(0, 0, 0, 0.54)'
  },
}))

const DialogCreateFriendList = (props) => {

  const classes = dialogStyle();
  const imagPath = "/assets/photos/65338712f1d88aa91c7d53e73f1596addb4caad7.png";
  const [friends,setFriends] = useState(0);
  const [friendsFiltered,setFriendsFiltered] = useState(0);
  const [friendList,setFriendList] = useState({name:'',friends:[]});
  const [userList,setUserList] = useState([]);
  const [isAlertOpen,setIsAlertOpen] = useState(false);
  const [alertMessage,setAlertMessage] = useState("");
  const user = useContext(UserContext);

  useEffect(()=>{
    axiosClient.get(`/friend/getOnline?userid=${user.userInfo.id}`)
      .then(response => {
        setFriends(response.data.friends);
        setFriendsFiltered(response.data.friends);
      })
      .catch(error => {
        console.log(error)
      })
  },[]);

  const addFriend = async(userId) => {
    if(!userList.includes(userId)){
      const tempArray = userList;
      tempArray.push(userId);
      setUserList([...tempArray]);
    }
  }

  const removeFriend = (userId) => {
    if(userList.includes(userId)){
      const tempList = [...userList];
      tempList.splice(tempList.indexOf(userId),1);
      setUserList(tempList);
    }
  }

  const setListName = (e) =>{
    setFriendList({...friendList,name:e.target.value});
  }

  const filterList = (e) =>{
    const filteredList = friends.filter(friend => friend.name.toLowerCase().includes(e.target.value.toLowerCase()));
    if(filteredList.length > 0){
      setFriendsFiltered(filteredList);
    }else{
      setFriendsFiltered(friends);
    }
  }

  const createList = () =>{
    setFriendList({...friendList,friends: userList});
    if(friendList.name !== '' && friendList.friends.length > 0){
      axiosClient.post('/friend/friendList/create', {'userid': user.userInfo.id,'friendList':friendList})
        .then(result => {
          setIsAlertOpen(true);
          setAlertMessage(result.data.message);
          setUserList([]);
          setFriendList({...friendList,name: '',friends: []});
        })
        .catch(error => {
            setIsAlertOpen(true);
            setAlertMessage(error);
        })
    }else{

    }
  }

  const onclose = () =>{
    setIsAlertOpen(false);
  }

  return (
    <>
      <Dialog open={props.dialogStatus} fullWidth={true} maxWidth="md">
        <DialogTitle id="customized-dialog-title">
          <Typography variant="h4" align="center">
            Create a Friend List
          </Typography>
          <CloseIcon className={classes.btnCloseDialog} onClick={props.closeDialog}/>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <label className={classes.label}>Friend List Name:</label>
                  </Typography>
                  <TextField
                    onChange={setListName}
                    value={friendList.name}
                    required
                    fullWidth
                    name='listName'
                    id='listName'
                    type='text'
                    variant='outlined'
                    label='Friend List Name'/>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <label className={classes.label}>Friends</label>
                  </Typography>
                  <FormControl variant='outlined' fullWidth>
                    <TextField
                      required
                      fullWidth
                      onChange={filterList}
                      name='friendSearch'
                      id='friendSearch'
                      type='text'
                      variant='outlined'
                      label='Search friend by name'/>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <List>
                {
                  friendsFiltered?
                    friendsFiltered.map(friend=>{
                    return (
                      <ListItem>
                        <Grid container>
                          <Grid item xs={8}>
                            <Box display="flex">
                              <AvatarComponent imageUrl={imagPath} username={friend.name}/>
                            </Box>
                          </Grid>
                          {!userList.includes(friend._id)?
                            <Grid item xs={4}>
                              <PersonAddIcon onClick={()=>addFriend(friend._id)}/>
                            </Grid>
                          :
                            <Grid item xs={4}>
                              <CloseIcon onClick={()=>removeFriend(friend._id)}/>
                            </Grid>
                          }
                        </Grid>
                      </ListItem>
                    )
                  })
                  :
                  ''
                }
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogBottom}>
          <Box alignItems="center">
            <Button variant="contained" onClick={createList} className={classes.btnBlack}>CREATE</Button>
          </Box>
        </DialogActions>
      </Dialog>
      <AlertSnackbar status={isAlertOpen} message={alertMessage} onclose={onclose}/>
    </>
  )
}

export default DialogCreateFriendList;
