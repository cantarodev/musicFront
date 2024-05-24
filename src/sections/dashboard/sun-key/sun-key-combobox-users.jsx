import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { usersApi } from 'src/api/users';

export default function ComboBox() {
  const getUsers = async () => {
    const response = await usersApi.getUsers(searchState);
  };
  return (
    <Autocomplete
      disablePortal
      id="combo-box"
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Usuarios"
        />
      )}
    />
  );
}

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
];
