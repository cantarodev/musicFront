import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, Collapse, List, ListItemText, MenuItem, TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import esES from 'date-fns/locale/es';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const initialTypeOptions = [
  { label: 'Todos', value: 'all' },
  { label: '01 - Factura', value: '01' },
  { label: '03 - Boleta de venta', value: '03' },
  { label: '07 - Nota de crédito', value: '07' },
  { label: '08 - Nota de débito', value: '08' },
];

const initialCurrencyOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'USD - Dólares', value: 'USD' },
  { label: 'PEN - Soles', value: 'PEN' },
  { label: 'EUR - Euros', value: 'EUR' },
];

const initialFilterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'No válido', value: 'No válido' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Pendiente por reinicio', value: 'Pendiente por reinicio' },
  { label: 'Subsanado', value: 'Subsanado' },
  { label: 'Disconforme', value: 'Disconforme' },
];

export const FactoringInconsistenciesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData, responseData } = props;
  const [searchTypeOptions, setSearchTypeOptions] = useState(initialTypeOptions);
  const [searchCurrencyOptions, setSearchCurrencyOptions] = useState(initialCurrencyOptions);
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [selectedOptions, setSelectedOptions] = useState(selectedParams.filters || []);
  const [selectedDate, setSelectedDate] = useState(selectedParams.period ? parse(selectedParams.period, 'yyyyMM', new Date()) : null);
  const [filterInitialized, setFilterInitialized] = useState(false);
  useEffect(() => {
    // Si ya se han inicializado los filtros, no los actualizamos de nuevo
    if (filterInitialized) return;
  
    if (responseData && responseData.relevant_data) {
      const filterData = responseData.relevant_data.filter; // Los filtros están aquí
  
      if (filterData) {
        // Actualiza las opciones de Tipo de Comprobante
        if (filterData.codCpe) {
          const updatedTypeOptions = initialTypeOptions.filter(option =>
            filterData.codCpe.includes(option.value)
          );
          setSearchTypeOptions(updatedTypeOptions.length ? updatedTypeOptions : initialTypeOptions);
        }
  
        // Actualiza las opciones de Moneda
        if (filterData.codMoneda) {
          const updatedCurrencyOptions = initialCurrencyOptions.filter(option =>
            filterData.codMoneda.includes(option.value)
          );
          setSearchCurrencyOptions(updatedCurrencyOptions.length ? updatedCurrencyOptions : initialCurrencyOptions);
        }
  
        // Actualiza las opciones de Observación
        if (filterData.observacion) {
          const updatedFilterOptions = initialFilterOptions.filter(option =>
            filterData.observacion.includes(option.value)
          );
          setFilterOptions(updatedFilterOptions.length ? updatedFilterOptions : initialFilterOptions);
        } else {
          // Si no hay observaciones en el response, reseteamos a todos los filtros
          setFilterOptions(initialFilterOptions);
        }
  
        // Marcamos que los filtros ya han sido inicializados
        setFilterInitialized(true);
      }
    }
  }, [responseData, filterInitialized]);
  
  
  

  // useEffect(() => {
  //   if (responseData && responseData.relevant_data) {
  //     const filterData = responseData.relevant_data.filter;

  //     if (filterData) {
  //       if (filterData.codCpe) {
  //         const updatedTypeOptions = initialTypeOptions.filter(option =>
  //           filterData.codCpe.includes(option.value)
  //         );
  //         setSearchTypeOptions(updatedTypeOptions.length ? updatedTypeOptions : initialTypeOptions);
  //       }

  //       if (filterData.codMoneda) {
  //         const updatedCurrencyOptions = initialCurrencyOptions.filter(option =>
  //           filterData.codMoneda.includes(option.value)
  //         );
  //         setSearchCurrencyOptions(updatedCurrencyOptions.length ? updatedCurrencyOptions : initialCurrencyOptions);
  //       }

  //       if (filterData.observacion) {
  //         const updatedFilterOptions = initialFilterOptions.filter(option =>
  //           filterData.observacion.includes(option.value)
  //         );
  //         setFilterOptions(updatedFilterOptions.length ? updatedFilterOptions : initialFilterOptions);
  //       }
  //     }
  //   }
  // }, [responseData]);

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleSelectedOptions = (event) => {
    const { target: { value } } = event;
    if (value.includes('all')) {
      setSelectedOptions(selectedOptions.includes('all') ? [] : filterOptions.map((option) => option.value));
      setSelectedParams((state) => ({ ...state, filters: selectedOptions.includes('all') ? [] : filterOptions.map((option) => option.value) }));
    } else {
      setSelectedOptions(value);
      setSelectedParams((state) => ({ ...state, filters: value }));
    }
  };

  const handleDateChange = (date) => {
    const value = date ? format(date, 'yyyyMM') : '';
    setSelectedParams((state) => ({ ...state, period: value }));
    setSelectedDate(date);
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) {
      return 'Todos seleccionados';
    }
    return selected.join(', ');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: 'none' },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          '& > *': {
            flex: { xs: '1 1 100%', md: '1 1 0' },
            minWidth: { xs: '100%', md: 0 },
            height: '54px', // Asegurando que todos los filtros tengan la misma altura
          },
        }}
      >
        {/* Periodo */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esES}>
          <DatePicker
            label="Periodo"
            views={['year', 'month']}
            openTo="month"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth />
            )}
          />
        </LocalizationProvider>

        {/* Tipo de Comprobante */}
        <TextField
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          value={selectedParams.docType}
        >
          {searchTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Moneda */}
        <TextField
          label="Moneda"
          name="currency"
          onChange={handleSelected}
          select
          value={selectedParams.currency}
        >
          {searchCurrencyOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Validaciones */}
        <TextField
          label="Validaciones"
          name="filters"
          select
          SelectProps={{
            multiple: true,
            renderValue,
          }}
          value={selectedOptions}
          onChange={handleSelectedOptions}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={selectedOptions.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={onLoadData}
          startIcon={<FilterListIcon />}
          disabled={loading}
          sx={{ height: '56px' }}
        >
          Filtrar
        </Button>
      </Box>
    </Box>
  );
};

FactoringInconsistenciesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onLoadData: PropTypes.func,
  responseData: PropTypes.object,
};
