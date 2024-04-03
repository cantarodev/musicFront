import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { paths } from 'src/paths';
import { AuthIssuer } from 'src/sections/auth/auth-issuer';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const initialValues = {
  email: '',
  name: '',
  password: '',
  policy: false,
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Debe ser un correo electrónico válido')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Debe ser un correo electrónico válido')
    .max(255)
    .required('Correo electrónico es requerido'),
  name: Yup.string().max(255).required('Se requiere la razón social'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255)
    .required('Se requiere contraseña')
    .test('has-uppercase', 'La contraseña debe contener al menos una letra mayúscula', (value) =>
      /[A-Z]/.test(value)
    )
    .test('has-digit', 'La contraseña debe contener al menos un número', (value) =>
      /\d/.test(value)
    )
    .test(
      'has-special-char',
      'La contraseña debe contener al menos un carácter especial',
      (value) => /[!@#$%^&*()_+]/.test(value)
    ),
  policy: Yup.boolean().oneOf([true], 'Este campo debe ser marcado'),
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const isMounted = useMounted();
  const router = useRouter();
  const { issuer, signUp } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signUp(values.email, values.name, values.password);
        if (isMounted()) {
          router.push(paths.auth.emailSent + '/' + formik.values.email);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const handleTogglePassowrdVisibility = () => {
    setShowPassword(!showPassword);
  };

  usePageView();

  return (
    <>
      <Seo title="Registro" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography
                color="text.secondary"
                variant="body2"
              >
                ¿Ya tienes una cuenta? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.auth.login}
                  underline="hover"
                  variant="subtitle2"
                >
                  Iniciar sesión
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Registro"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Razón social"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
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
                          onClick={handleTogglePassowrdVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  ml: -1,
                  mt: 1,
                }}
              >
                <Checkbox
                  checked={formik.values.policy}
                  name="policy"
                  onChange={formik.handleChange}
                />
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  He leído los{' '}
                  <Link
                    component="a"
                    href="#"
                  >
                    Términos y Condiciones
                  </Link>
                </Typography>
              </Box>
              {!!(formik.touched.policy && formik.errors.policy) && (
                <FormHelperText error>{formik.errors.policy}</FormHelperText>
              )}
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mt: 3 }}
                >
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
        <Box sx={{ mt: 3 }}>
          <AuthIssuer issuer={issuer} />
        </Box>
      </div>
    </>
  );
};

export default Page;
