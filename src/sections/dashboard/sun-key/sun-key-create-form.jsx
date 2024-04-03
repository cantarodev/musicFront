import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/hooks/use-router';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Box, Divider, IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { sunKeyAccountsApi } from 'src/api/sun-key-accounts/index';

export const SunKeyCreateForm = (props) => {
  const { action, onClose, handleSunKeyAccountsGet, sunKey } = props;
  const [inputRucValue, setInputRucValue] = useState(sunKey?.ruc || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const user = useMockedUser();

  const initialValues = {
    id: sunKey?.id || '',
    userId: sunKey?.userId || user.id,
    ruc: sunKey?.ruc || '',
    username: sunKey?.username || '',
    password: sunKey?.password || '',
    passwordConfirm: sunKey?.password || '',
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await sunKeyAccountsApi.createSunKeyAccount(values);
        handleSunKeyAccountsGet();
        toast.success(response.message, { duration: 3000, position: 'top-center' });
        onClose();
      } catch (err) {
        console.error(err);
        toast.error('Algo salió mal!', { duration: 3000, position: 'top-center' });
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
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {action === 'edit' ? 'Editar Clave SOL' : 'Crear Clave SOL'}
        </Typography>
      </Box>

      <Stack
        spacing={2}
        sx={{ p: 3 }}
      >
        <TextField
          disabled
          error={!!(formik.touched.userId && formik.errors.userId)}
          fullWidth
          helperText={formik.touched.userId && formik.errors.userId}
          label="ID Usuario"
          name="userId"
          onChange={formik.handleChange}
          value={formik.values.userId}
        />
        <TextField
          error={!!(formik.touched.ruc && formik.errors.ruc)}
          fullWidth
          helperText={formik.touched.ruc && formik.errors.ruc}
          label="Ruc"
          name="ruc"
          onChange={handleInputRucChange}
          value={inputRucValue}
        />
        <TextField
          error={!!(formik.touched.username && formik.errors.username)}
          fullWidth
          helperText={formik.touched.username && formik.errors.username}
          label="Nombre de usuario"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <TextField
          error={!!(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Contraseña"
          name="password"
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
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={1}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Button
            color="inherit"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            {action === 'edit' ? 'Editar' : 'Crear'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
SunKeyCreateForm.propTypes = {
  action: PropTypes.string,
  onClose: PropTypes.func,
  handleSunKeyAccountsGet: PropTypes.func,
  sunKey: PropTypes.object,
};
