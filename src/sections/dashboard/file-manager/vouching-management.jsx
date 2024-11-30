import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import { fileManagerApi } from 'src/api/file-manager/fileService';
import { Seo } from 'src/components/seo';
import { useDialog } from 'src/hooks/use-dialog';
import { useMounted } from 'src/hooks/use-mounted';
import { useSettings } from 'src/hooks/use-settings';
import { ItemDrawer } from 'src/sections/dashboard/file-manager/item-drawer';
import { ItemSearch } from 'src/sections/dashboard/file-manager/item-search';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { PLESearchDialog } from 'src/sections/dashboard/file-manager/search-ple';
import socket from 'src/utils/socket';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ItemVouchingList } from './item-vouching-list';
import { StorageVouchingStats } from './storage-vouching-stats';

const useItemsSearch = (user_id, rucAccount) => {
  const [state, setState] = useState({
    filters: {
      query: undefined,
    },
    page: 0,
    rowsPerPage: 9,
    sortBy: 'createdAt',
    sortDir: 'desc',
    user_id: user_id,
    rucAccount,
    year: new Date().getFullYear(),
    type: 'all',
  });

  const handleFilterType = useCallback((type) => {
    setState((prevState) => ({
      ...prevState,
      type,
    }));
  }, []);

  const handleFilterYear = useCallback((year) => {
    setState((prevState) => ({
      ...prevState,
      year,
    }));
  }, []);

  const handleFiltersChange = useCallback((filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handleSortChange = useCallback((sort) => {
    setState((prevState) => ({
      ...prevState,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
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
    handleFilterType,
    handleFilterYear,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useItemsTotals = (user_id, rucAccount) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    items: [],
  });

  const handleItemsTotalsGet = useCallback(async () => {
    try {
      const response = await fileManagerApi.getTotals({ user_id, rucAccount, option: 'vouching' });

      if (isMounted()) {
        setState({
          items: response.data,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [user_id, rucAccount, isMounted]);

  useEffect(() => {
    if (rucAccount) {
      handleItemsTotalsGet();
    }
  }, [rucAccount]);

  return {
    handleItemsTotalsGet,
    ...state,
  };
};

const useItemsStore = (searchState, rucAccount) => {
  searchState['rucAccount'] = rucAccount;
  searchState['option'] = 'vouching';

  const isMounted = useMounted();
  const [state, setState] = useState({
    items: [],
    itemsCount: 0,
  });

  const handleItemsGet = useCallback(async () => {
    try {
      if (rucAccount) {
        const response = await fileManagerApi.getFiles(searchState);

        if (isMounted()) {
          setState({
            items: response.data,
            itemsCount: response.count,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, rucAccount, isMounted]);

  const handleDelete = useCallback(async (itemId) => {
    try {
      const response = await fileManagerApi.deleteFile({
        user_id: searchState?.user_id,
        file_id: itemId,
        option: 'vouching',
      });
      if (isMounted()) {
        setState((prevState) => {
          return {
            ...prevState,
            items: prevState.items.filter((item) => item.id !== itemId),
          };
        });

        toast.success(response.message, { duration: 5000, position: 'top-center' });
      }
    } catch (err) {
      toast.error('Hubo un error al intentar eliminar PLE.', {
        duration: 5000,
        position: 'top-center',
      });
      console.error(err);
    }
  }, []);

  useEffect(() => {
    handleItemsGet();
  }, [searchState, rucAccount]);

  return {
    ...state,
    handleDelete,
    handleItemsGet,
  };
};

const useCurrentItem = (items, itemId) => {
  return useMemo(() => {
    if (!itemId) {
      return undefined;
    }

    return items.find((item) => item.id === itemId);
  }, [items, itemId]);
};

const Page = () => {
  const settings = useSettings();

  const user = useMockedUser();
  const selectedAccount = useSelector((state) => state.account);

  const itemsSearch = useItemsSearch(user?.user_id, selectedAccount);
  const itemsStore = useItemsStore(itemsSearch.state, selectedAccount);
  const detailsDialog = useDialog();
  const pleSearchDialog = useDialog(); // Dialog state for PLE search
  const currentItem = useCurrentItem(itemsStore.items, detailsDialog.data);
  const totals = useItemsTotals(user?.user_id, selectedAccount);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const handleDelete = useCallback(
    async (itemId) => {
      setLoading(true);
      detailsDialog.handleClose();
      await itemsStore.handleDelete(itemId);
      totals.handleItemsTotalsGet();
    },
    [detailsDialog, itemsStore]
  );

  useEffect(() => {
    setLoading(true);
    if (totals.items?.sizeTotals) {
      setLoading(false);
    }
  }, [totals.items]);

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
        <Container
          sx={{ pl: '0px !important', pr: '0px !important' }}
          maxWidth={settings.stretch ? false : 'xl'}
        >
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid size={{ xs: 12, md: 12 }}>
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <StorageVouchingStats
                  items={totals.items}
                  loading={loading}
                  title="Vouching"
                  opt="vouching"
                />
                <ItemSearch
                  onFilterType={itemsSearch.handleFilterType}
                  onFilterYear={itemsSearch.handleFilterYear}
                  onFiltersChange={itemsSearch.handleFiltersChange}
                  onSortChange={itemsSearch.handleSortChange}
                  sortBy={itemsSearch.state.sortBy}
                  sortDir={itemsSearch.state.sortDir}
                  year={itemsSearch.state.year}
                  type={itemsSearch.state.type}
                  loading={setLoading}
                  handleItemsTotalsGet={totals.handleItemsTotalsGet}
                  handleItemsGet={itemsStore.handleItemsGet}
                  opt="vouching"
                />
                <ItemVouchingList
                  setLoading={setLoading}
                  count={itemsStore.itemsCount}
                  items={itemsStore.items}
                  onDelete={handleDelete}
                  onFavorite={itemsStore.handleFavorite}
                  onOpen={detailsDialog.handleOpen}
                  onPageChange={itemsSearch.handlePageChange}
                  onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                  page={itemsSearch.state.page}
                  rowsPerPage={itemsSearch.state.rowsPerPage}
                  loading={loading}
                  opt="vouching"
                />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ItemDrawer
        item={currentItem}
        onClose={detailsDialog.handleClose}
        onDelete={handleDelete}
        onFavorite={itemsStore.handleFavorite}
        open={detailsDialog.open}
      />
      <PLESearchDialog
        onClose={pleSearchDialog.handleClose}
        open={pleSearchDialog.open}
      />
    </>
  );
};

export default Page;
