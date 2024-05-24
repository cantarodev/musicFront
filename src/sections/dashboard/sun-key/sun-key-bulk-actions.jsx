import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Checkbox, Button } from '@mui/material';

export const BulkActions = ({
  enableBulkActions,
  selectedAll,
  selectedSome,
  onSelectAll,
  onDeselectAll,
  confirmValidateAll,
  confirmDeleteAll,
}) => {
  if (!enableBulkActions) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
        display: 'flex',
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
  );
};

BulkActions.propTypes = {
  enableBulkActions: PropTypes.bool,
  selectedAll: PropTypes.bool,
  selectedSome: PropTypes.bool,
  onDeselectAll: PropTypes.func,
  onSelectAll: PropTypes.func,
  confirmValidateAll: PropTypes.func,
  confirmDeleteAll: PropTypes.func,
};
