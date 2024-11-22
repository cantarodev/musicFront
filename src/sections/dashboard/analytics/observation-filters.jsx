import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Box, Checkbox, IconButton, ListItemText, MenuItem, Tooltip } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import esES from 'date-fns/locale/es';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'src/hooks/use-local-storage';

const customEnLocale = {
  ...esES,
  options: {
    ...esES.options,
    weekStartsOn: 1,
  },
};

const validations = [
  { label: 'Todos', value: 'all' },
  { label: 'Tipo de Cambio', value: 'tipoCambio' },
  {
    label: 'CPE',
    value: 'cpe',
    subOptions: [
      { label: 'EMITIDO A OTRO RUC', value: 'emitido a otro contribuyente' },
      { label: 'NRO SERIE INCORRECTO', value: 'serie es incorrecta' },
      { label: 'F. EMISION INCORRECTA', value: 'emisión es incorrecta' },
      { label: 'NO EXISTE', value: 'no existe' },
      { label: 'ANULADO', value: 'anulado' },
      { label: 'NO AUTORIZADO', value: 'no autorizado' },
    ],
  },
  { label: 'Inconsistencias', value: 'inconsistencias' },
  { label: 'Condición', value: 'condicion' },
  { label: 'Obligados CPE', value: 'obligado' },
];

