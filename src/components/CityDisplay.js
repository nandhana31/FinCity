import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
// Import district components
import InvestmentDistrict from './InvestmentDistrict';
import SpendingDistrict from './SpendingDistrict';
import SavingsDistrict from './SavingsDistrict';

// Accept the full data objects and the opportunity flag
// *** ADDED Default empty objects {} to prevent undefined errors on initial render ***
function CityDisplay({
  investmentData = {}, // <-- FIX: Added default
  spendingData = {},   // <-- FIX: Added default
  savingsData = {},    // <-- FIX: Added default
  hasSpendingOpportunity
}) {
  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 }, mt: 2 }}>
      <Stack
         direction={{ xs: 'column', md: 'row' }}
         spacing={3}
         justifyContent="center"
         alignItems="stretch" // Stretch items to fill height if needed
      >
        {/* Pass down all needed props from the data object */}
        {/* These will now safely read 'undefined' from the empty object on first render, */}
        {/* which the child components handle with their own default props. */}
        <InvestmentDistrict
            status={investmentData.status}
            score={investmentData.score}
            level={investmentData.level}
        />
        <SpendingDistrict
            status={spendingData.status}
            score={spendingData.score}
            level={spendingData.level}
            hasOpportunity={hasSpendingOpportunity}
         />
        <SavingsDistrict
            status={savingsData.status}
            score={savingsData.score}
            level={savingsData.level}
        />
      </Stack>
    </Box>
  );
}

export default CityDisplay;