import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

import { SunKeyMoreMenu } from 'src/components/sun-key-more-menu';
import { SunKeyModal } from './sun-key-modal';
import { Button, Checkbox, Stack } from '@mui/material';

import { claveSolAccountsApi } from 'src/api/sun-key-accounts';

export const SunKeyListTable = (props) => {
  const {
    action,
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onSelectAll,
    onSelectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    open,
    handleOpen,
    onClose,
    selected = [],
    handleClaveSolAccountsGet,
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const enableBulkActions = selected.length > 0;

  const [currentClaveSol, setCurrentClaveSol] = useState(null);

  const handleClaveSolSelected = useCallback((claveSol) => {
    setCurrentClaveSol((prevClaveSol) => {
      return claveSol;
    });
  }, []);

  const deleteAllAccounts = async (toastId) => {
    try {
      const response = await claveSolAccountsApi.deleteClaveSolAccounts({ accountIds: selected });
      toast.dismiss(toastId);
      handleClaveSolAccountsGet();
      toast.success(response.message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error('Algo salió mal!', { duration: 3000, position: 'top-center' });
    }
  };

  const confirmDeleteAll = () => {
    toast(
      (t) => (
        <span>
          ¿Eliminar todas las cuentas?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => deleteAllAccounts(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  const validateAllAccounts = async (toastId) => {
    try {
      for (let index = 0; index < items.length; index++) {
        await claveSolAccountsApi.validateClaveSolAccount(items[index]);
      }
      toast.dismiss(toastId);
      handleClaveSolAccountsGet();
    } catch (err) {
      console.error(err);
      toast.error('Algo salió mal!', { duration: 3000, position: 'top-center' });
    }
  };

  const confirmValidateAll = () => {
    toast(
      (t) => (
        <span>
          ¿Validar los seleccionados?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => validateAllAccounts(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={(event) => {
              if (event.target.checked) {
                onSelectAll?.();
              } else {
                onDeselectAll?.();
              }
            }}
          />
          <Button
            color="inherit"
            size="small"
            onClick={confirmValidateAll}
          >
            Validar
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={confirmDeleteAll}
          >
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
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
            {items.map((claveSol) => {
              const isSelected = selected.includes(claveSol.account_id);
              const statusColor =
                claveSol.status === 'active'
                  ? 'success'
                  : claveSol.status === 'inactive'
                  ? 'error'
                  : 'warning';
              const status =
                claveSol.status === 'active'
                  ? 'activo'
                  : claveSol.status === 'inactive'
                  ? 'inactivo'
                  : 'pendiente';

              return (
                <Fragment key={claveSol.account_id}>
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
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{claveSol.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="15%">
                      <Typography variant="subtitle2">{claveSol.ruc}</Typography>
                    </TableCell>
                    <TableCell width="15%">{claveSol.username}</TableCell>
                    <TableCell width="15%">
                      {claveSol.verified ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
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
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
      <SunKeyModal
        onClose={onClose}
        open={open}
        claveSol={currentClaveSol}
        action={action}
        handleClaveSolAccountsGet={handleClaveSolAccountsGet}
      />
    </Box>
  );
};

SunKeyListTable.propTypes = {
  action: PropTypes.string,
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  onClose: PropTypes.func,
  selected: PropTypes.array,
  handleClaveSolAccountsGet: PropTypes.func,
};
