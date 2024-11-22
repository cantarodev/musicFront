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
  CircularProgress,
} from '@mui/material';
import { reportApi } from 'src/api/reports/reportService';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSelector } from 'react-redux';
import { CorrelativityInconsistenciesFilter } from 'src/sections/dashboard/analytics/correlativity-filter.jsx';

const Correlativity = ({ type }) => {
  const [data, setData] = useState(null);
  const selectedAccount = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [totalSums, setTotalSums] = useState({ baseIGravadaDG: 0, igv: 0, importe: 0 });
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
    setLoading(true);

    try {
      const response = await reportApi.getReportCorrelativity({
        ...selectedParams,
        user_id,
      });

      console.log('######### RESPONSE: ', response);
      const responseData = response?.data;

      setData(responseData);
      setDownloadPath(responseData?.download_path);

      const totalBase = responseData?.all_results?.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.mtoImporteTotal) || 0),
        0
      );
      const totalIgv = responseData?.all_results?.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.igv) || 0),
        0
      );
      const totalImporte = responseData?.all_results?.reduce(
        (sum, row) => sum + Math.abs(parseFloat(row.sunat_monto_dep) || 0),
        0
      );

      setTotalSums({
        baseIGravadaDG: totalBase,
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
      <Box sx={{ marginTop: 0, paddingTop: 0 }}>
        <CorrelativityInconsistenciesFilter
          selectedParams={selectedParams}
          setSelectedParams={setSelectedParams}
          loading={loading}
          onLoadData={onLoadData}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, overflowX: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo de Comprobante</TableCell>
              <TableCell>Serie</TableCell>
              <TableCell>Faltantes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data?.faltantes?.length > 0 ? (
              data.faltantes.map((item, index) => (
                <TableRow key={`faltantes-${index}`}>
                  <TableCell>{item.tipo_cpe}</TableCell>
                  <TableCell>{item.serie}</TableCell>
                  <TableCell>{item.faltantes?.join(', ')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                >
                  No hay faltantes disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Correlativity;
