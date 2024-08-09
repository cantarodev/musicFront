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
import { SalesFilter } from 'src/sections/dashboard/analytics/sales-filter';

const Page = () => {
  const settings = useSettings();
  const [generalDetail, setGeneralDetail] = useState({});
  const [details, setDetails] = useState([]);

  const [selectedParams, setSelectedParams] = useState({ period: '', type: 'ventas' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = useMockedUser();

  const handleDetails = useCallback(
    async (period, type, page, pageSize) => {
      const user_id = user?.user_id;
      setLoading(true);
      try {
        const response = await reportApi.getReportDetails({
          user_id,
          period,
          type,
          page,
          pageSize,
        });
        setDetails(response?.data?.items);
        setGeneralDetail(response?.data?.generalDetail);
        setLoading(false);
        return response?.data;
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    const loadData = async () => {
      const paginatedData = await handleDetails(
        selectedParams.period,
        selectedParams.type,
        page + 1,
        rowsPerPage
      );
      setDetails(paginatedData?.items);
      setTotalRecords(paginatedData?.total);
      setGeneralDetail(paginatedData?.generalDetail);
    };
    loadData();
  }, [selectedParams, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                  <Typography variant="h4">Ventas</Typography>
                </Stack>
                <SalesFilter
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
                details={details || []}
                generalDetail={generalDetail}
                totalRecords={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
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
