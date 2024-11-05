import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import { FactoringInconsistenciesFilter } from 'src/sections/dashboard/analytics/factoring-inconsistencies-filter';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

const Factoring = ({ type }) => {
  const [responseData, setResponseData] = useState(null);
  const selectedAccount = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [detailsMain, setDetailsMain] = useState([]);
  const [totalSums, setTotalSums] = useState({ baseIGravada: 0, igv: 0, importe: 0 });
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
      const response = await reportApi.getReportFactoring({
        ...selectedParams,
        user_id,
      });
  
      const data = response?.data;
      console.log("data: ", data);
      console.log("-------------------------");
      setDetailsMain(data?.all_results);
      setDownloadPath(data?.download_path);
      
      // Obtiene los filtros de la respuesta
      const codcpe = data.relevant_data.filter.codCpe || [];
      const codMoneda = data.relevant_data.filter.codMoneda || [];
      const observaciones = data.relevant_data.filter.observacion || [];
  
      console.log("codcpe: ", codcpe);
      
      // Actualiza el estado con los valores de filtro que se encuentran
      if (data?.filter) {
        setSelectedParams((prevParams) => ({
          ...prevParams,
          docType: codcpe.length > 0 ? codcpe[0] : "all", // Asigna un valor válido o "all"
          currency: codMoneda.length > 0 ? codMoneda[0] : "all", // Asigna un valor válido o "all"
          filters: observaciones.length > 0 ? observaciones : [], // Solo asigna los filtros que están disponibles
        }));
      }

      // Cálculo de los totales y inconsistencias
      const totalBase = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoBIGravadaDG) || 0), 0);
      const totalIgv = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoIGV) || 0), 0);
      const totalImporte = data?.all_results.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0), 0);
      
      setResponseData(data);  // Almacena la respuesta para usarla en los filtros
      setTotalSums({
        baseIGravada: totalBase,
        igv: totalIgv,
        importe: totalImporte,
      });
      setTotalInconsistencies(data?.all_results.length || 0); // Total de inconsistencias según los resultados

      setLoading(false); 
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <FactoringInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        loading={loading}
        onLoadData={onLoadData}
        responseData={responseData}  // Pasamos la respuesta del backend al filtro
      />

      <Box sx={{ mt: 2 }}>
        <Card>
          <CardHeader title="Compras" sx={{ p: 2, pb: 0 }} />
          <CardContent sx={{ p: 2, pb: '16px !important' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Stack
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                    height: 70,
                    borderRadius: 1.5,
                    p: 1.5,
                    width: '100%', // Ensure it takes full width
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
                    width: '100%', // Ensure it takes full width
                  }}
                >
                  <Typography color="text.secondary" variant="body2">Base Imponible</Typography>
                  <Typography variant="h5">{loading ? <Skeleton variant="text" /> : 'S/ ' + parseFloat(totalSums.baseIGravada.toLocaleString('en-US')).toFixed(2)}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                    height: 70,
                    borderRadius: 1.5,
                    p: 1.5,
                    width: '100%', // Ensure it takes full width
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
                    width: '100%', // Ensure it takes full width
                  }}
                >
                  <Typography color="text.secondary" variant="body2">Importe</Typography>
                  <Typography variant="h5">{loading ? <Skeleton variant="text" /> : 'S/ ' + parseFloat(totalSums.importe.toLocaleString('en-US')).toFixed(2)}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Tabla de datos con scroll horizontal */}
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '7%' }}>Período</TableCell>
              <TableCell sx={{ width: '10%' }}>RUC</TableCell>
              <TableCell sx={{ width: '15%' }}>Razón Social</TableCell>
              <TableCell sx={{ width: '10%' }}>Fecha Emisión</TableCell>
              <TableCell sx={{ width: '10%' }}>Tipo Comprobante</TableCell>
              <TableCell sx={{ width: '10%' }}>Número Comprobante</TableCell>
              <TableCell sx={{ width: '5%' }}>Moneda</TableCell>
              <TableCell sx={{ width: '7%' }}>Tipo de Cambio</TableCell>
              <TableCell sx={{ width: '10%' }}>Monto Importe Total</TableCell>
              <TableCell sx={{ maxWidth: '90%' }}>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detailsMain.length > 0 ? (
              detailsMain.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>{row.ruc}</TableCell>
                  <TableCell>{row.razonSocial}</TableCell>
                  <TableCell>{row.fecEmision}</TableCell>
                  <TableCell>{row.codCpe}</TableCell>
                  <TableCell>{row.numCpe}</TableCell>
                  <TableCell>{row.codMoneda}</TableCell>
                  <TableCell>{row.mtoTipoCambio}</TableCell>
                  <TableCell>{row.mtoImporteTotal}</TableCell>
                  <TableCell sx={{ maxWidth: '90%'}}>
                    <Typography variant="body2" style={{ wordWrap: 'break-word' }}>
                      {row.observacion}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

Factoring.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Factoring;
