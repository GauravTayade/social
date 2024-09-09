import React from "react";
import {MuiThemeProvider} from "@material-ui/core";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import {theme} from "./themes/theme";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import FriendsPage from "./pages/user/Friends";
import OpinionPage from "./pages/user/Opinion";
import FriendsPoolPage from "./pages/user/Opinion";
import ProfilePage from "./pages/user/Profile";
import DashboardPage from "./pages/user/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";
import ProtectedRoute from "./pages/user/HOC/ProtectedRoute";
import UserContext from "./contexts/UserContext";

function App() {

  const userObj = {
                    login: false,
                    timeout: '',
                    userInfo: {
                      id: '',
                      name: '',
                      email: '',
                    }
                  }

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={SignupPage}/>
          <Route path="/login" exact component={LoginPage}/>
          <UserContext.Provider value={userObj}>
            <ProtectedRoute path="/user/dashboard" component={DashboardPage}/>
            <ProtectedRoute path="/user/friends" exact component={FriendsPage}/>
            <ProtectedRoute path="/user/friends-pool" exact component={FriendsPoolPage}/>
            <ProtectedRoute path="/user/opinion" exact component={OpinionPage}/>
            <ProtectedRoute path="/user/:user_id/profile" exact component={ProfilePage}/>
          </UserContext.Provider>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
