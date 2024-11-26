import Box from '@mui/material/Box';
import { Seo } from 'src/components/seo';
import DynamicTabs from 'src/components/tabs';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

import { useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useSearchParams } from 'src/hooks/use-search-params';
import { CircularProgress } from '@mui/material';

import Inconsinstencies from 'src/sections/dashboard/analytics/inconsistencies';
import Sire from 'src/sections/dashboard/analytics/sire';
import PurchasesDetractions from 'src/sections/dashboard/analytics/detractions';
import PurchasesCreditDebitNotes from 'src/sections/dashboard/analytics/purchases_credit_debit_notes';
import Factoring from 'src/sections/dashboard/analytics/purchases-factoring';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useMockedUser();
  const auth = useAuth();
  const user_id = searchParams.get('user_id');

  const tabs = [
    {
      label: 'Home',
      content: <Inconsinstencies type="Compras" />,
    },
    {
      label: 'Sire',
      content: <Sire type="Compras" />,
    },
    {
      label: 'Factoring',
      content: <Factoring type="Compras" />,
    },
    {
      label: 'Notas Créd. Déb.',
      content: <PurchasesCreditDebitNotes type="Compras" />,
    },
    {
      label: 'Detracciones',
      content: <PurchasesDetractions type="Compras" />,
    },
  ];

  useEffect(() => {
    const handleLogout = async () => {
      if (user_id && user?.user_id != user_id) {
        await auth.signOut();
        router.push(paths.index);
      }
    };
    handleLogout();
  }, [user?.user_id, router]);

  return (
    <>
      <Seo title="Reporte: Compras" />
      {!(user_id && user?.user_id != user_id) ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pb: 8,
          }}
        >
          <DynamicTabs
            type="Compras"
            tabs={tabs}
          />
        </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Page;
