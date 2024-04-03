import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import Save02Icon from '@untitled-ui/icons-react/build/esm/Save02';
import Trash03Icon from '@untitled-ui/icons-react/build/esm/Trash03';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

import { usePopover } from 'src/hooks/use-popover';
import { sunKeyAccountsApi } from 'src/api/sun-key-accounts/index';
import { Button } from '@mui/material';
import { SunKeyModal } from 'src/sections/dashboard/sun-key/sun-key-modal';
import { useState } from 'react';

export const SunKeyMoreMenu = (props) => {
  const { handleSunKeySelected, sunKey, handleOpen, handleSunKeyAccountsGet } = props;
  const popover = usePopover();

  const handleDelete = async (toastId) => {
    try {
      const response = await sunKeyAccountsApi.deleteSunKeyAccount({ sunKeyId: sunKey.id });
      toast.dismiss(toastId);
      handleSunKeyAccountsGet();
      toast.success(response.message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error('Algo salió mal!', { duration: 3000, position: 'top-center' });
    }
  };

  const handleConfirm = () => {
    popover.handleClose();
    toast(
      (t) => (
        <span>
          ¿Estás seguro?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleDelete(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  const handleEdit = (sunKey) => {
    handleSunKeySelected(sunKey);
    handleOpen('edit');
    popover.handleClose();
  };

  const handleMenu = (sunKey) => {
    popover.handleOpen();
    // handleSunKeySelected(sunKey);
  };

  return (
    <>
      <Tooltip title="Más opciones">
        <IconButton
          onClick={() => handleMenu(sunKey)}
          ref={popover.anchorRef}
        >
          <SvgIcon>
            <DotsHorizontalIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{
          sx: {
            maxWidth: '100%',
            width: 200,
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <MenuItem onClick={() => handleEdit(sunKey)}>
          <ListItemIcon>
            <SvgIcon>
              <Save02Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </MenuItem>
        <MenuItem onClick={() => handleConfirm()}>
          <ListItemIcon>
            <SvgIcon>
              <Trash03Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Eliminar" />
        </MenuItem>
      </Menu>
    </>
  );
};

SunKeyMoreMenu.propTypes = {
  handleOpen: PropTypes.func,
  handleSunKeySelected: PropTypes.func,
  sunKey: PropTypes.object,
  handleSunKeyAccountsGet: PropTypes.func,
};
