import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { toast } from 'react-hot-toast';

import { RouterLink } from 'src/components/router-link';
import { Scrollbar } from 'src/components/scrollbar';
import { paths } from 'src/paths';
import { getInitials } from 'src/utils/get-initials';
import AWS from 'aws-sdk';
import { SeverityPill } from 'src/components/severity-pill';
import { UsersChangeStatus } from 'src/components/users-change-status';
import { UsersMoreMenu } from 'src/components/users-more-menu';
import { useCallback, useState } from 'react';

import { usersApi } from 'src/api/users/index';

export const UserListTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    handleOpen,
    handleUsersGet,
    onClose,
  } = props;
  const [currentUser, setCurrentUser] = useState(null);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const enableBulkActions = selected.length > 0;

  const handleUserSelected = useCallback((bot) => {
    setCurrentUser((prevBot) => {
      return bot;
    });
  }, []);

  const deleteAllUsers = async (toastId) => {
    try {
      const response = await usersApi.deletAllUsers({ userIds: selected });
      toast.dismiss(toastId);
      handleUsersGet();
      toast.success(response.message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error('Algo salió mal!', { duration: 3000, position: 'top-center' });
    }
  };

  const confirmDeleteAll = () => {
    toast(
      (t) => (
        <span>
          ¿Eliminar todos los usuarios?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => deleteAllUsers(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={(event) => {
              if (event.target.checked) {
                onSelectAll?.();
              } else {
                onDeselectAll?.();
              }
            }}
          />
          <Button
            color="inherit"
            size="small"
            onClick={confirmDeleteAll}
          >
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectAll?.();
                    } else {
                      onDeselectAll?.();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Doc. Idendtidad</TableCell>
              <TableCell>Tel/Celular</TableCell>
              <TableCell>Verificado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((user) => {
              const isSelected = selected.includes(user.user_id);
              const verifiedColor = user.verified ? 'success' : 'error';
              const statusColor =
                user.status === 'active'
                  ? 'success'
                  : user.status == 'inactive'
                  ? 'error'
                  : 'warning';
              const status =
                user.status === 'active'
                  ? 'Activo'
                  : user.status == 'inactive'
                  ? 'Inactivo'
                  : 'Pendiente';
              const verified = user.verified ? 'SI' : 'NO';
              let photoURL = '';
              const s3 = new AWS.S3({
                region: 'us-east-2',
                credentials: {
                  accessKeyId: 'AKIA4MTWJ6ITS7PRWPFS',
                  secretAccessKey: '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',
                },
                signatureVersion: 'v4',
              });

              if (user?.avatar) {
                const params = {
                  Bucket: 'user-photo-taxes',
                  Key: user?.avatar,
                };
                photoURL = s3.getSignedUrl('getObject', params);
              }

              return (
                <TableRow
                  hover
                  key={user.user_id}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={user.status === 'inactive'}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectOne?.(user.user_id);
                        } else {
                          onDeselectOne?.(user.user_id);
                        }
                      }}
                      value={isSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Avatar
                        src={photoURL}
                        sx={{
                          height: 42,
                          width: 42,
                        }}
                      >
                        {getInitials(user.name + ' ' + user.lastname)}
                      </Avatar>
                      <div>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          href={paths.dashboard.users.details}
                          variant="subtitle2"
                        >
                          {user.name + ' ' + user.lastname}
                        </Link>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {user.email}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{user.dni}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{user.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <SeverityPill color={verifiedColor}>{verified}</SeverityPill>
                  </TableCell>
                  <TableCell>
                    <UsersChangeStatus
                      handleUserSelected={handleUserSelected}
                      handleOpen={handleOpen}
                      onClose={onClose}
                      user={user}
                      handleUsersGet={handleUsersGet}
                      statusColor={statusColor}
                      status={status}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <UsersMoreMenu
                      handleUserSelected={handleUserSelected}
                      handleOpen={handleOpen}
                      user={user}
                      handleUsersGet={handleUsersGet}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

UserListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  handleOpen: PropTypes.func,
  handleUsersGet: PropTypes.func,
  onClose: PropTypes.func,
};
