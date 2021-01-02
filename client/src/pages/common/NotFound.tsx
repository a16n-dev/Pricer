import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Row } from 'reactstrap';

const NotFound = () => {
    
  const history = useHistory();
    
  return (
    <Container>
      <Row className={'mt-5'}>
        <h1>Not Found</h1>
      </Row>
      <Row className={'mt-5'}>
        <p>Oops! The page you were looking for doesn't exist</p>
      </Row>
      <Row>
        <Button outline color={'primary'} onClick={() => history.push('/')}>Go To Dashboard</Button>
      </Row>
    </Container>
  )
  ;
};

export default NotFound;