import Box from '@mui/material/Box';

import { Seo } from 'src/components/seo';
import BasicTabs from 'src/components/tabs-components';

const Page = () => {
  return (
    <>
      <Seo title="Dashboard: Ventas" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 8,
        }}
      >
        <BasicTabs type="Ventas" />
      </Box>
    </>
  );
};

export default Page;
