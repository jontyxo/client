import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



  const mainMarkerIcon = new L.Icon({
  iconUrl: require('../../src/important.png'), // You can use a custom red icon
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
function Map() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const res = await axios.get('http://localhost:432/api/disasters/all');
        setDisasters(res.data);
      } catch (err) {
        console.error('Failed to fetch disasters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (disasters.length === 0) {
    return <Typography textAlign="center" mt={4}>No disasters found</Typography>;
  }

  const defaultCenter = [disasters[0].lat, disasters[0].lng];

  // 🔍 Check if tags contain "urgent"
  const isUrgent = (tags = []) => tags.some(tag => tag.toLowerCase() === 'urgent');

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        🗺️ Disaster Map Overview
      </Typography>

      <Box height="80vh">
        <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {disasters.map((d) => (
            <Marker
              key={d.id}
              position={[d.lat, d.lng]}
              icon={isUrgent(d.tags) ? mainMarkerIcon :  new L.Icon.Default()}
            >
             <Popup>
  <div style={{ 
    color: isUrgent(d.tags) ? 'red' : 'black',
    fontWeight: isUrgent(d.tags) ? 'bold' : 'normal',
    fontSize: isUrgent(d.tags) ? '1.1rem' : 'inherit'
  }}>
    <strong>{d.title}</strong><br />
    {d.description}<br />
    <em>{d.location_name}</em>
  </div>
</Popup>

            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}

export default Map;
