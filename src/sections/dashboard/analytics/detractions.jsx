import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DetractionsInconsistenciesFilter } from 'src/sections/dashboard/analytics/detractions-inconsistencies-filter.jsx';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';
import { useSelector } from 'react-redux';

const PurchasesDetractions = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account); // Usar useSelector para obtener el valor de la cuenta
  const [loading, setLoading] = useState(false);
  const [detailsMain, setDetailsMain] = useState([]); // Definimos el estado para los resultados
  const [downloadPath, setDownloadPath] = useState(''); // Definimos el estado para la ruta de descarga
  const user = useMockedUser(); // Hook llamado en el nivel superior del componente

  const [selectedParams, setSelectedParams] = useState({
    period: '',
    account: selectedAccount,
    queryType: String(type).toLowerCase(),
    docType: 'all',
    currency: 'all',
    filters: [],
  });

  // Este useEffect escucha cualquier cambio en selectedAccount y actualiza selectedParams
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
    setDetailsMain([]); // Limpiamos los resultados previos
    setLoading(true); // Iniciamos el proceso de carga
    console.log('Parámetros seleccionados para filtrar: ', selectedParams);
    try {
      const response = await reportApi.getReportDetractions({
        ...selectedParams,
        user_id,
      });
      console.log("######### RESPONSE: ", response);
      const data = response?.data;

      setDetailsMain(data?.all_results); // Actualizamos los resultados
      setDownloadPath(data?.download_path); // Actualizamos la ruta de descarga
      setLoading(false); // Finalizamos la carga
    } catch (err) {
      console.error(err);
      setLoading(false); // Finalizamos la carga en caso de error
    }
  };

  return (
    <div>
      <h1>Detracciones</h1>

      {/* Componente de filtro */}
      <DetractionsInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        loading={loading}
        onLoadData={onLoadData}
      />

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
              <TableCell>Numero detraccion</TableCell>
              <TableCell>Monto Importe Total</TableCell>
              <TableCell>D. Pago (SUNAT)</TableCell>
              <TableCell>D. Tasa (SUNAT)</TableCell>
              <TableCell>Fecha detraccion</TableCell>
              <TableCell>D. Fecha pago (SUNAT)</TableCell>

              <TableCell sx={{ width: '30%' }}>Observación</TableCell> {/* Aumentar el ancho de la columna Observación */}
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
                  <TableCell>{row.codCpe}</TableCell> {/* codCpe para el tipo de comprobante */}
                  <TableCell>{row.numCpe}</TableCell> {/* número de comprobante */}
                  <TableCell>{row.codMoneda}</TableCell> {/* moneda */}
                  <TableCell>{row.mtoTipoCambio}</TableCell> {/* tipo de cambio */}
                  <TableCell>{row.numCDD}</TableCell> {/* num detraccion */}
                  <TableCell>{row.mtoImporteTotal}</TableCell> {/* monto total */}
                  <TableCell>{row.sunat_monto_dep}</TableCell>
                  <TableCell>{row.sunat_rate_csv}</TableCell>
                  <TableCell>{row.fecEmisionCDD}</TableCell> {/* fecha detraccion */}
                  <TableCell>{row.fecha_pago_sunat}</TableCell>
                  
                  <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {/* Esto asegura que el texto largo se ajuste en varias líneas */}
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

export default PurchasesDetractions;
