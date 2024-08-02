import PropTypes from 'prop-types';
import numeral from 'numeral';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';
import { Box, Container, Paper, Tab, TableContainer, TableSortLabel, Tabs } from '@mui/material';
import { useState } from 'react';

import { ItemSearch } from '../analytics/item-search';

export const AnalyticsMostVisited = (props) => {
  const { reports, selectedParams, setSelectedParams } = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    const types = { 0: 'compras', 1: 'ventas' };
    setSelectedTab(newValue);
    console.log(types[newValue]);

    setSelectedParams((state) => ({ ...state, ['type']: types[newValue] }));
  };

  const handleSelected = (field, value) => {
    console.log(field, value);
    setSelectedParams((state) => ({ ...state, [field]: value }));
  };

  return (
    <Card>
      <CardHeader
        title="Periodos"
        action={
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            centered
          >
            <Tab label="Compras" />
            <Tab label="Ventas" />
          </Tabs>
        }
      />
      <ItemSearch
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
      />
      <Scrollbar>
        <TableContainer>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Periodo</TableCell>
                <TableCell>PLE</TableCell>
                <TableCell>Base de datos</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports?.purchases?.map((report) => {
                const formatPle = numeral(report.quantityS3).format('0,0');
                const formatDb = numeral(report.quantityDb).format('0,0');

                return (
                  <TableRow
                    key={report.url}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Link
                        color="text.primary"
                        onClick={() => handleSelected('period', report.period)}
                      >
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Typography variant="body2">{report.period}</Typography>
                        </Stack>
                      </Link>
                    </TableCell>
                    <TableCell>{formatPle}</TableCell>
                    <TableCell>{formatDb}</TableCell>
                    <TableCell>
                      <Typography
                        sx={report.status ? { color: 'green' } : { color: 'red' }}
                        variant="h5"
                        padding={1}
                      >
                        •
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
};

AnalyticsMostVisited.propTypes = {
  reports: PropTypes.object.isRequired,
  selectedParams: PropTypes.object,
  setSelectedParams: PropTypes.func.isRequired,
};
