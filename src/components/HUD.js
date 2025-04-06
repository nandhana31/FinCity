import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper'; // Use Paper for better elevation/background
// Blueprint icon
import BuildCircleIcon from '@mui/icons-material/BuildCircle'; // Represents blueprints/building

const getScoreColor = (score) => {
  if (score >= 70) return 'success';
  if (score >= 40) return 'warning';
  return 'error';
};

// Accept blueprintCount prop
function HUD({ cityScore, investmentScore, spendingHealth, savingsProgress, alerts, blueprintCount }) {
  const scoreColor = getScoreColor(cityScore);

  return (
    // Use Paper for a slightly raised look
    <Paper elevation={2} sx={{ p: 2, width: '100%', bgcolor: 'grey.50' }}>
      <Stack spacing={2} align="stretch">
        <Box>
          <Typography variant="h6" component="div" fontWeight="bold" color={`${scoreColor}.dark`}> {/* Darker color */}
            Overall City Stability: {cityScore}/100
          </Typography>
          <LinearProgress variant="determinate" color={scoreColor} value={cityScore} sx={{ height: 10, borderRadius: 1 }}/>
        </Box>

        {/* Group scores and blueprints */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap"> {/* Allow wrapping */}
                <Chip label={`Investment Risk: ${investmentScore}`} color={getScoreColor(investmentScore)} size="small" variant="outlined" />
                <Chip label={`Spending Health: ${spendingHealth}`} color={getScoreColor(spendingHealth)} size="small" variant="outlined"/>
                <Chip label={`Savings Progress: ${savingsProgress}`} color={getScoreColor(savingsProgress)} size="small" variant="outlined"/>
            </Stack>
             {/* Blueprint Counter */}
            <Chip
                icon={<BuildCircleIcon />}
                label={`Blueprints: ${blueprintCount}`}
                color="info"
                size="small"
                variant="filled" // Filled looks more distinct
                 sx={{ mt: { xs: 1, sm: 0 } }} // Add margin top on small screens
            />
        </Stack>


        {alerts && alerts.length > 0 && (
          <Box pt={1.5} mt={1.5} borderTop={'1px solid'} borderColor={'divider'}>
            <Typography variant="caption" fontWeight="bold" color="primary.main">Recent Activity:</Typography>
            <Stack spacing={0.5} >
              {alerts.slice(-3).map((alert, index) => ( // Show 3 alerts
                 <Typography key={index} variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>{alert}</Typography>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export default HUD;