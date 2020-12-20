import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { logout } from '../redux/actions/Auth';

const Navbar: React.FC = () => {

  const dispatch = useDispatch();
  return(

    <>
      <Nav className={'my-3'}>
        <NavItem>
          <NavLink href="#">Link</NavLink>
        </NavItem>
        <NavItem>
          <Button outline color={'primary'} onClick={() => {
            dispatch(logout());
          }}>Sign Out</Button>
        </NavItem>
      </Nav>
      <hr />
    </>
  )
  ;
};

export default Navbar;