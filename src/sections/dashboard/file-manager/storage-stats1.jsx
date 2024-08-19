import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { FileIcon } from 'src/components/file-icon';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { useEffect, useState } from 'react';

export const StorageStats1 = (props) => {
  const { items } = props;
  const [totalStorage, setTotalStorage] = useState(0);

  const getTotalStorage = () => {
    let sum = 0;
    items.forEach((item) => {
      sum += item.size;
    });

    setTotalStorage(sum);
  };

  useEffect(() => {
    getTotalStorage();
  }, [items]);
  return (
    <Card>
      <CardHeader
        title="Almacenamiento"
        subheader="PLEs compras y ventas"
      />
      <CardContent>
        <Stack alignItems="center">
          <Box
            sx={{
              height: 200,
              mt: '-38px',
              mb: '-130px',
            }}
          >
            <Typography
              variant="h2"
              sx={{ color: 'primary.main' }}
            >
              {bytesToSize(totalStorage)}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ mb: 1 }}
          >
            Tus archivos ocupan un total de {bytesToSize(totalStorage)} de espacio.
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Sigue subiendo archivos PLEs de compras y ventas sin preocupaciones.
          </Typography>
        </Stack>
        <List
          disablePadding
          sx={{ mt: 2 }}
        >
          {items.map((total, index) => {
            const size = bytesToSize(total.size);
            const name = total.type == '08' ? 'COMPRAS' : 'VENTAS';
            return (
              <ListItem
                disableGutters
                key={index}
              >
                <ListItemIcon>
                  <Box sx={{ color: 'primary.main' }}>
                    <FileIcon extension="txt" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="caption">{name}</Typography>}
                  secondary={
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {size} • {total.countPle}
                      {total.countPle > 1 ? ' PLEs' : ' PLE'} • {total.countDoc} documentos
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

StorageStats1.propTypes = {
  items: PropTypes.array,
};
