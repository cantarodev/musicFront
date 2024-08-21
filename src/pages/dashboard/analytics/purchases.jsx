import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { Seo } from 'src/components/seo';
import { useSettings } from 'src/hooks/use-settings';
import TabsComponent from 'src/sections/dashboard/analytics/tabs-components';

const Page = () => {
  const settings = useSettings();

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
              <TabsComponent queryType="compras" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
