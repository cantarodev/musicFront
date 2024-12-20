import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import { fileManagerApi } from 'src/api/file-manager/fileService';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { useSettings } from 'src/hooks/use-settings';
import { ItemDrawer } from 'src/sections/dashboard/file-manager/item-drawer';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { PLESearchDialog } from 'src/sections/dashboard/file-manager/search-ple';
import toast from 'react-hot-toast';

import VideoPlayer from 'src/components/video-player';
import { Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import Search from 'src/components/search';
import VideoList from 'src/components/video-list';
import VideoSelections from 'src/components/video-selections';

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
      const response = await fileManagerApi.getTotals({ user_id, rucAccount, option: 'ple' });

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
  searchState['option'] = 'ple';

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
        option: 'ple',
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
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleVideoSelect = (video) => {
    setSelectedVideos((prev) => [...prev, video]);
    if (currentVideoIndex === null) {
      setCurrentVideoIndex(0); // Reproduce el primer video automáticamente
    }
  };

  const handleVideoEnd = () => {
    setSelectedVideos((prev) => {
      // Elimina el video que terminó de reproducirse
      const newVideos = prev.filter((_, index) => index !== currentVideoIndex);
      if (newVideos.length > 0) {
        // Reproduce el siguiente video si queda en la lista
        setCurrentVideoIndex((prevIndex) =>
          prevIndex < newVideos.length ? prevIndex : newVideos.length - 1
        );
      } else {
        // Si no quedan videos, resetea el índice actual
        setCurrentVideoIndex(null);
      }
      return newVideos;
    });
  };

  const currentVideo = selectedVideos[currentVideoIndex];

  return (
    <>
      <Seo title="Videos" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 8,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Container
          sx={{ pl: '0px !important', pr: '0px !important', height: '100%' }}
          maxWidth={settings.stretch ? false : 'xl'}
        >
          {/* Contenedor principal */}
          <Grid
            container
            spacing={2}
            sx={{ height: '100%' }}
          >
            {/* Barra de búsqueda */}
            <Grid
              item
              size={{ xs: 12, md: 9 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Search
                setVideos={setVideos}
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              />
              {/* Reproductor de video */}

              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  mt: 2,
                }}
              >
                {selectedVideos.length > 0 && (
                  <VideoPlayer
                    video={currentVideo}
                    onVideoEnd={handleVideoEnd}
                  />
                )}
                <VideoList
                  videos={videos}
                  onSelect={handleVideoSelect}
                />
              </Box>
            </Grid>

            {/* Lista de videos seleccionados */}
            <Grid
              item
              size={{ xs: 12, md: 3 }}
              sx={{
                height: '100%',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              <VideoSelections
                selectedVideos={selectedVideos}
                setSelectedVideos={setSelectedVideos}
                setCurrentVideoIndex={setCurrentVideoIndex}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
