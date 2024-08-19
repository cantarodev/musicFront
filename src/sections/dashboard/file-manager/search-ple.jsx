import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { fileManagerApi } from 'src/api/file-manager';

export const PLESearchDialog = (props) => {
  const { onClose, open = false, onSearch, user_id, file_id } = props; 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = useCallback(async () => {
    if (query) {
      try {
        console.log("QUERY PLE SEARCH COMPROBANTES :::::::::: ", query);

        const response = await fileManagerApi.searchComprobante({
          user_id: user_id,  
          file_id: file_id,
          comprobante: query,
        });

        console.log("RESPONSE ::::::: ", response);

        if (response.status === 'SUCCESS') {
          const resultArray = Array.isArray(response.message) ? response.message : [response.message];
          setResults(resultArray);
        } else {
          setResults([]); // No se encontraron resultados
        }

        console.log("RESULT: ", response.message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults([]); // Manejo de error
      }
    }
  }, [query, user_id, file_id]);

  const handleQueryChange = useCallback((event) => {
    setQuery(event.target.value); 
  }, []);

  const handleDialogClose = useCallback(() => {
    // Limpia el estado de query y results al cerrar el diálogo
    setQuery('');
    setResults([]);
    onClose(); // Llama a la función onClose original pasada como prop
  }, [onClose]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleDialogClose} // Usa handleDialogClose aquí
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">BUSCAR</Typography>
        <IconButton
          color="inherit"
          onClick={handleDialogClose} // Usa handleDialogClose aquí
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            label="Buscar comprobantes"
            variant="outlined"
            fullWidth
            value={query}
            onChange={handleQueryChange}
          />
          <Button
            variant="contained"
            onClick={handleSearch} // Llama a la búsqueda solo cuando se hace clic en "Buscar"
          >
            Buscar
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RUC</TableCell>
                <TableCell>codTipoCDP</TableCell>
                <TableCell>numSerieCDP</TableCell>
                <TableCell>numCDP</TableCell>
                <TableCell>codMoneda</TableCell>
                <TableCell>Tipo de Cambio</TableCell>
                {/* Agrega más columnas según sea necesario */}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.numDocIdentidadProveedor}</TableCell>
                    <TableCell>{row.codTipoCDP}</TableCell>
                    <TableCell>{row.numSerieCDP}</TableCell>
                    <TableCell>{row.numCDP}</TableCell>
                    <TableCell>{row.codMoneda}</TableCell>
                    <TableCell>{row.tipoCambio}</TableCell>
                    {/* Agrega más celdas según sea necesario */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

PLESearchDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onSearch: PropTypes.func, 
  user_id: PropTypes.string, 
  file_id: PropTypes.string, 
};
