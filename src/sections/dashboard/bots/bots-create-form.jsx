import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box, Checkbox, Divider } from '@mui/material';

import { botsApi } from 'src/api/bots/botService';

export const BotsCreateForm = (props) => {
  const { action, onClose, handleBotsGet, bot } = props;

  const initialValues = {
    bot_id: bot?._id || '',
    identifier_tag: bot?.identifier_tag || '',
    name: bot?.name || '',
    description: bot?.description || '',
    required_clave_sol: bot?.required_clave_sol || false,
  };

  const validationSchema = Yup.object({
    identifier_tag: Yup.string().max(50).required('Se requiere una etiqueta para el bot'),
    name: Yup.string().max(50).required('Se requiere un nombre para el bot'),
    description: Yup.string().max(255),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const { status, message } = await botsApi.createBot(values);
        if (status !== 'error') {
          handleBotsGet();
          toast.success(message, { duration: 3000, position: 'top-center' });
        } else {
          toast.error(message, {
            duration: 3000,
            position: 'top-center',
          });
        }
        onClose();
      } catch (err) {
        console.error(err);
        toast.error(err.message, {
          duration: 3000,
          position: 'top-center',
        });

        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'Hubo un problema al procesar la solicitud.' });
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
          error={!!(formik.touched.identifier_tag && formik.errors.identifier_tag)}
          fullWidth
          helperText={formik.touched.identifier_tag && formik.errors.identifier_tag}
          label="Etiqueta"
          name="identifier_tag"
          onChange={formik.handleChange}
          value={formik.values.identifier_tag}
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            ml: -1,
            mt: 1,
          }}
        >
          <Checkbox
            checked={formik.values.required_clave_sol}
            name="required_clave_sol"
            onChange={formik.handleChange}
          />
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {formik.values.required_clave_sol
              ? 'Requiere Cuenta Clave Sol'
              : 'No requiere Cuenta Clave Sol'}
          </Typography>
        </Box>
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
