import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export const PurchasesSireCards = (props) => {
  const { title, loading, relevantData } = props;
  console.log(relevantData);

  return (
    <Card>
      <CardHeader
        title={title}
        sx={{ p: 2, pb: 0 }}
      />
      <CardContent sx={{ p: 2, pb: '16px !important' }}>
        <Grid
          container
          spacing={2}
        >
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Total de Registros SUNAT
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : relevantData.total_sunat}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Total de Registros PLE
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : relevantData.total_ple}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Registros Coincidentes
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : relevantData.coincidences}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Registros No Coincidentes (SUNAT)
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : relevantData.num_only_in_database}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Registros No Coincidentes (PLE)
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : relevantData.num_only_in_s3}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Porcentaje de Coincidencia
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  parseFloat(relevantData.coincidence_percentage).toFixed(2) + '%'
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Diferencia en Monto Total
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  'S/ ' +
                  parseFloat(relevantData.sum_total_difference.toLocaleString('en-US')).toFixed(2)
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'error.lightest',
                height: 70,
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Porcentaje de Discrepancia en Monto
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  relevantData.discrepancy_percentage.toFixed(2) + '%'
                )}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PurchasesSireCards.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  relevantData: PropTypes.object,
};
