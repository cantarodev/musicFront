import { useCallback, useEffect, useState } from 'react';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { solKeyAccountsApi } from 'src/api/customers';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import { SolKeyAccountEditForm } from 'src/sections/dashboard/customers/customer-edit-form';
import { getInitials } from 'src/utils/get-initials';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { solKeyAccount } from 'src/api/customers/data';

const useCustomer = () => {
  const isMounted = useMounted();
  const [account, setAccount] = useState(null);

  const handleAccountGet = useCallback(async () => {
    try {
      const response = await solKeyAccountsApi.getSolKeyAccount();

      if (isMounted()) {
        setAccount(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleAccountGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return account;
};

const Page = () => {
  const user = useMockedUser();
  const customer = useCustomer();

  usePageView();

  if (!customer) {
    return null;
  }

  return (
    <>
      <Seo title="Dashboard: Clave-Sol" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.solKeyAccounts.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Clave Sol</Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                  <Avatar
                    src={user?.avatar}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  >
                    {getInitials(user?.name)}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{user?.email}</Typography>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">ID Usuario:</Typography>
                      <Chip
                        label={user?.id}
                        size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <SolKeyAccountEditForm solKeyAccount={solKeyAccount} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
