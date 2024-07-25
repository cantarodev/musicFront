import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { AnalyticsStats } from 'src/sections/dashboard/analytics/analytics-stats';
import { AnalyticsMostVisited } from 'src/sections/dashboard/analytics/analytics-most-visited';
import { AnalyticsSocialSources } from 'src/sections/dashboard/analytics/analytics-social-sources';
import { AnalyticsTrafficSources } from 'src/sections/dashboard/analytics/analytics-traffic-sources';
import { AnalyticsVisitsByCountry } from 'src/sections/dashboard/analytics/analytics-visits-by-country';

const Page = () => {
  const settings = useSettings();

  usePageView();

  return (
    <>
      <Seo title="Dashboard: Análisis" />
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
                  <Typography variant="h4">Análisis</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              lg={4}
            >
              <AnalyticsVisitsByCountry
                visits={[
                  {
                    id: 'us',
                    name: 'United States',
                    seoPercentage: 40,
                    value: 31200,
                  },
                  {
                    id: 'uk',
                    name: 'United Kingdom',
                    seoPercentage: 47,
                    value: 12700,
                  },
                  {
                    id: 'ru',
                    name: 'Russia',
                    seoPercentage: 65,
                    value: 10360,
                  },
                  {
                    id: 'ca',
                    name: 'Canada',
                    seoPercentage: 23,
                    value: 5749,
                  },
                  {
                    id: 'de',
                    name: 'Germany',
                    seoPercentage: 45,
                    value: 2932,
                  },
                  {
                    id: 'es',
                    name: 'Spain',
                    seoPercentage: 56,
                    value: 200,
                  },
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              lg={8}
            >
              <AnalyticsMostVisited
                pages={[
                  {
                    db: 16,
                    ple: 8584,
                    period: '202406',
                    name: 'LE2016163678020240600080100001111.txt',
                  },
                  {
                    db: 5,
                    ple: 648,
                    period: '202405',
                    name: 'LE2016163678020240500080100001111.txt',
                  },
                  {
                    db: 2,
                    ple: 568,
                    period: '202404',
                    name: 'LE2016163678020240400080100001111.txt',
                  },
                  {
                    db: 12,
                    ple: 12322,
                    period: '202403',
                    name: 'LE2016163678020240300080100001111.txt',
                  },
                  {
                    db: 10,
                    ple: 11645,
                    period: '202402',
                    name: 'LE2016163678020240200080100001111.txt',
                  },
                  {
                    db: 8,
                    ple: 10259,
                    period: '202401',
                    name: 'LE2016163678020240100080100001111.txt',
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
