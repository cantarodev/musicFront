import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import esES from 'date-fns/locale/es';

// Locale personalizado para que la semana comience en lunes
const customEnLocale = {
  ...esES,
  options: {
    ...esES.options,
    weekStartsOn: 1,
  },
};

// Opciones para tipo de comprobante
const searchTypeOptions = [
  { label: 'Todos', value: 'all' },
  { label: '01 - Factura', value: '01' },
  { label: '03 - Boleta de venta', value: '03' },
  { label: '07 - Nota de crédito', value: '07' },
  { label: '08 - Nota de débito', value: '08' },
];

// Opciones de estados de factoring
const factoringStatusOptions = [
  { label: 'No válido', value: 'No válido' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Pendiente por reinicio', value: 'Pendiente por reinicio' },
  { label: 'Subsanado', value: 'Subsanado' },
  { label: 'Disconforme', value: 'Disconforme' },
];

// Opciones de filtros
const filterOptions = [{ label: 'Todos', value: 'all' }];

export const CorrelativityInconsistenciesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;

  // Valores iniciales para las opciones seleccionadas
  const [selectedOptions, setSelectedOptions] = useState(['all']);
  const [selectedFactoringStatus, setSelectedFactoringStatus] = useState([]);
  const [expanded, setExpanded] = useState({});

  // Manejo de fecha predeterminada
  useEffect(() => {
    const currentMonth = format(new Date(), 'yyyyMM');
    setSelectedParams((state) => ({ ...state, period: currentMonth }));
  }, [setSelectedParams]);

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleSelectedOptions = (option) => {
    let updatedSelection = [];

    if (option.value === 'all') {
      updatedSelection = selectedOptions.includes('all') ? [] : ['all'];
    } else {
      updatedSelection = selectedOptions.includes(option.value)
        ? selectedOptions.filter((item) => item !== option.value && item !== 'all')
        : [...selectedOptions.filter((item) => item !== 'all'), option.value];

      if (updatedSelection.length === filterOptions.length - 1) {
        updatedSelection.push('all');
      }
    }

    setSelectedOptions(updatedSelection);
    setSelectedParams((state) => ({ ...state, filters: updatedSelection }));
  };

  const handleSubOptionSelect = (subOption) => {
    setSelectedFactoringStatus((prevSelected) => {
      const alreadySelected = prevSelected.includes(subOption.value);
      return alreadySelected
        ? prevSelected.filter((val) => val !== subOption.value)
        : [...prevSelected, subOption.value];
    });
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) return 'Todos seleccionados';
    if (selected.length > 2) return `${selected.length} seleccionados`;
    return selected.map((value) => filterOptions.find((opt) => opt.value === value)?.label).join(', ');
  };

  const formatDate = (date) => (date ? format(date, 'yyyyMM') : '');

  const parseDateFromYYYYMM = (dateString) => (dateString ? parse(dateString, 'yyyyMM', new Date()) : null);

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
  }, [selectedOptions, selectedFactoringStatus, setSelectedParams]);

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: 'none' } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          '& > *': { flex: { xs: '1 1 100%', md: '1 1 0' } },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={customEnLocale}>
          <DatePicker
            label="Periodo"
            views={['year', 'month']}
            openTo="month"
            value={parseDateFromYYYYMM(selectedParams.period)}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            format="MMMM, yyyy"
          />
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          value={selectedParams.docType}
          SelectProps={{
            native: true,
          }}
        >
          {searchTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Validaciones"
          select
          SelectProps={{
            multiple: true,
            renderValue,
            MenuProps: { PaperProps: { style: { maxHeight: 600 } } },
          }}
          value={selectedOptions}
          onChange={() => {}}
        >
          {filterOptions.map((option) => (
            <div key={option.value}>
              <MenuItem value={option.value} onClick={() => handleSelectedOptions(option)}>
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
                <Collapse in={expanded[option.value]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {option.subOptions.map((subOption) => (
                      <MenuItem
                        key={subOption.value}
                        onClick={() => handleSubOptionSelect(subOption)}
                        sx={{ pl: 4 }}
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
          disabled={loading}
          sx={{ height: '56px' }}
        >
          Filtrar
        </Button>
      </Box>
    </Box>
  );
};

CorrelativityInconsistenciesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onLoadData: PropTypes.func,
};
