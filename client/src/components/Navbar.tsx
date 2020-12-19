import React from 'react';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { AuthService } from '../util/AuthService';

const Navbar: React.FC = () => (
  <>
    <Nav className={'my-3'}>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <Button outline color={'primary'} onClick={() => AuthService.signOut()}>Sign Out</Button>
      </NavItem>
    </Nav>
    <hr />
  </>
);

export default Navbar;