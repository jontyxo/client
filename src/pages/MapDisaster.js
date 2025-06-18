import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});




function MapDisaster() {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearby, setNearby] = useState([]);
  const mapRef = useRef();
  const [radius, setRadius] = useState(10); // Default radius in km

  const mainMarkerIcon = new L.Icon({
  iconUrl: require('../../src/pin.png'), // You can use a custom red icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('../../src/pin.png'),
  shadowSize: [41, 41]
});


  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const res = await axios.get(`http://localhost:432/api/disasters/disaster/${id}`);
        setDisaster(res.data);
      } catch (err) {
        console.error('Failed to fetch disaster:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisaster();
  }, [id]);

  useEffect(() => {
    if (disaster && mapRef.current) {
      const bounds = L.circle([disaster.lat, disaster.lng], {
        radius
      }).getBounds();

      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [disaster]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!disaster) {
    return <Typography mt={5} textAlign="center">Disaster not found</Typography>;
  }

    const fetchNearby = async (lat, lng, km) => {
    try {
      const res = await axios.get(`http://localhost:432/api/disasters/nearby?lat=${lat}&lng=${lng}&radius=${km*1000}`);
      setNearby(res.data);
    } catch (err) {
      console.error('Nearby fetch error:', err);
    }
  };
  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
  };
    const handleApply = () => {
    if (disaster) {
      fetchNearby(disaster.lat, disaster.lng, radius);
    }
  };

const getZoomLevel = (radiusInMeters) => {
  // Basic approximation: adjust the constants if needed
  const scale = radiusInMeters / 500;
  const zoom = 16 - Math.log2(scale);
  return Math.min(Math.max(zoom, 1), 18); // clamp between 1 and 18
};

  return (
 <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        🗺️ {disaster.title} — {disaster.location_name}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          label="Geofence Radius (km)"
          type="number"
          value={radius}
          onChange={handleRadiusChange}
          size="small"
        />
        <Button variant="contained" color="primary" onClick={handleApply}>
          Apply
        </Button>
      </Stack>

      <Box height="80vh" mb={3}>
        <MapContainer
          center={[disaster.lat, disaster.lng]}
          zoom={getZoomLevel(radius * 1000)}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[disaster.lat, disaster.lng]} icon={mainMarkerIcon}>
            <Popup><strong>{disaster.title}</strong>
            <br />
                {disaster.description}</Popup>
          </Marker>
          <Circle
            center={[disaster.lat, disaster.lng]}
            radius={radius * 1000}
            pathOptions={{ color: 'red' }}
          />
          {nearby.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup>
                <strong>{d.title}</strong><br />
                {d.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      {nearby.length > 0 && (
        <>
          <Typography variant="h6">Nearby Disasters:</Typography>
          {nearby.map((d) => (
            <Card key={d.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">{d.title}</Typography>
                <Typography variant="body2">{d.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
    
  );
}

export default MapDisaster;
