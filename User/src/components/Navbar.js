import React,{useContext, useEffect,useState} from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import '../bootstrap.min.css'
import {context} from './Context';
import '../css/Navbar.css'
import {FiLogIn} from 'react-icons/fi'
import {BiUser} from 'react-icons/bi'
import {BiLogOut} from 'react-icons/bi'
import axios from "../axios/Axios";

export const NavigationBar=()=> {

  const navigate=useNavigate()
  const cont=useContext(context)
  
  useEffect(()=>{
    if(!cont.verifylogin){
      cont.setVerifyLogin(!cont.verifylogin)
      if(localStorage.getItem("shopeasyuser_token")){
        const token_user=localStorage.getItem("shopeasyuser_token")
        axios.get(`/user/auth/verifytoken/${token_user}`).then((res)=>{
          console.log(res.data)
          if(res.data.status){
            cont.setUserName(res.data.name)
            console.log(res.data.name)
            cont.setUserEmail(res.data.email)
          }
          else{ 
            toast.warning("Session Expired")
            localStorage.removeItem("shopeasyuser_token")
            navigate("/login")
          }
        })
      }
    }
  },[])

   return (
    <div className="container-fluid navbar">
    <Navbar bg="light" expand="lg" fixed="top">
      <div className='container-fluid'>
      <LinkContainer to="/">
        <Navbar.Brand>Shop Easy</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto my-2 my-lg-0">
          <LinkContainer to="/shopping">
            <Nav.Link>Shop</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/Cart">
            <Nav.Link>Cart</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/myorders">
            <Nav.Link>Myorders</Nav.Link>
          </LinkContainer>
          </Nav>
          
          <div className="d-flex gap-3">
            {localStorage.getItem("shopeasyuser_token")?
                   <span id="username">Hello {cont.username}</span> :""}
            {localStorage.getItem("shopeasyuser_token")?
            "":
            <LinkContainer to="/login">
                <Nav.Link><FiLogIn/>SignUp</Nav.Link>
            </LinkContainer>
            }
            {localStorage.getItem("shopeasyuser_token")?
            <LinkContainer to="/logout" id="logout">
                <Nav.Link><BiLogOut/>Logout</Nav.Link>
            </LinkContainer>:
            <LinkContainer to="/login">
                <Nav.Link><FiLogIn/>Login</Nav.Link>
            </LinkContainer>
            }
            
            
            
            
            
          </div>
        
      </Navbar.Collapse>
      </div>
      <ToastContainer/>
    </Navbar>
    </div>
  );
}




