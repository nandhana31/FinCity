import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
// Icons
import BuildCircleIcon from '@mui/icons-material/BuildCircle'; // Blueprints
import LeaderboardIcon from '@mui/icons-material/Leaderboard'; // Representing Level/Score

const getScoreColor = (score) => {
  if (score >= 70) return 'success';
  if (score >= 40) return 'warning';
  return 'error';
};

// Accept level props
function HUD({
    cityScore,
    investmentScore, spendingHealth, savingsProgress,
    alerts, blueprintCount,
    investmentLevel, spendingLevel, savingsLevel // New level props
}) {
  const scoreColor = getScoreColor(cityScore);

  return (
    <Paper elevation={2} sx={{ p: 2, width: '100%', bgcolor: 'grey.50' }}>
      <Stack spacing={2} align="stretch">
        {/* Overall Score */}
        <Box>
          <Typography variant="h6" component="div" fontWeight="bold" color={`${scoreColor}.dark`}>
            Overall City Stability: {cityScore}/100
          </Typography>
          <LinearProgress variant="determinate" color={scoreColor} value={cityScore} sx={{ height: 10, borderRadius: 1 }}/>
        </Box>

         {/* District Scores & Levels Row */}
         <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-around" alignItems="center" spacing={1}>
             <Chip icon={<LeaderboardIcon />} label={`Invest Lvl ${investmentLevel} (Score: ${investmentScore})`} color={getScoreColor(investmentScore)} size="small" variant="outlined" />
             <Chip icon={<LeaderboardIcon />} label={`Spend Lvl ${spendingLevel} (Score: ${spendingHealth})`} color={getScoreColor(spendingHealth)} size="small" variant="outlined"/>
             <Chip icon={<LeaderboardIcon />} label={`Save Lvl ${savingsLevel} (Score: ${savingsProgress})`} color={getScoreColor(savingsProgress)} size="small" variant="outlined"/>
         </Stack>

         {/* Blueprints */}
         <Stack direction="row" justifyContent="flex-end">
            <Chip
                icon={<BuildCircleIcon />}
                label={`Blueprints: ${blueprintCount}`}
                color="info"
                size="small"
                variant="filled"
                sx={{ fontWeight: 'bold' }}
            />
         </Stack>

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <Box pt={1.5} mt={1} borderTop={'1px solid'} borderColor={'divider'}>
            <Typography variant="caption" fontWeight="bold" color="primary.main">Recent Activity:</Typography>
            <Stack spacing={0.5} >
              {alerts.slice(-3).map((alert, index) => (
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