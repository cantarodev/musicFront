import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';

import { Seo } from 'src/components/seo';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettings } from 'src/hooks/use-settings';
import { AnalyticsDetails } from 'src/sections/dashboard/analytics/analytics-details';
import { MergeDataTable } from 'src/sections/dashboard/analytics/merged-data-table';
import { SalesFilter } from 'src/sections/dashboard/analytics/sales-filter';
import { reportApi } from 'src/api/reports/reportService';
import { format, subMonths } from 'date-fns';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { StorageStats } from 'src/sections/dashboard/analytics/storage-stats';

const Page = () => {
  const settings = useSettings();
  const selectedAccount = useSelector((state) => state.account);
  const [detailsMain, setDetailsMain] = useState([]);
  const [downloadPath, setDownloadPath] = useState('');
  const [detailsMerge, setDetailsMerge] = useState([]);
  const [totals, setTotals] = useState({ totalSunat: 0, totalPle: 0 });

  const [loadingObservations, setLoadingObservations] = useState(false);
  const [loadingMissings, setLoadingMissings] = useState(false);

  const user = useMockedUser();

  const [selectedParams, setSelectedParams] = useState({
    period: format(subMonths(new Date(), 1), 'yyyyMM'),
    account: selectedAccount,
    queryType: 'ventas',
    docType: 'all',
    currency: 'all',
    filters: {},
  });

  const [totalSums, setTotalSums] = useState({
    baseIGravadaDG: 0.0,
    baseIGravadaDGNG: 0.0,
    baseIGravadaDNG: 0.0,
    igv: 0.0,
    igvSunat: 0.0,
    importe: 0.0,
    importeSunat: 0.0,
    resumenGeneral: 0,
    resumenTC: 0,
  });

  const handleApplyFilters = async () => {
    const user_id = user?.user_id;

    setDetailsMain([]);
    setLoadingObservations(true);
    try {
      const response = await reportApi.reportObservations({
        ...selectedParams,
        user_id,
      });

      const data = response?.data;

      setDetailsMain(data?.all_results);
      setDownloadPath(data?.download_path);
      setTotals({ totalSunat: data?.total_sunat, totalPle: data?.total_ple });
      setLoadingObservations(false);
    } catch (err) {
      console.error(err);
      setLoadingObservations(false);
    }
  };

  const handleDownloadObservations = async () => {
    try {
      const response = await reportApi.downloadObservations({
        downloadPath,
      });

      const fileResponse = await axios.get(response.data, {
        responseType: 'blob',
      });

      const blob = new Blob([fileResponse.data], { type: fileResponse.data.type });

      const fileName = downloadPath.split('/').pop();
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      const newFileName = fileName.replace('.xlsx', `_${formattedDate}.xlsx`);

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', newFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    const user_id = user?.user_id;
    const period = selectedParams.period;
    const queryType = selectedParams.queryType;
    const docType = selectedParams.docType;
    const currency = selectedParams.currency;

    setLoadingMissings(true);
    try {
      const response = await reportApi.getReportMissings({
        user_id,
        period,
        queryType,
        docType,
        currency,
      });

      const data = response?.data;

      setDetailsMerge(data?.all_results);
      setLoadingMissings(false);
    } catch (err) {
      console.error(err);
      setLoadingMissings(false);
    }
  };

  useEffect(() => {
    setDetailsMain([]);
    setDetailsMerge([]);
    setTotals({ totalSunat: 0, totalPle: 0 });
    setSelectedParams((state) => ({ ...state, account: selectedAccount }));
  }, [selectedAccount]);

  useEffect(() => {
    const tcRegex = /Valor TC: [\d.]+ \(debería ser [\d.]+\)/;
    const importeRegex = /Valor Importe: [\d.]+ \(debería ser [\d.]+\)/;
    const igvRegex = /Valor IGV: [\d.]+ \(debería ser [\d.]+\)/;

    const newTotals = detailsMain.reduce(
      (totals, detail) => {
        totals.baseIGravadaDG += parseFloat(detail.mtoBIGravadaDG) || 0;
        totals.baseIGravadaDGNG += parseFloat(detail.mtoBIGravadaDGNG) || 0;
        totals.baseIGravadaDNG += parseFloat(detail.mtoBIGravadaDNG) || 0;
        totals.igv += parseFloat(detail.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.mtoIGVSunat) || 0;
        totals.importe += parseFloat(detail.mtoImporteTotal) || 0;
        totals.importeSunat += parseFloat(detail.mtoImporteTotalSunat) || 0;

        if (tcRegex.test(detail.observacion)) {
          totals.resumenTC += 1;
        }

        if (importeRegex.test(detail.observacion) || igvRegex.test(detail.observacion)) {
          totals.resumenGeneral += 1;
        }

        return totals;
      },
      {
        baseIGravadaDG: 0.0,
        baseIGravadaDGNG: 0.0,
        baseIGravadaDNG: 0.0,
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        resumenTC: 0,
        resumenGeneral: 0,
      }
    );

    setTotalSums(newTotals);
  }, [detailsMain]);

  const sourceCounts = detailsMerge.reduce((counts, item) => {
    counts[item.source] = (counts[item.source] || 0) + 1;
    return counts;
  }, {});

  return (
    <>
      <Seo title="Dashboard: Ventas" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid
              xs={12}
              lg={12}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <SalesFilter
                  selectedParams={selectedParams}
                  setSelectedParams={setSelectedParams}
                  onLoadData={handleApplyFilters}
                  loading={loadingObservations}
                />
                <StorageStats
                  title="Ventas"
                  totals={totals}
                  totalInconsistencies={detailsMain.length || 0}
                  totalSums={totalSums}
                  loading={loadingObservations}
                />
                <AnalyticsDetails
                  loading={loadingObservations}
                  details={detailsMain || []}
                  downloadPath={downloadPath}
                  onLoadData={handleApplyFilters}
                  onDownload={handleDownloadObservations}
                  totals={totals}
                />
                <MergeDataTable
                  loading={loadingMissings}
                  details={detailsMerge || []}
                  sourceCounts={sourceCounts}
                  onLoadData={loadData}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
