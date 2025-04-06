import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // Use Paper for better visual grouping
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TrackChangesIcon from '@mui/icons-material/TrackChanges'; // Icon for Budget Goals

function ControlPanel({
    // Ensure all expected props are listed here
    onCheckRisk, onSimulateSpending, onLogSavings, onOptimizeSpending,
    onSimulateFeeFound, loading, showSnackbar,
    blueprintCount, investmentLevel, spendingLevel, savingsLevel,
    onUpgrade, upgradeCost, maxLevel
   }) {
    const [ticker, setTicker] = useState('');

    // *** FIX: Added the correct logic inside this function ***
    const handleRiskCheckClick = () => {
      console.log(">>> ControlPanel: handleRiskCheckClick triggered!"); // Keep for debugging if needed

      if (!ticker) {
        console.log(">>> ControlPanel: Ticker is empty, calling showSnackbar."); // Keep for debugging
        showSnackbar('Please enter a stock or REIT ticker.', 'warning'); // Use the passed prop
        return; // Stop execution if ticker is empty
      }
      console.log(`>>> ControlPanel: Ticker is '${ticker}', calling onCheckRisk prop.`); // Keep for debugging
      onCheckRisk(ticker); // Call the function passed down from App.js
    };
    // *** END FIX ***

    // --- Keep the rest of the component logic the same ---
    const canUpgradeInvestment = blueprintCount >= upgradeCost && investmentLevel < maxLevel;
    const canUpgradeSpending = blueprintCount >= upgradeCost && spendingLevel < maxLevel;
    const canUpgradeSavings = blueprintCount >= upgradeCost && savingsLevel < maxLevel;

    const getTooltipTitle = (level, canUpgrade, districtName) => {
        if (level >= maxLevel) return `${districtName} is at max level!`;
        // Corrected blueprint logic slightly for clarity
        if (!canUpgrade && blueprintCount < upgradeCost) return `Need ${upgradeCost - blueprintCount} more Blueprint(s)`;
        if (!canUpgrade) return `${districtName} cannot be upgraded now`; // Generic fallback
        return `Upgrade ${districtName} to Level ${level + 1}`;
    };
    // ----------------------------------------------------

    return (
      <Paper elevation={3} sx={{ p: 2, width: '100%', }}>
        <Stack spacing={2.5}>
          <Typography fontWeight="bold" variant="h6" align="center">Architect Controls</Typography>

          {/* --- Risk Analysis --- */}
          <Box>
              <Typography variant="overline" display="block" color="text.secondary" gutterBottom>Investment Risk Analysis (CBRE Focus)</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                  <TextField label="Stock or REIT Ticker" variant="outlined" size="small" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} disabled={loading} fullWidth placeholder="e.g., AAPL, O, SPG"/>
                  {/* Ensure onClick points to the corrected handleRiskCheckClick */}
                  <Button variant="contained" color="error" onClick={handleRiskCheckClick} disabled={loading} sx={{ minWidth: '130px' }} >
                       {loading ? <CircularProgress size={24} color="inherit" /> : 'Check Risk'}
                  </Button>
              </Stack>
          </Box>

          <Divider />

           {/* --- Simulation & Actions --- */}
           <Box>
               <Typography variant="overline" display="block" color="text.secondary" gutterBottom>Simulate Actions & Insights (Capital One Focus)</Typography>
               <Stack direction="row" spacing={1} justifyContent="space-around" flexWrap="wrap" sx={{mb: 1}}>
                   <Button variant="contained" color="warning" onClick={onSimulateSpending} disabled={loading} size="small"> Simulate High Spending </Button>
                   <Button variant="contained" color="secondary" onClick={onSimulateFeeFound} disabled={loading} size="small"> Simulate Fee Found </Button>
                   <Button variant="contained" color="success" onClick={onOptimizeSpending} disabled={loading} size="small"> Optimize Spending </Button>
                   <Button variant="contained" color="info" onClick={onLogSavings} disabled={loading} size="small"> Log Savings Goal </Button>
               </Stack>
                {/* Budget Goal Hint */}
                <TextField
                    label="Budget Goals" variant="outlined" size="small" fullWidth disabled
                    value="(Feature coming soon!)"
                    InputProps={{ startAdornment: <TrackChangesIcon position="start" sx={{ color: 'action.disabled', mr:1}}/>, }}
                    sx={{ mt: 1, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(0, 0, 0, 0.5)', }, }}
                />
           </Box>

           <Divider />

          {/* --- City Upgrades --- */}
          <Box>
               <Typography variant="overline" display="block" color="text.secondary" gutterBottom>City Development (Cost: {upgradeCost} <UpgradeIcon fontSize='inherit' sx={{verticalAlign: 'middle'}}/>)</Typography>
               <Stack direction="row" spacing={1} justifyContent="space-around" flexWrap="wrap">
                  {/* Investment Upgrade Button */}
                  <Tooltip title={getTooltipTitle(investmentLevel, canUpgradeInvestment, "Investment")}>
                      <span> {/* Tooltip requires child DOM element when button is disabled */}
                          <Button variant="outlined" color="primary" startIcon={<UpgradeIcon />} onClick={() => onUpgrade('investment')} disabled={!canUpgradeInvestment || loading} size="small" > Investments </Button>
                      </span>
                  </Tooltip>
                  {/* Spending Upgrade Button */}
                  <Tooltip title={getTooltipTitle(spendingLevel, canUpgradeSpending, "Spending")}>
                      <span>
                          <Button variant="outlined" color="primary" startIcon={<UpgradeIcon />} onClick={() => onUpgrade('spending')} disabled={!canUpgradeSpending || loading} size="small" > Spending </Button>
                      </span>
                  </Tooltip>
                  {/* Savings Upgrade Button */}
                  <Tooltip title={getTooltipTitle(savingsLevel, canUpgradeSavings, "Savings")}>
                      <span>
                          <Button variant="outlined" color="primary" startIcon={<UpgradeIcon />} onClick={() => onUpgrade('savings')} disabled={!canUpgradeSavings || loading} size="small" > Savings </Button>
                      </span>
                  </Tooltip>
               </Stack>
          </Box>

        </Stack>
      </Paper>
    );
  }

export default ControlPanel;