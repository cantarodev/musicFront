import PropTypes from 'prop-types';
import numeral from 'numeral';
import InfoCircleIcon from '@untitled-ui/icons-react/build/esm/InfoCircle';
import LinkExternal01Icon from '@untitled-ui/icons-react/build/esm/LinkExternal01';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';
import { Box, Container, Paper, Tab, TableContainer, TableSortLabel, Tabs } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { applySort } from 'src/utils/apply-sort';

export const AnalyticsMostVisited = (props) => {
  const { reports } = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
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
      <Container>
        <Box mt={2}>
          {selectedTab === 0 && (
            <Scrollbar>
              <TableContainer component={Paper}>
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
                              href="#"
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
          )}
          {selectedTab === 1 && (
            <Scrollbar>
              <TableContainer component={Paper}>
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
                    {reports?.sales?.map((report) => {
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
                              href="#"
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
          )}
        </Box>
      </Container>
    </Card>
  );
};

AnalyticsMostVisited.propTypes = {
  reports: PropTypes.object.isRequired,
};
