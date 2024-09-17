import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PurchasesInconsinstencies from 'src/sections/dashboard/analytics/purchases-inconsistencies';
import PurchasesSire from 'src/sections/dashboard/analytics/purchases-sire';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const BasicTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ pl: 3, pr: 3 }}
      >
        <Tab label="Home" />
        <Tab label="Sire" />
      </Tabs>

      <TabPanel
        value={value}
        index={0}
      >
        <PurchasesInconsinstencies />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
      >
        <PurchasesSire />
      </TabPanel>
    </Box>
  );
};

export default BasicTabs;
