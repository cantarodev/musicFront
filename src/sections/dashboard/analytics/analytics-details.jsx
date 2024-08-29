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
  TableFooter,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { ModalDetail } from './modal-detail';
import { useEffect, useState } from 'react';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';

export const AnalyticsDetails = (props) => {
  const { loading, details, onLoadData, downloadPath, onDownload } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [totalSums, setTotalSums] = useState({
    igv: 0.0,
    igvSunat: 0.0,
    importe: 0.0,
    importeSunat: 0.0,
    resumenGeneral: 0,
    resumenTC: 0,
  });

  const columnLabels = {
    periodo: 'Período',
    ruc: 'RUC',
    razonSocial: 'Razón Social',
    fechaEmision: 'Fecha Emisión',
    tipoComprobante: 'Tipo Comprobante',
    numeroComprobante: 'Número Comprobante',
    moneda: 'Moneda',
    igv: 'IGV',
    igvSunat: 'IGV Sunat',
    importe: 'Importe',
    importeSunat: 'Importe Sunat',
    tipoCambio: 'Tipo de Cambio',
    resumen: 'Resumen General',
    resumenTC: 'Resumen Tipo de Cambio',
    resumenFactoring: 'Resumen Factoring',
  };

  const [columnVisibility, setColumnVisibility] = useState({
    periodo: true,
    ruc: true,
    razonSocial: true,
    fechaEmision: true,
    tipoComprobante: true,
    numeroComprobante: true,
    moneda: true,
    igv: true,
    igvSunat: false,
    importe: true,
    importeSunat: false,
    tipoCambio: true,
    resumen: true,
    resumenTC: true,
    resumenFactoring: false,
  });

  const [open, setOpen] = useState(false);

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

  const isEmpty = details.length === 0;

  const handleOpen = (detail, option = '') => {
    setModalOpen(true);
    setSelectedDetail(detail);
    setSelectedOption(option);
  };

  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const tcRegex = /Valor TC: [\d.]+ \(debería ser [\d.]+\)/;
    const importeRegex = /Valor Importe: [\d.]+ \(debería ser [\d.]+\)/;
    const igvRegex = /Valor IGV: [\d.]+ \(debería ser [\d.]+\)/;

    const newTotals = details.reduce(
      (totals, detail) => {
        totals.igv += parseFloat(detail.mtoIGV) || 0;
        totals.igvSunat += parseFloat(detail.mtoIGVSunat) || 0;
        totals.importe += parseFloat(detail.mtoImporteTotal) || 0;
        totals.importeSunat += parseFloat(detail.mtoImporteTotalSunat) || 0;

        if (tcRegex.test(detail.observacion)) {
          totals.resumenTC += 1;
        }

        if (importeRegex.test(detail.observacion) || igvRegex.test(detail.observacion)) {
          totals.resumenGeneral += 1;
        }

        return totals;
      },
      {
        igv: 0.0,
        igvSunat: 0.0,
        importe: 0.0,
        importeSunat: 0.0,
        resumenTC: 0,
        resumenGeneral: 0,
      }
    );

    setTotalSums(newTotals);
  }, [details]);

  return (
    <Card>
      <CardHeader
        title="Inconsistencias"
        sx={{ p: 2, pb: 0 }}
        action={
          <>
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
                {columnVisibility.igv && (
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>IGV</Typography>
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
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Importe</Typography>
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
                {columnVisibility.resumen && (
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
                )}
                {columnVisibility.resumenTC && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Resumen Tipo de Cambio
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.resumenFactoring && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Resumen Factoring
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={15}
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
                    colSpan={15}
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
                            {detail.mtoIGV}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.igvSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>{detail.mtoIGVSunat}</Typography>
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
                            {detail.mtoImporteTotal}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.importeSunat && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {detail.mtoImporteTotalSunat}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.tipoCambio && (
                        <TableCell
                          className="customTableCell"
                          sx={{ textAlign: 'right' }}
                        >
                          {/* 17863 */}
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
                      {columnVisibility.resumen && (
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
                      {columnVisibility.resumenTC && (
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
                      {columnVisibility.resumenFactoring && (
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
                          ></Typography>
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
                  {columnVisibility.resumen && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.resumenGeneral}
                    </TableCell>
                  )}
                  {columnVisibility.resumenTC && (
                    <TableCell sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                      {totalSums.resumenTC}
                    </TableCell>
                  )}
                  {columnVisibility.resumenFactoring && <TableCell></TableCell>}
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

AnalyticsDetails.propTypes = {
  loading: PropTypes.bool,
  details: PropTypes.array.isRequired,
  downloadPath: PropTypes.string,
  onDownload: PropTypes.func,
  onLoadData: PropTypes.func,
};
