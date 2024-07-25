import PropTypes from 'prop-types';
import numeral from 'numeral';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { ListItemIcon } from '@mui/material';
import { FileIcon } from 'src/components/file-icon';

export const StorageStats = (props) => {
  const { items } = props;
  const [totalStorage, setTotalStorage] = useState(0);
  const [totalPle, setTotalPle] = useState(0);

  const getTotalStorage = () => {
    let sum = 0;
    let total = 0;
    items.forEach((item) => {
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
        title="Tus archivos PLEs de compras y ventas"
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={4}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                borderRadius: 2.5,
                px: 3,
                py: 4,
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  height: 48,
                  width: 48,
                }}
              >
                <ListItemIcon>
                  <Box sx={{ color: 'primary.main' }}>
                    <FileIcon extension="txt" />
                  </Box>
                </ListItemIcon>
              </Box>
              <div>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Todos
                </Typography>
                <Typography variant="h5">{bytesToSize(totalStorage)}</Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  • {totalPle}
                  {totalPle > 1 ? ' PLEs' : ' PLE'}
                </Typography>
              </div>
            </Stack>
          </Grid>
          {items?.map((total, index) => {
            const size = bytesToSize(total.size);
            const name = total.type == '08' ? 'Compras' : 'Ventas';
            return (
              <Grid
                xs={12}
                md={4}
                key={index}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                    borderRadius: 2.5,
                    px: 3,
                    py: 4,
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      height: 48,
                      width: 48,
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ color: 'primary.main' }}>
                        <FileIcon extension="txt" />
                      </Box>
                    </ListItemIcon>
                  </Box>
                  <div>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {name}
                    </Typography>
                    <Typography variant="h5">{size}</Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      • {total.countPle}
                      {total.countPle > 1 ? ' PLEs' : ' PLE'} • {total.countDoc} documentos
                    </Typography>
                  </div>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

StorageStats.propTypes = {
  items: PropTypes.array,
};
