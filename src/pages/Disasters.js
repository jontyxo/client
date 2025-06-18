import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Box,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@mui/material';
import { validEmails } from '../validaEmails';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6;

function Disasters() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

const [editOpen, setEditOpen] = useState(false);
const [editData, setEditData] = useState({ id: '', title: '', description: '', tags: [] });

const handleEditOpen = (disaster) => {
  setEditData(disaster);
  setEditOpen(true);
};

const handleEditClose = () => {
  setEditOpen(false);
  setEditData({ id: '', title: '', description: '', tags: [] });
};

const handleEditSave = async () => {
  try {
    await axios.put(`https://citymall-sldm.onrender.com/api/disasters/${editData.id}`, {
      title: editData.title,
      description: editData.description,
      tags: editData.tags
    });
    toast.success("✅ Disaster updated!");
    handleEditClose();
    fetchDisasters();
    // Optionally refetch disasters
  } catch (error) {
    console.error(error);
    toast.error("❌ Update failed");
  }
};

  const loggedInUUID = localStorage.getItem('userUUID');
const navigate = useNavigate();
const classifyDisaster = (disaster) => {
  const keywords = ['urgent', 'emergency', 'evacuation', 'alert', 'fire', 'flood'];
  const content = `${disaster.title} ${disaster.description} ${disaster.tags?.join(' ')}`.toLowerCase();
  const isHighPriority = keywords.some(word => content.includes(word));
  return {
    ...disaster,
    priority: isHighPriority ? 'High' : 'Normal'
  };
};
const handleViewOnMap = (id) => {
  navigate(`/map/${id}`);
};
  const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this disaster?");
  if (!confirmed) return;

  try {
    await axios.delete(`https://citymall-sldm.onrender.com/api/disasters/${id}`);
    toast.success("🗑️ Deleted successfully");
    setDisasters((prev) => prev.filter((d) => d.id !== id));
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("❌ Failed to delete");
  }
};
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('https://citymall-sldm.onrender.com/api/disasters/all');
          const classified = response.data.map(classifyDisaster);
        setDisasters(classified);
      } catch (error) {
        console.error('Error fetching disasters:', error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {


    fetchDisasters();
  }, []);

   const getEmailFromUUID = (uuid) => {
    const match = validEmails.find((u) => u.uuid === uuid);
    return match ? match.email : 'Unknown';
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }


  const handlePageChange = (_, value) => setPage(value);

  const paginatedDisasters = disasters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

 

  return (
   <Box>
   <Dialog open={editOpen} onClose={handleEditClose}>
  <DialogTitle>Edit Disaster</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      label="Title"
      value={editData.title}
      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Description"
      multiline
      minRows={3}
      value={editData.description}
      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Tags (comma-separated)"
      value={editData.tags.join(', ')}
      onChange={(e) => setEditData({ ...editData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
      margin="normal"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleEditClose}>Cancel</Button>
    <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
  </DialogActions>
</Dialog>

      <Typography variant="h4" gutterBottom>
        📋 List of Disasters
      </Typography>
      <ToastContainer />


      {disasters.length === 0 ? (
        <Typography>No disasters found.</Typography>
      ) : (
        <>
          {paginatedDisasters.map((disaster) => (
          <Card key={disaster.id} sx={{ mb: 2 }}>
  <CardContent>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" fontWeight="bold">{disaster.title}</Typography>

{disaster.created_by === loggedInUUID && (
  <Box>
    <IconButton color="primary" size="small" onClick={() => handleEditOpen(disaster)}>
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton color="error" size="small" onClick={() => handleDelete(disaster.id)}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Box>
)}


    </Box>

    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      {disaster.location_name} • {new Date(disaster.created_at).toLocaleString()}
    </Typography>

    <Typography variant="body2" sx={{ mb: 1 }}>
      👤 Reported by: <strong>{getEmailFromUUID(disaster.created_by)}</strong>
    </Typography>

    <Typography variant="body1" sx={{ mb: 1 }}>
      {disaster.description}
    </Typography>
    <Typography variant="caption" color={disaster.priority === 'High' ? 'error' : 'text.secondary'}>
  Priority: {disaster.priority}
</Typography>


<Stack direction="row" spacing={1} flexWrap="wrap">
  {disaster.tags?.map((tag, i) => (
    <Chip key={i} label={tag} 
    onClick={() => {}}
      sx={{
        backgroundColor: '#ffe6ea',
        color: '#d32f2f',
        fontWeight: 'bold',
        borderRadius: 2,
        '&:hover': {
          backgroundColor: '#ffccd5',
          cursor: 'pointer'
        }
      }}
    />
  ))}
</Stack>

<Button
  onClick={() => handleViewOnMap(disaster.id)}
  size="small"
  variant="contained"
  sx={{
    mt: 2,
    backgroundColor: '#ff005c',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '20px',
    textTransform: 'none',
    px: 3,
    '&:hover': {
      backgroundColor: '#e6004f',
      transform: 'scale(1.03)',
      boxShadow: '0px 2px 10px rgba(255, 0, 92, 0.3)'
    },
    transition: 'all 0.2s ease-in-out'
  }}
>
  🔍 View on Map
</Button>

  </CardContent>
</Card>

          ))}

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil(disasters.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  backgroundColor: '#ffe6ea',
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  borderRadius: 2,
                },
                '& .Mui-selected': {
                  backgroundColor: '#d32f2f !important',
                  color: '#fff',
                }
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Disasters;
