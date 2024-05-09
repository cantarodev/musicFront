import PropTypes from 'prop-types';
import { SunKeyCreateForm } from 'src/sections/dashboard/sun-key/sun-key-create-form';

import { Backdrop, Box, Fade, Modal } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const SunKeyModal = (props) => {
  const { action, onClose, open = false, handleClaveSolAccountsGet, claveSol } = props;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={style}
          maxWidth="sm"
        >
          <SunKeyCreateForm
            onClose={onClose}
            handleClaveSolAccountsGet={handleClaveSolAccountsGet}
            claveSol={claveSol}
            action={action}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

SunKeyModal.propTypes = {
  action: PropTypes.oneOf(['create', 'edit']),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  handleClaveSolAccountsGet: PropTypes.func,
  claveSol: PropTypes.object,
};
