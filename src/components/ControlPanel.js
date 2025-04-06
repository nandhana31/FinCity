import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField'; // Like Input
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Like Spinner
import Alert from '@mui/material/Alert'; // We'll use Snackbar from App.js instead of toast here

// We will get the snackbar function via props from App.js
function ControlPanel({ onCheckRisk, onSimulateSpending, onLogSavings, onOptimizeSpending, loading, showSnackbar }) {
  const [ticker, setTicker] = useState('');

  const handleRiskCheckClick = () => {
    if (!ticker) {
      // Use the snackbar function passed from App.js
      showSnackbar('Please enter a stock ticker symbol.', 'warning');
      return;
    }
    onCheckRisk(ticker);
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, width: '100%', bgcolor: 'white' }}>
      <Stack spacing={2}> {/* Like VStack */}
        <Typography fontWeight="bold" variant="h6" align="center">Architect Controls</Typography>

        {/* Investment Risk Check */}
        <Stack direction="row" spacing={1} alignItems="center"> {/* Like HStack */}
          <TextField
            label="Stock Ticker"
            variant="outlined"
            size="small"
            placeholder="e.g., AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            disabled={loading}
            fullWidth
          />
          <Button
            variant="contained"
            color="error" // MUI uses 'error' for red-like theme color
            onClick={handleRiskCheckClick}
            disabled={loading}
            sx={{ minWidth: '150px' }} // Prevent button shrinking too much
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Check Risk'}
          </Button>
        </Stack>

        {/* Simulated Actions */}
        <Stack direction="row" spacing={1} justifyContent="space-around">
           <Button variant="contained" color="warning" onClick={onSimulateSpending} disabled={loading}>
             Simulate High Spending
           </Button>
           <Button variant="contained" color="success" onClick={onOptimizeSpending} disabled={loading}>
             Optimize Spending
           </Button>
           <Button variant="contained" color="info" onClick={onLogSavings} disabled={loading}>
             Log Savings Goal
           </Button>
        </Stack>

      </Stack>
    </Box>
  );
}

export default ControlPanel;