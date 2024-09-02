import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';

import { Seo } from 'src/components/seo';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettings } from 'src/hooks/use-settings';
import { AnalyticsDetails } from 'src/sections/dashboard/analytics/analytics-details';
import { MergeDataTable } from 'src/sections/dashboard/analytics/merged-data-table';
import { PurchasesFilter } from 'src/sections/dashboard/analytics/purchases-filter';
import { reportApi } from 'src/api/reports/reportService';

import axios from 'axios';
import { useSelector } from 'react-redux';

const Page = () => {
  const settings = useSettings();

  const selectedAccount = useSelector((state) => state.account);
  const [detailsMain, setDetailsMain] = useState([]);
  const [downloadPath, setDownloadPath] = useState('');
  const [detailsMerge, setDetailsMerge] = useState([]);

  const [loadingObservations, setLoadingObservations] = useState(false);
  const [loadingMissings, setLoadingMissings] = useState(false);

  const user = useMockedUser();

  const [selectedParams, setSelectedParams] = useState({
    period: '202408',
    account: selectedAccount,
    queryType: 'compras',
    docType: 'all',
    currency: 'all',
    filters: {},
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
    loadData();
  }, []);

  useEffect(() => {
    setSelectedParams((state) => ({ ...state, account: selectedAccount }));
  }, [selectedAccount]);

  const sourceCounts = detailsMerge.reduce((counts, item) => {
    counts[item.source] = (counts[item.source] || 0) + 1;
    return counts;
  }, {});

  return (
    <>
      <Seo title="Dashboard: Compras" />
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
                <PurchasesFilter
                  selectedParams={selectedParams}
                  setSelectedParams={setSelectedParams}
                />
                <AnalyticsDetails
                  loading={loadingObservations}
                  details={detailsMain || []}
                  downloadPath={downloadPath}
                  onLoadData={handleApplyFilters}
                  onDownload={handleDownloadObservations}
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
