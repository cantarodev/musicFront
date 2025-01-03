import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid2';

import { Scrollbar } from 'src/components/scrollbar';
import { IconButton, InputAdornment } from '@mui/material';

export const AccountSecuritySettings = (props) => {
  const { loginEvents } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditing((prevState) => !prevState);
  }, []);

  const handleTogglePassowrdVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Stack spacing={4}>
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
              <Typography variant="h6">Change password</Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <TextField
                  disabled={!isEditing}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="Thebestpasswordever123#"
                  sx={{
                    flexGrow: 1,
                    ...(!isEditing && {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dotted',
                      },
                    }),
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          arial-label="Alternar visibilidad de contraseña"
                          onClick={handleTogglePassowrdVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Multi Factor Authentication" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              sm={6}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'block',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Authenticator App
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use an authenticator app to generate one time security codes.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              sm={6}
              xs={12}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Text Message
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use your mobile phone to receive security codes via SMS.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="Login history"
          subheader="Your recent login activity"
        />
        <Scrollbar>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Login type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginEvents.map((event) => {
                const createdAt = format(event.createdAt, 'HH:mm a MM/dd/yyyy');

                return (
                  <TableRow
                    key={event.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">{event.type}</Typography>
                      <Typography
                        variant="body2"
                        color="body2"
                      >
                        on {createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>{event.ip}</TableCell>
                    <TableCell>{event.userAgent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </Stack>
  );
};

AccountSecuritySettings.propTypes = {
  loginEvents: PropTypes.array.isRequired,
};
