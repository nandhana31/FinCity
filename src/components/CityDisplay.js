import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
// Import district components
import InvestmentDistrict from './InvestmentDistrict';
import SpendingDistrict from './SpendingDistrict';
import SavingsDistrict from './SavingsDistrict';

// Accept hasSpendingOpportunity prop
function CityDisplay({ investmentData, spendingData, savingsData, hasSpendingOpportunity }) {
  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, mt: 2 }}> {/* Add margin top, adjust padding */}
      {/* Use Stack for layout, adjust spacing and direction for responsiveness */}
      <Stack
         direction={{ xs: 'column', md: 'row' }} // Column on small screens, row on medium+
         spacing={3} // Increase spacing
         justifyContent="center"
         alignItems="center" // Center items when stacked vertically
      >
        <InvestmentDistrict status={investmentData.status} score={investmentData.score} />
        {/* Pass hasOpportunity to SpendingDistrict */}
        <SpendingDistrict status={spendingData.status} score={spendingData.score} hasOpportunity={hasSpendingOpportunity} />
        <SavingsDistrict status={savingsData.status} score={savingsData.score} />
      </Stack>
    </Box>
  );
}

export default CityDisplay;