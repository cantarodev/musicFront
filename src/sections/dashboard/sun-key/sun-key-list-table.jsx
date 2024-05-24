import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import { Box, TablePagination, Button } from '@mui/material';
import { BulkActions } from './sun-key-bulk-actions';
import { AccountTable } from './sun-key-account-table';
import { SunKeyModal } from './sun-key-modal'; // Assuming SunKeyModal is another custom component
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import { claveSolAccountsApi } from 'src/api/sun-key-accounts'; // Assuming the API file location
import { Scrollbar } from 'src/components/scrollbar';

export const SunKeyListTable = (props) => {
  const {
    items,
    selected,
    onSelectAll,
    onDeselectAll,
    onSelectOne,
    onDeselectOne,
    handleOpen,
    handleClaveSolAccountsGet,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    open,
    onClose,
    action,
  } = props;
  const [currentClaveSol, setCurrentClaveSol] = useState(null);
  const [enableBulkActions, setEnableBulkActions] = useState(false);
  const rootMap = new Map();

  useEffect(() => {
    setEnableBulkActions(selected.length > 0);
  }, [selected]);

  const handleClaveSolSelected = useCallback((claveSol) => {
    setCurrentClaveSol(claveSol);
  }, []);

  const deleteAllAccounts = async (toastId) => {
    try {
      const response = await claveSolAccountsApi.deleteClaveSolAccounts({ accountIds: selected });
      toast.dismiss(toastId);
      handleClaveSolAccountsGet();
      toast.success(response.message, { duration: 5000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error(
        'Hubo un error al intentar eliminar los registros seleccionados. Por favor, inténtalo de nuevo más tarde.',
        { duration: 5000, position: 'top-center' }
      );
    }
  };

  const confirmDeleteAll = () => {
    toast(
      (t) => (
        <span>
          <p style={{ fontSize: '13px' }}>
            ¿Estás seguro de que deseas eliminar los registros seleccionados? Esta acción no se
            puede deshacer.
          </p>
          <Button
            sx={{ mr: 1, fontSize: '13px' }}
            onClick={() => toast.dismiss(t.id)}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            sx={{ fontSize: '13px' }}
            onClick={() => deleteAllAccounts(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      { duration: 50000 }
    );
  };

  const validateAllAccounts = async (toastId) => {
    try {
      toast.dismiss(toastId);
      const tabla = document.getElementById('tbl_accounts');
      const filas = tabla.getElementsByTagName('tr');

      const registrosFiltrados = items.filter((registro) => selected.includes(registro.account_id));

      for (let index = 1; index < filas.length; index++) {
        const celdas = filas[index].getElementsByTagName('td');
        const account = registrosFiltrados.find(
          (obj) => obj.account_id == celdas[1].querySelector('input').value
        );
        if (account) {
          const loaderContainer = celdas[4].querySelector('div');

          let root = rootMap.get(loaderContainer);
          if (!root) {
            root = createRoot(loaderContainer);
            rootMap.set(loaderContainer, root);
          } else {
            root.unmount();
          }

          root.render(
            <CircularProgress
              className="progress"
              color="primary"
              style={{ color: '#6366f1', width: '25px', height: '25px' }}
            />
          );

          const resp = await claveSolAccountsApi.validateClaveSolAccount(account);

          if (resp.validated) {
            root.render(<CheckIcon color="success" />);
          } else {
            root.render(<CloseIcon color="error" />);
          }
        }
      }

      onDeselectAll();
      toast.success('Las cuentas CLAVE SOL seleccionadas han sido procesadas correctamente.', {
        duration: 5000,
        position: 'top-center',
        fontSize: '13px',
      });
    } catch (err) {
      console.error(err);
      toast.error(
        'Hubo un error al intentar validar los registros seleccionados. Por favor, inténtalo de nuevo más tarde.',
        { duration: 5000, position: 'top-center', fontSize: '13px' }
      );
    }
  };

  const confirmValidateAll = () => {
    toast(
      (t) => (
        <span>
          <p style={{ fontSize: '13px' }}>¿Validar los registros seleccionados?</p>
          <Button
            sx={{ mr: 1, fontSize: '13px' }}
            onClick={() => toast.dismiss(t.id)}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            sx={{ fontSize: '13px' }}
            onClick={() => validateAllAccounts(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      { duration: 5000 }
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <BulkActions
        enableBulkActions={enableBulkActions}
        selectedAll={selected.length === items.length}
        selectedSome={selected.length > 0 && selected.length < items.length}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        confirmValidateAll={confirmValidateAll}
        confirmDeleteAll={confirmDeleteAll}
      />
      <Scrollbar>
        <AccountTable
          items={items}
          selected={selected}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onSelectOne={onSelectOne}
          onDeselectOne={onDeselectOne}
          handleClaveSolSelected={handleClaveSolSelected}
          handleOpen={handleOpen}
          handleClaveSolAccountsGet={handleClaveSolAccountsGet}
        />
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
