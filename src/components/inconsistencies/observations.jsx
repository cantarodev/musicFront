import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const pointStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'primary.main',
  display: 'inline-block',
  marginRight: '6px',
};

export const Observations = ({ messages }) => (
  <Box>
    {messages.map((msg, index) => (
      <Box
        key={index}
        color="text.secondary"
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '4px',
          whiteSpace: 'normal',
          cursor: 'pointer',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <Box
          component="span"
          sx={{
            ...pointStyle,
          }}
        ></Box>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: 14,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {msg}
        </Typography>
      </Box>
    ))}
  </Box>
);

Observations.propTypes = {
  messages: PropTypes.array,
};
