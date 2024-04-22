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
import { Box, Divider, IconButton, InputAdornment, TextareaAutosize } from '@mui/material';

import { botsApi } from 'src/api/bots/index';

export const BotsCreateForm = (props) => {
  const { action, onClose, handleBotsGet, bot } = props;
  const user = useMockedUser();

  const initialValues = {
    id: bot?.id || '',
    tag: bot?.tag || '',
    name: bot?.name || '',
    description: bot?.description || '',
  };

  const validationSchema = Yup.object({
    tag: Yup.string().max(50).required('Se requiere una etiqueta para el bot'),
    name: Yup.string().max(50).required('Se requiere un nombre para el bot'),
    description: Yup.string().max(255),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const response = await botsApi.createBot(values);
        handleBotsGet();
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ p: 3 }}>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {action === 'edit' ? 'Editar Bot' : 'Crear Bot'}
        </Typography>
      </Box>

      <Stack
        spacing={2}
        sx={{ p: 3 }}
      >
        <TextField
          disabled={action === 'edit' ? true : false}
          error={!!(formik.touched.tag && formik.errors.tag)}
          fullWidth
          helperText={formik.touched.tag && formik.errors.tag}
          label="Etiqueta"
          name="tag"
          onChange={formik.handleChange}
          value={formik.values.tag}
        />
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
          error={!!(formik.touched.description && formik.errors.description)}
          fullWidth
          multiline
          rows={3}
          helperText={formik.touched.description && formik.errors.description}
          label="Descripción"
          name="description"
          type="textarea"
          onChange={formik.handleChange}
          value={formik.values.description}
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
BotsCreateForm.propTypes = {
  action: PropTypes.string,
  onClose: PropTypes.func,
  handleBotsGet: PropTypes.func,
  bot: PropTypes.object,
};
