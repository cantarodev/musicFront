import { useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { solKeyAccountsApi } from 'src/api/products/index';

const initialValues = {
  userId: '',
  ruc: '',
  username: '',
  password: '',
  passwordConfirm: '',
};

const validationSchema = Yup.object({
  userId: Yup.string().max(255),
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
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Se requiere confirmar contraseña'),
});

export const ProductCreateForm = (props) => {
  const [inputRucValue, setInputRucValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const user = useMockedUser();
  const router = useRouter();
  initialValues.userId = user.id;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const response = await solKeyAccountsApi.createSolKeyAccount(values);
        toast.success('Cuenta Clave SOL creada');
        router.push(paths.dashboard.products.index);
      } catch (err) {
        console.error(err);
        toast.error('Algo salió mal!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleTogglePassowrdVisibility = (opt) => {
    if (opt == 'show-pass') setShowPassword(!showPassword);
    if (opt == 'show-pass-confirm') setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleInputRucChange = (e) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value) && String(value).length <= 11) {
      setInputRucValue(value);
      formik.setFieldValue('ruc', value);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
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
                <Typography variant="h6">Detalles básicos</Typography>
              </Grid>
              <Grid
                xs={12}
                md={8}
              >
                <Stack spacing={3}>
                  <TextField
                    disabled
                    error={!!(formik.touched.userId && formik.errors.userId)}
                    fullWidth
                    helperText={formik.touched.userId && formik.errors.userId}
                    label="ID Usuario"
                    name="userId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.userId || user?.id}
                  />
                  <TextField
                    autoFocus
                    error={!!(formik.touched.ruc && formik.errors.ruc)}
                    fullWidth
                    helperText={formik.touched.ruc && formik.errors.ruc}
                    label="Ruc"
                    name="ruc"
                    onBlur={formik.handleBlur}
                    onChange={handleInputRucChange}
                    value={inputRucValue}
                  />
                  <TextField
                    error={!!(formik.touched.username && formik.errors.username)}
                    fullWidth
                    helperText={formik.touched.username && formik.errors.username}
                    label="Nombre de usuario"
                    name="username"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Contraseña"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            arial-label="Alternar visibilidad de contraseña"
                            onClick={() => handleTogglePassowrdVisibility('show-pass')}
                            edge="end"
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                    fullWidth
                    helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                    label="Contraseña (Confirmar)"
                    name="passwordConfirm"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={formik.values.passwordConfirm}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            arial-label="Alternar visibilidad de contraseña"
                            onClick={() => handleTogglePassowrdVisibility('show-pass-confirm')}
                            edge="end"
                          >
                            {showPasswordConfirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={1}
        >
          <Button color="inherit">Cancelar</Button>
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Crear
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
