import React, {useState, useContext, useEffect, useRef} from 'react';
import UserContext from "../../../contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import '../../utility/AlertSnackbar';
import AlertSnackbar from "../../utility/AlertSnackbar";
import {useHistory} from "react-router-dom";

const dialogStyle = makeStyles(theme => ({
  label: {
    marginBottom: "0.3rem",
    display: "inline-block"
  },
  imgPreview: {
    height: '200px',
    width: '200px',
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  },
  dropper: {
    height: '200px',
    width: '200px',
    border: '1px solid #e8e8e8',
    backgroundImage: 'url(/assets/photos/image_placeholder.png)',
    backgroundSize: "contain",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: "center",
    margin: '2rem',
    objectFit: 'scale-down'
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
  closeBtn: {
    right: '5px',
    position: 'absolute',
    top: '5px'
  }
}))

const DialogCreatePoll = (props) => {

  const classes = dialogStyle();
  const uHistory = useHistory();
  const userContext = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [poll, setPoll] = useState({
    poll: {
      pollUser: '',
      pollQuestion: '',
      pollFriendList: '',
      images: ''
    }
  })
  const file1 = useRef(null);

  const closeSnackbar = () => {
    setShowSnackbar(false)
  }

  useEffect(() => {
    setPoll({poll: {...poll.poll, pollUser: userContext.userInfo.id}});
  }, [])

  useEffect(() => {
    if (props.data) {
      setPoll({poll: {...props.data.poll}});
    }
  }, [props.data])

  const dragOver = (e) => {
    e.preventDefault();
  }
  const dragEnter = (e) => {
    e.preventDefault();
  }
  const dragLeave = (e) => {
    e.preventDefault();
  }

  const handleFileDrop = (e, p) => {
    e.preventDefault();
    var reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        e.target.setAttribute("src", reader.result)
      }
    }
    reader.readAsDataURL(e.dataTransfer.files[0]);
    let items = [...images];
    items[p] = e.dataTransfer.files[0];
    setImages([...items])
  }

  const handleInput = (e) => {
    setPoll({poll: {...poll.poll, pollQuestion: e.target.value}});
  }

  const handleSelect = (e) => {
    setPoll({poll: {...poll.poll, pollFriendList: e.target.value}})
  }

  const openFileUpload = () => {
    file1.current.click()
  }

  useEffect(()=>{
    console.log(localStorage.getItem('userInfo'));
  })

  const createPoll = async () => {

    let formData = new FormData();
    formData.set('pollQuestion', poll.poll.pollQuestion);
    formData.set('pollFriendList', poll.poll.pollFriendList);
    formData.set('pollUser', poll.poll.pollUser);
    formData.append('file', images[0]);
    formData.append('file', images[1]);

    axios.post('http://localhost:3001/poll/create', formData)
      .then(response => {
        if (response.data.status === 1) {
          setShowSnackbar(true);
          setApiResponse(response.data.message);
          images.splice(0, images.length);
          props.closeDialog();
          window.location.reload(false);
        } else {

        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const updatePoll = (pollId) => {

    let formData = new FormData();
    formData.set('pollId', pollId);
    formData.set('pollQuestion', poll.poll.pollQuestion);
    formData.set('pollFriendList', poll.poll.pollFriendList);
    formData.set('pollUser', poll.poll.pollUser);
    if (images.length > 0) {
      formData.append('file', images[0]);
      formData.append('file', images[1]);
    }

    axios.post('http://localhost:3001/poll/update', formData)
      .then(response => {
        if (response.data.status === 1) {
          setShowSnackbar(true);
          setApiResponse(response.data.message);
          images.splice(0, images.length);
          props.closeDialog();
          window.location.reload(false);
        } else {

        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <>
      <Dialog open={props.dialogStatus} fullWidth={true} maxWidth="md">
        <DialogTitle id="customized-dialog-title">
          {props.data ?
            <Typography variant="h4" align="center">
              Update a Poll
            </Typography>
            :
            <Typography variant="h4" align="center">
              Create a Poll
            </Typography>
          }
          <CloseIcon className={classes.closeBtn} onClick={props.closeDialog}/>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <label className={classes.label}>Question:</label>
                  </Typography>
                  <TextField
                    required
                    fullWidth
                    name='question'
                    id='question'
                    type='text'
                    variant='outlined'
                    label='Question'
                    value={poll.poll ?
                      poll.poll.pollQuestion
                      :
                      ''
                    }
                    onChange={handleInput}/>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    <label className={classes.label}>Friend List</label>
                  </Typography>
                  <FormControl variant='outlined' fullWidth>
                    <InputLabel>Friend List</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Age"
                      name="friendList" onChange={handleSelect}>
                      <option value="">--Select Friend list---</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={7}>
              <Grid container>
                <img id="img0" className={classes.dropper}
                     onClick={openFileUpload}
                     onDragOver={dragOver}
                     onDragEnter={dragEnter}
                     onDragLeave={dragLeave}
                     onDrop={(e) => handleFileDrop(e, 0)}
                     src={poll.poll.images[0] ? poll.poll.images[0] : ''}/>
                <input type="file" name="image1" ref={file1} style={{"display": 'none'}} required/>

                <img id="img0" className={classes.dropper}
                     onDragOver={dragOver}
                     onDragEnter={dragEnter}
                     onDragLeave={dragLeave}
                     onDrop={(e) => handleFileDrop(e, 1)}
                     src={props.data ? props.data.poll.images[1] :
                       images[1] ? images[1] : ''}/>

                <input type="file" style={{"display": 'none'}} name="image2" required/>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogBottom}>
          <Box alignItems="center">
            {props.data ?
              <Button variant="contained" onClick={() => updatePoll(props.data.poll._id)}
                      className={classes.btnBlack}>Update</Button>
              :
              <Button variant="contained" onClick={createPoll} className={classes.btnBlack}>CREATE</Button>
            }
          </Box>
        </DialogActions>
      </Dialog>
      <AlertSnackbar status={showSnackbar} message={apiResponse} onclose={closeSnackbar}/>
    </>
  )

}

export default DialogCreatePoll;
