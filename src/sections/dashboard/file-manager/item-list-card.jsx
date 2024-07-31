import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { subDays, subHours, subMinutes, format } from 'date-fns';
import { es } from 'date-fns/locale';
import Star01Icon from '@untitled-ui/icons-react/build/esm/Star01';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';
import { bytesToSize } from 'src/utils/bytes-to-size';

import { ItemIcon } from './item-icon';
import { ItemMenu } from './item-menu';

import { convertToPeriodDate } from '../../../utils/date';
import { Button } from '@mui/material';
import toast from 'react-hot-toast';
import { CostExplorer } from 'aws-sdk';

export const ItemListCard = (props) => {
  const { item, onDelete, onOpen } = props;
  const popover = usePopover();

  const confirmDeleteFile = () => {
    toast(
      (t) => (
        <span>
          <p style={{ fontSize: '13px' }}>
            ¿Estás seguro de que deseas eliminar el PLE seleccionado? Esta acción no se puede
            deshacer.
          </p>
          <Button
            sx={{ mr: 1, fontSize: '13px' }}
            onClick={() => toast.dismiss(t.id)}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            sx={{ fontSize: '13px' }}
            onClick={() => handleDelete(t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      { duration: 50000 }
    );
  };

  const handleDelete = useCallback(
    (toast_id) => {
      popover.handleClose();
      onDelete?.(item._id);
      toast.dismiss(toast_id);
    },
    [item, popover, onDelete]
  );

  let size = bytesToSize(item.size);

  size += ` • ${item.count} documentos`;
  const name = item.type == '08' ? 'Compras' : 'Ventas';
  console.log("###########################item", item);
  console.log("###########################name", name);
  const createDate = new Date(item.createdAt);
  const createdAtFormat = createDate && format(createDate, 'MMMM dd, yyyy', { locale: es });

  const convertedPeriod = convertToPeriodDate(item.period);
  console.log("###########################convertperiod", convertedPeriod);
  const periodFormat = convertedPeriod && format(convertedPeriod, 'MMMM, yyyy', { locale: es });
  console.log("###########################periodFormat", periodFormat);

  return (
    <>
      <Card
        key={item._id}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 0,
          transition: (theme) =>
            theme.transitions.create(['background-color, box-shadow'], {
              easing: theme.transitions.easing.easeInOut,
              duration: 200,
            }),
          '&:hover': {
            backgroundColor: 'background.paper',
            boxShadow: 16,
          },
        }}
        variant="outlined"
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={3}
          sx={{
            pt: 2,
            px: 2,
          }}
        >
          <IconButton
            onClick={popover.handleOpen}
            ref={popover.anchorRef}
          >
            <SvgIcon fontSize="small">
              <DotsVerticalIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 1,
            }}
          >
            <Box
              onClick={() => onOpen?.(item._id)}
              sx={{
                display: 'inline-flex',
                cursor: 'pointer',
              }}
            >
              <ItemIcon
                type="file"
                extension="txt"
              />
              <Stack>
                <Typography
                  color="text.secondary"
                  variant="h6"
                >
                  {periodFormat.charAt(0).toUpperCase() + periodFormat.slice(1)}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {name}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Tooltip title={item.name}>
            <Typography
              onClick={() => onOpen?.(item._id)}
              sx={{ cursor: 'pointer' }}
              variant="subtitle2"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.name}
            </Typography>
          </Tooltip>
          <Divider sx={{ my: 1 }} />
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={1}
          >
            <div>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {size}
              </Typography>
            </div>
          </Stack>
          <Typography
            color="text.secondary"
            variant="caption"
          >
            Creado en {createdAtFormat.charAt(0).toUpperCase() + createdAtFormat.slice(1)}
          </Typography>
        </Box>
      </Card>
      <ItemMenu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        onDelete={confirmDeleteFile}
        open={popover.open}
        item={item}
      />
    </>
  );
};

ItemListCard.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  onOpen: PropTypes.func,
};
