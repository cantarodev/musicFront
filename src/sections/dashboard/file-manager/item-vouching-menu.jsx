import PropTypes from 'prop-types';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import Menu from '@mui/material/Menu';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

import axios from 'axios';
import { fileManagerApi } from 'src/api/file-manager/fileService';

export const ItemVouchingMenu = (props) => {
  const { anchorEl, onClose, onDelete, item, open = false } = props;

  const handleDownload = async () => {
    try {
      const response = await fileManagerApi.downloadFile({
        user_id: item?.user_id,
        file_id: item?._id,
        option: 'vouching',
      });

      if (response.status === 'success') {
        const fileResponse = await axios.get(response.message, {
          responseType: 'blob',
        });

        const blob = new Blob([fileResponse.data], { type: fileResponse.data.type });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', item?.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={onClose}
        open={open}
        sx={{
          [`& .${menuItemClasses.root}`]: {
            fontSize: 14,
            '& svg': {
              mr: 1,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <MenuItem onClick={handleDownload}>
          <SvgIcon fontSize="small">
            <Download01Icon />
          </SvgIcon>
          Descargar
        </MenuItem>
        <MenuItem
          onClick={onDelete}
          sx={{ color: 'error.main' }}
        >
          <SvgIcon fontSize="small">
            <Trash02Icon />
          </SvgIcon>
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};

ItemVouchingMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.object,
};
