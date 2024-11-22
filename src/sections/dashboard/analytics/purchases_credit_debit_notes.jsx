import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Card, CardHeader } from '@mui/material';
import { DetractionsInconsistenciesFilter } from 'src/sections/dashboard/analytics/detractions-inconsistencies-filter.jsx';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

const PurchasesDetractions = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account); 
  const [loading, setLoading] = useState(false);
  const [detailsMain, setDetailsMain] = useState([]); 
  const [totalSums, setTotalSums] = useState({ baseIGravadaDG: 0, igv: 0, importe: 0 });
  const [totalInconsistencies, setTotalInconsistencies] = useState(0); 
  const [downloadPath, setDownloadPath] = useState(''); 
  const user = useMockedUser(); 

  const [selectedParams, setSelectedParams] = useState({
    period: '',
    account: selectedAccount,
    queryType: String(type).toLowerCase(),
    docType: 'all',
    currency: 'all',
    filters: [],
  });

  useEffect(() => {
    if (selectedAccount) {
      setSelectedParams((prevParams) => ({
        ...prevParams,
        account: selectedAccount,
      }));
    }
  }, [selectedAccount]);

  const onLoadData = async () => {
    const user_id = user?.user_id;
    setDetailsMain([]);
    setLoading(true);
    try {
      const response = await reportApi.getReportDetractions({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;
      setDetailsMain(data?.all_results);
      setDownloadPath(data?.download_path);

      // Cálculo de los totales
      const totalBase = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0), 0);
      const totalIgv = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.sunat_monto_dep) || 0), 0);
      const totalImporte = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.sunat_rate_csv) || 0), 0);

      setTotalSums({
        baseIGravada: totalBase,
        igv: totalIgv,
        importe: totalImporte,
      });

      setTotalInconsistencies(data?.all_results.length || 0); 
      setLoading(false); 
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <DetractionsInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        loading={loading}
        onLoadData={onLoadData}
      />

      {/* Tarjeta con el título "Compras" y los totales */}
      {/* <Card sx={{ marginTop: 2 }}>
        <CardHeader title="Compras" sx={{ p: 2, pb: 0 }} />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Stack
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                  height: 70,
                  borderRadius: 1.5,
                  p: 1.5,
                  width: '100%',
                }}
              >
                <Typography color="text.secondary" variant="body2">Inconsistencias</Typography>
                <Typography variant="h5">{loading ? <Skeleton variant="text" /> : totalInconsistencies}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                  height: 70,
                  borderRadius: 1.5,
                  p: 1.5,
                  width: '100%',
                }}
              >
                <Typography color="text.secondary" variant="body2">Base Imponible</Typography>
                <Typography variant="h5">{loading ? <Skeleton variant="text" /> : 'S/ ' + parseFloat(totalSums.baseIGravadaDG.toLocaleString('en-US')).toFixed(2)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                  height: 70,
                  borderRadius: 1.5,
                  p: 1.5,
                  width: '100%',
                }}
              >
                <Typography color="text.secondary" variant="body2">IGV</Typography>
                <Typography variant="h5">{loading ? <Skeleton variant="text" /> : 'S/ ' + parseFloat(totalSums.igv.toLocaleString('en-US')).toFixed(2)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Stack
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                  height: 70,
                  borderRadius: 1.5,
                  p: 1.5,
                  width: '100%',
                }}
              >
                <Typography color="text.secondary" variant="body2">Importe</Typography>
                <Typography variant="h5">{loading ? <Skeleton variant="text" /> : 'S/ ' + parseFloat(totalSums.importe.toLocaleString('en-US')).toFixed(2)}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card> */}

      {/* Tabla de datos */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Período</TableCell>
              <TableCell>RUC</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>Fecha Emisión</TableCell>
              <TableCell>Tipo Comprobante</TableCell>
              <TableCell>Número Comprobante</TableCell>
              <TableCell>Moneda</TableCell>
              <TableCell>Tipo de Cambio</TableCell>
              <TableCell>Numero detracción</TableCell>
              <TableCell>Monto Importe Total</TableCell>
              <TableCell>D. Pago (SUNAT)</TableCell>
              <TableCell>D. Tasa (SUNAT)</TableCell>
              <TableCell>Fecha detracción</TableCell>
              <TableCell>D. Fecha pago (SUNAT)</TableCell>
              <TableCell sx={{ width: '30%' }}>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detailsMain.length > 0 ? (
              detailsMain.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>{row.ruc}</TableCell>
                  <TableCell>{row.razonSocial}</TableCell>
                  <TableCell>{row.fechaEmision}</TableCell>
                  <TableCell>{row.codCpe}</TableCell>
                  <TableCell>{row.numCpe}</TableCell>
                  <TableCell>{row.codMoneda}</TableCell>
                  <TableCell>{row.mtoTipoCambio}</TableCell>
                  <TableCell>{row.numCDD}</TableCell>
                  <TableCell>{row.mtoImporteTotal}</TableCell>
                  <TableCell>{row.sunat_monto_dep}</TableCell>
                  <TableCell>{row.sunat_rate_csv}</TableCell>
                  <TableCell>{row.fecEmisionCDD}</TableCell>
                  <TableCell>{row.fecha_pago_sunat}</TableCell>
                  <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <Typography variant="body2" style={{ wordWrap: 'break-word' }}>
                      {row.observacion}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
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
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PurchasesDetractions;
