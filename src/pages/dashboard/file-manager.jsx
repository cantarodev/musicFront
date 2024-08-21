import { useCallback, useEffect, useMemo, useState } from 'react';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
// import SearchIcon from '@untitled-ui/icons-react/build/esm/Search'; // Asegúrate de que esta ruta sea correcta
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { fileManagerApi } from 'src/api/file-manager';
import { Seo } from 'src/components/seo';
import { useDialog } from 'src/hooks/use-dialog';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { FileUploader } from 'src/sections/dashboard/file-manager/file-uploader';
import { ItemDrawer } from 'src/sections/dashboard/file-manager/item-drawer';
import { ItemList } from 'src/sections/dashboard/file-manager/item-list';
import { ItemSearch } from 'src/sections/dashboard/file-manager/item-search';
import { StorageStats } from 'src/sections/dashboard/file-manager/storage-stats';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { PLESearchDialog } from 'src/sections/dashboard/file-manager/search-ple'; // Asegúrate de que la ruta sea correcta
import { set } from 'nprogress';
import toast from 'react-hot-toast';

const useItemsSearch = (user_id) => {
  const [state, setState] = useState({
    filters: {
      query: undefined,
    },
    page: 0,
    rowsPerPage: 9,
    sortBy: 'createdAt',
    sortDir: 'desc',
    user_id: user_id,
  });

  const handleFiltersChange = useCallback((filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handleSortChange = useCallback((sortDir) => {
    setState((prevState) => ({
      ...prevState,
      sortDir,
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
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useItemsTotals = (user_id) => {
  const [state, setState] = useState({
    items: [],
  });
  const handleItemsTotalsGet = useCallback(async () => {
    try {
      const response = await fileManagerApi.getTotals({ user_id });
      setState({
        items: response,
      });
    } catch (err) {
      console.error(err);
    }
  }, [user_id]);

  useEffect(
    () => {
      handleItemsTotalsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user_id]
  );

  return {
    handleItemsTotalsGet,
    ...state,
  };
};

const useItemsStore = (searchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    items: [],
    itemsCount: 0,
  });

  const handleItemsGet = useCallback(async () => {
    try {
      const response = await fileManagerApi.getFiles(searchState);
      if (isMounted()) {
        setState({
          items: response.data,
          itemsCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleItemsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  const handleDelete = useCallback(async (itemId) => {
    try {
      const response = await fileManagerApi.deleteFile({
        user_id: searchState?.user_id,
        file_id: itemId,
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
        duration: 5000, position: 'top-center',
      });
      console.error(err);
    }
  }, []);

  return {
    handleDelete,
    handleItemsGet,
    ...state,
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
  const user = useMockedUser();
  const settings = useSettings();
  const itemsSearch = useItemsSearch(user?.user_id);
  const itemsStore = useItemsStore(itemsSearch.state);
  const [view, setView] = useState('grid');
  const uploadDialog = useDialog();
  const detailsDialog = useDialog();
  const pleSearchDialog = useDialog(); // Dialog state for PLE search
  const currentItem = useCurrentItem(itemsStore.items, detailsDialog.data);
  const totals = useItemsTotals(user?.user_id);

  usePageView();

  const handleDelete = useCallback(
    (itemId) => {
      detailsDialog.handleClose();
      itemsStore.handleDelete(itemId);
    },
    [detailsDialog, itemsStore]
  );

  return (
    <>
      <Seo title="Dashboard: Gestión PLEs" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pb: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">Administrador de Archivos</Typography>
                </div>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >
                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={12}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <StorageStats items={totals.items} />
                <ItemSearch
                  onFiltersChange={itemsSearch.handleFiltersChange}
                  onSortChange={itemsSearch.handleSortChange}
                  onViewChange={setView}
                  sortBy={itemsSearch.state.sortBy}
                  sortDir={itemsSearch.state.sortDir}
                  view={view}
                />
                <ItemList
                  count={itemsStore.itemsCount}
                  items={itemsStore.items}
                  onDelete={handleDelete}
                  onFavorite={itemsStore.handleFavorite}
                  onOpen={detailsDialog.handleOpen}
                  onPageChange={itemsSearch.handlePageChange}
                  onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                  page={itemsSearch.state.page}
                  rowsPerPage={itemsSearch.state.rowsPerPage}
                  view={view}
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
      <FileUploader
        onClose={uploadDialog.handleClose}
        open={uploadDialog.open}
        handleItemsTotalsGet={totals.handleItemsTotalsGet}
        handleItemsGet={itemsStore.handleItemsGet}
      />
      <PLESearchDialog
        onClose={pleSearchDialog.handleClose}
        open={pleSearchDialog.open}
      />
    </>
  );
};

export default Page;
