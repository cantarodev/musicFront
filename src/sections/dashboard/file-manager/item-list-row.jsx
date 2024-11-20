import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Globe01Icon from '@untitled-ui/icons-react/build/esm/Globe03';
import Star01Icon from '@untitled-ui/icons-react/build/esm/Star01';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';
import { bytesToSize } from 'src/utils/bytes-to-size';

import { ItemMenu } from './item-menu';
import { SeverityPill } from 'src/components/severity-pill';

const getMonthInSpanish = (period) => {
  const year = parseInt(period.substring(0, 4), 10);
  const month = parseInt(period.substring(4, 6), 10);

  const date = new Date(year, month - 1);

  let monthName = format(date, 'MMMM', { locale: es });

  monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return monthName;
};

const status = {
  pending: {
    label: 'Pendiente',
    color: 'warning',
  },
  error: {
    label: 'Error',
    color: 'error',
  },
  validating: {
    label: 'Validando',
    color: 'info',
  },
  processed: {
    label: 'Procesado',
    color: 'success',
  },
};

export const ItemListRow = (props) => {
  const { item, onDelete } = props;
  const popover = usePopover();

  const handleDelete = useCallback(() => {
    popover.handleClose();
    onDelete?.(item._id);
  }, [item, popover, onDelete]);

  let size = bytesToSize(item.size);

  const createDate = new Date(item.createdAt);
  const createdAtFormat = createDate && format(createDate, 'MMMM dd, yyyy HH:mm', { locale: es });
  const fieldYear = item.period && String(item.period).substring(0, 4);

  return (
    <>
      <TableRow key={item._id}>
        <TableCell>
          <Typography variant="subtitle2">
            <SeverityPill color={status[item.general_status].color}>
              {status[item.general_status].label}
            </SeverityPill>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{fieldYear}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{getMonthInSpanish(item.period)}</Typography>
        </TableCell>
        <TableCell>
          <Typography
            noWrap
            variant="subtitle2"
          >
            {item.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            noWrap
            variant="subtitle2"
          >
            {item.count > 1 ? item.count + ' documentos' : item.count + ' documento'}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            noWrap
            variant="subtitle2"
          >
            {createdAtFormat.charAt(0).toUpperCase() + createdAtFormat.slice(1)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            noWrap
            variant="subtitle2"
          >
            {size}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            noWrap
            variant="subtitle2"
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={popover.handleOpen}
            ref={popover.anchorRef}
          >
            <SvgIcon fontSize="small">
              <DotsVerticalIcon />
            </SvgIcon>
          </IconButton>
        </TableCell>
      </TableRow>
      <ItemMenu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        onDelete={handleDelete}
        item={item}
        open={popover.open}
      />
    </>
  );
};

ItemListRow.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  onOpen: PropTypes.func,
};
