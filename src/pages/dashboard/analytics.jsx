import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { useSettings } from 'src/hooks/use-settings';
import { AnalyticsMostVisited } from 'src/sections/dashboard/analytics/analytics-most-visited';
import { useCallback, useEffect, useState } from 'react';
import { reportApi } from 'src/api/reports/';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { AnalyticsVisitsByCountry } from 'src/sections/dashboard/analytics/analytics-visits-by-country';

const Page = () => {
  const settings = useSettings();
  const [reports, setReports] = useState({});
  const user = useMockedUser();

  // usePageView();

  const handleReports = useCallback(async () => {
    const user_id = user?.user_id;
    try {
      const response = await reportApi.getReportStatus({ user_id });
      setReports(response);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    handleReports();
  }, [handleReports]);

  return (
    <>
      <Seo title="Dashboard: Reportes" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
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
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">Reportes</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={12}
            >
              <AnalyticsMostVisited reports={reports} />
            </Grid>
            <Grid
              xs={12}
              lg={12}
            >
              <AnalyticsVisitsByCountry
                visits={[
                  {
                    period: '202405',
                    series: 'E001',
                    number: 6907,
                    existsInPle: true,
                    existsInDb: true,
                    observation: '',
                  },
                  {
                    period: '202405',
                    series: 'E001',
                    number: 9386,
                    existsInPle: true,
                    existsInDb: true,
                    observation: 'Discrepancia de montos entre valores de PLE y Base de datos',
                  },
                  {
                    period: '202405',
                    series: 'F001',
                    number: 35495,
                    existsInPle: true,
                    existsInDb: true,
                    observation: '',
                  },
                  {
                    period: '202405',
                    series: 'E001',
                    number: 883,
                    existsInPle: true,
                    existsInDb: false,
                    observation: 'Registro en PLE presente, Registro en la base de datos ausente.',
                  },
                  {
                    period: '202405',
                    series: 'F300',
                    number: 476279,
                    existsInPle: true,
                    existsInDb: true,
                    observation: '',
                  },
                  {
                    period: '202405',
                    series: 'F001',
                    number: 2268,
                    existsInPle: true,
                    existsInDb: true,
                    observation: '',
                  },
                  {
                    period: '202405',
                    series: 'F001',
                    number: 6470,
                    existsInPle: false,
                    existsInDb: true,
                    observation: 'Registro en la base de datos presente, Registro en PLE ausente.',
                  },
                  {
                    period: '202405',
                    series: 'F004',
                    number: 516086,
                    existsInPle: true,
                    existsInDb: true,
                    observation: '',
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
