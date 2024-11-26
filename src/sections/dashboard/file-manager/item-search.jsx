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
import { useDialog } from 'src/hooks/use-dialog'; // Importa el hook useDialog
import { FileUploader } from 'src/sections/dashboard/file-manager/file-uploader'; // Importa el componente FileUploader

const currentYear = new Date().getFullYear();
const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

const sortOptions = [
  {
    label: 'El último',
    value: 'createdAt|desc',
  },
  {
    label: 'Más antiguo',
    value: 'createdAt|asc',
  },
];

const typeOptions = [
  {
    label: 'Todo',
    value: 'all',
  },
  {
    label: 'Compras',
    value: 'compras',
  },
  {
    label: 'Ventas',
    value: 'ventas',
  },
];

export const ItemSearch = (props) => {
  const {
    setLoading,
    onFilterType,
    onFilterYear,
    onFiltersChange,
    onSortChange,
    sortBy,
    sortDir,
    year,
    type,
    handleItemsTotalsGet,
    handleItemsGet,
    opt,
  } = props;

  const queryRef = useRef(null);
  const uploadDialog = useDialog(); // Hook para manejar el estado del diálogo de subida de archivos

  const handleQueryChange = useCallback(
    (event) => {
      event.preventDefault();

      onFiltersChange?.({
        query: queryRef.current?.value || '',
      });
    },
    [onFiltersChange]
  );

  const handleSortChange = useCallback(
    (event) => {
      const [sortBy, sortDir] = event.target.value.split('|');

      onSortChange?.({
        sortBy,
        sortDir,
      });
    },
    [onSortChange]
  );

  const handleYearSelected = useCallback(
    (event) => {
      const year = event.target.value;
      onFilterYear?.(year);
    },
    [year]
  );

  const handleTypeSelected = useCallback(
    (event) => {
      const type = event.target.value;
      onFilterType?.(type);
    },
    [type]
  );

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
          sx={{ flexGrow: 1 }}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="itemName"
            placeholder="Buscar"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <Box sx={{ display: 'flex', columnGap: 1 }}>
          {opt === 'ple' && (
            <TextField
              label="Tipo"
              name="type"
              onChange={handleTypeSelected}
              select
              SelectProps={{ native: true }}
              value={type}
              sx={{ minWidth: 120 }}
            >
              {typeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </TextField>
          )}
          <TextField
            label="Año"
            name="year"
            onChange={handleYearSelected}
            select
            SelectProps={{ native: true }}
            value={year}
            sx={{ minWidth: 120 }} // Asegúrate de que el campo de selección sea compacto
          >
            {lastFiveYears.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </TextField>
          <TextField
            label="Ordenar por"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={`${sortBy}|${sortDir}`}
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
        </Box>
      </Stack>
      <FileUploader
        setLoading={setLoading}
        onClose={uploadDialog.handleClose} // Maneja el cierre del diálogo
        open={uploadDialog.open} // Estado del diálogo (abierto o cerrado)
        handleItemsTotalsGet={handleItemsTotalsGet} // Pasa la función para actualizar los totales
        handleItemsGet={handleItemsGet} // Pasa la función para obtener los ítems
        opt={opt} // Pasa la función para obtener los ítems
      />
    </Card>
  );
};

ItemSearch.propTypes = {
  onFilterType: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFiltersChange: PropTypes.func,
  handleItemsTotalsGet: PropTypes.func,
  handleItemsGet: PropTypes.func,
  onSortChange: PropTypes.func,
  setLoading: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
  year: PropTypes.number,
  type: PropTypes.string,
  opt: PropTypes.string,
};

export default ItemSearch;
