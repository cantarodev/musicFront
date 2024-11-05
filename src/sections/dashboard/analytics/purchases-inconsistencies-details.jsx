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
  Paper,
} from '@mui/material';

import { ModalDetail } from './modal-detail';
import { useEffect, useMemo, useRef, useState } from 'react';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useSelector } from 'react-redux';

import { setFilteredResultsAndTotals } from 'src/slices/filtered-results';
import { useDispatch } from 'react-redux';

const columnLabels = {
  periodo: 'Período',
  ruc: 'RUC',
  razonSocial: 'Razón Social',
  fechaEmision: 'Fecha Emisión',
  tipoComprobante: 'Tipo Comprobante',
  numeroComprobante: 'Número Comprobante',
  moneda: 'Moneda',
  mtoBIGravada: 'Base Imponible',
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
  observacionTC: 'Observación Tipo de Cambio',
  observacionCpe: 'Observación CPE',
  observacionIncons: 'Observación Incons.',
  observacionCond: 'Observación Cond.',
  observacionObligado: 'Observación Obligados CPE.',
};

function descendingComparator(a, b, orderBy) {
  const aValue = orderBy.split('.').reduce((obj, key) => obj[key], a);
  const bValue = orderBy.split('.').reduce((obj, key) => obj[key], b);

  if (parseFloat(bValue) < parseFloat(aValue)) return -1;
  if (parseFloat(bValue) > parseFloat(aValue)) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  console.log(order, orderBy);

  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function sortRows(array, comparator) {
  const stabilizedRows = array.map((el, index) => [el, index]);
  console.log(stabilizedRows);
  stabilizedRows.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRows.map((el) => el[0]);
}

export const PurchasesInconsistenciesDetails = (props) => {
  const { loading, downloadPath, onDownload, params } = props;

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState('');

  const results = useSelector((state) => state.report);

  const [displayedRows, setDisplayedRows] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const containerRef = useRef();

  const [columnVisibility, setColumnVisibility] = useState({
    periodo: true,
    ruc: true,
    razonSocial: true,
    fechaEmision: true,
    tipoComprobante: true,
    numeroComprobante: true,
    moneda: true,
    mtoBIGravada: true,
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
    observacionTC: true,
    observacionCpe: true,
    observacionIncons: true,
    observacionCond: true,
    observacionObligado: true,
  });
  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('monto');

  const { filteredResults, totals } = useMemo(() => {
    let filteredResults =
      results?.filter((item) => {
        const matchesDocType = params.docType === 'all' || item.codComp === params.docType;

        const matchesCurrency = params.currency === 'all' || item.codMoneda === params.currency;

        const matchesFilters = Object.keys(params.filters).some((key) => {
          if (key === 'all') {
            return true;
          }

          if (params.filters[key].length) {
            return params.filters[key]?.some((filter) =>
              item.observaciones[key]?.some((str) =>
                String(str).toLowerCase().includes(String(filter).toLowerCase())
              )
            );
          } else {
            return item.observaciones && item.observaciones.hasOwnProperty(key);
          }
        });

        return matchesDocType && matchesCurrency && matchesFilters;
      }) || [];

    const totals = filteredResults.reduce(
      (totals, detail) => {
        totals.baseIGravada += parseFloat(detail.mtos.mtoBIGravada) || 0;
        totals.baseIGravadaDGNG += parseFloat(detail.mtos.mtoBIGravadaDGNG) || 0;
        totals.baseIGravadaDNG += parseFloat(detail.mtos.mtoBIGravadaDNG) || 0;
        totals.igv += parseFloat(detail.mtos.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.mtoIGV) || 0;
        totals.importe += parseFloat(detail.monto) || 0;
        totals.importeSunat += parseFloat(detail.mtoImporteTotal) || 0;

        if (detail.observaciones) {
          if (
            detail.observaciones['tipoCambio']?.length > 0 &&
            params?.filters?.hasOwnProperty('tipoCambio')
          ) {
            totals.observacionTC += 1;
            totals.observaciones += 1;
          }

          if (detail.observaciones['cpe']?.length > 0 && params?.filters?.hasOwnProperty('cpe')) {
            totals.observacionCpe += 1;
            totals.observaciones += 1;
          }

          if (
            detail.observaciones['inconsistencias']?.length > 0 &&
            params?.filters?.hasOwnProperty('inconsistencias')
          ) {
            totals.observacionIncons += 1;
            totals.observaciones += 1;
          }

          if (
            detail.observaciones['condicion']?.length > 0 &&
            params?.filters?.hasOwnProperty('condicion')
          ) {
            totals.observacionCond += 1;
            totals.observaciones += 1;
          }

          if (
            detail.observaciones['obligado']?.length > 0 &&
            params?.filters?.hasOwnProperty('obligado')
          ) {
            totals.observacionObligado += 1;
            totals.observaciones += 1;
          }
        }

        return totals;
      },
      {
        baseIGravada: 0.0,
        baseIGravadaDGNG: 0.0,
        baseIGravadaDNG: 0.0,
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        observacionTC: 0,
        observacionCpe: 0,
        observacionIncons: 0,
        observacionCond: 0,
        observacionObligado: 0,
        observaciones: 0,
      }
    );

    return { filteredResults, totals };
  }, [results, params.docType, params.currency, params.filters]);

  const sortedResults = useMemo(() => {
    return sortRows(filteredResults, getComparator(order, orderBy));
  }, [filteredResults, order, orderBy]);

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

  const handleOpen = (texto) => {
    setModalOpen(true);
    setSelectedDetail(texto);
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

  useEffect(() => {
    const newRows = sortedResults.slice(0, (page + 1) * rowsPerPage);
    setDisplayedRows(newRows);
  }, [page, filteredResults, order, orderBy]);

  const isEmpty = filteredResults.length === 0;

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    dispatch(setFilteredResultsAndTotals({ results: filteredResults, totals }));
  }, [filteredResults, totals, dispatch]);

  return (
    <Card>
      <CardHeader
        title="Observaciones"
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
        <TableContainer
          component={Paper}
          ref={containerRef}
          onScroll={handleScroll}
          sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        >
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
                          maxWidth: '120px',
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
                          maxWidth: '120px',
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
                {columnVisibility.mtoBIGravada && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <TableSortLabel
                      active={orderBy === 'mtos.mtoBIGravada'}
                      direction={orderBy === 'mtos.mtoBIGravada' ? order : 'asc'}
                      onClick={() => handleRequestSort('mtos.mtoBIGravada')}
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
                      active={orderBy === 'mtos.mtoIGV'}
                      direction={orderBy === 'mtos.mtoIGV' ? order : 'asc'}
                      onClick={() => handleRequestSort('mtos.mtoIGV')}
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
                      active={orderBy === 'monto'}
                      direction={orderBy === 'monto' ? order : 'asc'}
                      onClick={() => handleRequestSort('monto')}
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

                {columnVisibility.observacionTC && params.filters.hasOwnProperty('tipoCambio') && (
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
                {columnVisibility.observacionCpe && params.filters.hasOwnProperty('cpe') && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación CPE
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.observacionIncons &&
                  params.filters.hasOwnProperty('inconsistencias') && (
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
                {columnVisibility.observacionCond && params.filters.hasOwnProperty('condicion') && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Observación Cond.
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.observacionObligado &&
                  params.filters.hasOwnProperty('obligado') && (
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        Observación Obligados.
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
                displayedRows?.map((detail, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {columnVisibility.periodo && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>
                            {String(detail.periodoPle).substring(0, 6)}
                          </Typography>
                        </TableCell>
                      )}

                      {columnVisibility.ruc && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 14 }}>{detail.numDocRecep}</Typography>
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
                          <Tooltip
                            title={detail.tipoComprobante}
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
                                maxWidth: '120px',
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
                            {String(detail.numeroSerie).trim() !== '-'
                              ? detail.numeroSerie + ' - ' + Number(detail.numero)
                              : Number(detail.numero)}
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
                            {formatNumber(detail.mtos.mtoBIGravadaDGNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIgvIpmDGNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoIgvIpmDGNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoBIGravadaDNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoBIGravadaDNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIgvIpmDNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoIgvIpmDNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoValorAdqNG && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoValorAdqNG)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoISC && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoISC)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoIcbp && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoIcbp)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoOtrosTrib && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoOtrosTrib)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mtoBIGravada && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtos.mtoBIGravada)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.igv && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography
                            // sx={
                            //   detail.observacion['cpe'].some((obs) => obs.includes('IGV', 'igv'))
                            //     ? { color: 'red' }
                            //     : { color: 'inherit' }
                            // }
                            style={{ fontSize: 14 }}
                          >
                            {formatNumber(detail.mtos.mtoIGV)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.igvSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoIGV)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.importe && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography
                            // sx={
                            //   detail.observacion['cpe'].some((obs) =>
                            //     obs.includes('Importe', 'importe')
                            //   )
                            //     ? { color: 'red' }
                            //     : { color: 'inherit' }
                            // }
                            style={{ fontSize: 14 }}
                          >
                            {formatNumber(detail.monto)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.importeSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {formatNumber(detail.mtoImporteTotal)}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.tipoCambio && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography
                            // sx={
                            //   detail.observacion['tc'].length > 0
                            //     ? { color: 'red' }
                            //     : { color: 'inherit' }
                            // }
                            style={{ fontSize: 14 }}
                          >
                            {detail.tipoCambio}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacionTC &&
                        params.filters.hasOwnProperty('tipoCambio') && (
                          <TableCell className="customTableCell">
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {detail.observaciones['tipoCambio']?.length > 0 ? (
                                <Typography
                                  color="text.secondary"
                                  fontWeight="bold"
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      color: 'primary.main',
                                    },
                                  }}
                                  onClick={() =>
                                    handleOpen(detail.observaciones['tipoCambio'].join('. '))
                                  }
                                >
                                  {detail.observaciones['tipoCambio'].join('. ')}
                                </Typography>
                              ) : (
                                'Sin observaciones'
                              )}
                            </Typography>
                          </TableCell>
                        )}
                      {columnVisibility.observacionCpe && params.filters.hasOwnProperty('cpe') && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 'normal',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {detail.observaciones['cpe']?.length > 0 ? (
                              <Typography
                                color="text.secondary"
                                fontWeight="bold"
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: 'primary.main',
                                  },
                                }}
                              >
                                {detail.observaciones['cpe'].join('. ')}
                              </Typography>
                            ) : (
                              'Sin observaciones'
                            )}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.observacionIncons &&
                        params.filters.hasOwnProperty('inconsistencias') && (
                          <TableCell className="customTableCell">
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {detail.observaciones['inconsistencias']?.length > 0 ? (
                                <Typography
                                  color="text.secondary"
                                  fontWeight="bold"
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      color: 'primary.main',
                                    },
                                  }}
                                >
                                  {detail.observaciones['inconsistencias'].join('. ')}
                                </Typography>
                              ) : (
                                'Sin observaciones'
                              )}
                            </Typography>
                          </TableCell>
                        )}

                      {columnVisibility.observacionCond &&
                        params.filters.hasOwnProperty('condicion') && (
                          <TableCell className="customTableCell">
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {detail.observaciones['condicion']?.length > 0 ? (
                                <Typography
                                  color="text.secondary"
                                  fontWeight="bold"
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      color: 'primary.main',
                                    },
                                  }}
                                >
                                  {detail.observaciones['condicion'].join('. ')}
                                </Typography>
                              ) : (
                                'Sin observaciones'
                              )}
                            </Typography>
                          </TableCell>
                        )}
                      {columnVisibility.observacionObligado &&
                        params.filters.hasOwnProperty('obligado') && (
                          <TableCell className="customTableCell">
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 'normal',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {detail.observaciones['obligado']?.length > 0 ? (
                                <Typography
                                  color="text.secondary"
                                  fontWeight="bold"
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      color: 'primary.main',
                                    },
                                  }}
                                >
                                  {detail.observaciones['obligado'].join('. ')}
                                </Typography>
                              ) : (
                                'Sin observaciones'
                              )}
                            </Typography>
                          </TableCell>
                        )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
            {results?.length > 0 && (
              <TableFooter
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'background.paper',
                }}
              >
                <TableRow>
                  {columnVisibility.periodo && <TableCell></TableCell>}
                  {columnVisibility.ruc && <TableCell></TableCell>}
                  {columnVisibility.razonSocial && <TableCell></TableCell>}
                  {columnVisibility.fechaEmision && <TableCell></TableCell>}
                  {columnVisibility.tipoComprobante && <TableCell></TableCell>}
                  {columnVisibility.numeroComprobante && <TableCell></TableCell>}
                  {columnVisibility.moneda && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravadaDGNG && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totals.baseIGravadaDGNG.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.mtoIgvIpmDGNG && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravadaDNG && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totals.baseIGravadaDNG.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.mtoIgvIpmDNG && <TableCell></TableCell>}
                  {columnVisibility.mtoValorAdqNG && <TableCell></TableCell>}
                  {columnVisibility.mtoISC && <TableCell></TableCell>}
                  {columnVisibility.mtoIcbp && <TableCell></TableCell>}
                  {columnVisibility.mtoOtrosTrib && <TableCell></TableCell>}
                  {columnVisibility.mtoBIGravada && <TableCell></TableCell>}
                  {columnVisibility.igv && <TableCell></TableCell>}
                  {columnVisibility.igvSunat && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totals.igvSunat.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.importe && <TableCell></TableCell>}
                  {columnVisibility.importeSunat && (
                    <TableCell sx={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      {totals.importeSunat.toLocaleString('en-US')}
                    </TableCell>
                  )}
                  {columnVisibility.tipoCambio && <TableCell></TableCell>}
                  {columnVisibility.observacionTC &&
                    params.filters.hasOwnProperty('tipoCambio') && (
                      <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {totals.observacionTC}
                      </TableCell>
                    )}
                  {columnVisibility.observacionCpe && params.filters.hasOwnProperty('cpe') && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {totals.observacionCpe}
                    </TableCell>
                  )}
                  {columnVisibility.observacionIncons &&
                    params.filters.hasOwnProperty('inconsistencias') && (
                      <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {totals.observacionIncons}
                      </TableCell>
                    )}
                  {columnVisibility.observacionCond &&
                    params.filters.hasOwnProperty('condicion') && (
                      <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {totals.observacionCond}
                      </TableCell>
                    )}
                  {columnVisibility.observacionObligado &&
                    params.filters.hasOwnProperty('obligado') && (
                      <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {totals.observacionObligado}
                      </TableCell>
                    )}
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
      />
    </Card>
  );
};

PurchasesInconsistenciesDetails.propTypes = {
  loading: PropTypes.bool,
  // details: PropTypes.array.isRequired,
  totals: PropTypes.object,
  downloadPath: PropTypes.string,
  onDownload: PropTypes.func,
};
