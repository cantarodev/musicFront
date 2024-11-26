import PropTypes from 'prop-types';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import Trash02Icon from '@untitled-ui/icons-react/build/esm/Trash02';
import Menu from '@mui/material/Menu';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import SearchIcon from '@mui/icons-material/Search';
import { PLESearchDialog } from 'src/sections/dashboard/file-manager/search-ple';

import { useState } from 'react';
import axios from 'axios';
import { fileManagerApi } from 'src/api/file-manager/fileService';

export const ItemPleMenu = (props) => {
  const { anchorEl, onClose, onDelete, item, open = false } = props;

  // Estado para controlar la apertura del diálogo
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [comprobante, setComprobante] = useState(''); // Estado para guardar el valor del comprobante

  const handleDownload = async () => {
    try {
      const response = await fileManagerApi.downloadFile({
        user_id: item?.user_id,
        file_id: item?._id,
        option: 'ple',
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

  const handleOpenDialog = () => {
    setDialogOpen(true); // Abre el diálogo cuando se hace clic en "Buscar comprobante"
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Cierra el diálogo
  };

  const handleSearch = async (query) => {
    console.log('ITEMSEARCH---------------------------', item);
    setComprobante(query); // Actualizar el valor del comprobante
    const request = {
      user_id: item?.user_id,
      file_id: item?._id,
      comprobante: query,
    };
    console.log('Search Request: ', request);
    await fileManagerApi.searchComprobante(request); // Llamar a la búsqueda del comprobante
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
        <MenuItem onClick={handleOpenDialog}>
          <SvgIcon fontSize="small">
            <SearchIcon />
          </SvgIcon>
          Buscar comprobante
        </MenuItem>
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

      {/* Dialog para mostrar la tabla de búsqueda de PLEs */}
      <PLESearchDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSearch={handleSearch} // Pasar la función de búsqueda al diálogo
        user_id={item?.user_id} // Pasar user_id al hijo
        file_id={item?._id} // Pasar file_id al hijo
      />
    </>
  );
};

ItemPleMenu.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.object,
};
