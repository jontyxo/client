import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 30;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 80
    }
  })
};

function FEMA() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchFemaData = async () => {
      try {
        const response = await axios.get(
          `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$top=1000`
        );
        setDisasters(response.data.DisasterDeclarationsSummaries);
      } catch (error) {
        console.error('FEMA API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFemaData();
  }, []);

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedData = disasters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}
      >
        🧭 FEMA Disaster Declarations
      </motion.h2>

      <Grid container spacing={3}>
        {paginatedData.map((disaster, index) => (
          <Grid item xs={12} sm={6} md={4} key={disaster.disasterNumber}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '18px',
                  boxShadow: 4,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 10
                  },
                  background:
                    'linear-gradient(135deg, #fffdfd 0%, #f7f7f7 100%)'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {disaster.declarationTitle || 'No Title'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📄 Disaster #: {disaster.disasterNumber}
                  </Typography>
                  <Typography variant="body2">📍 State: {disaster.state}</Typography>
                  <Typography variant="body2">🌪️ Type: {disaster.incidentType}</Typography>
                  <Typography variant="body2">
                    🗓️ Declared:{' '}
                    {new Date(disaster.declarationDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box mt={5} display="flex" justifyContent="center">
      <Pagination
  count={Math.ceil(disasters.length / ITEMS_PER_PAGE)}
  page={page}
  onChange={handlePageChange}
  color="primary"
  size="large"
  sx={{
    '& .MuiPaginationItem-root': {
      backgroundColor: '#ffe5ec', // light pink bg
      color: '#7a003c',           // dark text
      fontWeight: 'bold',
      borderRadius: '12px',
      '&:hover': {
        backgroundColor: '#ffd1dc'
      }
    },
    '& .Mui-selected': {
      backgroundColor: '#FF0B55 !important',
      color: '#fff !important'
    }
  }}
/>

      </Box>
    </Box>
  );
}

export default FEMA;
