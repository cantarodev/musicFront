import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box, Button, Checkbox, ListItemText, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import esES from 'date-fns/locale/es';

const customEnLocale = {
  ...esES,
  options: {
    ...esES.options,
    weekStartsOn: 1,
  },
};

const searchTypeOptions = [
  { label: 'Todos', value: 'all' },
  { label: '01 - Factura', value: '01' },
  { label: '03 - Boleta de venta', value: '03' },
  { label: '07 - Nota de crédito', value: 'F7' },
  { label: '08 - Nota de débito', value: 'F8' },
];

const searchCurrencyOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'USD - Dólares', value: 'USD' },
  { label: 'PEN- Soles', value: 'PEN' },
  { label: 'EUR - Euros', value: 'EUR' },
];

// Agregamos las opciones de estados de Factoring
const factoringStatusOptions = [
  { label: 'No válido', value: 'No válido' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Pendiente por reinicio', value: 'Pendiente por reinicio' },
  { label: 'Subsanado', value: 'Subsanado' },
  { label: 'Disconforme', value: 'Disconforme' },
];

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'General', value: 'general' },
  { label: 'Tipo de Cambio', value: 'tc' },
  { label: 'Factoring', value: 'facto' },
];

export const PurchasesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;
  const [selectedOptions, setSelectedOptions] = useState(['general']);
  const [selectedFactoringStatus, setSelectedFactoringStatus] = useState([]); // Para almacenar estados seleccionados

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleSelectedOptions = (option) => {
    let updatedSelection = [];

    if (option.value === 'all') {
      if (selectedOptions.includes('all')) {
        updatedSelection = [];
      } else {
        updatedSelection = [
          'all',
          ...filterOptions.filter((opt) => opt.value !== 'all').map((opt) => opt.value),
        ];
      }
    } else {
      updatedSelection = selectedOptions.includes(option.value)
        ? selectedOptions.filter((item) => item !== option.value && item !== 'all')
        : [...selectedOptions.filter((item) => item !== 'all'), option.value];

      if (updatedSelection.length === filterOptions.length - 1) {
        updatedSelection.push('all');
      }
    }

    setSelectedOptions(updatedSelection);

    setSelectedParams((state) => ({ ...state, ['filters']: updatedSelection }));
  };

  const handleFactoringStatusChange = (event) => {
    const { value } = event.target;
    setSelectedFactoringStatus((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((status) => status !== value)
        : [...prevSelected, value]
    );
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) {
      return 'Todos seleccionados';
    }
    if (selected.length > 2) {
      return `${selected.length} seleccionados`;
    }
    return selected
      .map((value) => filterOptions.find((opt) => opt.value === value)?.label)
      .join(', ');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'yyyyMM');
  };

  const parseDateFromYYYYMM = (dateString) => {
    if (!dateString) return null;
    return parse(dateString, 'yyyyMM', new Date());
  };

  const handleDateChange = (date) => {
    const value = formatDate(date);
    setSelectedParams((state) => ({ ...state, period: value }));
  };

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: selectedOptions,
      factoringStatuses: selectedFactoringStatus,
    }));

    // Agregar console.log para validar los datos
    console.log('Filtros seleccionados: ', selectedOptions);
    console.log('Estados de Factoring seleccionados: ', selectedFactoringStatus);
  }, [selectedOptions, selectedFactoringStatus, setSelectedParams]);
  console.log('PARAMS', selectedParams);
  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      sx={{ width: '100%' }}
    >
      <Stack
        alignItems="center"
        direction="row"
        gap={2}
        sx={{ minWidth: 150 }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={customEnLocale}
        >
          <DatePicker
            label="Periodo"
            views={['year', 'month']}
            openTo="month"
            value={parseDateFromYYYYMM(selectedParams.period)}
            onChange={handleDateChange}
            textField={(params) => (
              <TextField
                {...params}
                margin="normal"
                sx={{ width: '200px', height: 54 }}
              />
            )}
            format="MMMM, yyyy"
          />
        </LocalizationProvider>
        <TextField
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.docType}
          sx={{ width: '200px', height: 54 }}
        >
          {searchTypeOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Moneda"
          name="currency"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.currency}
          sx={{ width: '150px', height: 54 }}
        >
          {searchCurrencyOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        gap={2}
      >
        <TextField
          label="Validaciones"
          name="filter"
          select
          SelectProps={{
            multiple: true,
            renderValue: renderValue,
            MenuProps: {
              PaperProps: {
                style: {
                  width: '200px',
                },
              },
            },
          }}
          value={selectedOptions}
          onChange={() => {}}
          sx={{ width: '200px', height: 54 }}
        >
          {filterOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              onClick={() => handleSelectedOptions(option)}
            >
              <Checkbox checked={selectedOptions.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={onLoadData}
          startIcon={<FilterListIcon />}
          sx={{ width: '100px', height: 50 }}
          disabled={loading ? true : false}
        >
          Filtrar
        </Button>
      </Stack>

      {/* Estados de Factoring alineados en la misma línea */}
      {selectedOptions.includes('facto') && (
        <Box
          mt={2}
          display="flex"
          flexDirection="row"
          gap={2}
        >
          {factoringStatusOptions.map((status) => (
            <MenuItem
              key={status.value}
              value={status.value}
            >
              <Checkbox
                checked={selectedFactoringStatus.includes(status.value)}
                onChange={handleFactoringStatusChange}
                value={status.value}
              />
              <ListItemText primary={status.label} />
            </MenuItem>
          ))}
        </Box>
      )}
    </Stack>
  );
};

PurchasesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onLoadData: PropTypes.func,
};
