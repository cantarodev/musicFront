import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  IconButton,
  List,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

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
  {
    label: 'CPE',
    value: 'cpe',
    subOptions: [
      { label: 'NO EXISTE', value: 'NO EXISTE' },
      { label: 'ACEPTADO', value: 'ACEPTADO' },
      { label: 'ANULADO', value: 'ANULADO' },
      { label: 'AUTORIZADO', value: 'AUTORIZADO' },
      { label: 'NO AUTORIZADO', value: 'NO AUTORIZADO' },
    ],
  },
  { label: 'Inconsistencia', value: 'incons' },
];

export const SalesInconsistenciesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;
  const [selectedOptions, setSelectedOptions] = useState({ general: [] });
  const [expanded, setExpanded] = useState({});

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleSelectedOptions = (option) => {
    let updatedSelection = { ...selectedOptions };

    if (option.value === 'all') {
      // Si se selecciona "all", seleccionamos todas las opciones principales
      if (Object.keys(updatedSelection).length === filterOptions.length) {
        updatedSelection = {}; // Desmarcar todo
      } else {
        updatedSelection = filterOptions.reduce((acc, opt) => {
          acc[opt.value] = []; // Todas las opciones seleccionadas
          return acc;
        }, {});
      }
    } else if (selectedOptions[option.value]) {
      // Si la opción ya está seleccionada, la eliminamos y sus subOptions
      delete updatedSelection[option.value];
    } else {
      // Si es nueva, la añadimos y si tiene subOptions las marcamos todas
      if (option.subOptions) {
        updatedSelection[option.value] = option.subOptions.map((sub) => sub.value);
      } else {
        updatedSelection[option.value] = [];
      }
    }
    setSelectedOptions(updatedSelection);
    setSelectedParams((state) => ({ ...state, ['filters']: updatedSelection }));
  };

  const handleSubOptionSelect = (parentOption, subOption) => {
    const updatedSelection = { ...selectedOptions };

    if (!updatedSelection[parentOption.value]) {
      updatedSelection[parentOption.value] = [];
    }

    const subOptions = updatedSelection[parentOption.value];

    if (subOptions.includes(subOption.value)) {
      // Si ya está seleccionado, lo quitamos
      updatedSelection[parentOption.value] = subOptions.filter((item) => item !== subOption.value);
    } else {
      // Lo añadimos si no está seleccionado
      updatedSelection[parentOption.value].push(subOption.value);
    }

    // Si no quedan suboptions seleccionadas, desmarcamos la opción principal
    if (updatedSelection[parentOption.value].length === 0) {
      delete updatedSelection[parentOption.value];
    }

    setSelectedOptions(updatedSelection); // Actualizamos el estado con los subOptions
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) {
      return 'Todos seleccionados';
    }
    const labels = selected.flatMap((option) => {
      const parentOption = filterOptions.find((opt) => opt.value === option);
      if (parentOption?.subOptions && selectedOptions[option].length > 0) {
        return selectedOptions[option].map(
          (subOption) =>
            `${parentOption.label} - ${
              parentOption.subOptions.find((sub) => sub.value === subOption)?.label
            }`
        );
      }
      return parentOption?.label || option;
    });
    return labels.join(', ');
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

  const toggleSubMenu = (option) => {
    setExpanded((prevExpanded) => {
      // Cerrar otros submenus
      const newExpanded = Object.keys(prevExpanded).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // Abrir el submenu actual
      newExpanded[option.value] = !prevExpanded[option.value];

      return newExpanded;
    });
  };

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: selectedOptions,
    }));

    console.log('Filtros seleccionados: ', selectedOptions);
  }, [selectedOptions, setSelectedParams]);

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
              />
            )}
            format="MMMM, yyyy"
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.docType}
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
          fullWidth
          label="Moneda"
          name="currency"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.currency}
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

        <TextField
          fullWidth
          label="Validaciones"
          name="filter"
          select
          SelectProps={{
            multiple: true,
            renderValue: renderValue,
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 600,
                  width: 300,
                },
              },
            },
          }}
          value={Object.keys(selectedOptions)}
          onChange={() => {}}
          sx={{ height: 54 }}
        >
          {filterOptions.map((option) => (
            <div key={option.value}>
              <MenuItem
                key={option.value}
                value={option.value}
                onClick={() => handleSelectedOptions(option)}
              >
                <Checkbox checked={selectedOptions[option.value] !== undefined} />
                <ListItemText primary={option.label} />
                {option.subOptions?.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubMenu(option);
                    }}
                  >
                    {expanded[option.value] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </MenuItem>
              {option.subOptions?.length > 0 && (
                <Collapse
                  in={expanded[option.value]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="div"
                    disablePadding
                  >
                    {option.subOptions.map((subOption) => (
                      <MenuItem
                        key={subOption.value}
                        onClick={() => handleSubOptionSelect(option, subOption)}
                        sx={{ pl: 4 }} // Indent the subitems
                      >
                        <Checkbox
                          checked={selectedOptions[option.value]?.includes(subOption.value)}
                        />
                        <ListItemText primary={subOption.label} />
                      </MenuItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </TextField>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onLoadData}
          startIcon={<FilterListIcon />}
          disabled={loading ? true : false}
          sx={{ height: '56px' }}
        >
          Filtrar
        </Button>
      </Box>
    </Box>
  );
};

SalesInconsistenciesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onLoadData: PropTypes.func,
};
