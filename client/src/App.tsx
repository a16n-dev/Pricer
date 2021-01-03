import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'reactstrap';
import Navbar from './components/Navbar';
import { AuthState } from './redux/auth/AuthSlice';
import { hydrateAuth } from './redux/auth/hydrateAuth';

import { fetchProducts } from './redux/product/fetchProducts';
import { RootState, useAppDispatch } from './redux/store';
import { fetchUnits } from './redux/unit/fetchUnits';

import ProtectedRoutes from './routes/ProtectedRoutes';
import PublicRoutes from './routes/PublicRoutes';

const App = () => {

  const {
    resolvingAuthState,
    isAuthenticated,
  } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useAppDispatch();



  useEffect(() => {
    dispatch(hydrateAuth());
  }, [ dispatch ]);

  useEffect(() => {
    if(isAuthenticated){
      dispatch(fetchProducts());
      dispatch(fetchUnits());
    }
  }, [ isAuthenticated ]);

  return (
    <Router>
      <Container>
        {!resolvingAuthState && (isAuthenticated ?
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
