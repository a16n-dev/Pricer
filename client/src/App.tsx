import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';

import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import { AuthService } from './util/AuthService';
import { LoggerService } from './util/LoggerService';


const App = () => {
  
  console.log(Auth);

  // TODO: Move this into redux
  const [ authState, setAuthState ] = useState<boolean>(false);

  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    AuthService.isAuthenticated().then((res) => {
      console.log(res);
      setAuthState(res);
      setLoading(false);
    }).catch((err) => {
      LoggerService.log(err);
      setLoading(false);
    });
  }, []);


  return (
    <Container>
      {!loading && (authState ?
        <>
          <Navbar/>
          <h1>You are logged in!</h1>
        </>
        :
        <Login setAuthState={setAuthState}/>
      )}
      
    </Container>
  );
};

export default App;
