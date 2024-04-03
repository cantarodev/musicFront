import PropTypes from 'prop-types';
import { BotsCreateForm } from 'src/sections/dashboard/bots/bots-create-form';

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

export const BotsModal = (props) => {
  const { action, onClose, open = false, handleBotsGet, bot } = props;
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
          <BotsCreateForm
            onClose={onClose}
            handleBotsGet={handleBotsGet}
            bot={bot}
            action={action}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

BotsModal.propTypes = {
  action: PropTypes.oneOf(['create', 'edit']),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  handleBotsGet: PropTypes.func,
  bot: PropTypes.object,
};
