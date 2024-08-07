import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { usersApi } from 'src/api/users/userService';
import { useEffect, useState } from 'react';

export default function ComboBox() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await usersApi.getUsers();
    const users = response.data.map((usuario) => ({
      label: usuario.name + ' ' + usuario.lastname,
      email: usuario.email,
    }));
    setUsers(users);
    return users;
  };

  const handleSelectedUser = (event, value) => {
    if (value) {
      console.log(value.email);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
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
      onChange={handleSelectedUser}
    />
  );
}

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
];
