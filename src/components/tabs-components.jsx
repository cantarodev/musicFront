import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

import PurchasesInconsinstencies from 'src/sections/dashboard/analytics/purchases-inconsistencies';
import PurchasesSire from 'src/sections/dashboard/analytics/purchases-sire';
import Correlativity from 'src/sections/dashboard/analytics/sales-inconsistencies-correlativity';

import SalesInconsinstencies from 'src/sections/dashboard/analytics/sales-inconsistencies';
import SalesSire from 'src/sections/dashboard/analytics/sales-sire';

import PurchasesDetractions from 'src/sections/dashboard/analytics/detractions';
import PurchasesCreditDebitNotes from 'src/sections/dashboard/analytics/purchases_credit_debit_notes';

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

const BasicTabs = ({ type }) => {
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
        <Tab label="Notas Créd. Déb." />
        {type === 'Compras' && <Tab label="Detracciones" />}
        {type === 'Ventas' && <Tab label="Correlatividad" />}
      </Tabs>

      <TabPanel
        value={value}
        index={0}
      >
        {type === 'Compras' ? (
          <PurchasesInconsinstencies type={type} />
        ) : (
          <SalesInconsinstencies type={type} />
        )}
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
      >
        {type === 'Compras' ? <PurchasesSire type={type} /> : <SalesSire type={type} />}
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
      >
        {/* Usar PurchasesCreditDebitNotes para ambos tipos */}
        <PurchasesCreditDebitNotes type={type} />
      </TabPanel>
      <TabPanel
        value={value}
        index={3}
      >
        {type === 'Compras' && <PurchasesDetractions type={type} />}
      </TabPanel>
      <TabPanel
        value={value}
        index={3}
      >
        {type === 'Ventas' && <Correlativity type={type} />}
      </TabPanel>
    </Box>
  );
};

export default BasicTabs;
