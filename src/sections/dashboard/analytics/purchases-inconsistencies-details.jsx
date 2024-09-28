import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@untitled-ui/icons-react/build/esm/Download01';

import {
  TableContainer,
  CardHeader,
  Box,
  LinearProgress,
  IconButton,
  SvgIcon,
  TableFooter,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TableSortLabel,
} from '@mui/material';

import { ModalDetail } from './modal-detail';
import { useState } from 'react';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';

const columnLabels = {
  periodo: 'Período',
  ruc: 'RUC',
  razonSocial: 'Razón Social',
  fechaEmision: 'Fecha Emisión',
  tipoComprobante: 'Tipo Comprobante',
  numeroComprobante: 'Número Comprobante',
  moneda: 'Moneda',
  mtoBIGravadaDG: 'Base Imponible',
  mtoBIGravadaDGNG: 'B.I / Gravada - No Grav.',
  mtoIgvIpmDGNG: 'IGV / Gravada - No Grav.',
  mtoBIGravadaDNG: 'B.I / No Gravada',
  mtoIgvIpmDNG: 'IGV / No Gravada',
  mtoValorAdqNG: 'Adq. No Gravadas',
  mtoISC: 'Imp. Selectivo al Consumo',
  mtoIcbp: 'Imp. a Bolsas Plásticas',
  mtoOtrosTrib: 'Otros Tributos',
  igv: 'IGV',
  igvSunat: 'IGV Sunat',
  importe: 'Importe',
  importeSunat: 'Importe Sunat',
  tipoCambio: 'Tipo de Cambio',
  observacion: 'Observación General',
  observacionTC: 'Observación Tipo de Cambio',
  observacionFactoring: 'Observación Factoring',
  observacionIncons: 'Observación Incons.',
};

