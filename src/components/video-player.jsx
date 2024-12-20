// src/components/VideoPlayer.js

import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Box, Typography } from '@mui/material';

const VideoPlayer = ({ video, onVideoEnd }) => {
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (video) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [video]);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%',
          backgroundColor: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${video?.id.videoId}`}
          playing={playing}
          controls
          width="100%"
          height="100%"
          onEnded={onVideoEnd}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ful
        />
      </Box>
      <Typography
        variant="h5"
        color="text.primary"
        noWrap
      >
        {video?.snippet.title}
      </Typography>
    </Box>
  );
};

export default VideoPlayer;
