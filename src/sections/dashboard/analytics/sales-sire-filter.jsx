import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
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
  {
    label: 'Factoring',
    value: 'facto',
    subOptions: [
      { label: 'No válido', value: 'No válido' },
      { label: 'Pendiente', value: 'Pendiente' },
      { label: 'Pendiente por reinicio', value: 'Pendiente por reinicio' },
      { label: 'Subsanado', value: 'Subsanado' },
      { label: 'Disconforme', value: 'Disconforme' },
    ],
  },
];

export const SalesSireFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
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

  console.log('PARAMS', selectedParams);

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
          },
        }}
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
                fullWidth
                margin="normal"
                sx={{ height: 54 }}
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
          fullWidth
          SelectProps={{ native: true }}
          value={selectedParams.docType}
          sx={{ height: 54 }}
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
          fullWidth
          SelectProps={{ native: true }}
          value={selectedParams.currency}
          sx={{ height: 54 }}
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

        <Button
          variant="contained"
          color="primary"
          onClick={onLoadData}
          startIcon={<FilterListIcon />}
          sx={{ width: '100%', height: 54 }}
          disabled={loading ? true : false}
        >
          Filtrar
        </Button>
      </Box>
    </Box>
  );
};

SalesSireFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onLoadData: PropTypes.func,
};
