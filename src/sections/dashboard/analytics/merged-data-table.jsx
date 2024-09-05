import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import DownloadIcon from '@untitled-ui/icons-react/build/esm/Download01';

import {
  TableContainer,
  TablePagination,
  TableFooter,
  CardHeader,
  Box,
  LinearProgress,
  IconButton,
  SvgIcon,
  Stack,
} from '@mui/material';

export const MergeDataTable = (props) => {
  const { loading, details, sourceCounts, onLoadData } = props;

  const isEmpty = details.length === 0;

  return (
    <Card>
      <CardHeader
        title="Comprobantes faltantes"
        sx={{ p: 2, pb: 0 }}
        action={
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ color: 'green', fontSize: 24, marginRight: 4 }}>•</span> Existe
            </Typography>{' '}
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ color: 'red', fontSize: 24, marginRight: 4 }}>•</span> No existe
            </Typography>{' '}
            <IconButton
              color="inherit"
              onClick={onLoadData}
            >
              <SvgIcon fontSize="small">
                <RefreshCcw01Icon />
              </SvgIcon>
            </IconButton>
          </Stack>
        }
      />
      <Box
        display="flex"
        flexDirection="column"
        maxHeight="500px"
        p={2}
      >
        <TableContainer sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Período</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Serie</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Número</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>SUNAT</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>PLE</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    style={{ height: 200 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      <LinearProgress />
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : isEmpty ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    style={{ height: 200 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      No hay datos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                details?.map((detail, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        sx={{ textAlign: 'center' }}
                        className="customTableCell"
                      >
                        {detail.periodo}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: 'center' }}
                        className="customTableCell"
                      >
                        {detail.numSerie}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: 'center' }}
                        className="customTableCell"
                      >
                        {detail.numCpe}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: 'center' }}
                        className="customTableCell"
                      >
                        <Typography
                          sx={detail?.source === 'sunat' ? { color: 'green' } : { color: 'red' }}
                          variant="h5"
                          padding={1}
                        >
                          •
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: 'center' }}
                        className="customTableCell"
                      >
                        <Typography
                          sx={detail?.source === 'ple' ? { color: 'green' } : { color: 'red' }}
                          variant="h5"
                          padding={1}
                        >
                          •
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            {details.length > 0 && (
              <TableFooter
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'background.paper',
                }}
              >
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: 16, fontWeight: 600 }}>
                    {sourceCounts?.ple}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontSize: 16, fontWeight: 600 }}>
                    {sourceCounts?.sunat}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

MergeDataTable.propTypes = {
  loading: PropTypes.bool,
  details: PropTypes.array.isRequired,
  sourceCounts: PropTypes.object,
  onLoadData: PropTypes.func,
};
