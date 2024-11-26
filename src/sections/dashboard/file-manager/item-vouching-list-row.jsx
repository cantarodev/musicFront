import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DotsVerticalIcon from '@untitled-ui/icons-react/build/esm/DotsVertical';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';
import { bytesToSize } from 'src/utils/bytes-to-size';

import { ItemVouchingMenu } from './item-vouching-menu';

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

export const ItemVouchingListRow = (props) => {
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
      <ItemVouchingMenu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        onDelete={handleDelete}
        item={item}
        open={popover.open}
      />
    </>
  );
};

ItemVouchingListRow.propTypes = {
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onFavorite: PropTypes.func,
  onOpen: PropTypes.func,
};
