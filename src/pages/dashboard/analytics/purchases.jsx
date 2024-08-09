import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { useSettings } from 'src/hooks/use-settings';
import { useCallback, useEffect, useState } from 'react';
import { reportApi } from 'src/api/reports/reportService';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { AnalyticsDetails } from 'src/sections/dashboard/analytics/analytics-details';
import { PurchasesFilter } from 'src/sections/dashboard/analytics/purchases-filter';
import { current } from '@reduxjs/toolkit';

const Page = () => {
  const settings = useSettings();
  const [generalDetail, setGeneralDetail] = useState({});
  const [details, setDetails] = useState([]);

  const [selectedParams, setSelectedParams] = useState({ period: '', type: 'compras' });

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = useMockedUser();

  const handleDetails = useCallback(async () => {
    const user_id = user?.user_id;
    const period = selectedParams.period;
    const type = selectedParams.type;

    setLoading(true);
    try {
      const response = await reportApi.getReportDetails({
        user_id,
        period,
        type,
        page,
        pageSize: 0,
      });

      setDetails(response?.data?.items);
      setTotalRecords(response?.data?.total);
      setGeneralDetail(response?.data?.generalDetail);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      const user_id = user?.user_id;
      const period = selectedParams.period;
      const type = selectedParams.type;

      setLoading(true);
      try {
        const response = await reportApi.getReportDetails({
          user_id,
          period,
          type,
          page,
          pageSize: 0,
        });

        setDetails(response?.data?.items);
        setTotalRecords(response?.data?.total);
        setGeneralDetail(response?.data?.generalDetail);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, [user, selectedParams]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = details.slice(startIndex, endIndex);

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
              sx={{
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: 'primary.main',
                marginRight: '-10px',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">Compras</Typography>
                </Stack>
                <PurchasesFilter
                  selectedParams={selectedParams}
                  setSelectedParams={setSelectedParams}
                />
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={12}
            >
              <AnalyticsDetails
                loading={loading}
                details={paginatedData || []}
                generalDetail={generalDetail}
                totalRecords={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
