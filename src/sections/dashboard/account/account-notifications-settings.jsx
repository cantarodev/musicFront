import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

export const AccountNotificationsSettings = () => (
  <Card>
    <CardContent>
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={4}
        >
          <Typography variant="h6">Email</Typography>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={8}
        >
          <Stack
            divider={<Divider />}
            spacing={3}
          >
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle1">Product updates</Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  News, announcements, and product updates.
                </Typography>
              </Stack>
              <Switch defaultChecked />
            </Stack>
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle1">Security updates</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Important notifications about your account security.
                </Typography>
              </Stack>
              <Switch defaultChecked />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={4}
        >
          <Typography variant="h6">Phone notifications</Typography>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={8}
        >
          <Stack
            divider={<Divider />}
            spacing={3}
          >
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle1">Security updates</Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Important notifications about your account security.
                </Typography>
              </Stack>
              <Switch />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
