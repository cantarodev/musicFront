import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export const PurchasesInconsistenciesCards = (props) => {
  const { title, loading, totalInconsistencies, totalSums } = props;

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
                Inconsistencias
              </Typography>
              <Typography variant="h5">
                {loading ? <Skeleton variant="text" /> : totalInconsistencies}
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
                Base Imponible
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  'S/ ' + totalSums.baseIGravadaDG.toLocaleString('en-US')
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
                IGV
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  'S/ ' + totalSums.igv.toLocaleString('en-US')
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
                Importe
              </Typography>
              <Typography variant="h5">
                {loading ? (
                  <Skeleton variant="text" />
                ) : (
                  'S/ ' + totalSums.importe.toLocaleString('en-US')
                )}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PurchasesInconsistenciesCards.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
  totalInconsistencies: PropTypes.number,
  totalSums: PropTypes.object,
};
