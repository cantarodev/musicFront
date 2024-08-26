import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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

const searchPeriodOptions = [
  {
    label: convertirFecha('202408'),
    value: '202408',
  },
  {
    label: convertirFecha('202407'),
    value: '202407',
  },
  {
    label: convertirFecha('202406'),
    value: '202406',
  },
  {
    label: convertirFecha('202405'),
    value: '202405',
  },
  {
    label: convertirFecha('202404'),
    value: '202404',
  },
  {
    label: convertirFecha('202403'),
    value: '202403',
  },
];

const searchTypeOptions = [
  {
    label: 'Todos',
    value: 'all',
  },
  {
    label: '01 - Factura',
    value: '01',
  },
  {
    label: '03 - Boleta de venta',
    value: '03',
  },
  {
    label: '07 - Nota de crédito',
    value: 'F7',
  },
  {
    label: '08 - Nota de débito',
    value: 'F8',
  },
];

const searchCurrencyOptions = [
  {
    label: 'Todos',
    value: 'all',
  },
  {
    label: 'USD - Dólares',
    value: 'USD',
  },
  {
    label: 'PEN- Soles',
    value: 'PEN',
  },
  {
    label: 'EUR - Euros',
    value: 'EUR',
  },
];

export const PurchasesFilter = (props) => {
  const { selectedParams, setSelectedParams, onApplyFilters } = props;

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters();
  };

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
    >
      <Stack
        alignItems="center"
        direction="row"
        gap={2}
      >
        <TextField
          label="Periodo"
          name="period"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.period}
        >
          {searchPeriodOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
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
    </Stack>
  );
};

PurchasesFilter.propTypes = {
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onApplyFilters: PropTypes.func,
};
