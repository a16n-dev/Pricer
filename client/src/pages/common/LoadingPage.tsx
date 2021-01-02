import React from 'react';
import { Container, Spinner } from 'reactstrap';

const LoadingPage = () => (
  <Container
    className={'d-flex align-items-center justify-content-center'}
    style={{height: '80vh'}}
  >
    <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}/>
  </Container>
);

export default LoadingPage;