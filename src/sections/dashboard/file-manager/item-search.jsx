import { useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid01Icon from '@untitled-ui/icons-react/build/esm/Grid01';
import ListIcon from '@untitled-ui/icons-react/build/esm/List';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01'; // Importa el icono de subir
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Importa el componente Button
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { useDialog } from 'src/hooks/use-dialog'; // Importa el hook useDialog
import { FileUploader } from 'src/sections/dashboard/file-manager/file-uploader'; // Importa el componente FileUploader

import { fileManagerApi } from 'src/api/file-manager'; // Importa la API de gestión de archivos
import toast from 'react-hot-toast'; // Para notificaciones

const sortOptions = [
  {
    label: 'El último',
    value: 'desc',
  },
  {
    label: 'Más antiguo',
    value: 'asc',
  },
];

export const ItemSearch = (props) => {
  const {
    onFiltersChange,
    onSortChange,
    onViewChange,
    view = 'grid',
    sortDir = 'asc',
    user_id,
  } = props;

  const queryRef = useRef(null);
  const uploadDialog = useDialog(); // Hook para manejar el estado del diálogo de subida de archivos

  const [state, setState] = useState({
    items: [],
    itemsCount: 0,
  });

  // Función para obtener los ítems
  const handleItemsGet = useCallback(async () => {
    try {
      const response = await fileManagerApi.getFiles({
        filters: {
          query: queryRef.current?.value || '',
        },
        page: 0,
        rowsPerPage: 9,
        sortBy: 'createdAt',
        sortDir: sortDir,
        user_id: user_id,
      });
      setState({
        items: response.data,
        itemsCount: response.count,
      });
    } catch (err) {
      console.error(err);
    }
  }, [sortDir, user_id]);

  // Función para actualizar los totales de los ítems
  const handleItemsTotalsGet = useCallback(async () => {
    try {
      const response = await fileManagerApi.getTotals({ user_id });
      setState((prevState) => ({
        ...prevState,
        items: response,
      }));
    } catch (err) {
      console.error(err);
    }
  }, [user_id]);

  const handleQueryChange = useCallback(
    (event) => {
      event.preventDefault();
      onFiltersChange?.({
        query: queryRef.current?.value || '',
      });
      handleItemsGet(); // Actualiza los ítems al cambiar la consulta
    },
    [onFiltersChange, handleItemsGet]
  );

  const handleSortChange = useCallback(
    (event) => {
      const sortDir = event.target.value;
      onSortChange?.(sortDir);
      handleItemsGet(); // Actualiza los ítems al cambiar el orden
    },
    [onSortChange, handleItemsGet]
  );

  const handleViewChange = useCallback(
    (event, value) => {
      onViewChange?.(value);
    },
    [onViewChange]
  );

  useEffect(() => {
    handleItemsGet();
  }, [handleItemsGet]);

  return (
    <Card>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2 }}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{ flexGrow: 1, maxWidth: 600 }}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="itemName"
            placeholder="Buscar PLE"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <ToggleButtonGroup
          exclusive
          onChange={handleViewChange}
          sx={{
            borderWidth: 1,
            borderColor: 'divider',
            borderStyle: 'solid',
            [`& .${toggleButtonGroupClasses.grouped}`]: {
              margin: 0.5,
              border: 0,
              '&:not(:first-of-type)': {
                borderRadius: 1,
              },
              '&:first-of-type': {
                borderRadius: 1,
              },
            },
          }}
          value={view}
        >
          <ToggleButton value="grid">
            <SvgIcon fontSize="small">
              <Grid01Icon />
            </SvgIcon>
          </ToggleButton>
          <ToggleButton value="list">
            <SvgIcon fontSize="small">
              <ListIcon />
            </SvgIcon>
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Ordenar por"
          name="sort"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          value={sortDir}
          sx={{ minWidth: 120 }} // Asegúrate de que el campo de selección sea compacto
        >
          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
        <Button
          onClick={uploadDialog.handleOpen} // Abre el diálogo de subida de archivos
          startIcon={
            <SvgIcon>
              <Upload01Icon />
            </SvgIcon>
          }
          variant="contained"
        >
          Subir
        </Button>
      </Stack>
      <FileUploader
        onClose={uploadDialog.handleClose} // Maneja el cierre del diálogo
        open={uploadDialog.open} // Estado del diálogo (abierto o cerrado)
        handleItemsTotalsGet={handleItemsTotalsGet} // Pasa la función para actualizar los totales
        handleItemsGet={handleItemsGet} // Pasa la función para obtener los ítems
      />
    </Card>
  );
};

ItemSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  onViewChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
  view: PropTypes.oneOf(['grid', 'list']),
  user_id: PropTypes.string.isRequired,
};

export default ItemSearch;
