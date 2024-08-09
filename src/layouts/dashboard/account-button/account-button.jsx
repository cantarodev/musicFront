import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import SvgIcon from '@mui/material/SvgIcon';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { usePopover } from 'src/hooks/use-popover';

import { AccountPopover } from './account-popover';
import { useEffect, useState } from 'react';

export const AccountButton = () => {
  const [photo, setPhoto] = useState('');
  const user = useMockedUser();
  const popover = usePopover();

  // useEffect(() => {
  //   if (user?.avatar) {
  //     // Aquí puedes configurar una URL fija o lógica para obtener la foto del usuario desde otra fuente.
  //     // Por ejemplo, si tienes un servidor backend que sirve las imágenes, puedes construir la URL aquí.
  //     const url = `/path/to/user/photos/${user.avatar}`;
  //     setPhoto(url);
  //   }
  // }, [user]);

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderStyle: 'solid',
          borderRadius: '50%',
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32,
            '&:hover': {
              height: 34,
              width: 34,
            },
          }}
          src={photo}
        >
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
