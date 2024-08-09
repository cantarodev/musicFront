import PropTypes from 'prop-types';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import Tool02Icon from '@untitled-ui/icons-react/build/esm/Tool02';

import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { useSettings } from 'src/hooks/use-settings';
import { Divider } from '@mui/material';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const settings = useSettings();
  console.log(settings);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      {...other}
      sx={{
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          p: 1,
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: '8px',
        }}
      >
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Configuraciones</Typography>} />
        </ListItemButton>
        <Divider />
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Tool02Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Soporte</Typography>} />
        </ListItemButton>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
