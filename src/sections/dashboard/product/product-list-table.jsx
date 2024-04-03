import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

import { solKeyAccountsApi } from 'src/api/products/index';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const initialValues = {};

export const ProductListTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [inputRucValue, setInputRucValue] = useState('');

  items.forEach((product) => {
    initialValues[product.id] = {
      id: product.id || '',
      ruc: product.ruc || '',
      username: product.username || '',
      password: product.password || '',
    };
  });

  const validationSchema = Yup.object({
    id: Yup.string().max(255),
    ruc: Yup.string()
      .matches(/^[0-9]+$/, 'Solo se permiten números')
      .min(11, 'Debe tener exactamente 11 dígitos')
      .max(11, 'Debe tener exactamente 11 dígitos')
      .test('dosPrimerosDigitos', 'Los dos primeros dígitos deben ser 10 o 20', (value) => {
        const primerosDosDigitos = value ? value.substring(0, 2) : '';
        return primerosDosDigitos === '10' || primerosDosDigitos === '20';
      })
      .required('Se requiere RUC'),
    username: Yup.string().max(50).required('Se requiere nombre de usuario'),
    password: Yup.string().max(20).required('Se requiere contraseña'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        console.log(values);
        // NOTE: Make API request
        // const response = await solKeyAccountsApi.updateSolKeyAccount(values);
        // console.log(response);
        toast.success('Cuenta Clave SOL creada');
      } catch (err) {
        console.error(err);
        toast.error('Algo salió mal!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleProductToggle = useCallback((productId) => {
    setCurrentProduct((prevProductId) => {
      if (prevProductId === productId) {
        return null;
      }

      return productId;
    });
  }, []);

  const handleProductClose = useCallback(() => {
    setCurrentProduct(null);
  }, []);

  const handleProductUpdate = useCallback(async (id) => {
    try {
      console.log(id);
      // const response = await solKeyAccountsApi.updateSolKeyAccount({});
      setCurrentProduct(null);
      toast.success('Product updated');
    } catch (err) {
      console.error(err);
      toast.error('Algo salió mal!');
    }
  }, []);

  const handleProductDelete = useCallback(() => {
    toast.error('Product cannot be deleted');
  }, []);

  const handleTogglePassowrdVisibility = (opt) => {
    if (opt == 'show-pass') setShowPassword(!showPassword);
  };

  const handleInputRucChange = (e) => {
    const { value, name } = e.target;
    console.log(value, name);
    if (/^[0-9]*$/.test(value) && String(value).length <= 11) {
      setInputRucValue(value);
      formik.setFieldValue(name, value);
    }
  };

  const handleIdChange = (id) => {
    formik.values.id = id;
  };

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" />
              <TableCell width="30%">ID Clave SOL</TableCell>
              <TableCell width="30%">ID Usuario</TableCell>
              <TableCell width="15%">Ruc</TableCell>
              <TableCell width="15%">Nombre de Usuario</TableCell>
              <TableCell width="15%">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((product) => {
              const isCurrent = product.id === currentProduct;
              const statusColor =
                product.status === 'active'
                  ? 'success'
                  : product.status === 'inactive'
                  ? 'error'
                  : 'warning';
              const status =
                product.status === 'active'
                  ? 'activo'
                  : product.status === 'inactive'
                  ? 'inactivo'
                  : 'pendiente';

              return (
                <Fragment key={product.id}>
                  <TableRow
                    hover
                    key={product.id}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }),
                      }}
                      width="5%"
                    >
                      <IconButton onClick={() => handleProductToggle(product.id)}>
                        <SvgIcon>{isCurrent ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
                      </IconButton>
                    </TableCell>
                    <TableCell width="30%">
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{product.id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="30%">
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{product.userId}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="15%">
                      <Typography variant="subtitle2">{product.ruc}</Typography>
                    </TableCell>
                    <TableCell width="15%">{product.username}</TableCell>
                    <TableCell width="15%">
                      <SeverityPill color={statusColor}>{status}</SeverityPill>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <SvgIcon>
                          <DotsHorizontalIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {isCurrent && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }}
                      >
                        <form onSubmit={formik.handleSubmit}>
                          <CardContent>
                            <Grid
                              container
                              spacing={3}
                            >
                              <Grid
                                item
                                md={12}
                                xs={12}
                              >
                                <Typography variant="h6">Detalles</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid
                                  container
                                  spacing={3}
                                >
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <TextField
                                      disabled
                                      fullWidth
                                      label="ID Clave SOL"
                                      name={`${product.id}.id`}
                                      value={formik.values[product.id]?.id}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <TextField
                                      error={
                                        !!(
                                          formik.touched[product.id]?.username &&
                                          formik.errors[product.id]?.username
                                        )
                                      }
                                      fullWidth
                                      helperText={
                                        formik.touched[product.id]?.username &&
                                        formik.errors[product.id]?.username
                                      }
                                      label="Nombre de Usuario"
                                      name={`${product.id}.username`}
                                      value={formik.values[product.id]?.username}
                                      onChange={formik.handleChange}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <TextField
                                      // error={
                                      //   !!(
                                      //     formik.touched[product.id]?.ruc &&
                                      //     formik.errors[product.id]?.ruc
                                      //   )
                                      // }
                                      fullWidth
                                      // helperText={
                                      //   formik.touched[product.id]?.ruc &&
                                      //   formik.errors[product.id]?.ruc
                                      // }
                                      label="Ruc"
                                      name={`${product.id}.ruc`}
                                      value={formik.values[product.id]?.ruc}
                                      onChange={handleInputRucChange}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <TextField
                                      // error={!!(formik.touched.password && formik.errors.password)}
                                      fullWidth
                                      // helperText={formik.touched.password && formik.errors.password}
                                      label="Contraseña"
                                      name={`${product.id}.password`}
                                      type={showPassword ? 'text' : 'password'}
                                      onChange={formik.handleChange}
                                      value={formik.values[product.id]?.password}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              arial-label="Alternar visibilidad de contraseña"
                                              onClick={() =>
                                                handleTogglePassowrdVisibility('show-pass')
                                              }
                                              edge="end"
                                            >
                                              {showPassword ? (
                                                <VisibilityIcon />
                                              ) : (
                                                <VisibilityOffIcon />
                                              )}
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                          <Divider />
                          <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            sx={{ p: 2 }}
                          >
                            <Stack
                              alignItems="center"
                              direction="row"
                              spacing={2}
                            >
                              <Button
                                disabled={formik.isSubmitting}
                                type="submit"
                                variant="contained"
                              >
                                Modificar
                              </Button>
                              <Button
                                color="inherit"
                                onClick={handleProductClose}
                              >
                                Cancelar
                              </Button>
                            </Stack>
                            <div>
                              <Button
                                onClick={handleProductDelete}
                                color="error"
                              >
                                Eliminar Clave SOL
                              </Button>
                            </div>
                          </Stack>
                        </form>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
    </div>
  );
};

ProductListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
