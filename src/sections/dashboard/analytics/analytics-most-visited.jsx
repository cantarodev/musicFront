import PropTypes from 'prop-types';
import numeral from 'numeral';
import InfoCircleIcon from '@untitled-ui/icons-react/build/esm/InfoCircle';
import LinkExternal01Icon from '@untitled-ui/icons-react/build/esm/LinkExternal01';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

export const AnalyticsMostVisited = (props) => {
  const { pages } = props;

  return (
    <Card>
      <CardHeader
        title="PLEs"
        action={
          <Tooltip title="Refresh rate is 24h">
            <SvgIcon color="action">
              <InfoCircleIcon />
            </SvgIcon>
          </Tooltip>
        }
      />
      <Scrollbar>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>PLE</TableCell>
              <TableCell>Base de datos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.map((page) => {
              const formatPle = numeral(page.ple).format('0,0');
              const formatDb = numeral(page.db).format('0,0');

              return (
                <TableRow
                  key={page.url}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Link
                      color="text.primary"
                      href="#"
                    >
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="body2">{page.period}</Typography>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={page.name}>
                      <Typography
                        sx={{ cursor: 'pointer' }}
                        variant="subtitle2"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                        }}
                      >
                        {page.name}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatPle}</TableCell>
                  <TableCell>{formatDb}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};

AnalyticsMostVisited.propTypes = {
  pages: PropTypes.array.isRequired,
};
