import { useCallback, useEffect, useMemo, useState } from 'react';
import { subDays, subHours, subMinutes, subMonths } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { SunKeyModal } from 'src/sections/dashboard/sun-key/sun-key-modal';
import { claveSolAccountsApi } from 'src/api/sun-key-accounts/sunKeyService';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { useSelection } from 'src/hooks/use-selection';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import { SunKeyListSearch } from 'src/sections/dashboard/sun-key/sun-key-list-search';
import { SunKeyListTable } from 'src/sections/dashboard/sun-key/sun-key-list-table';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { AccountBillingSettings } from 'src/sections/dashboard/account/account-billing-settings';
import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { AccountNotificationsSettings } from 'src/sections/dashboard/account/account-notifications-settings';
import { AccountSecuritySettings } from 'src/sections/dashboard/account/account-security-settings';

const now = new Date();

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Clave Sol', value: 'clavesol' },
  { label: 'Facturación', value: 'facturacion' },
  { label: 'Notificaciones', value: 'notificaciones' },
  { label: 'Seguridad', value: 'seguridad' },
];

const useClaveSolAccountsSearch = () => {
  const user = useMockedUser();
  const [state, setState] = useState({
    filters: {
      query: undefined,
      status: [],
      user_id: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    user_id: user?.user_id,
  });

  const handleFiltersChange = useCallback((filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handleFiltersChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useClaveSolAccountsStore = (searchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    claveSolAccounts: [],
    claveSolAccountsCount: 0,
  });

  const handleClaveSolAccountsGet = useCallback(async () => {
    try {
      const response = await claveSolAccountsApi.getClaveSolAccounts(searchState);

      if (isMounted()) {
        setState({
          claveSolAccounts: response.data,
          claveSolAccountsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleClaveSolAccountsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
    handleClaveSolAccountsGet,
  };
};

const useClaveSolAccountIds = (accounts = []) => {
  return useMemo(() => {
    return accounts.map((account) => account.account_id);
  }, [accounts]);
};

const Page = () => {
  const user = useMockedUser();
  const [currentTab, setCurrentTab] = useState('general');
  const claveSolAccountsSearch = useClaveSolAccountsSearch();
  const claveSolAccountsStore = useClaveSolAccountsStore(claveSolAccountsSearch.state);
  const claveSolAccountIds = useClaveSolAccountIds(claveSolAccountsStore.claveSolAccounts);
  const claveSolAccountsSelection = useSelection(claveSolAccountIds);

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('create');
  const handleOpen = (option) => {
    setAction(option);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Dashboard: Cuenta" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">Cuenta</Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' && (
            <AccountGeneralSettings
              avatar={user?.avatar || ''}
              email={user?.email || ''}
              name={user?.name || ''}
              lastname={user?.lastname || ''}
            />
          )}
          {currentTab === 'clavesol' && (
            <>
              <Stack spacing={4}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">Clave SOL</Typography>
                    <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                      <Link
                        color="text.primary"
                        component={RouterLink}
                        href={paths.dashboard.index}
                        variant="subtitle2"
                      >
                        Dashboard
                      </Link>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                      >
                        Clave SOL
                      </Typography>
                    </Breadcrumbs>
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={3}
                  >
                    <Button
                      onClick={() => handleOpen('create')}
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                    >
                      Agregar
                    </Button>
                  </Stack>
                </Stack>
                <Card>
                  <SunKeyListSearch onFiltersChange={claveSolAccountsSearch.handleFiltersChange} />
                  <SunKeyListTable
                    onPageChange={claveSolAccountsSearch.handlePageChange}
                    onRowsPerPageChange={claveSolAccountsSearch.handleRowsPerPageChange}
                    page={claveSolAccountsSearch.state.page}
                    count={claveSolAccountsStore.claveSolAccountsCount}
                    items={claveSolAccountsStore.claveSolAccounts}
                    onDeselectAll={claveSolAccountsSelection.handleDeselectAll}
                    onDeselectOne={claveSolAccountsSelection.handleDeselectOne}
                    onSelectAll={claveSolAccountsSelection.handleSelectAll}
                    onSelectOne={claveSolAccountsSelection.handleSelectOne}
                    rowsPerPage={claveSolAccountsSearch.state.rowsPerPage}
                    selected={claveSolAccountsSelection.selected}
                    handleClaveSolAccountsGet={claveSolAccountsStore.handleClaveSolAccountsGet}
                    open={open}
                    handleOpen={handleOpen}
                    onClose={handleClose}
                    action={action}
                  />
                </Card>
              </Stack>
              <SunKeyModal
                action={action}
                onClose={handleClose}
                open={action === 'create' && open}
                handleClaveSolAccountsGet={claveSolAccountsStore.handleClaveSolAccountsGet}
                claveSol={{}}
              />
            </>
          )}
          {currentTab === 'facturacion' && (
            <AccountBillingSettings
              plan="standard"
              invoices={[
                {
                  id: '5547409069c59755261f5546',
                  amount: 4.99,
                  createdAt: subMonths(now, 1).getTime(),
                },
                {
                  id: 'a3e17f4b551ff8766903f31f',
                  amount: 4.99,
                  createdAt: subMonths(now, 2).getTime(),
                },
                {
                  id: '28ca7c66fc360d8203644256',
                  amount: 4.99,
                  createdAt: subMonths(now, 3).getTime(),
                },
              ]}
            />
          )}
          {currentTab === 'notificaciones' && <AccountNotificationsSettings />}
          {currentTab === 'seguridad' && (
            <AccountSecuritySettings
              loginEvents={[
                {
                  id: '1bd6d44321cb78fd915462fa',
                  createdAt: subDays(subHours(subMinutes(now, 5), 7), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7',
                },
                {
                  id: 'bde169c2fe9adea5d4598ea9',
                  createdAt: subDays(subHours(subMinutes(now, 25), 9), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7',
                },
              ]}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Page;
