import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'reactstrap';
import Navbar from './components/Navbar';
import ProtectedRoutes from './routes/ProtectedRoutes';
import PublicRoutes from './routes/PublicRoutes';
import { AuthService } from './util/AuthService';
import { LoggerService } from './util/LoggerService';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from './redux/types';
import { LOGIN } from './redux/constants/actionTypes';

const App = () => {

  // TODO: Move this state into redux
  const authState = useSelector((state : rootState) => state.isAuthenticated);
  const dispatch = useDispatch();

  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    AuthService.isAuthenticated().then((res) => {
      dispatch({ type: LOGIN });
      setLoading(false);
    }).catch((err) => {
      LoggerService.log(err);
      setLoading(false);
    });
  }, [ dispatch ]);

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