export const ObservationFilters = (props) => {
  const { selectedParams, setSelectedParams, onLoadData, type, hide } = props;
  const results = useSelector((state) => {
    const reportTypes = {
      Compras: state.report.purchases,
      Ventas: state.report.sales,
      Faltantes: state.report.missings,
    };
    return reportTypes[type] || [];
  });
  const [filters, setFilters] = useLocalStorage('filters');

  const [activeSubOptions, setActiveSubOptions] = useState(null);
  const [clean, setClean] = useState(false);

  const getLabel = (value) => {
    const option = validations.find((opt) => opt.value === value);
    return option ? option.label : null;
  };

  const getSubLabel = (list) => {
    const cpeOption = validations.find((option) => option.value === 'cpe');

    for (let str of list) {
      for (let subOption of cpeOption.subOptions) {
        if (String(str).toLocaleLowerCase().includes(subOption.value)) {
          return { label: subOption.label, value: subOption.value };
        }
      }
    }

    return null;
  };

  const getUniqueByLabelAndValue = (array) => {
    const uniqueSet = new Set();
    const uniqueArray = [];

    array.forEach((item) => {
      const identifier = JSON.stringify({ label: item.label, value: item.value });
      if (!uniqueSet.has(identifier)) {
        uniqueSet.add(identifier);
        uniqueArray.push(item);
      }
    });

    return uniqueArray;
  };

  const handleSubOptionClick = (option) => {
    setActiveSubOptions(option);
  };

  const handleBackToMainMenu = () => {
    setActiveSubOptions(null);
  };

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      currency: 'all',
      filters: { all: [] },
    }));
  }, [selectedParams.docType]);

  useEffect(() => {
    setSelectedParams((state) => ({
      ...state,
      filters: { all: [] },
    }));
  }, [selectedParams.currency]);

  useEffect(() => {
    onLoadData();
  }, [selectedParams.period, selectedParams.queryType]);

  const searchTypeOptions = useMemo(
    () => [
      { label: 'Todos', value: 'all' },
      ...Array.from(
        new Map(results?.map((doc) => [doc.codComp, doc.tipoComprobante])).entries()
      ).map(([codComp, tipoComprobante]) => ({
        label: tipoComprobante,
        value: codComp,
      })),
    ],
    [results]
  );

  const searchCurrencyOptions = useMemo(() => {
    const currencyMap = new Map(
      results
        ?.map((doc) => {
          if (selectedParams.docType === 'all' || doc.codComp === selectedParams.docType) {
            return [doc.moneda, doc.tipoMoneda];
          }
        })
        .filter(Boolean)
    );

    return [
      { label: 'Todos', value: 'all' },
      ...Array.from(currencyMap.entries()).map(([moneda, tipoMoneda]) => ({
        label: tipoMoneda,
        value: moneda,
      })),
    ];
  }, [results, selectedParams.docType]);

  const filterOptions = useMemo(() => {
    const uniqueObservationKeys = new Set();
    const subOptions = [];

    results
      ?.filter(
        (item) =>
          (selectedParams.docType === 'all' || item.codComp === selectedParams.docType) &&
          (selectedParams.currency === 'all' || item.moneda === selectedParams.currency)
      )
      .forEach((item) => {
        if (item.observaciones) {
          const keys = Object.keys(item.observaciones);
          keys.forEach((key) => uniqueObservationKeys.add(key));
          if (item.observaciones.hasOwnProperty('cpe')) {
            const result = getSubLabel(item.observaciones.cpe);
            if (result) {
              subOptions.push(result);
            }
          }
        }
      });

    let uniqueSubOptions = [];
    if (subOptions.length) {
      uniqueSubOptions = getUniqueByLabelAndValue(subOptions);
    }

    return [
      { label: 'Todos', value: 'all' },
      ...Array.from(uniqueObservationKeys).map((key) => {
        const hasSubOptions = key === 'cpe' && uniqueSubOptions.length > 0;

        return {
          label: getLabel(key),
          value: key,
          subOptions: hasSubOptions ? uniqueSubOptions : undefined,
        };
      }),
    ];
  }, [results, selectedParams.docType, selectedParams.currency, clean]);

  const handleSelected = (event) => {
    const { name, value } = event.target;
    setSelectedParams((state) => ({ ...state, [name]: value }));
  };

  const handleSelectedOptions = (option, subOption = null) => {
    let updatedSelection = { ...selectedParams.filters };

    if (option.value === 'all') {
      if (updatedSelection.all) {
        updatedSelection = {};
      } else {
        updatedSelection = filterOptions.reduce((acc, opt) => {
          if (opt.value !== 'all') {
            acc[opt.value] = opt.subOptions ? opt.subOptions.map((subOpt) => subOpt.value) : [];
          }
          return acc;
        }, {});
        updatedSelection.all = [];
      }
    } else if (subOption) {
      const mainOptionValue = option.value;

      if (!updatedSelection[mainOptionValue]) {
        updatedSelection[mainOptionValue] = [];
      }

      if (updatedSelection[mainOptionValue].includes(subOption.value)) {
        updatedSelection[mainOptionValue] = updatedSelection[mainOptionValue].filter(
          (val) => val !== subOption.value
        );
      } else {
        updatedSelection[mainOptionValue].push(subOption.value);
      }

      if (updatedSelection[mainOptionValue].length === 0) {
        delete updatedSelection[mainOptionValue];
      }
    } else {
      if (option.subOptions && option.subOptions.length > 0) {
        if (updatedSelection[option.value]) {
          delete updatedSelection[option.value];
        } else {
          updatedSelection[option.value] = option.subOptions.map((subOpt) => subOpt.value);
        }
      } else {
        if (updatedSelection[option.value]) {
          delete updatedSelection[option.value];
        } else {
          updatedSelection[option.value] = [];
        }
      }
    }

    const allOptionsSelected = filterOptions.every(
      (opt) =>
        opt.value === 'all' ||
        (updatedSelection[opt.value] &&
          (!opt.subOptions ||
            opt.subOptions.every((subOpt) => updatedSelection[opt.value].includes(subOpt.value))))
    );
    if (allOptionsSelected) {
      updatedSelection.all = [];
    } else {
      delete updatedSelection.all;
    }

    setSelectedParams((state) => ({ ...state, filters: updatedSelection }));
  };

  const handleCleanFilters = () => {
    setSelectedParams((state) => ({
      ...state,
      docType: 'all',
      currency: 'all',
      filters: { all: [] },
    }));
    setClean(!clean);
  };

  const renderValue = (selected) => {
    if (selected.includes('all')) {
      return 'Todos seleccionados';
    }
    const labels = selected.flatMap((option) => {
      const parentOption = filterOptions.find((opt) => opt.value === option);
      return parentOption?.label || option;
    });

    if (labels.length > 2) {
      return `${labels.slice(0, 2).join(', ')}, ...`;
    }

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
    setFilters({
      searchTypeOptions,
      searchCurrencyOptions,
      period: selectedParams.period,
      type: selectedParams.queryType,
    });
  }, [searchTypeOptions, searchCurrencyOptions, selectedParams.period, selectedParams.queryType]);

  useEffect(() => {
    const allFilterKeys = filterOptions.map((option) => option.value);
    const newFilters = allFilterKeys.reduce((acc, key) => {
      const option = filterOptions.find((opt) => opt.value === key);

      if (option && option.subOptions) {
        acc[key] = option.subOptions.map((subOption) => subOption.value);
      } else {
        acc[key] = [];
      }

      return acc;
    }, {});

    setSelectedParams((state) => ({
      ...state,
      filters: {
        ...newFilters,
      },
    }));
  }, [filterOptions, selectedParams.periodo, selectedParams.docType, selectedParams.currency]);

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
        {!hide?.includes('period') && (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={customEnLocale}
          >
            <DatePicker
              name="period"
              label="Periodo"
              views={['year', 'month']}
              openTo="month"
              value={parseDateFromYYYYMM(selectedParams.period || filters.period)}
              onChange={handleDateChange}
              textField={(params) => (
                <TextField
                  {...params}
                  placeholder="Selecciona un período"
                  fullWidth
                  margin="normal"
                />
              )}
              format="MMMM, yyyy"
            />
          </LocalizationProvider>
        )}

        {!hide?.includes('docType') && (
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
        )}

        {!hide?.includes('currency') && (
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
        )}

        {!hide?.includes('filters') && (
          <TextField
            fullWidth
            label="Validaciones"
            name="filters"
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
            value={Object.keys(selectedParams.filters)}
            onChange={() => {}}
          >
            {activeSubOptions
              ? [
                  <MenuItem
                    onClick={handleBackToMainMenu}
                    key="back"
                  >
                    <IconButton size="small">
                      <ArrowBackIcon />
                    </IconButton>
                    <ListItemText primary="Volver al menú principal" />
                  </MenuItem>,
                  activeSubOptions.subOptions.map((subOption) => (
                    <MenuItem
                      key={subOption.value}
                      value={subOption.value}
                      onClick={() => handleSelectedOptions(activeSubOptions, subOption)}
                      sx={{ pl: 4 }}
                    >
                      <Checkbox
                        checked={Boolean(
                          selectedParams.filters[activeSubOptions.value]?.includes(subOption.value)
                        )}
                      />
                      <ListItemText primary={subOption.label} />
                    </MenuItem>
                  )),
                ]
              : filterOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    onClick={() => handleSelectedOptions(option)}
                  >
                    <Checkbox
                      checked={Boolean(selectedParams.filters[option.value])}
                      indeterminate={
                        option.subOptions &&
                        selectedParams.filters[option.value] &&
                        selectedParams.filters[option.value].length > 0 &&
                        selectedParams.filters[option.value].length < option.subOptions.length
                      }
                    />
                    <ListItemText primary={option.label} />
                    {option.subOptions?.length > 0 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Detener la propagación para evitar la selección de la opción principal
                          handleSubOptionClick(option); // Mostrar suboptions al hacer click en el icono
                        }}
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
          </TextField>
        )}

        <Tooltip title="Restablecer filtros">
          <IconButton
            onClick={handleCleanFilters}
            size="large"
          >
            <RestoreIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

ObservationFilters.propTypes = {
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
  onLoadData: PropTypes.func,
  type: PropTypes.string,
};
