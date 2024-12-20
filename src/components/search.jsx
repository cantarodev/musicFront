import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, IconButton, AppBar, Toolbar, Box } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { searchVideos, getCategories } from 'src/api/external/youtube/youtube.service';

const Search = ({ setVideos }) => {
  const [query, setQuery] = useState('');
  const [musicCategoryId, setMusicCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        const musicCategory = categoryList.find((category) => category.snippet.title === 'Music');
        setMusicCategoryId(musicCategory?.id);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async () => {
    try {
      if (musicCategoryId) {
        const results = await searchVideos(query, musicCategoryId);
        setVideos(results);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'transparent' }}>
      <TextField
        fullWidth
        placeholder="Buscar"
        variant="outlined"
        sx={{ cursor: 'pointer', marginBottom: 2, borderRadius: '50%' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="inherit"
                onClick={handleSearch}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { backgroundColor: '#1e1e1e', color: 'white' },
        }}
      />
    </Box>
  );
};

export default Search;
