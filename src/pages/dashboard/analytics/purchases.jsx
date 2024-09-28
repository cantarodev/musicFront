import Box from '@mui/material/Box';
import { useParams } from 'react-router';
import { Seo } from 'src/components/seo';
import BasicTabs from 'src/components/tabs-components';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

import { useEffect } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useSearchParams } from 'src/hooks/use-search-params';
import { CircularProgress } from '@mui/material';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useMockedUser();
  const auth = useAuth();
  const user_id = searchParams.get('user_id');

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
      <Seo title="Dashboard: Compras" />
      {!(user_id && user?.user_id != user_id) ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pb: 8,
          }}
        >
          <BasicTabs type="Compras" />
        </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Page;
