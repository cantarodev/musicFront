import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox, ListItemText, MenuItem, Box } from '@mui/material';
import { useEffect, useState } from 'react';

// Función para convertir fecha
function convertirFecha(fechaStr) {
  if (!/^\d{6}$/.test(fechaStr)) {
    throw new Error('Formato de fecha inválido. Debe ser "YYYYMM".');
  }

  const anio = fechaStr.slice(0, 4);
  const mes = fechaStr.slice(4, 6);

  const fecha = parse(`${anio}-${mes}-01`, 'yyyy-MM-dd', new Date());

  let fechaFormateada = format(fecha, 'MMMM, yyyy', { locale: es });

  fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  return fechaFormateada;
}

// Opciones de filtros y otros campos
const searchPeriodOptions = [
  { label: convertirFecha('202408'), value: '202408' },
  { label: convertirFecha('202407'), value: '202407' },
  { label: convertirFecha('202406'), value: '202406' },
  { label: convertirFecha('202405'), value: '202405' },
  { label: convertirFecha('202404'), value: '202404' },
  { label: convertirFecha('202403'), value: '202403' },
];

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
  const { selectedParams, setSelectedParams } = props;
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

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: selectedOptions,
      factoringStatuses: selectedFactoringStatus,
    }));

    // Agregar console.log para validar los datos
    console.log("Filtros seleccionados: ", selectedOptions);
    console.log("Estados de Factoring seleccionados: ", selectedFactoringStatus);

  }, [selectedOptions, selectedFactoringStatus, setSelectedParams]);
  console.log("PARAMS",selectedParams);
  return (
    <Stack alignItems="center" direction="column" spacing={2}>
      {/* Filtros Principales */}
      <Stack alignItems="center" direction="row" spacing={2}>
        <TextField
          label="Periodo"
          name="period"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.period}
        >
          {searchPeriodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <TextField
          label="Tipo Comprobante"
          name="docType"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.docType}
        >
          {searchTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
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
        >
          {searchCurrencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>

        {/* Filtro de Factoring */}
        <TextField
          label="Filtros"
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
          sx={{ width: '200px' }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value} onClick={() => handleSelectedOptions(option)}>
              <Checkbox checked={selectedOptions.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Estados de Factoring alineados en la misma línea */}
      {selectedOptions.includes('facto') && (
        <Box mt={2} display="flex" flexDirection="row" gap={2}>
          {factoringStatusOptions.map((status) => (
            <MenuItem key={status.value} value={status.value}>
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
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
};