function descendingComparator(a, b, orderBy) {
  if (parseFloat(b[orderBy]) < parseFloat(a[orderBy])) return -1;
  if (parseFloat(b[orderBy]) > parseFloat(a[orderBy])) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function sortRows(array, comparator) {
  const stabilizedRows = array.map((el, index) => [el, index]);
  stabilizedRows.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRows.map((el) => el[0]);
}

export const PurchasesInconsistenciesDetails = (props) => {
  const { loading, details, totalSums, downloadPath, onDownload } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const [columnVisibility, setColumnVisibility] = useState({
    periodo: true,
    ruc: true,
    razonSocial: true,
    fechaEmision: true,
    tipoComprobante: true,
    numeroComprobante: true,
    moneda: true,
    mtoBIGravadaDG: true,
    mtoBIGravadaDGNG: false,
    mtoIgvIpmDGNG: false,
    mtoBIGravadaDNG: false,
    mtoIgvIpmDNG: false,
    mtoValorAdqNG: false,
    mtoISC: false,
    mtoIcbp: false,
    mtoOtrosTrib: false,
    igv: true,
    igvSunat: false,
    importe: true,
    importeSunat: false,
    tipoCambio: true,
    observacion: true,
    observacionTC: true,
    observacionFactoring: true,
    observacionIncons: true,
  });
  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('mtoImporteTotal');

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleColumnVisibilityChange = (column) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = sortRows(details, getComparator(order, orderBy));

  const isEmpty = sortedRows.length === 0;

  const handleOpen = (detail, option = '') => {
    setModalOpen(true);
    setSelectedDetail(detail);
    setSelectedOption(option);
  };

  const handleClose = () => setModalOpen(false);

  const formatNumber = (number) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(number));

    return formattedNumber;
  };

  return (
    <Card>
      <CardHeader
        title="Inconsistencias"
        sx={{ p: 2, pb: 0 }}
        action={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            {downloadPath && (
              <IconButton
                color="inherit"
                onClick={onDownload}
              >
                <SvgIcon fontSize="small">
                  <DownloadIcon />
                </SvgIcon>
              </IconButton>
            )}
            <IconButton onClick={handleDialogOpen}>
              <ViewColumnIcon />
            </IconButton>
            <Dialog
              open={open}
              onClose={handleDialogClose}
              fullScreen
              PaperProps={{
                sx: {
                  height: '100%',
                  width: '300px',
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  overflowY: 'auto',
                },
              }}
            >
              <DialogTitle>Columnas</DialogTitle>
              <DialogContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(100% - 64px)',
                  overflowY: 'auto',
                }}
              >
                {Object.keys(columnVisibility).map((column) => (
                  <FormControlLabel
                    key={column}
                    control={
                      <Checkbox
                        checked={columnVisibility[column]}
                        onChange={() => handleColumnVisibilityChange(column)}
                      />
                    }
                    label={columnLabels[column]}
                  />
                ))}
              </DialogContent>
            </Dialog>
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
                {columnVisibility.periodo && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Período</Typography>
                  </TableCell>
                )}
                {columnVisibility.ruc && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>RUC</Typography>
                  </TableCell>
                )}
                {columnVisibility.razonSocial && (
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
                )}
                {columnVisibility.fechaEmision && (
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
                )}
                {columnVisibility.tipoComprobante && (
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
                )}
                {columnVisibility.numeroComprobante && (
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
                )}
                {columnVisibility.moneda && (
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
                )}
                {columnVisibility.mtoBIGravadaDGNG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="B.I / Gravada - No Grav."
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
                        B.I / Gravada - No Grav.
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoIgvIpmDGNG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="IGV / Gravada - No Grav."
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
                        IGV / Gravada - No Grav.
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoBIGravadaDNG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="B.I / No Gravada"
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
                        B.I / No Gravada
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoIgvIpmDNG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="IGV / No Gravada"
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
                        IGV / No Gravada
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoValorAdqNG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="Adq. No Gravadas"
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
                        Adq. No Gravadas
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoISC && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="Imp. Selectivo al Consumo"
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
                        Imp. Selectivo al Consumo
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoIcbp && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="Imp. a Bolsas Plásticas"
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
                        Imp. a Bolsas Plásticas
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoOtrosTrib && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="Otros Tributos"
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
                        Otros Tributos
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.mtoBIGravadaDG && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <TableSortLabel
                      active={orderBy === 'mtoBIGravadaDG'}
                      direction={orderBy === 'mtoBIGravadaDG' ? order : 'asc'}
                      onClick={() => handleRequestSort('mtoBIGravadaDG')}
                    >
                      <Tooltip
                        title="Base Imponible"
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
                          B. Imponible
                        </Typography>
                      </Tooltip>
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.igv && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <TableSortLabel
                      active={orderBy === 'mtoIGV'}
                      direction={orderBy === 'mtoIGV' ? order : 'asc'}
                      onClick={() => handleRequestSort('mtoIGV')}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>IGV</Typography>
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.igvSunat && (
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
                )}
                {columnVisibility.importe && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <TableSortLabel
                      active={orderBy === 'mtoImporteTotal'}
                      direction={orderBy === 'mtoImporteTotal' ? order : 'asc'}
                      onClick={() => handleRequestSort('mtoImporteTotal')}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Importe</Typography>
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.importeSunat && (
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
                )}
                {columnVisibility.tipoCambio && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip
                      title="Tipo de Cambio"
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
                        Tipo de cambio
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.observacion && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.observacionTC && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación Tipo de Cambio
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.observacionFactoring && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación Factoring
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.observacionIncons && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación Incons.
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={25}
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
                    colSpan={25}
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
                sortedRows?.map((detail, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {columnVisibility.periodo && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>{detail.periodo}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.ruc && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>{detail.ruc}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.razonSocial && (
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
                      )}
                      {columnVisibility.fechaEmision && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>{detail.fechaEmision}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.tipoComprobante && (
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
                      )}
                      {columnVisibility.numeroComprobante && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>
                            {detail.numSerie}-{detail.numCpe}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.moneda && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>{detail.codMoneda}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoBIGravadaDGNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoBIGravadaDGNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIgvIpmDGNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoIgvIpmDGNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoBIGravadaDNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoBIGravadaDNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIgvIpmDNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoIgvIpmDNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoValorAdqNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoValorAdqNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoISC && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoISC)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIcbp && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoIcbp)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoOtrosTrib && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoOtrosTrib)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoBIGravadaDG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoBIGravadaDG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.igv && (
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
                            {formatNumber(detail.mtoIGV)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.igvSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoIGVSunat)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.importe && (
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
                            {formatNumber(detail.mtoImporteTotal)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.importeSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoImporteTotalSunat)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.tipoCambio && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography
                            style={{ fontSize: 14 }}
                            sx={
                              String(detail.observacion).includes('TC')
                                ? { color: 'red' }
                                : { color: 'inherit' }
                            }
                          >
                            {detail.mtoTipoCambio}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacion && (
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
                            {String(detail.observacion)
                              .replace(/Valor TC: [\d.]+ \(debería ser [\d.]+\)\.?/, '')
                              .trim()
                              .replace(/\.$/, '')}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacionTC && (
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
                            onClick={() => handleOpen(detail, 'TC')}
                          >
                            {String(detail.observacion).includes('TC') &&
                              String(detail.observacion).match(
                                /Valor TC: [\d.]+ \(debería ser [\d.]+\)/
                              )[0]}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacionFactoring && (
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
                          >
                            {detail.observacion_factoring
                              ? detail.observacion_factoring
                              : 'Sin observaciones'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacionIncons && (
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
                          >
                            {detail.observacion}
                          </Typography>
                        </TableCell>
                      )}
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
                  {columnVisibility.periodo && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {details.length}
                    </TableCell>
                  )}

                  {columnVisibility.ruc && <TableCell></TableCell>}
                  {columnVisibility.razonSocial && <TableCell></TableCell>}
                  {columnVisibility.fechaEmision && <TableCell></TableCell>}
                  {columnVisibility.tipoComprobante && <TableCell></TableCell>}
                  {columnVisibility.numeroComprobante && <TableCell></TableCell>}
                  {columnVisibility.moneda && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravadaDGNG && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.baseIGravadaDGNG.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.mtoIgvIpmDGNG && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravadaDNG && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.baseIGravadaDNG.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.mtoIgvIpmDNG && <TableCell></TableCell>}
                  {columnVisibility.mtoValorAdqNG && <TableCell></TableCell>}
                  {columnVisibility.mtoISC && <TableCell></TableCell>}
                  {columnVisibility.mtoIcbp && <TableCell></TableCell>}
                  {columnVisibility.mtoOtrosTrib && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravadaDG && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.baseIGravadaDG.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.igv && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.igv.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.igvSunat && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.igvSunat.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.importe && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.importe.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.importeSunat && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.importeSunat.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.tipoCambio && <TableCell></TableCell>}
                  {columnVisibility.observacion && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.observacionGeneral}
                    </TableCell>
                  )}
                  {columnVisibility.observacionTC && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.observacionTC}
                    </TableCell>
                  )}
                  {columnVisibility.observacionFactoring && <TableCell></TableCell>}
                  {columnVisibility.observacionIncons && <TableCell></TableCell>}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Box>

      <ModalDetail
        open={modalOpen}
        handleClose={handleClose}
        data={selectedDetail}
        option={selectedOption}
      />
    </Card>
  );
};

PurchasesInconsistenciesDetails.propTypes = {
  loading: PropTypes.bool,
  details: PropTypes.array.isRequired,
  totalSums: PropTypes.object,
  downloadPath: PropTypes.string,
  onDownload: PropTypes.func,
};