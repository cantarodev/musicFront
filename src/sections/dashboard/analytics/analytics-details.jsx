import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import DownloadIcon from '@untitled-ui/icons-react/build/esm/Download01';

import {
  TableContainer,
  CardHeader,
  Box,
  LinearProgress,
  IconButton,
  SvgIcon,
  Paper,
} from '@mui/material';

import { ModalDetail } from './modal-detail';
import { useState } from 'react';

export const AnalyticsDetails = (props) => {
  const { loading, details, onLoadData } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const isEmpty = details.length === 0;

  const handleOpen = (detail) => {
    setModalOpen(true);
    setSelectedDetail(detail);
  };

  const handleClose = () => setModalOpen(false);

  return (
    <Card>
      <CardHeader
        title="Inconsistencias"
        sx={{ p: 2, pb: 0 }}
        action={
          <>
            <IconButton color="inherit">
              <SvgIcon fontSize="small">
                <DownloadIcon />
              </SvgIcon>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={onLoadData}
            >
              <SvgIcon fontSize="small">
                <RefreshCcw01Icon />
              </SvgIcon>
            </IconButton>
          </>
        }
      />
      <Box
        display="flex"
        flexDirection="column"
        maxHeight="500px"
        p={2}
      >
        <TableContainer
          sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}
          component={Paper}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Período</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>RUC</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    Razón Social
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title="Fecha Emisión"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '80px',
                      }}
                    >
                      Fecha Emisión
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title="Tipo Comprobante"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100px',
                      }}
                    >
                      Tipo Comprobante
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title="Número Comprobante"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100px',
                      }}
                    >
                      Número Comprobante
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title="Moneda"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '40px',
                      }}
                    >
                      Moneda
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>IGV</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Tooltip
                    title="IGV Sunat"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '70px',
                        textAlign: 'right',
                      }}
                    >
                      IGV Sunat
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Importe</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Tooltip
                    title="Importe Sunat"
                    arrow
                  >
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '80px',
                      }}
                    >
                      Importe Sunat
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  >
                    Resumen
                  </Typography>
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
                      <TableCell className="customTableCell">
                        <Typography sx={{ fontSize: 14 }}>{detail.periodo}</Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography sx={{ fontSize: 14 }}>{detail.ruc}</Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Tooltip
                          title={detail.razonSocial}
                          arrow
                        >
                          <Typography
                            sx={{
                              cursor: 'pointer',
                              fontSize: 14,
                              fontWeight: 'normal',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '150px',
                            }}
                          >
                            {detail.razonSocial}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography sx={{ fontSize: 14 }}>{detail.fechaEmision}</Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Tooltip title={detail.tipoComprobante}>
                          <Typography
                            sx={{
                              cursor: 'pointer',
                              fontSize: 14,
                              fontWeight: 'normal',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100px',
                            }}
                          >
                            {detail.tipoComprobante}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography sx={{ fontSize: 14 }}>
                          {detail.numSerie}-{detail.numCpe}
                        </Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography sx={{ fontSize: 14 }}>{detail.codMoneda}</Typography>
                      </TableCell>
                      <TableCell
                        className="customTableCell"
                        sx={{ textAlign: 'right' }}
                      >
                        <Typography
                          sx={
                            String(detail.observacion).includes('IGV', 'igv')
                              ? { color: 'red' }
                              : { color: 'inherit' }
                          }
                          style={{ fontSize: 14 }}
                        >
                          {detail.mtoIGV}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="customTableCell"
                        sx={{ textAlign: 'right' }}
                      >
                        <Typography sx={{ fontSize: 14 }}>{detail.mtoIGVSunat}</Typography>
                      </TableCell>
                      <TableCell
                        className="customTableCell"
                        sx={{ textAlign: 'right' }}
                      >
                        <Typography
                          sx={
                            String(detail.observacion).includes('Importe')
                              ? { color: 'red' }
                              : { color: 'inherit' }
                          }
                          style={{ fontSize: 14 }}
                        >
                          {detail.mtoImporteTotal}
                        </Typography>
                      </TableCell>
                      <TableCell
                        className="customTableCell"
                        sx={{ textAlign: 'right' }}
                      >
                        <Typography sx={{ fontSize: 14 }}>{detail.mtoImporteTotalSunat}</Typography>
                      </TableCell>
                      <TableCell className="customTableCell">
                        <Typography
                          sx={{
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 'normal',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '&:hover': {
                              color: 'primary.main',
                              cursor: 'pointer',
                            },
                          }}
                          onClick={() => handleOpen(detail)}
                        >
                          {detail.observacion}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ModalDetail
        open={modalOpen}
        handleClose={handleClose}
        data={selectedDetail}
      />
    </Card>
  );
};

AnalyticsDetails.propTypes = {
  loading: PropTypes.bool,
  details: PropTypes.array.isRequired,
  onLoadData: PropTypes.func,
};
