import PropTypes from 'prop-types';
import numeral from 'numeral';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { ListItemIcon, Skeleton } from '@mui/material';
import { FileIcon } from 'src/components/file-icon';

export const StoragePleStats = (props) => {
  const { items, loading, title, opt } = props;
  const [totalStorage, setTotalStorage] = useState(0);
  const [totalPle, setTotalPle] = useState(0);

  const getTotalStorage = () => {
    let sum = 0;
    let total = 0;
    items?.forEach((item) => {
      sum += item.size;
      total += item.countPle;
    });

    setTotalStorage(sum);
    setTotalPle(total);
  };

  useEffect(() => {
    getTotalStorage();
  }, [items]);

  return (
    <Card>
      <CardHeader
        title={title}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Grid
          container
          spacing={2} // Reduje el espacio entre los elementos
        >
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1.5} // Reduje el espacio entre los íconos y el texto
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                borderRadius: 1.5, // Reduje el radio de los bordes
                px: 2, // Reduje el padding horizontal
                py: 2.5, // Reduje el padding vertical
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 36, // Reduje la altura del ícono
                  width: 36, // Reduje el ancho del ícono
                }}
              >
                {loading ? (
                  <Skeleton
                    variant="circular"
                    width={36}
                    height={36}
                  />
                ) : (
                  <ListItemIcon>
                    <Box sx={{ color: 'primary.main' }}>
                      <FileIcon extension="txt" />
                    </Box>
                  </ListItemIcon>
                )}
              </Box>
              <div>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={50}
                      height={20}
                    />
                  ) : (
                    'Todos'
                  )}
                </Typography>
                <Typography variant="h6">
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={25}
                    />
                  ) : (
                    bytesToSize(totalStorage)
                  )}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                    />
                  ) : (
                    totalPle + ' ' + (totalPle > 1 ? ' PLEs' : ' PLE')
                  )}
                </Typography>
              </div>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1.5} // Reduje el espacio entre los íconos y el texto
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                borderRadius: 1.5, // Reduje el radio de los bordes
                px: 2, // Reduje el padding horizontal
                py: 2.5, // Reduje el padding vertical
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 36, // Reduje la altura del ícono
                  width: 36, // Reduje el ancho del ícono
                }}
              >
                {loading ? (
                  <Skeleton
                    variant="circular"
                    width={36}
                    height={36}
                  />
                ) : (
                  <ListItemIcon>
                    <Box sx={{ color: 'primary.main' }}>
                      <FileIcon extension="txt" />
                    </Box>
                  </ListItemIcon>
                )}
              </Box>
              <div>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={50}
                      height={20}
                    />
                  ) : items[0]?.type == 'compras' ? (
                    'Compras'
                  ) : (
                    'Ventas'
                  )}
                </Typography>
                <Typography variant="h6">
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={25}
                    />
                  ) : (
                    bytesToSize(items[0]?.size)
                  )}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                    />
                  ) : (
                    '• ' +
                    items[0]?.countPle +
                    ' ' +
                    (items[0]?.totalPle > 1 ? ' PLEs ' : ' PLE ') +
                    ('• ' + items[0]?.countDoc + ' documentos')
                  )}
                </Typography>
              </div>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1.5} // Reduje el espacio entre los íconos y el texto
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                borderRadius: 1.5, // Reduje el radio de los bordes
                px: 2, // Reduje el padding horizontal
                py: 2.5, // Reduje el padding vertical
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 36, // Reduje la altura del ícono
                  width: 36, // Reduje el ancho del ícono
                }}
              >
                {loading ? (
                  <Skeleton
                    variant="circular"
                    width={36}
                    height={36}
                  />
                ) : (
                  <ListItemIcon>
                    <Box sx={{ color: 'primary.main' }}>
                      <FileIcon extension="txt" />
                    </Box>
                  </ListItemIcon>
                )}
              </Box>
              <div>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={50}
                      height={20}
                    />
                  ) : items[1]?.type == 'compras' ? (
                    'Compras'
                  ) : (
                    'Ventas'
                  )}
                </Typography>
                <Typography variant="h6">
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={25}
                    />
                  ) : (
                    bytesToSize(items[1]?.size)
                  )}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                    />
                  ) : (
                    '• ' +
                    items[1]?.countPle +
                    ' ' +
                    (items[1]?.totalPle > 1 ? ' PLEs ' : ' PLE ') +
                    ('• ' + items[1]?.countDoc + ' documentos')
                  )}
                </Typography>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

StoragePleStats.propTypes = {
  loading: PropTypes.bool,
  items: PropTypes.array,
};
