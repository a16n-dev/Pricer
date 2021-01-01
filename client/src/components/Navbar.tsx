import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { logout } from '../redux/AuthSlice';

const Navbar: React.FC = () => {

  const dispatch = useDispatch();
  
  return(
    <>
      <Nav className={'my-3'}>
        <NavItem className={'mr-4'}>
          <h4>Pricer</h4>
        </NavItem>
        <NavItem>
          <NavLink href="/">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/recipes">Recipes</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/products">Products</NavLink>
        </NavItem>
        <NavItem className={'ml-auto'}>
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