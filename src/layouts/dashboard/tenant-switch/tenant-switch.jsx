import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';

import { TenantPopover } from './tenant-popover';

const tenants = ['Devias', 'Acme Corp'];

export const TenantSwitch = (props) => {
  const popover = usePopover();

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              color: 'text.primary',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '0.3px',
              lineHeight: 1,
              '& span': {
                color: 'primary.main',
              },
            }}
          >
            Izi<span>tax</span>
          </Typography>
          <Typography
            color="neutral.400"
            variant="body2"
          >
            Prueba
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
