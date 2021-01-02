import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import { logout } from '../redux/AuthSlice';

const Navbar: React.FC = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const navItems = [
    {link: '/', text: 'Dashboard'},
    {link: '/recipes', text: 'Recipes'},
    {link: '/products', text: 'Products'},
    {link: '/units', text: 'Units'},
  ];

  return(
    <>
      <Nav className={'my-3'}>
        <NavItem className={'mr-4'}>
          <h4>Pricer</h4>
        </NavItem>
        {navItems.map((v, i) => (
          <NavItem>
            <Button color={'link'} onClick={() => history.push(v.link)}>{v.text}</Button>
          </NavItem>
        ))}
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