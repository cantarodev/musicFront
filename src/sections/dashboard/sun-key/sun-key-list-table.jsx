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

import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

import { SunKeyMoreMenu } from 'src/components/sun-key-more-menu';
import { SunKeyModal } from './sun-key-modal';

export const SunKeyListTable = (props) => {
  const {
    action,
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    open,
    handleOpen,
    onClose,
    handleSunKeyAccountsGet,
  } = props;

  const [currentSunKey, setCurrentSunKey] = useState(null);

  const handleSunKeySelected = useCallback((sunKey) => {
    setCurrentSunKey((prevSunKey) => {
      return sunKey;
    });
  }, []);

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" />
              <TableCell width="30%">ID Clave SOL</TableCell>
              <TableCell width="30%">ID Usuario</TableCell>
              <TableCell width="15%">Ruc</TableCell>
              <TableCell width="15%">Usuario</TableCell>
              <TableCell width="15%">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((sunKey, index) => {
              const isCurrent = sunKey.id === currentSunKey;
              const statusColor =
                sunKey.status === 'active'
                  ? 'success'
                  : sunKey.status === 'inactive'
                  ? 'error'
                  : 'warning';
              const status =
                sunKey.status === 'active'
                  ? 'activo'
                  : sunKey.status === 'inactive'
                  ? 'inactivo'
                  : 'pendiente';

              return (
                <Fragment key={sunKey.id}>
                  <TableRow
                    hover
                    key={sunKey.id}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }),
                      }}
                      width="5%"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell width="30%">
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{sunKey.id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="30%">
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{sunKey.userId}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="15%">
                      <Typography variant="subtitle2">{sunKey.ruc}</Typography>
                    </TableCell>
                    <TableCell width="15%">{sunKey.username}</TableCell>
                    <TableCell width="15%">
                      <SeverityPill color={statusColor}>{status}</SeverityPill>
                    </TableCell>
                    <TableCell align="right">
                      <SunKeyMoreMenu
                        handleSunKeySelected={handleSunKeySelected}
                        handleOpen={handleOpen}
                        sunKey={sunKey}
                        handleSunKeyAccountsGet={handleSunKeyAccountsGet}
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
        sunKey={currentSunKey}
        action={action}
        handleSunKeyAccountsGet={handleSunKeyAccountsGet}
      />
    </div>
  );
};

SunKeyListTable.propTypes = {
  action: PropTypes.string,
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  onClose: PropTypes.func,
  handleSunKeyAccountsGet: PropTypes.func,
};
