import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Checkbox, Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { SeverityPill } from 'src/components/severity-pill';
import { SunKeyMoreMenu } from 'src/components/sun-key-more-menu';

export const AccountRow = ({
  claveSol,
  selected,
  onSelectOne,
  onDeselectOne,
  handleClaveSolSelected,
  handleOpen,
  handleClaveSolAccountsGet,
}) => {
  const isSelected = selected.includes(claveSol.account_id);
  const statusColor =
    claveSol.status === 'active' ? 'success' : claveSol.status === 'inactive' ? 'error' : 'warning';
  const status =
    claveSol.status === 'active'
      ? 'activo'
      : claveSol.status === 'inactive'
      ? 'inactivo'
      : 'pendiente';

  return (
    <TableRow
      hover
      key={claveSol.account_id}
      selected={isSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          disabled={claveSol.status === 'inactive'}
          onChange={(event) => {
            if (event.target.checked) {
              onSelectOne?.(claveSol.account_id);
            } else {
              onDeselectOne?.(claveSol.account_id);
            }
          }}
          value={isSelected}
        />
      </TableCell>
      <TableCell width="30%">
        <Box sx={{ cursor: 'pointer' }}>
          <Typography variant="subtitle2">{claveSol.name}</Typography>
          <input
            type="hidden"
            value={claveSol.account_id}
          />
        </Box>
      </TableCell>
      <TableCell width="15%">
        <Typography variant="subtitle2">{claveSol.ruc}</Typography>
      </TableCell>
      <TableCell width="15%">{claveSol.username}</TableCell>
      <TableCell width="15%">
        <div key={claveSol.account_id + '' + claveSol.ruc}>
          {claveSol.verified ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
        </div>
      </TableCell>
      <TableCell width="15%">
        <SeverityPill color={statusColor}>{status}</SeverityPill>
      </TableCell>
      <TableCell align="right">
        <SunKeyMoreMenu
          handleClaveSolSelected={handleClaveSolSelected}
          handleOpen={handleOpen}
          claveSol={claveSol}
          handleClaveSolAccountsGet={handleClaveSolAccountsGet}
        />
      </TableCell>
    </TableRow>
  );
};

AccountRow.propTypes = {
  claveSol: PropTypes.object,
  selected: PropTypes.array,
  onSelectOne: PropTypes.func,
  onDeselectOne: PropTypes.func,
  handleClaveSolSelected: PropTypes.func,
  handleOpen: PropTypes.func,
  handleClaveSolAccountsGet: PropTypes.func,
};
