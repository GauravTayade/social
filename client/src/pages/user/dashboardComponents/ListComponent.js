import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Grid,
  Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DialogCreateFriendList from "./DialogCreateFriendList";
import ListFriendComponent from "./ListFriendComponent";
import axios  from "axios";

const ListComponentStyle = makeStyles(theme=>({
  btnRounded: {
    border: '1px solid #e8e8e8',
      borderRadius: '25px',
      padding: '0.5rem 1rem'
  },
}))

const ListComponent = (props) => {

  const [isFriendListDialogOpen, setIsFriendListDialogOpen] = useState(false);
  const [friendList,setFriendList] = useState(null);
  const classes = ListComponentStyle();
  const axiosClient = new axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  })

  const openFriendListDialog = () => {
    setIsFriendListDialogOpen(true)
  }

  const closeFriendListDialog = () => {
    setIsFriendListDialogOpen(false)
  }

  const getFriendList = () =>{
    axiosClient.get('/friend/friendList/getFriendLists')
      .then(response=>{
        if(response.data.response){
          setFriendList(response.data.response);
        }
      })
      .catch(error=>{

      })
  }

  const deleteFriendList = (listId) =>{
      axiosClient.post('/friend/friendList/deleteFriendList',{listId:listId})
        .then(response=>{
          console.log(response);
        })
  }

  useEffect(()=>{
    getFriendList()
  },[])

  return (
    <>
      <Grid item xs={12}>
        <Box pt={4} pb={2}>
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h4">
                Friend List
              </Typography>
            </Grid>
            <Grid item container xs={2} justify="center">
              <Box display="flex" justifyContent="flex-end">
                <Button onClick={openFriendListDialog} className={classes.btnRounded}>Create List</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container>
            {friendList?
              friendList.map(list=>{
                return  <ListFriendComponent listData={list} deleteFriendList={()=>deleteFriendList(list.id)}/>
              })
              :
              'No List to display'
            }
          </Grid>
        </Box>
      </Grid>
      <DialogCreateFriendList
        dialogStatus={isFriendListDialogOpen}
        closeDialog={closeFriendListDialog}/>
    </>
  )

}

export default ListComponent;
