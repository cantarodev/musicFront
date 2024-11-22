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

  useEffect(() => {
    console.log("Updated selectedParams in parent:", selectedParams);
  }, [selectedParams]); // Logs each time selectedParams is updated

  useEffect(() => {
    console.log("detailsMain actualizado: ", detailsMain);
  }, [detailsMain]);
  
  // console.log("##############################################")
  // console.log("responseData?.data?: ", responseData?.data);
  // const data = responseData?.data;
  // const filteredData = responseData?.data?.filter((row) => {
  //   return data;
  // }) || [];
  // console.log("Filtered Data:", filteredData);
    

  const onLoadData = async () => {
    const user_id = user?.user_id;
    setDetailsMain([]);
    setLoading(true);
  
    try {
      const response = await reportApi.getReportFactoring({
        ...selectedParams,
        user_id,
      });
      console.log("##response: ", response);
      console.log("-------------------------SELECTED PARAMS: ", selectedParams);
      const data = response?.data;
      console.log("data: ", data);
      console.log("-------------------------");
      setDetailsMain(data?.data); // Ajustado para reflejar la estructura actual
      setDownloadPath(data?.download_path);

      const codcpeList = data?.data
        .filter(item => item.codcpe) // Filtra solo los objetos que tienen `codcpe`
        .map(item => item.codcpe);   // Extrae el valor de `codcpe`

      console.log("Lista de codcpe: ", codcpeList);

      if (data?.relevant_data) {
        setSelectedParams(prevParams => ({
          ...prevParams,
          docType: codcpeList.length > 0 ? codcpeList[0] : "all",
          currency: data.relevant_data.codMoneda || "all",
          filters: data.relevant_data.observacion || []
        }));
      }

      const totalBase = data?.data.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoBIGravadaDG) || 0), 0);
      const totalIgv = data?.data.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoIGV) || 0), 0);
      const totalImporte = data?.data.reduce((sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0), 0);

      setResponseData(data);
      setTotalSums({
        baseIGravada: totalBase,
        igv: totalIgv,
        importe: totalImporte,
      });
      setTotalInconsistencies(data?.data.length || 0);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // console.log("##############################################")
  // console.log("-------------------------SELECTED PARAMS: ", selectedParams);
  // console.log("responseData?.data?: ", responseData?.data);
  // const data = responseData?.data;
  // const filteredData = responseData?.data?.filter((row) => {
  //   return data;
  // }) || [];
  // console.log("Filtered Data:", filteredData);


console.log("##############################################");
console.log("-------------------------SELECTED PARAMS: ", selectedParams);
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
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>{row.numDoc}</TableCell>
                  <TableCell>{row.razonSocial}</TableCell>
                  <TableCell>{row.fechaEmision}</TableCell>
                  <TableCell>{row.codComp}</TableCell>
                  <TableCell>{row.numeroSerie}</TableCell>
                  <TableCell>{row.codMoneda}</TableCell>
                  <TableCell>{row.tipoCambio}</TableCell>
                  <TableCell>{row.mtoImporteTotal}</TableCell>
                  <TableCell>{row.observacion}</TableCell>
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

Factoring.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Factoring;
