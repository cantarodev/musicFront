import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Button, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const VideoList = ({ videos, onSelect }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2 }}>
      <Grid
        container
        spacing={2}
      >
        {videos?.map((video) => (
          <Grid
            item
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            key={video?.id.videoId}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                sx={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transform: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    transform: 'translateY(-5px)',
                    '& .video-overlay': {
                      opacity: 1,
                    },
                    '& .video-thumbnail': {
                      transform: 'scale(1.1)',
                    },
                    '& .video-title': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
                onClick={() => onSelect(video)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={video?.snippet.title}
                    height="140"
                    image={video?.snippet.thumbnails.medium.url}
                    className="video-thumbnail"
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Box
                    className="video-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      Play Video
                    </Typography>
                  </Box>
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    transition: 'background-color 0.3s ease',
                    backgroundColor: theme.palette.action.hover,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{
                      transition: 'color 0.3s ease',
                      color: 'inherit',
                    }}
                  >
                    {video?.snippet.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {video?.viewCount} views
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoList;
