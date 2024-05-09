import { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

import { BotsMoreMenu } from 'src/components/bots-more-menu';
import { BotsModal } from './bots-modal';

export const BotsListTable = (props) => {
  const {
    action,
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    open,
    handleOpen,
    onClose,
    handleBotsGet,
  } = props;

  const [currentBot, setCurrentBot] = useState(null);

  const handleBotSelected = useCallback((bot) => {
    setCurrentBot((prevBot) => {
      return bot;
    });
  }, []);

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" />
              <TableCell width="30%">ID Bot</TableCell>
              <TableCell width="30%">Etiqueta</TableCell>
              <TableCell width="15%">Nombre</TableCell>
              <TableCell width="15%">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((bot, index) => {
              const isCurrent = bot.bot_id === currentBot;
              const statusColor = bot.status === 'active' ? 'success' : 'error';

              const status = bot.status === 'active' ? 'activo' : 'inactivo';

              return (
                <Fragment key={bot.bot_id}>
                  <TableRow
                    hover
                    key={bot.bot_id}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }),
                      }}
                      width="5%"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell width="30%">
                      <Box
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <Typography variant="subtitle2">{bot.bot_id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell width="15%">
                      <Typography variant="subtitle2">{bot.identifier_tag}</Typography>
                    </TableCell>
                    <TableCell width="15%">
                      <Typography variant="subtitle2">{bot.name}</Typography>
                    </TableCell>
                    <TableCell width="15%">
                      <SeverityPill color={statusColor}>{status}</SeverityPill>
                    </TableCell>
                    <TableCell align="right">
                      <BotsMoreMenu
                        handleBotSelected={handleBotSelected}
                        handleOpen={handleOpen}
                        bot={bot}
                        handleBotsGet={handleBotsGet}
                      />
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
      <BotsModal
        onClose={onClose}
        open={open}
        bot={currentBot}
        action={action}
        handleBotsGet={handleBotsGet}
      />
    </div>
  );
};

BotsListTable.propTypes = {
  action: PropTypes.string,
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  onClose: PropTypes.func,
  handleBotsGet: PropTypes.func,
};
