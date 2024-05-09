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
import { BotsModal } from 'src/sections/dashboard/bots/bots-modal';

import { botsApi } from 'src/api/bots';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { BotsListSearch } from 'src/sections/dashboard/bots/bots-list-search';
import { BotsListTable } from 'src/sections/dashboard/bots/bots-list-table';
import { useMockedUser } from 'src/hooks/use-mocked-user';

const useBotsSearch = () => {
  const user = useMockedUser();
  const [state, setState] = useState({
    filters: {
      name: undefined,
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

const useBotsStore = (searchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    bots: [],
    botsCount: 0,
  });

  const handleBotsGet = useCallback(async () => {
    try {
      const response = await botsApi.getBots(searchState);
      if (isMounted()) {
        setState({
          bots: response.data,
          botsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleBotsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
    handleBotsGet,
  };
};

const Page = () => {
  const botsSearch = useBotsSearch();
  const botsStore = useBotsStore(botsSearch.state);
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
      <Seo title="Dashboard: Bots" />
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
                <Typography variant="h4">Bots</Typography>
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
                    Bots
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
              <BotsListSearch onFiltersChange={botsSearch.handleFiltersChange} />
              <BotsListTable
                onPageChange={botsSearch.handlePageChange}
                onRowsPerPageChange={botsSearch.handleRowsPerPageChange}
                page={botsSearch.state.page}
                items={botsStore.bots}
                count={botsStore.botsCount}
                rowsPerPage={botsSearch.state.rowsPerPage}
                handleBotsGet={botsStore.handleBotsGet}
                open={open}
                handleOpen={handleOpen}
                onClose={handleClose}
                action={action}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
      <BotsModal
        action={action}
        onClose={handleClose}
        open={action === 'create' && open}
        handleBotsGet={botsStore.handleBotsGet}
        sunKey={{}}
      />
    </>
  );
};

export default Page;
