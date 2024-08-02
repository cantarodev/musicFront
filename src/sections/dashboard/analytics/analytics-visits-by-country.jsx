import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import InfoCircleIcon from '@untitled-ui/icons-react/build/esm/InfoCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { applySort } from 'src/utils/apply-sort';
import { TableContainer, TablePagination } from '@mui/material';
import { UserListSearch } from '../users/user-list-search';

const flagMap = {
  ca: '/assets/flags/flag-ca.svg',
  de: '/assets/flags/flag-de.svg',
  es: '/assets/flags/flag-es.svg',
  ru: '/assets/flags/flag-ru.svg',
  uk: '/assets/flags/flag-uk.svg',
  us: '/assets/flags/flag-us.svg',
};

export const AnalyticsVisitsByCountry = (props) => {
  const { details, totalRecords, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage } =
    props;
  const [sort, setSort] = useState('desc');

  // const sortedVisits = useMemo(() => {
  //   return applySort(visits, 'value', sort);
  // }, [visits, sort]);

  // const handleSort = useCallback(() => {
  //   setSort((prevState) => {
  //     if (prevState === 'asc') {
  //       return 'desc';
  //     }

  //     return 'asc';
  //   });
  // }, []);

  return (
    <Card>
      <CardHeader title="Detalle" />
      <UserListSearch />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell sortDirection={sort}>
                {/* <TableSortLabel
                active
                direction={sort}
                onClick={handleSort}
              >
                Número
              </TableSortLabel> */}
                Número
              </TableCell>
              <TableCell>Ple?</TableCell>
              <TableCell>Base de datos?</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail, index) => {
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
                        {detail.periodo}
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
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

AnalyticsVisitsByCountry.propTypes = {
  details: PropTypes.array.isRequired,
  totalRecords: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};
