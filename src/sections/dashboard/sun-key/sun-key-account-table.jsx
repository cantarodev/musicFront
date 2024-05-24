import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import { AccountRow } from './sun-key-account-row';

export const AccountTable = ({
  items,
  selected,
  onSelectAll,
  onDeselectAll,
  onSelectOne,
  onDeselectOne,
  handleClaveSolSelected,
  handleOpen,
  handleClaveSolAccountsGet,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 700 }}
        id="tbl_accounts"
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected.length === items.length}
                indeterminate={selected.length > 0 && selected.length < items.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelectAll?.();
                  } else {
                    onDeselectAll?.();
                  }
                }}
              />
            </TableCell>
            <TableCell width="30%">Nombre</TableCell>
            <TableCell width="15%">Ruc</TableCell>
            <TableCell width="15%">Usuario</TableCell>
            <TableCell width="15%">Verificado</TableCell>
            <TableCell width="15%">Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((claveSol) => (
            <AccountRow
              key={claveSol.account_id}
              claveSol={claveSol}
              selected={selected}
              onSelectOne={onSelectOne}
              onDeselectOne={onDeselectOne}
              handleClaveSolSelected={handleClaveSolSelected}
              handleOpen={handleOpen}
              handleClaveSolAccountsGet={handleClaveSolAccountsGet}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AccountTable.propTypes = {
  items: PropTypes.array,
  selected: PropTypes.array,
  onSelectAll: PropTypes.func,
  onDeselectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onDeselectOne: PropTypes.func,
  handleClaveSolSelected: PropTypes.func,
  handleOpen: PropTypes.func,
  handleClaveSolAccountsGet: PropTypes.func,
};
