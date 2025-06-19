import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Box, Button } from '@mui/material';
import { Map, Add, Warning, Logout, Public, TravelExplore, ImageSearch } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Disasters', path: '/', icon: <Warning /> },
  { text: 'Create', path: '/create', icon: <Add /> },
   { text: 'Map', path: '/map', icon: <Public /> },             
  { text: 'FEMA', path: '/fema', icon: <TravelExplore /> },     
  { text: 'Image Analyser', path: '/image-analyzer', icon: <ImageSearch /> }, 
];

function Sidebar() {
 const location = useLocation();
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
<Drawer
  variant="permanent"
  anchor="left"
  sx={{
    width: 220,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 220,
      boxSizing: 'border-box',
      fontFamily: 'cardo-regular',
      backgroundColor: '#F7374F',
      color: '#fff'
    }
  }}
>

<List>
  {menuItems.map((item) => (
    <ListItem
      button
      key={item.text}
      component={Link}
      to={item.path}
      selected={location.pathname === item.path}
      sx={{
        color: '#fff',
        '&.Mui-selected': {
          backgroundColor: '#ff3366',
        },
        '&:hover': {
          backgroundColor: '#ff5588',
          cursor:'pointer'
        }
      }}
    >
      <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
      <ListItemText primary={item.text} sx={{ color: '#fff' }} />
    </ListItem>
  ))}
</List>
 <Box p={2}>
        <Button
          variant="outlined"
          sx={{
          marginTop:'20vh',
            color: '#fff',
            borderColor: '#fff',
            cursor: 'pointer',
          }}
          startIcon={<Logout />}
          onClick={handleLogout}
          fullWidth
          color="error"
        >
          Logout
        </Button>
      </Box>

    </Drawer>
  );
}

export default Sidebar;
