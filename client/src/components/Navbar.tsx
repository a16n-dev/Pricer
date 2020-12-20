import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { AuthService } from '../util/AuthService';

const Navbar: React.FC = () => {
  const history = useHistory();
  return(

    <>
      <Nav className={'my-3'}>
        <NavItem>
          <NavLink href="#">Link</NavLink>
        </NavItem>
        <NavItem>
          <Button outline color={'primary'} onClick={() => {
            AuthService.signOut();
            history.push('/login');
          }}>Sign Out</Button>
        </NavItem>
      </Nav>
      <hr />
    </>
  )
  ;
};

export default Navbar;