import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Grid01Icon from '@untitled-ui/icons-react/build/esm/Grid01';
import ListIcon from '@untitled-ui/icons-react/build/esm/List';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { startOfMonth, format } from 'date-fns';
import { esES } from '@mui/x-date-pickers/locales';

const searchTypeOptions = [
  {
    label: 'Compras',
    value: 'compras',
  },
  {
    label: 'Ventas',
    value: 'ventas',
  },
];

const searchStatusOptions = [
  {
    label: 'Todo',
    value: 'todo',
  },
  {
    label: 'No existe en PLE',
    value: 'no-ple',
  },
  {
    label: 'Existe en PLE',
    value: 'si-ple',
  },
  {
    label: 'No existe en Base de Datos',
    value: 'no-bd',
  },
  {
    label: 'Existe en Base de Datos',
    value: 'si-bd',
  },
];

export const PurchasesFilter = (props) => {
  const { selectedParams, setSelectedParams } = props;

  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(startOfMonth(currentDate));

  const handleSelected = (event) => {
    const { value } = event.target;
    setSelectedParams((state) => ({ ...state, type: value }));
  };

  const handleDateChange = useCallback(
    (date) => {
      const value = formatDate(date);
      setSelectedDate(date);
      setSelectedParams((state) => ({ ...state, period: value }));
    },
    [setSelectedParams]
  );

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'yyyyMM');
  };

  useEffect(() => {
    handleDateChange(selectedDate);
  }, [selectedDate, handleDateChange]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      gap={2}
    >
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={esES}
      >
        <DatePicker
          label="Periodo"
          views={['year', 'month']}
          value={selectedDate}
          onChange={handleDateChange}
          textField={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="normal"
            />
          )}
          format="MMMM, yyyy" // Formato para la entrada
        />
      </LocalizationProvider>
    </Stack>
  );
};

PurchasesFilter.propTypes = {
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
};
