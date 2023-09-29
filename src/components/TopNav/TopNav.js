import React, { Component } from "react";
import './TopNav.css';
import { Avatar, Box, Button, Container, Menu, MenuItem } from "@mui/material";
import { Rectangle } from "@mui/icons-material";
import { Navigate } from 'react-router-dom';

function TopNav(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    window.location.href = "/#/login";
  }
  let url = '';
  if (process.env.REACT_APP_BACKEND_URL) {
    url = 'https://' + process.env.REACT_APP_BACKEND_URL;
  }
  else {
    url = 'http://localhost:3000';
  }
  const handleLogout = async () => {
    let url = `${url}/api/v1/api-keys/`+localStorage.getItem('api_id');
   
    const response = await fetch(url, {
          method: 'DELETE',
          mode: 'no-cors',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });
  
    localStorage.clear();
    window.location.href = "/#/login";
    
  };
  const isAuthenticated = !!localStorage.getItem('authToken');
  return (
    <Box className={"BoxNav"}>
      <Container sx={{ width: '100%', height: '85px', position: 'fixed', top: 0, left: 0 }}>
        <p className={"AppName"}>Travel Log</p>
        <Button
          id="profile-button"
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ position: 'absolute', top: '16px', left: '16px' }}
        >
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" left={0} position={"absolute"} />

        </Button>

        <Menu
          id="profile-menu"
          spacing={2}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'profile-button',
          }}

        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <span>
            {isAuthenticated ? 
            <MenuItem onClick={handleLogout}>Logout</MenuItem> : 
            <MenuItem onClick={handleLogin}>Login</MenuItem>}
          </span>
        </Menu>

      </Container>
    </Box>
  );
}

export default TopNav;
