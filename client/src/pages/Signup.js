import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import {TextField, Grid, Box, Typography, Button, Hidden, Select, MenuItem} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

import AlertSnackbar from "./utility/AlertSnackbar";
import Menu from "./Menu";

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001/'
})

const signupStyle = makeStyles(theme => ({
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  header: {
    marginBottom: '1.5rem'
  },
  label: {
    paddingRight: "1rem",
    marginBottom: "0.3rem",
    display: "inline-block"
  },
  loginContent: {
    maxWidth: "450px"
  },
  loginImage: {
    background: "url('./assets/photos/f1d2e32ad77c9c983af281c12eee46567109a4f6.png')",
    backgroundPosition: "center",
    backgroundSize: "cover"
  },
  loginButton: {
    borderRadius: '50px',
    backgroundColor: 'black',
    padding: '.5rem',
    width: '8rem',
    fontSize: '1rem'
  }
}));


const SignupPage = () => {

  const classes = signupStyle();
  const inputel = useRef(null);
  const [errors, setErrors] = useState({
    errors: ''
  })

  const [success, setSuccess] = useState({result: ''});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    gender:''
  });

  useEffect(() => {
    document.title = "Signup"
  }, []);

  const closeSnackbar = () => {
    setShowSnackbar(false)
  }

  const setInput = (e) => {
    setUserInfo({
      ...userInfo, [e.target.name]: e.target.value
    })
  }

  const validate = () => {

    setErrors({errors: ''})

    if (userInfo.name === ''
      || userInfo.email === ''
      || userInfo.password === ''
      || userInfo.confirm === '') {

      setErrors({
        errors: 'Fill all required fields'
      })

      setShowSnackbar(true);
      return false;
    } else if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(userInfo.email) === false) {

      setErrors({
        ...errors, errors: '\n Please enter valid email Address'
      })

      setShowSnackbar(true);
      return false;
    } else if (userInfo.password.length < 6) {

      setErrors({
        ...errors, errors: '\n Password must be more then 6 character long'
      })

      setShowSnackbar(true);
      return false;
    } else if (userInfo.password !== userInfo.confirm) {

      setErrors({
        ...errors, errors: '\n Password and confirm does not match'
      })

      setShowSnackbar(true);
      return false;
    } else {
      return true;
    }
  }


  const register = (e) => {

    e.preventDefault();
    console.log('tandc', inputel.current.checked);
    if (document.getElementById('checkTC').checked === false) {
      setShowSnackbar(true);
      setErrors({errors: 'Check terms and condition checkbox'});
    } else {
      if (validate()) {
        axiosClient.post('user/register', {
          userInfo
        })
          .then(response => {
            setUserInfo({
              name: '',
              email: '',
              password: '',
              confirm: '',
              gender:''
            })
            if (response.status === 201) {
              setShowSnackbar(true)
              setSuccess({result: 'Your Account has been created'})
            }
          })
          .catch(errors => {
            console.log(errors);
          })
      } else {
        console.log("failed");
      }
    }
  }

  return (
    <>
      <Menu/>
      <Grid container style={{minHeight: "100vh"}}>
        <Grid item xs={12} md={6} className={classes.loginContainer}>
          <Box className={classes.loginContent}>
            <Box className={classes.header}>
              <Typography variant="h3" component="h3">
                Create an account
              </Typography>
            </Box>
            <form autoComplete="off" onSubmit={register}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <label className={classes.label}>YOUR NAME</label>
                  <TextField
                    fullWidth
                    required
                    type="text"
                    id="name"
                    variant="outlined"
                    label="name"
                    name="name"
                    value={userInfo.name}
                    onChange={setInput}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <label className={classes.label}>EMAIL ADDRESS</label>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    id="email"
                    variant="outlined"
                    label="email"
                    name="email"
                    value={userInfo.email}
                    onChange={setInput}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <label className={classes.label}>PASSWORD</label>
                  <TextField
                    fullWidth
                    required
                    inputProps={{
                      minLength: 6
                    }}
                    type="password"
                    id="password"
                    variant="outlined"
                    label="password"
                    name="password"
                    value={userInfo.password}
                    onChange={setInput}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <label className={classes.label}>CONFIRM PASSWORD</label>
                  <TextField
                    fullWidth
                    required
                    inputProps={{
                      minLength: 6
                    }}
                    type="password"
                    id="confirm"
                    variant="outlined"
                    label="confirm"
                    name="confirm"
                    value={userInfo.confirm}
                    onChange={setInput}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <label className={classes.label}>Gender</label>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="gender"
                    value={userInfo.gender}
                    onChange={setInput}>
                    <MenuItem value="0">--Select--</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Unknown">Wish not to Specify</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={12}>
                  <input type="checkbox" name="checkTC" id="checkTC" ref={inputel}/>
                  <label>by signing up I agree with terms and condition</label>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" className={classes.loginButton} variant="contained"
                          color="primary">CREATE</Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
        <Hidden xsDown>
          <Grid item display={{xs: 'none'}} xs={12} md={6} className={classes.loginImage}>
          </Grid>
        </Hidden>
      </Grid>
      {errors.errors ?
        <AlertSnackbar status={showSnackbar} message={errors.errors} onclose={closeSnackbar}/>
        :
        ''
      }
      {success.result ?
        <AlertSnackbar status={showSnackbar} message={success.result} onclose={closeSnackbar}/>
        :
        ''
      }
    </>
  )
}

export default SignupPage;
