import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { FileDropzone } from 'src/components/file-dropzone';

export const FileUploader = (props) => {
  const { setLoading, onClose, open = false, handleItemsTotalsGet, handleItemsGet, opt } = props;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);
  }, [open]);

  const handleDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
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
        <Typography variant="h6">Subir archivos</Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <FileDropzone
          setLoading={setLoading}
          accept={opt === 'vouching' ? { 'application/pdf': ['.pdf'] } : { 'text/plain': ['.txt'] }}
          caption={
            opt === 'vouching'
              ? '(Sólo se permiten archivos .pdf)'
              : '(Sólo se permiten archivos .txt)'
          }
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onClose={onClose}
          handleItemsTotalsGet={handleItemsTotalsGet}
          handleItemsGet={handleItemsGet}
          opt={opt}
        />
      </DialogContent>
    </Dialog>
  );
};

FileUploader.propTypes = {
  setLoading: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  handleItemsTotalsGet: PropTypes.func,
  handleItemsGet: PropTypes.func,
  opt: PropTypes.string,
};
