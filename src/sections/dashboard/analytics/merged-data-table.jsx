import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import DownloadIcon from '@untitled-ui/icons-react/build/esm/Download01';

import {
  TableContainer,
  TablePagination,
  TableFooter,
  CardHeader,
  Box,
  LinearProgress,
  IconButton,
  SvgIcon,
  Stack,
  Paper,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { reportApi } from 'src/api/reports/reportService';

export const MergeDataTable = (props) => {
  const { loading, filePath, params } = props;

  const results = useSelector((state) => state.report.missings);

  const [displayedRows, setDisplayedRows] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const containerRef = useRef();

  const { filteredResults } = useMemo(() => {
    let filteredResults =
      results?.filter((item) => {
        const matchesDocType = params.docType === 'all' || item.codComp === params.docType;

        const matchesCurrency = params.currency === 'all' || item.moneda === params.currency;

        return matchesDocType && matchesCurrency;
      }) || [];

    return { filteredResults };
  }, [results, params.docType, params.currency]);
  console.log(filteredResults);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const exportToExcel = async (data) => {
    try {
      const response = await reportApi.downloadMissingsExcel({
        filteredData: JSON.stringify(data),
        filePath,
      });

      if (response?.status === 'success') {
        const binaryString = window.atob(response?.data.excelBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
          type: response?.data.contentType,
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response?.data.filename;
        document.body.appendChild(link);

        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const formatNumber = (number) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(number));

    return formattedNumber;
  };

  useEffect(() => {
    const newRows = filteredResults.slice(0, (page + 1) * rowsPerPage);
    setDisplayedRows(newRows);
  }, [page, filteredResults]);
  console.log('ROWS:', displayedRows);

  const isEmpty = filteredResults.length === 0;
  return (
    <Card>
      <CardHeader
        title="Comprobantes faltantes"
        sx={{ p: 2, pb: 0 }}
        action={
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            {filteredResults?.length > 0 && (
              <IconButton
                color="inherit"
                onClick={() => exportToExcel(filteredResults)}
              >
                <SvgIcon fontSize="small">
                  <DownloadIcon />
                </SvgIcon>
              </IconButton>
            )}
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ color: 'green', fontSize: 24, marginRight: 4 }}>•</span> Existe
            </Typography>{' '}
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ color: 'red', fontSize: 24, marginRight: 4 }}>•</span> No existe
            </Typography>{' '}
          </Stack>
        }
      />
      <Box
        display="flex"
        flexDirection="column"
        maxHeight="500px"
        p={2}
      >
        <TableContainer
          component={Paper}
          ref={containerRef}
          onScroll={handleScroll}
          sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Período</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>
                    Tipo Comprobante
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>
                    Número Comprobante
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Moneda</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>
                    Importe Total
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    SUNAT
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    PLE
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    style={{ height: 180 }}
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
                    colSpan={12}
                    align="center"
                    style={{ height: 180 }}
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
                displayedRows?.map((detail, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell className="customTableCell">{detail.periodo}</TableCell>
                      <TableCell className="customTableCell">{detail?.tipoComprobante}</TableCell>
                      <TableCell className="customTableCell">
                        {String(detail.numeroSerie).trim() !== '-'
                          ? detail.numeroSerie + ' - ' + Number(detail.numero)
                          : Number(detail.numero)}
                      </TableCell>
                      <TableCell className="customTableCell">
                        {String(detail.codMoneda).trim() !== '' ? detail.codMoneda : '-'}
                      </TableCell>
                      <TableCell
                        className="customTableCell"
                        sx={{ textAlign: 'right' }}
                      >
                        {formatNumber(Number(detail.monto))}
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography
                          variant="h5"
                          sx={
                            detail?.source === 'sunat'
                              ? { color: 'green', textAlign: 'center' }
                              : { color: 'red', textAlign: 'center' }
                          }
                          padding={1}
                        >
                          •
                        </Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography
                          variant="h5"
                          sx={
                            detail?.source === 'ple'
                              ? { color: 'green', textAlign: 'center' }
                              : { color: 'red', textAlign: 'center' }
                          }
                          padding={1}
                        >
                          •
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

MergeDataTable.propTypes = {
  loading: PropTypes.bool,
  results: PropTypes.array.isRequired,
  sourceCounts: PropTypes.object,
};
