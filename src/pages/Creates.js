import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  CircularProgress
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cancel } from '@mui/icons-material';


function Create() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');


    const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }
const created_by = localStorage.getItem('userUUID');
  if (!created_by) {
    toast.error('User not logged in');
    return;
  }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:432/api/disasters', {
        title,
        description,
        tags,
        created_by
      });

      toast.success(`✅ Created: ${response.data[0].title}`);
      setTitle('');
      setDescription('');
      setTags([]);
      setTagInput('');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error==="Could not geocode location"? 
        "Please try with a valid locaton description" 
        :'❌ Failed to create disaster');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <ToastContainer />
    
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🛑 Create New Disaster Report
      </Typography>

      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        margin="normal"
        multiline
        minRows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        fullWidth
        label="Add Tag"
        variant="outlined"
        margin="normal"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyDown}
        placeholder="Press Enter or Comma to add"
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={() => removeTag(tag)}
            color="primary"
            deleteIcon={<Cancel />}
          />
        ))}
      </Stack>
 {/* <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Upload Image
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button> */}
      {imagePreview && (
        <Box sx={{ mb: 2 }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Box>
      )}

   
      <Button
        variant="contained"
        color="error"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </Button>
    </Box>
  );
}

export default Create;
