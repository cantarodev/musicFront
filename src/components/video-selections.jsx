import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import { Box, Button, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useCssVars } from 'src/hooks/use-css-vars';
import { useSettings } from 'src/hooks/use-settings';

const VideoSelections = ({ selectedVideos, setSelectedVideos, setCurrentVideoIndex }) => {
  const settings = useSettings();
  const color = settings.navColor;
  const cssVars = useCssVars(color);

  const handleRemoveVideo = (index) => {
    const newSelectedVideos = [...selectedVideos];
    newSelectedVideos.splice(index, 1);
    setSelectedVideos(newSelectedVideos);
  };

  const handleRemoveAllVideos = () => {
    setSelectedVideos([]);
  };

  return (
    <Box
      sx={{
        ...cssVars,
        backgroundColor: 'var(--nav-bg)',
        borderRightColor: 'var(--nav-border-color)',
        borderRightStyle: 'solid',
        borderRightWidth: 1,
        color: 'var(--nav-color)',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <List>
        <Typography
          variant="h6"
          padding={2}
        >
          Cola de reproducción
        </Typography>
        {selectedVideos?.map((video, index) => (
          <ListItem
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="Eliminar"
                onClick={() => handleRemoveVideo(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={video.snippet.title} />
          </ListItem>
        ))}
        <ListItem>
          <ListItemText primary="" />
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveAllVideos}
          >
            Eliminar todos
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

export default VideoSelections;
