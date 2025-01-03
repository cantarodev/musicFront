import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Box, CircularProgress, Divider, IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { claveSolAccountsApi } from 'src/api/sun-key-accounts/sunKeyService';

export const SunKeyCreateForm = (props) => {
  const { action, onClose, handleClaveSolAccountsGet, claveSol } = props;
  const [inputRucValue, setInputRucValue] = useState(claveSol?.ruc || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [accountValidated, setAccountValidated] = useState(claveSol?.verified || false);
  const [btnSelected, setBtnSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useMockedUser();

  const initialValues = {
    account_id: claveSol?.account_id || '',
    user_id: claveSol?.user_id || user.user_id,
    verified: claveSol?.verified || false,
    name: claveSol?.name || '',
    ruc: claveSol?.ruc || '',
    username: claveSol?.username || '',
    password: claveSol?.password || '',
    passwordConfirm: claveSol?.password || '',
  };

  const validationSchema = Yup.object({
    user_id: Yup.string().max(255),
    name: Yup.string().max(50).required('Se requiere un nombre'),
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
        if (btnSelected === 'test') {
          values = { ...values, mode: 'test' };
          const { message, validated } = await claveSolAccountsApi.validateClaveSolAccount(values);

          validated
            ? toast.success(message, { duration: 3000, position: 'top-center' })
            : toast.error(message, { duration: 3000, position: 'top-center' });

          setAccountValidated(validated);
        }
        if (btnSelected === 'editCreate') {
          values = { ...values, verified: accountValidated };
          const { message } = await claveSolAccountsApi.createClaveSolAccount(values);
          handleClaveSolAccountsGet();
          toast.success(message, { duration: 3000, position: 'top-center' });
          onClose();
        }
        setBtnSelected('');
      } catch (err) {
        console.error(err);
        toast.error(err.message, { duration: 3000, position: 'top-center' });
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        setBtnSelected('');
      } finally {
        setLoading(false);
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

  const handleBtnSelected = (e) => {
    const buttonName = e.target.name;
    Object.keys(formik.errors).length <= 0 && setLoading(true);
    setBtnSelected(buttonName);
  };

  return (
    <>
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
            error={!!(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Nombre"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
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
              disabled={formik.isSubmitting && btnSelected === 'test'}
              variant="outlined"
              color="primary"
              type="submit"
              name="test"
              onClick={handleBtnSelected}
            >
              Probar
            </Button>
            <Button
              disabled={formik.isSubmitting && btnSelected === 'editCreate'}
              type="submit"
              variant="contained"
              name="editCreate"
              onClick={handleBtnSelected}
            >
              {action === 'edit' ? 'Editar' : 'Crear'}
            </Button>
          </Stack>
        </Stack>
      </form>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
};
SunKeyCreateForm.propTypes = {
  action: PropTypes.string,
  onClose: PropTypes.func,
  handleClaveSolAccountsGet: PropTypes.func,
  claveSol: PropTypes.object,
};
