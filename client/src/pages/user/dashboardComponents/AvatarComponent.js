import React from "react";
import {Avatar, Badge, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const avatarStyle = makeStyles(theme => ({
  username: {
    marginLeft: '0.5rem !important'
  },
  badgeCustom: {
    backgroundColor: "#44b700"
  }
}));

const AvatarComponent = (props) => {

  const classes = avatarStyle();

  return (
    <>
      <Badge classes={{badge: classes.badgeCustom}} overlap="circle" badgeContent=" " variant="dot">
        <Avatar alt="user" src={props.imageUrl}/>
      </Badge>
      <Typography component="h6" variant="h6" className={classes.username}>
        {props.username}
      </Typography>
    </>
  )
}

export default AvatarComponent;
