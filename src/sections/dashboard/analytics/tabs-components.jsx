import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AnalyticsDetails } from './analytics-details';
import { PurchasesFilter } from './purchases-filter';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { reportApi } from 'src/api/reports/reportService';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MergeDataTable } from './merged-data-table';

const TabsComponent = ({ queryType }) => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabs = [
    'Home',
    'Tipo de Cambio',
    'Factoring',
    'Nota de Crédito - Débito',
    'Detracciones',
    "DUA's",
  ];

  const [detailsMain, setDetailsMain] = useState([]);
  const [detailsMerge, setDetailsMerge] = useState([]);

  const [loadingObservations, setLoadingObservations] = useState(false);
  const [loadingMissings, setLoadingMissings] = useState(false);

  const user = useMockedUser();

  const [selectedParams, setSelectedParams] = useState({
    period: '202408',
    queryType: queryType,
    docType: 'all',
    currency: 'all',
  });

  console.log(selectedParams);

  const handleApplyFilters = async () => {
    const user_id = user?.user_id;
    const period = selectedParams.period;
    const queryType = selectedParams.queryType;
    const docType = selectedParams.docType;
    const currency = selectedParams.currency;

    setLoadingObservations(true);
    try {
      const response = await reportApi.getReportObservations({
        user_id,
        period,
        queryType,
        docType,
        currency,
      });
      console.log(response);

      const data = response?.data;
      setDetailsMain(data?.all_results);
      setLoadingObservations(false);
    } catch (err) {
      console.error(err);
      setLoadingObservations(false);
    }
  };

  const loadData = async () => {
    const user_id = user?.user_id;
    const period = selectedParams.period;
    const queryType = selectedParams.queryType;
    const docType = selectedParams.docType;
    const currency = selectedParams.currency;

    setLoadingMissings(true);
    try {
      const response = await reportApi.getReportMissings({
        user_id,
        period,
        queryType,
        docType,
        currency,
      });

      const data = response?.data;

      setDetailsMerge(data?.all_results);
      setLoadingMissings(false);
    } catch (err) {
      console.error(err);
      setLoadingMissings(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (index) => {
    setAnchorEl(null);
    if (index !== undefined) {
      setValue(index);
    }
  };

  const handleChangePageMain = (event, newPage) => {
    setPageMain(newPage + 1);
  };

  const handleChangeRowsPerPageMain = (event) => {
    setRowsPerPageMain(parseInt(event.target.value, 10));
    setPageMain(1);
  };

  const sourceCounts = detailsMerge.reduce((counts, item) => {
    counts[item.source] = (counts[item.source] || 0) + 1;
    return counts;
  }, {});

  const numVisibleTabs = isMobile ? 2 : 5;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs example"
          sx={{ overflow: 'hidden', flex: '1 1 auto', maxWidth: 'calc(100% - 40px)' }}
        >
          {tabs.slice(0, numVisibleTabs).map((tab, index) => (
            <Tab
              key={index}
              label={tab}
            />
          ))}
        </Tabs>
        {tabs.length > numVisibleTabs && (
          <IconButton
            aria-label="more"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ alignSelf: 'center' }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
      {tabs.length > numVisibleTabs && (
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
        >
          {tabs.slice(numVisibleTabs).map((tab, index) => (
            <MenuItem
              key={index}
              onClick={() => handleClose(index + numVisibleTabs)}
            >
              {tab}
            </MenuItem>
          ))}
        </Menu>
      )}
      <TabPanel
        value={value}
        index={0}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <PurchasesFilter
            selectedParams={selectedParams}
            setSelectedParams={setSelectedParams}
          />
          <AnalyticsDetails
            loading={loadingObservations}
            details={detailsMain || []}
            onLoadData={handleApplyFilters}
          />
          <MergeDataTable
            loading={loadingMissings}
            details={detailsMerge || []}
            sourceCounts={sourceCounts}
            onLoadData={loadData}
          />
        </Box>
      </TabPanel>
    </Box>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabsComponent;