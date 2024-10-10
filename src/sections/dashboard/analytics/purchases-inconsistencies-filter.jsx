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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

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
      { label: 'EMITIDO A OTRO RUC', value: 'EMITIDO A OTRO RUC' },
      { label: 'NRO SERIE INCORRECTO', value: 'NRO SERIE INCORRECTO' },
      { label: 'NO EXISTE', value: 'NO EXISTE' },
      { label: 'ANULADO', value: 'ANULADO' },
      { label: 'NO AUTORIZADO', value: 'NO AUTORIZADO' },
    ],
  },
  { label: 'Inconsistencia', value: 'incons' },
  { label: 'Condición', value: 'cond' },
];

export const PurchasesInconsistenciesFilter = (props) => {
  const { selectedParams, setSelectedParams, loading, onLoadData } = props;
  const [selectedOptions, setSelectedOptions] = useState({ incons: [] });
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [detailOptions, setDetailOptions] = useState([]);
  const [expanded, setExpanded] = useState({});

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  // const handleSelectedOptions = (option) => {
  //   let updatedSelection = { ...selectedOptions };

  //   if (option.value === 'all') {
  //     // Si se selecciona "all", seleccionamos todas las opciones principales
  //     if (Object.keys(updatedSelection).length === filterOptions.length) {
  //       updatedSelection = {}; // Desmarcar todo
  //     } else {
  //       updatedSelection = filterOptions.reduce((acc, opt) => {
  //         if (opt.subOptions) {
  //           acc[opt.value] = opt.subOptions.map((sub) => sub.value); // Seleccionar todas las subopciones
  //         } else {
  //           acc[opt.value] = [];
  //         }
  //         return acc;
  //       }, {});
  //     }
  //   } else if (selectedOptions[option.value]) {
  //     // Si la opción ya está seleccionada, la eliminamos y sus subOptions
  //     delete updatedSelection[option.value];
  //   } else {
  //     // Si es nueva, la añadimos y si tiene subOptions las marcamos todas
  //     if (option.subOptions) {
  //       updatedSelection[option.value] = option.subOptions.map((sub) => sub.value);
  //       setDetailOptions(option.subOptions); // Mostrar suboptions en el menú de detalles
  //       setSelectedDetails(option.subOptions.map((subOption) => subOption.value));
  //     } else {
  //       updatedSelection[option.value] = [];
  //     }
  //   }
  //   setSelectedOptions(updatedSelection);
  //   setSelectedParams((state) => ({ ...state, ['filters']: updatedSelection }));
  // };

  const handleSelectedOptions = (option) => {
    let updatedSelection = { ...selectedOptions };

    if (option.value === 'all') {
      if (Object.keys(updatedSelection).length === filterOptions.length) {
        updatedSelection = {}; // Desmarcar todo
      } else {
        updatedSelection = filterOptions.reduce((acc, opt) => {
          acc[opt.value] = opt.subOptions ? opt.subOptions.map((sub) => sub.value) : [];
          return acc;
        }, {});
      }
    } else if (updatedSelection[option.value]) {
      // Si la opción ya está seleccionada, eliminarla
      delete updatedSelection[option.value];
    } else {
      // Si es nueva, la añadimos y si tiene subOptions las marcamos todas
      if (option.subOptions) {
        const previouslySelected = selectedOptions[option.value] || []; // Recuperar las seleccionadas previamente
        const allSubOptions = option.subOptions.map((sub) => sub.value);

        // Si no hay suboptions previas seleccionadas, seleccionamos todas
        if (previouslySelected.length === 0) {
          updatedSelection[option.value] = allSubOptions;
        } else {
          updatedSelection[option.value] = previouslySelected; // Dejar las seleccionadas previamente
        }
      } else {
        updatedSelection[option.value] = [];
      }
    }

    setSelectedOptions(updatedSelection);
    setSelectedParams((state) => ({ ...state, filters: updatedSelection }));
  };

  const handleSelectedDetails = (subOption) => {
    const parentOption = detailOptions[0].parent;
    const updatedSelectedOptions = { ...selectedOptions };

    if (!updatedSelectedOptions[parentOption]) {
      updatedSelectedOptions[parentOption] = [];
    }

    const currentSubOptions = updatedSelectedOptions[parentOption];

    // Si la subopción ya está seleccionada, la eliminamos
    if (currentSubOptions.includes(subOption.value)) {
      updatedSelectedOptions[parentOption] = currentSubOptions.filter(
        (item) => item !== subOption.value
      );
    } else {
      // Si no está seleccionada, la añadimos
      updatedSelectedOptions[parentOption].push(subOption.value);
    }

    // Verificar si quedan suboptions, si no quedan, eliminar el parentOption
    if (updatedSelectedOptions[parentOption].length === 0) {
      delete updatedSelectedOptions[parentOption];
    }

    setSelectedOptions(updatedSelectedOptions); // Actualizar el estado de las subOptions
    setSelectedParams((state) => ({ ...state, filters: updatedSelectedOptions })); // Actualizar el estado de los parámetros
  };

  const toggleSubMenu = (option) => {
    if (option.subOptions) {
      // Obtener las subopciones ya seleccionadas del estado o inicializar una lista vacía
      const selectedSubOptions = selectedOptions[option.value] || [];
      setDetailOptions(option.subOptions.map((sub) => ({ ...sub, parent: option.value }))); // Añadimos la referencia al padre (option)
      setSelectedDetails(selectedSubOptions); // Reflejar el estado de las suboptions ya seleccionadas
    } else {
      setDetailOptions([]);
    }
  };

  const handleBackToMainMenu = () => {
    setDetailOptions([]);
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

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: selectedOptions,
    }));

    console.log('Filtros seleccionados: ', selectedOptions);
  }, [selectedOptions, setSelectedParams]);

  useEffect(() => {
    console.log('Opciones seleccionadas: ', selectedOptions);
    console.log('Detalles seleccionados: ', selectedDetails);
  }, [selectedOptions, selectedDetails]);

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
                  maxHeight: 400,
                },
              },
            },
          }}
          value={Object.keys(selectedOptions)}
          onChange={() => {}} // Vacío porque manejamos onClick
        >
          {!detailOptions.length
            ? filterOptions.map((option) => (
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
                        toggleSubMenu(option); // Mostrar suboptions al hacer click
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  )}
                </MenuItem>
              ))
            : // Mostrar solo las suboptions
              [
                <MenuItem onClick={handleBackToMainMenu}>
                  <NavigateBeforeIcon />
                  <ListItemText primary="Volver al menú principal" />
                </MenuItem>,
                detailOptions.map((subOption) => (
                  <MenuItem
                    key={subOption.value}
                    value={subOption.value}
                    onClick={() => handleSelectedDetails(subOption)}
                  >
                    <Checkbox checked={selectedDetails.includes(subOption.value)} />
                    <ListItemText primary={subOption.label} />
                  </MenuItem>
                )),
              ]}
        </TextField>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onLoadData}
          startIcon={<FilterListIcon />}
          disabled={loading ? true : false}
          sx={{ height: '56px', maxWidth: 120 }}
        >
          Filtrar
        </Button>
      </Box>
    </Box>
  );
};

PurchasesInconsistenciesFilter.propTypes = {
  loading: PropTypes.bool,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
  onLoadData: PropTypes.func,
};
