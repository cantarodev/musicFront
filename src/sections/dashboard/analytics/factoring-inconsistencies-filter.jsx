import PropTypes from 'prop-types'; 
import { useEffect, useState, useMemo } from 'react';
import {
  Box, Checkbox, ListItemText, MenuItem, TextField, Tooltip, IconButton
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import esES from 'date-fns/locale/es';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'src/hooks/use-local-storage';

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
  //const [selectedOptions, setSelectedOptions] = useState(selectedParams?.filters || ['all']);
  const [selectedOptions, setSelectedOptions] = useState(['all']); 
  const [selectedDate, setSelectedDate] = useState(
    selectedParams.period ? parse(selectedParams.period, 'yyyyMM', new Date()) : null
  );


  const handleCleanFilters = () => {
    setSelectedParams((state) => ({
      ...state,
      docType: 'all',
      currency: 'all',
      filters: { all: [] },
    }));
    setClean(!clean);
  };

  useEffect(() => {
    if (responseData && responseData.data) {
      const filterData = responseData.data;

      if (filterData?.length) {
        const uniqueTypes = [...new Set(filterData.map(item => item.tipoComprobante))];
        setSearchTypeOptions(
          uniqueTypes.length === 1
            ? [{ label: 'Todos', value: 'all' }, { label: uniqueTypes[0], value: uniqueTypes[0] }]
            : initialTypeOptions
        );
        console.log("uniqueTypes: ", uniqueTypes);

        const uniqueCurrencies = [...new Set(filterData.map(item => item.codMoneda))];
        const validCurrencies = uniqueCurrencies.filter(currency => ['PEN', 'USD'].includes(currency));

        setSearchCurrencyOptions(
          validCurrencies.length === 0
            ? initialCurrencyOptions
            : [
                { label: 'Todos', value: 'all' }, // Siempre mostramos la opción 'Todos'
                ...validCurrencies.map(currency => ({ label: `${currency} - ${currency}`, value: currency }))
              ]
        );
        console.log("validCurrencies: ", validCurrencies);

        const uniqueObservations = [...new Set(filterData.map(item => item.observacion))];
        setFilterOptions(
          uniqueObservations.length === 1
            ? [{ label: 'Todos', value: 'all' }, { label: uniqueObservations[0], value: uniqueObservations[0] }]
            : [{ label: 'Todos', value: 'all' }, ...uniqueObservations.map(obs => ({ label: obs, value: obs })) ]
        );
        console.log("uniqueObservations: ", uniqueObservations);
      }
    }
  }, [responseData]);

  useEffect(() => {
    onLoadData();
  }, [selectedParams.period]);

  const handleSelected = (event) => {
    const { name, value } = event.target;
    if (value === 'all') {
      setSelectedParams((state) => ({ ...state, [name]: 'all' }));
    } else {
      setSelectedParams((state) => ({ ...state, [name]: value }));
    }
  };

  const handleSelectedOptions = (event) => {
    const { target: { value } } = event;

    if (value.includes('all')) {
      const newSelectedOptions = value.includes('all') ? filterOptions.map(option => option.value) : value;
      setSelectedOptions(newSelectedOptions);
      setSelectedParams((state) => ({ ...state, filters: newSelectedOptions }));
    } else {
      setSelectedOptions(value);
      setSelectedParams((state) => ({ ...state, filters: value }));
    }
  };

  const handleDateChange = (date) => {
    const formattedPeriod = date ? format(date, 'yyyyMM') : '';
    setSelectedDate(date);
    setSelectedParams((state) => ({ ...state, period: formattedPeriod, period_search: formattedPeriod }));
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) {
      return 'Todos seleccionados';
    }
    return selected.join(', ');
  };

  // Filtrar los datos según las observaciones seleccionadas
  const filteredData = responseData?.data?.filter((row) => {
    return selectedOptions.includes('all') || selectedOptions.includes(row.observacion);
  }) || [];

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
            height: 54, // Igual altura para todos los campos
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esES}>
          <DatePicker
            label="Periodo"
            views={['year', 'month']}
            openTo="month"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
  
        <TextField
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          value={selectedParams.docType || ''}
        >
          {searchTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
  
        <TextField
          label="Moneda"
          name="currency"
          onChange={handleSelected}
          select
          value={selectedParams.currency || ''}
        >
          {searchCurrencyOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
  
        <TextField
          label="Validaciones"
          name="filters"
          select
          SelectProps={{
            multiple: true,
            renderValue,
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 600, // Control de altura del menú desplegable
                },
              },
            },
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
        <Tooltip title="Restablecer filtros">
            <IconButton
              onClick={handleCleanFilters}
              size="large"
              sx={{
                height: '100%',
                width: 'auto',
              }}
            >
              <RestoreIcon fontSize="large" />
            </IconButton>
          </Tooltip>
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
