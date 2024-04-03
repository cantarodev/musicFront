import { useCallback, useEffect, useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { SunKeyModal } from 'src/sections/dashboard/sun-key/sun-key-modal';

import { sunKeyAccountsApi } from 'src/api/sun-key-accounts';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import { SunKeyListSearch } from 'src/sections/dashboard/sun-key/sun-key-list-search';
import { SunKeyListTable } from 'src/sections/dashboard/sun-key/sun-key-list-table';
import { useMockedUser } from 'src/hooks/use-mocked-user';

const useSunKeyAccountsSearch = () => {
  const user = useMockedUser();
  const [state, setState] = useState({
    filters: {
      ruc: undefined,
      username: undefined,
      status: [],
    },
    page: 0,
    rowsPerPage: 5,
    userId: user?.id,
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

const useSunKeyAccountsStore = (searchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    sunKeyAccounts: [],
    sunKeyAccountsCount: 0,
  });

  const handleSunKeyAccountsGet = useCallback(async () => {
    try {
      const response = await sunKeyAccountsApi.getSunKeyAccounts(searchState);
      if (isMounted()) {
        setState({
          sunKeyAccounts: response.data,
          sunKeyAccountsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleSunKeyAccountsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
    handleSunKeyAccountsGet,
  };
};

const Page = () => {
  const sunKeyAccountsSearch = useSunKeyAccountsSearch();
  const sunKeyAccountsStore = useSunKeyAccountsStore(sunKeyAccountsSearch.state);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('create');
  const handleOpen = (option) => {
    setAction(option);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // usePageView();

  return (
    <>
      <Seo title="Dashboard: Clave SOL" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
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
              <SunKeyListSearch onFiltersChange={sunKeyAccountsSearch.handleFiltersChange} />
              <SunKeyListTable
                onPageChange={sunKeyAccountsSearch.handlePageChange}
                onRowsPerPageChange={sunKeyAccountsSearch.handleRowsPerPageChange}
                page={sunKeyAccountsSearch.state.page}
                items={sunKeyAccountsStore.sunKeyAccounts}
                count={sunKeyAccountsStore.sunKeyAccountsCount}
                rowsPerPage={sunKeyAccountsSearch.state.rowsPerPage}
                handleSunKeyAccountsGet={sunKeyAccountsStore.handleSunKeyAccountsGet}
                open={open}
                handleOpen={handleOpen}
                onClose={handleClose}
                action={action}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
      <SunKeyModal
        action={action}
        onClose={handleClose}
        open={action === 'create' && open}
        handleSunKeyAccountsGet={sunKeyAccountsStore.handleSunKeyAccountsGet}
        sunKey={{}}
      />
    </>
  );
};

export default Page;
