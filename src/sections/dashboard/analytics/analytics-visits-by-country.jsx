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

const flagMap = {
  ca: '/assets/flags/flag-ca.svg',
  de: '/assets/flags/flag-de.svg',
  es: '/assets/flags/flag-es.svg',
  ru: '/assets/flags/flag-ru.svg',
  uk: '/assets/flags/flag-uk.svg',
  us: '/assets/flags/flag-us.svg',
};

export const AnalyticsVisitsByCountry = (props) => {
  const { visits } = props;
  const [sort, setSort] = useState('desc');

  const sortedVisits = useMemo(() => {
    return applySort(visits, 'value', sort);
  }, [visits, sort]);

  const handleSort = useCallback(() => {
    setSort((prevState) => {
      if (prevState === 'asc') {
        return 'desc';
      }

      return 'asc';
    });
  }, []);

  return (
    <Card>
      <CardHeader
        title="Detalle"
        // action={
        //   <Tooltip title="Refresh rate is 24h">
        //     <SvgIcon color="action">
        //       <InfoCircleIcon />
        //     </SvgIcon>
        //   </Tooltip>
        // }
      />
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
          {sortedVisits.map((visit, index) => {
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
                      {visit.period}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{visit.series}</TableCell>
                <TableCell>{visit.number}</TableCell>
                <TableCell>
                  <Typography
                    sx={visit.existsInPle ? { color: 'green' } : { color: 'red' }}
                    variant="h5"
                    padding={1}
                  >
                    •
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={visit.existsInDb ? { color: 'green' } : { color: 'red' }}
                    variant="h5"
                    padding={1}
                  >
                    •
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={visit.observation}>
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
                      {visit.observation}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
};

AnalyticsVisitsByCountry.propTypes = {
  visits: PropTypes.array.isRequired,
};
