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
import { CreditDebitInconsistenciesFilter } from 'src/sections/dashboard/analytics/credit-debit-notes-filter.jsx';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';
import { useSelector } from 'react-redux';
import { PurchasesInconsistenciesCards } from 'src/sections/dashboard/analytics/purchases-inconsistencies-cards';

const PurchasesCreditDebitNotes = ({ type }) => {
  const selectedAccount = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [detailsMain, setDetailsMain] = useState([]);
  const [totalSums, setTotalSums] = useState({ baseIGravada: 0, igv: 0, importe: 0 });
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

  console.log('QUERY TYPE: ', selectedParams);

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
    console.log('Parámetros seleccionados para filtrar: ', selectedParams);

    try {
      const response = await reportApi.getReportDebitCreditNotes({
        ...selectedParams,
        user_id,
      });

      console.log('######### RESPONSE: ', response);
      const data = response?.data;

      setDetailsMain(data?.all_results);
      setDownloadPath(data?.download_path);

      // Cálculo de los totales
      const totalBase = data?.all_results.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0),
        0
      );
      const totalIgv = data?.all_results.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.igv) || 0),
        0
      );
      const totalImporte = data?.all_results.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.sunat_monto_dep) || 0),
        0
      );

      setTotalSums({
        baseIGravada: totalBase,
        igv: totalIgv,
        importe: totalImporte,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <CreditDebitInconsistenciesFilter
        selectedParams={selectedParams}
        setSelectedParams={setSelectedParams}
        loading={loading}
        onLoadData={onLoadData}
      />

      <Box sx={{ mt: 2 }}>
        <PurchasesInconsistenciesCards
          title="Resumen de notas de crédito y débito"
          loading={loading}
          totalInconsistencies={detailsMain.length || 0} // Aquí pasamos el número de inconsistencias
          totalSums={totalSums} // Aquí pasamos los totales calculados
        />
      </Box>

      {/* Tabla de datos con scroll horizontal */}
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, overflowX: 'auto' }}
      >
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
                  <TableCell>{row.fechaEmision}</TableCell>
                  <TableCell>{row.codCpe}</TableCell>
                  <TableCell>{row.numCpe}</TableCell>
                  <TableCell>{row.codMoneda}</TableCell>
                  <TableCell>{row.mtoTipoCambio}</TableCell>
                  <TableCell>{row.mtoImporteTotal}</TableCell>
                  <TableCell sx={{ maxWidth: '90%' }}>
                    <Typography
                      variant="body2"
                      style={{ wordWrap: 'break-word' }}
                    >
                      {row.observacion}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  align="center"
                >
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

export default PurchasesCreditDebitNotes;
