import React from 'react';

const UserContext = React.createContext(
  {
              login: false,
              timeout: '',
              userInfo: {
                id: '',
                name: '',
                email: '',
              }
            })

export default UserContext;
