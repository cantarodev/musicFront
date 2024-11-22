import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { DetractionsInconsistenciesFilter } from 'src/sections/dashboard/analytics/detractions-inconsistencies-filter.jsx';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

const PurchasesDetractions = ({ type }) => {
  const [responseData, setResponseData] = useState(null);
  const selectedAccount = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [detailsMain, setDetailsMain] = useState([]); // Inicializa como array vacío
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
  console.log("###################setSelectedParams: ", selectedParams);
  console.log("responseData?.data?: ", responseData?.data);

  const data = responseData?.data;
  
  // Filtrar la data según los parámetros seleccionados
  const filteredData = data?.filter((row) => {
    let isValid = true;
  
    // Filtrar por moneda
    const monedaRow = row.tipoMoneda.split(' ')[0];
    console.log("monedaRow: ", monedaRow);
    if (selectedParams.currency !== 'all' && monedaRow !== selectedParams.currency) {
      isValid = false;
    }
  
    // Filtrar por tipo de comprobante
    console.log("Tipo de comprobante: ", row.tipoComprobante);
    console.log("selectedParams.docType: ", selectedParams.docType);
    console.log("row.tipoComprobante: ", row.tipoComprobante);
    if (selectedParams.docType !== 'all' && row.tipoComprobante !== selectedParams.docType) {
      isValid = false;
    }
  
    // Filtrar por observaciones
    if (selectedParams.filters.length > 0 && !selectedParams.filters.includes(row.observacion)) {
      isValid = false;
    }
  
    return isValid;
  }) || [];
  
  console.log("Filtered Data:", filteredData);


  const onLoadData = async () => {
    const user_id = user?.user_id;
    setDetailsMain([]);  // Reinicia los datos al cargar
    setLoading(true);
    try {
      const response = await reportApi.getReportDetractions({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;
      setResponseData(data);
      if (data) {
        const allResults = data?.data || [];  // Asegúrate de que 'data' siempre sea un array
        console.log("response: ", response);
        console.log("data: ", data);
        console.log("allResults: ", allResults);
        setDetailsMain(allResults);

        // Cálculo de los totales
        const totalBase = allResults.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0), 0);
        const totalIgv = allResults.reduce((sum, row) => sum + Math.abs(parseFloat(row.sunat_monto_dep) || 0), 0);
        const totalImporte = allResults.reduce((sum, row) => sum + Math.abs(parseFloat(row.sunat_rate_csv) || 0), 0);

        setTotalSums({
          baseIGravadaDG: totalBase,
          igv: totalIgv,
          importe: totalImporte,
        });

        setTotalInconsistencies(allResults.length);  // Ahora 'allResults' siempre es un array
      }

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
        responseData={responseData} 
      />

      {/* Tarjeta con los totales */}
      {/* <Box sx={{ mt: 2 }}>
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
                  <Typography variant="h5">
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      'S/ ' + (isNaN(totalSums.baseIGravadaDG) ? '0.00' : parseFloat(totalSums.baseIGravadaDG).toLocaleString('en-US')).toFixed(2)
                    )}
                  </Typography>
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
                  <Typography variant="h5">
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      'S/ ' + (isNaN(totalSums.igv) ? '0.00' : parseFloat(totalSums.igv).toLocaleString('en-US')).toFixed(2)
                    )}
                  </Typography>
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
                  <Typography color="text.secondary" variant="body2">Importe Total</Typography>
                  <Typography variant="h5">
                    {loading ? (
                      <Skeleton variant="text" />
                    ) : (
                      'S/ ' + (isNaN(totalSums.importe) ? '0.00' : parseFloat(totalSums.importe).toLocaleString('en-US')).toFixed(2)
                    )}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box> */}


      {/* Tabla de datos */}
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2 }}
      >
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
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>{row.numDoc}</TableCell>
                  <TableCell>{row.razonSocial}</TableCell>
                  <TableCell>{row.fechaEmision}</TableCell>
                  <TableCell>{row.tipoComprobante}</TableCell>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell>{row.codMoneda}</TableCell>
                  <TableCell>{row.tipoCambio}</TableCell>
                  <TableCell>{row.numCDD}</TableCell>
                  <TableCell>{row.mtoImporteTotal}</TableCell>
                  <TableCell>{row.sunat_monto_dep}</TableCell>
                  <TableCell>{row.sunat_rate_csv}</TableCell>
                  <TableCell>{row.sunat_fecha_detraccion}</TableCell>
                  <TableCell>{row.sunat_fecha_pago}</TableCell>
                  <TableCell>{row.observacion}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14}>No hay datos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PurchasesDetractions;
