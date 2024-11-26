import Box from '@mui/material/Box';
import { Seo } from 'src/components/seo';

import DynamicTabs from 'src/components/tabs';
import PleManagement from 'src/sections/dashboard/file-manager/ple-management';
import VouchingManagement from 'src/sections/dashboard/file-manager/vouching-management';

const Page = () => {
  const tabs = [
    {
      label: 'PLEs',
      content: <PleManagement />,
    },
    {
      label: 'Vouching',
      content: <VouchingManagement />,
    },
  ];

  return (
    <>
      <Seo title="Gestión de Archivos" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 8,
        }}
      >
        <DynamicTabs tabs={tabs} />
      </Box>
    </>
  );
};

export default Page;
