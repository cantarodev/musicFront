import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Seo } from 'src/components/seo';
import DynamicTabs from 'src/components/tabs';
import { useAuth } from 'src/hooks/use-auth';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';

import { paths } from 'src/paths';

import Correlativity from 'src/sections/dashboard/analytics/sales-inconsistencies-correlativity';
import Inconsinstencies from 'src/sections/dashboard/analytics/inconsistencies';
import Sire from 'src/sections/dashboard/analytics/sire';
import PurchasesCreditDebitNotes from 'src/sections/dashboard/analytics/purchases_credit_debit_notes';
import Factoring from 'src/sections/dashboard/analytics/purchases-factoring'; // Importar factoring

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useMockedUser();
  const auth = useAuth();
  const user_id = searchParams.get('user_id');

  const tabs = [
    {
      label: 'Home',
      content: <Inconsinstencies type="Ventas" />,
    },
    {
      label: 'Sire',
      content: <Sire type="Ventas" />,
    },
    {
      label: 'Factoring',
      content: <Factoring type="Ventas" />,
    },
    {
      label: 'Notas Créd. Déb.',
      content: <PurchasesCreditDebitNotes type="Ventas" />,
    },
    {
      label: 'Correlatividad',
      content: <Correlativity type="Ventas" />,
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
      <Seo title="Reporte: Ventas" />
      {!(user_id && user?.user_id != user_id) ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pb: 8,
          }}
        >
          <DynamicTabs
            type="Ventas"
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
