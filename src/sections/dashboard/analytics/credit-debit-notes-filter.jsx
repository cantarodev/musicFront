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
  { label: 'Fecha Emision', value: 'fecha_emision' },
  { label: 'Importe Total', value: 'importe_total' },
  { label: 'NC Sin F/B', value: 'nc_sin_f_b' },
  { label: 'NC Negativo / ND Positivo NC', value: 'nc_nd_valor' },
];

export const CreditDebitInconsistenciesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;
  const [selectedOptions, setSelectedOptions] = useState(['general']);
  const [selectedFactoringStatus, setSelectedFactoringStatus] = useState([]); // Para almacenar estados seleccionados
  const [expanded, setExpanded] = useState({});

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

  const handleSubOptionSelect = (subOption) => {
    setSelectedFactoringStatus((prevSelected) => {
      const alreadySelected = prevSelected.includes(subOption.value);

      if (alreadySelected) {
        return prevSelected.filter((val) => val !== subOption.value);
      } else {
        return [...prevSelected, subOption.value];
      }
    });
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

  const toggleSubMenu = (option) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [option.value]: !prevExpanded[option.value],
    }));
  };

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: selectedOptions,
      factoringStatuses: selectedFactoringStatus,
    }));

    // Agregar console.log para validar los datos
    console.log('Filtros seleccionados: ', selectedOptions);
  }, [selectedOptions, selectedFactoringStatus, setSelectedParams]);
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
                },
              },
            },
          }}
          value={selectedOptions}
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
                <Checkbox checked={selectedOptions.includes(option.value)} />
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
                        onClick={() => handleSubOptionSelect(subOption)}
                        sx={{ pl: 4 }} // Indent the subitems
                      >
                        <Checkbox checked={selectedFactoringStatus.includes(subOption.value)} />
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

CreditDebitInconsistenciesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onLoadData: PropTypes.func,
};
