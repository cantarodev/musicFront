import { useCallback, useRef } from 'react';
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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const searchOptions = [
  {
    label: 'Compras',
    value: 'compras',
  },
  {
    label: 'Ventas',
    value: 'ventas',
  },
];

export const ItemSearch = (props) => {
  const {
    onFiltersChange,
    onSortChange,
    onViewChange,
    view = 'grid',
    // sortBy = 'createdAt',
    selectedParams,
    setSelectedParams,
  } = props;
  const queryRef = useRef(null);

  const handleQueryChange = useCallback(
    (event) => {
      event.preventDefault();
      const query = queryRef.current?.value || '';

      onFiltersChange?.({
        query,
      });
    },
    [onFiltersChange]
  );

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    console.log(value);
  }, []);

  const handleSelected = (event) => {
    const { value } = event.target;
    console.log(value);
    setSelectedParams((state) => ({ ...state, type: value }));
  };

  const handleViewChange = useCallback(
    (event, value) => {
      onViewChange?.(value);
    },
    [onViewChange]
  );

  return (
    <Card>
      <Stack
        alignItems="center"
        direction="row"
        gap={2}
        sx={{ p: 2 }}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{ flexGrow: 1 }}
        >
          <OutlinedInput
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            name="itemName"
            placeholder="Buscar"
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <ToggleButtonGroup
          exclusive
          onChange={handleViewChange}
          sx={{
            borderWidth: 1,
            borderColor: 'divider',
            borderStyle: 'solid',
            [`& .${toggleButtonGroupClasses.grouped}`]: {
              margin: 0.5,
              border: 0,
              '&:not(:first-of-type)': {
                borderRadius: 1,
              },
              '&:first-of-type': {
                borderRadius: 1,
              },
            },
          }}
          value={view}
        >
          <ToggleButton value="grid">
            <SvgIcon fontSize="small">
              <Grid01Icon />
            </SvgIcon>
          </ToggleButton>
          <ToggleButton value="list">
            <SvgIcon fontSize="small">
              <ListIcon />
            </SvgIcon>
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Tipo"
          name="search"
          onChange={handleSelected}
          select
          SelectProps={{ native: true }}
          value={selectedParams.type}
        >
          {searchOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
      </Stack>
    </Card>
  );
};

ItemSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  onViewChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(['asc', 'desc']),
  view: PropTypes.oneOf(['grid', 'list']),
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func,
};
