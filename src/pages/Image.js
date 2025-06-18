import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material';

function ImageAnalysis() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'AIzaSyDmcS1o6wpO5SUEUm7N43kCiKiQeIkmwUI'; // Replace with your Gemini API Key

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult('');
  };

  const analyzeImage = async () => {
    if (!file || !description.trim()) {
      return alert('Please upload an image and provide a description.');
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];

      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: base64Image,
                    },
                  },
                  {
                    text: `This image is reported to be from a disaster with the following description:\n"${description}".\n\nCan you verify if the image contextually matches the description and detect if it is AI-generated or manipulated in any way?`,
                  },
                ],
              },
            ],
          }
        );

        const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        setResult(text || 'No analysis returned');
      } catch (err) {
        console.error(err);
        setResult('❌ Error analyzing image');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h6" gutterBottom>
        🧠 Gemini 1.5 Disaster Image Authenticity Check
      </Typography>

      <TextField
        fullWidth
        label="Disaster Description"
        variant="outlined"
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={3}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '16px' }} />

      <Button
        onClick={analyzeImage}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : 'Analyze Image'}
      </Button>

      {result && (
        <Box mt={3}>
          <Typography variant="subtitle1">🔍 Analysis Result:</Typography>
          <Typography variant="body1" whiteSpace="pre-wrap">{result}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default ImageAnalysis;
