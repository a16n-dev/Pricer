import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'reactstrap';
import Navbar from './components/Navbar';
import ProtectedRoutes from './routes/ProtectedRoutes';
import PublicRoutes from './routes/PublicRoutes';
import { AuthService } from './util/AuthService';
import { LoggerService } from './util/LoggerService';



const App = () => {

  // TODO: Move this state into redux
  const [ authState, setAuthState ] = useState<boolean>(false);

  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    AuthService.isAuthenticated().then((res) => {
      setAuthState(res);
      setLoading(false);
    }).catch((err) => {
      LoggerService.log(err);
      setLoading(false);
    });
  }, []);


  return (
    <Router>
      <Container>
        {!loading && (authState ?
          <>
            <Navbar/>
            <ProtectedRoutes/>
          </>
          :
          <PublicRoutes/>)
        }
      </Container>
    </Router>
  );
};

export default App;
