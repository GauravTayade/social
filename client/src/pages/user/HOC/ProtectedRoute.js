import React, {useContext} from 'react';
import UserContext from "../../../contexts/UserContext";
import {Route, useHistory} from 'react-router-dom';


const ProtectedRoute = ({component: Component, ...rest}) => {

  let history = useHistory();
  const userContext = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (userContext.login === true) {
          return <Component {...rest} {...props}/>;
        } else {
          const userData = JSON.parse(localStorage.getItem('userInfo'));
          if (userData && userData.login === true
            && userContext.login === false
            && userContext.timeout < new Date().getTime() / 1000
          ) {
            userContext.login = userData.login;
            userContext.userInfo.id = userData.userInfo.id;
            userContext.userInfo.name = userData.userInfo.name;
            userContext.userInfo.email = userData.userInfo.email;
            return <Component {...rest} {...props}/>;
          } else {
            return (
              history.push("/login")
            );
          }
        }
      }}
    />
  )
}

export default ProtectedRoute;
