import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  TableRow as MuiTableRow,
  TableCell as MuiTableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';

import format from 'date-fns/format';
import { convertToPeriodDate } from 'src/utils/date';

export const AnalyticsVisitsByCountry = (props) => {
  const {
    details,
    generalDetail,
    totalRecords,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  const isEmpty = details.length === 0;
  console.log(generalDetail);
  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'MMMM yyyy');
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Cant. Ple</TableCell>
              <TableCell>Cant. Base de Datos</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmpty ? (
              <MuiTableRow>
                <MuiTableCell
                  colSpan={6}
                  align="center"
                >
                  <Typography
                    variant="h6"
                    color="textSecondary"
                  >
                    No hay detalle general para mostrar
                  </Typography>
                </MuiTableCell>
              </MuiTableRow>
            ) : (
              <>
                <TableCell>{formatDate(convertToPeriodDate(generalDetail.periodo))}</TableCell>
                <TableCell>{generalDetail?.totalInPle}</TableCell>
                <TableCell>{generalDetail?.totalInDb}</TableCell>
                <TableCell>
                  <Typography
                    sx={generalDetail?.estado ? { color: 'green' } : { color: 'red' }}
                    variant="h5"
                    padding={1}
                  >
                    •
                  </Typography>
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell>Número</TableCell>
              <TableCell>Ple?</TableCell>
              <TableCell>Base de datos?</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmpty ? (
              <MuiTableRow>
                <MuiTableCell
                  colSpan={6}
                  align="center"
                >
                  <Typography
                    variant="h6"
                    color="textSecondary"
                  >
                    No hay documentos para mostrar
                  </Typography>
                </MuiTableCell>
              </MuiTableRow>
            ) : (
              details?.map((detail, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Typography
                          sx={{ ml: 1 }}
                          variant="subtitle2"
                        >
                          {formatDate(convertToPeriodDate(detail.periodo))}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{detail.serie}</TableCell>
                    <TableCell>{detail.numero}</TableCell>
                    <TableCell>
                      <Typography
                        sx={detail.existsPle ? { color: 'green' } : { color: 'red' }}
                        variant="h5"
                        padding={1}
                      >
                        •
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={detail.existsDb ? { color: 'green' } : { color: 'red' }}
                        variant="h5"
                        padding={1}
                      >
                        •
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={detail.observacion}>
                        <Typography
                          sx={{ cursor: 'pointer' }}
                          variant="subtitle2"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px',
                          }}
                        >
                          {detail.observacion}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalRecords || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Card>
  );
};

AnalyticsVisitsByCountry.propTypes = {
  details: PropTypes.array.isRequired,
  generalDetail: PropTypes.object,
  totalRecords: PropTypes.number,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};
