import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Disasters from './pages/Disasters';
import Creates from './pages/Creates';
import Map from './pages/Map';
import Login from './pages/Login';
import PrivateRoute from './components/privateRoutes';
import FEMA from './pages/FEMA';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MapDisaster from './pages/MapDisaster';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import ImageAnalyzer from './pages/Image';


function AppWrapper() {
   const [incomingReport, setIncomingReport] = useState(null);

   
  const handleClose = () => {
    setIncomingReport(null);
  };
useEffect(() => {
    const socket = new WebSocket('ws://citymall-sldm.onrender.com/');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('📡 WebSocket message received:', msg);

      if (msg.type === 'new_social') {
        const uuid = localStorage.getItem('userUUID');
        const report = msg.data;

        const hasUrgentTag = report.tags?.some(
          (tag) => tag.toLowerCase() === 'urgent'
        );

        if (hasUrgentTag && uuid && (report.created_by !== uuid)) {
          setIncomingReport(report);
        }
      }
    };

    return () => socket.close();
  }, []);
  

  return (
    <Router>
      <App />
         {incomingReport && (
        <Dialog open onClose={handleClose}>
          <DialogTitle>🚨 New Social Report</DialogTitle>
          <DialogContent>
            <Typography variant="h6" fontWeight="bold">
              {incomingReport.title}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {incomingReport.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
              📍 {incomingReport.location_name}
            </Typography>
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
              {incomingReport.tags?.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" />
              ))}
            </Stack>
          </DialogContent>
         
           <DialogActions>
            <Button onClick={()=> window.location.href = `/map/${incomingReport.id}`} color="primary">View on Map</Button>
          </DialogActions>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Dismiss</Button>
          </DialogActions>
        </Dialog>
      )}
    </Router>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userEmail'));
  const location = useLocation();

  // Listen to storage changes (like login or logout)
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('userEmail'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Optional: update login state on route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userEmail'));
  }, [location]);

  return (
    <div style={{ display: 'flex' }}>
  
      {isLoggedIn && <Sidebar />}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Disasters />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Creates />
              </PrivateRoute>
            }
          />
            <Route
            path="/fema"
            element={
              <PrivateRoute>
                <FEMA />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PrivateRoute>
                <Map />
              </PrivateRoute>
            }
          />
              <Route
            path="/map/:id"
            element={
              <PrivateRoute>
                <MapDisaster />
              </PrivateRoute>
            }
          />
                        <Route
            path="/image-analyzer"
            element={
              <PrivateRoute>
                <ImageAnalyzer />
              </PrivateRoute>
            }
          />
          
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
