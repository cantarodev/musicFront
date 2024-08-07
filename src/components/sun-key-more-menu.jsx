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
import { claveSolAccountsApi } from 'src/api/sun-key-accounts/sunKeyService';
import { Button } from '@mui/material';

export const SunKeyMoreMenu = (props) => {
  const { handleClaveSolSelected, claveSol, handleOpen, handleClaveSolAccountsGet } = props;
  const popover = usePopover();

  const handleDelete = async (toastId) => {
    try {
      const { message } = await claveSolAccountsApi.deleteClaveSolAccount({
        account_id: claveSol.account_id,
      });
      toast.dismiss(toastId);
      handleClaveSolAccountsGet();
      toast.success(message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { duration: 3000, position: 'top-center' });
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

  const handleEdit = (claveSol) => {
    handleClaveSolSelected(claveSol);
    handleOpen('edit');
    popover.handleClose();
  };

  const handleMenu = () => {
    popover.handleOpen();
  };

  return (
    <>
      <Tooltip title="Más opciones">
        <IconButton
          onClick={() => handleMenu()}
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
        <MenuItem onClick={() => handleEdit(claveSol)}>
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
  handleClaveSolSelected: PropTypes.func,
  claveSol: PropTypes.object,
  handleClaveSolAccountsGet: PropTypes.func,
};
