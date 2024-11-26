import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';

import { ItemPleListRow } from './item-ple-list-row';
import {
  LinearProgress,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export const ItemPleList = (props) => {
  const {
    setLoading,
    loading,
    count = 0,
    items = [],
    onDelete,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  const isEmpty = items.length === 0;

  return (
    <Stack spacing={4}>
      <Scrollbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Mes</TableCell>
                <TableCell>Nombre del archivo</TableCell>
                <TableCell>Cantidad docs</TableCell>
                <TableCell>Fecha subida del archivo / hora</TableCell>
                <TableCell>Tamaño del archivo</TableCell>
                <TableCell>Tipo de archivo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={25}
                    align="center"
                    style={{ height: 200 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      <LinearProgress />
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : isEmpty ? (
                <TableRow>
                  <TableCell
                    colSpan={25}
                    align="center"
                    style={{ height: 200 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      No hay datos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <ItemPleListRow
                    setLoading={setLoading}
                    key={item._id}
                    item={item}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[9, 18]}
      />
    </Stack>
  );
};

ItemPleList.propTypes = {
  setLoading: PropTypes.func,
  bool: PropTypes.bool,
  items: PropTypes.array,
  count: PropTypes.number,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  onOpen: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  view: PropTypes.oneOf(['grid', 'list']),
};
