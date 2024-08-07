import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { MultiSelect } from 'src/components/multi-select';
import { useUpdateEffect } from 'src/hooks/use-update-effect';
import { Autocomplete, TextField } from '@mui/material';

import { usersApi } from 'src/api/users/userService';

const statusOptions = [
  {
    label: 'Pendiente',
    value: 'pending',
  },
  {
    label: 'Activo',
    value: 'active',
  },
  {
    label: 'Inactivo',
    value: 'inactive',
  },
];

export const SunKeyListSearch = (props) => {
  const { onFiltersChange, ...other } = props;
  const queryRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [chips, setChips] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const getUsers = async () => {
    const response = await usersApi.getUsers();
    const users = response.data.map((usuario) => ({
      label: usuario.name + ' ' + usuario.lastname,
      user_id: usuario._id,
    }));
    setUsers(users);
    return users;
  };

  const handleChipsUpdate = useCallback(() => {
    const filters = {
      query: undefined,
      status: [],
      user_id: undefined,
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case 'query':
          filters.query = chip.value;
          break;
        case 'status':
          filters.status.push(chip.value);
          break;
        case 'user_id':
          filters.user_id = chip.value;
          break;
        default:
          break;
      }
    });

    onFiltersChange?.(filters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips, handleChipsUpdate]);

  const handleChipDelete = useCallback((deletedChip) => {
    setChips((prevChips) => {
      return prevChips.filter((chip) => {
        return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
      });
    });
  }, []);

  const handleAutocompleteChange = (event, newValue) => {
    event.preventDefault();

    const { label, user_id } = newValue || { label: '', user_id: '' };
    const value = user_id;

    setChips((prevChips) => {
      const foundNameChip = prevChips.find((chip) => chip.field === 'user_id');

      if (foundNameChip && value) {
        return prevChips.map((chip) => {
          if (chip.field === 'user_id') {
            return {
              ...chip,
              value: user_id || '',
            };
          }
          return chip;
        });
      }

      if (foundNameChip && !value) {
        return prevChips.filter((chip) => chip.field !== 'user_id');
      }

      if (!foundNameChip && value) {
        const chip = {
          label: 'Usuario',
          field: 'user_id',
          value,
          displayValue: label,
        };

        return [...prevChips, chip];
      }

      return prevChips;
    });
  };

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();

    const value = queryRef.current?.value || '';

    setChips((prevChips) => {
      const foundNameChip = prevChips.find((chip) => chip.field === 'query');

      if (foundNameChip && value) {
        return prevChips.map((chip) => {
          if (chip.field === 'query') {
            return {
              ...chip,
              value: queryRef.current?.value || '',
            };
          }
          return chip;
        });
      }

      if (foundNameChip && !value) {
        return prevChips.filter((chip) => chip.field !== 'query');
      }

      if (!foundNameChip && value) {
        const chip = {
          label: 'Nombre o Ruc',
          field: 'query',
          value,
        };

        return [...prevChips, chip];
      }

      return prevChips;
    });

    if (queryRef.current) {
      queryRef.current.value = '';
    }
  }, []);

  const handleStatusChange = useCallback((values) => {
    setChips((prevChips) => {
      const valuesFound = [];
      // First cleanup the previous chips
      const newChips = prevChips.filter((chip) => {
        if (chip.field !== 'status') {
          return true;
        }

        const found = values.includes(chip.value);

        if (found) {
          valuesFound.push(chip.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newChips;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = statusOptions.find((option) => option.value === value);

          newChips.push({
            label: 'Estado',
            field: 'status',
            value,
            displayValue: option.label,
          });
        }
      });

      return newChips;
    });
  }, []);

  const statusValues = useMemo(
    () => chips.filter((chip) => chip.field === 'status').map((chip) => chip.value),
    [chips]
  );

  const showChips = chips.length > 0;

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        spacing={1}
        sx={{ p: 1 }}
      >
        <Stack
          alignItems="center"
          component="form"
          direction="row"
          onSubmit={handleQueryChange}
          spacing={2}
          sx={{ p: 2 }}
        >
          <SvgIcon>
            <SearchMdIcon />
          </SvgIcon>
          <Input
            defaultValue=""
            disableUnderline
            fullWidth
            inputProps={{ ref: queryRef }}
            placeholder="Filtrar por nombre o ruc ..."
            sx={{ flexGrow: 1 }}
          />
        </Stack>
        <Autocomplete
          disablePortal
          id="combo-box"
          options={users}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Usuarios"
            />
          )}
          onChange={handleAutocompleteChange}
        />
      </Stack>
      <Divider />
      {showChips ? (
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2 }}
        >
          {chips.map((chip, index) => (
            <Chip
              key={index}
              label={
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    '& span': {
                      fontWeight: 600,
                    },
                  }}
                >
                  <>
                    <span>{chip.label}</span>: {chip.displayValue || chip.value}
                  </>
                </Box>
              }
              onDelete={() => handleChipDelete(chip)}
              variant="outlined"
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography
            color="text.secondary"
            variant="subtitle2"
          >
            No se aplicaron filtros
          </Typography>
        </Box>
      )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Estados"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        />
      </Stack>
    </div>
  );
};

SunKeyListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
};
