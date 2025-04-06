import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
// Icons
import FoundationIcon from '@mui/icons-material/Foundation';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DomainIcon from '@mui/icons-material/Domain';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

// Determine base appearance based on Level
const getLevelInfo = (level) => {
    // ... (no changes needed in this helper function) ...
    switch (level) {
        case 0: return { IconComponent: FoundationIcon, name: "Basic Exchange", baseColor: 'grey.500', baseBg: 'grey.100' };
        case 1: return { IconComponent: AccountBalanceWalletIcon, name: "Managed Portfolio", baseColor: 'info.main', baseBg: 'info.50' };
        case 2: return { IconComponent: DomainIcon, name: "Diversified Holdings", baseColor: 'primary.main', baseBg: 'primary.50' };
        default: return { IconComponent: FoundationIcon, name: "Investment District", baseColor: 'grey.500', baseBg: 'grey.100' };
    }
};

// Determine temporary status overlay icon and color
const getStatusOverlay = (status) => {
    // *** FIX: Added check for undefined/null status ***
    if (!status) {
        // If status is undefined or null, return the default 'idle' state object immediately
        return { statusIcon: null, statusColor: 'default', label: 'Status Loading...' }; // Changed label slightly
    }
    // *** END FIX ***

    switch (status) {
        case 'risky': return { statusIcon: WarningAmberIcon, statusColor: 'error', label: 'High Risk!' };
        case 'moderate': return { statusIcon: CloudQueueIcon, statusColor: 'warning', label: 'Moderate Risk' };
        case 'healthy': return { statusIcon: CheckCircleOutlineIcon, statusColor: 'success', label: 'Stable' };
        default: return { statusIcon: null, statusColor: 'default', label: 'Status Idle' }; // Default for known, non-matching statuses
    }
};

// Accept level prop from the data object passed down
function InvestmentDistrict({ status = 'idle', score = 50, level = 0 }) {
  const levelInfo = getLevelInfo(level);
  const statusOverlay = getStatusOverlay(status); // Now guaranteed to return an object
  const LevelIcon = levelInfo.IconComponent;
  // This destructuring should now be safe because statusOverlay is always an object
  const StatusIcon = statusOverlay.statusIcon;
  const statusColor = statusOverlay.statusColor; // Get color for badge too
  const statusLabel = statusOverlay.label; // Get label

  // Determine final styles - status overrides level color *when not idle*
  const finalBorderColor = status !== 'idle' && statusColor !== 'default' ? `${statusColor}.main` : levelInfo.baseColor;
  // Use level background as base, overlay status tint if not idle/healthy
  const baseBgColor = levelInfo.baseBg;
  const statusBgTint = status === 'risky' ? 'error.light' : status === 'moderate' ? 'warning.light' : baseBgColor; // Use light status color or base
  const finalBgColor = status !== 'idle' && status !== 'healthy' ? statusBgTint : baseBgColor;

  const tooltipTitle = `Lvl ${level} ${levelInfo.name} (${statusLabel}) - Score: ${score}`;

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: finalBorderColor, bgcolor: finalBgColor, minWidth: '170px',
        textAlign: 'center', position: 'relative', overflow: 'visible',
        boxShadow: 3, transition: 'all 0.3s ease-in-out',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 }
      }}
    >
      {/* Status Badge - Only show if status is not idle AND StatusIcon exists */}
      {StatusIcon && status !== 'idle' && (
        <Badge
          badgeContent={<StatusIcon sx={{ fontSize: '1rem' }} />}
          color={statusColor} // Use the destructured statusColor
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
              position: 'absolute', top: -8, right: -8,
              '& .MuiBadge-badge': {
                  border: `2px solid ${finalBorderColor}`, padding: '0 4px', backgroundColor: finalBgColor
                }
            }}
        />
      )}
      <Tooltip title={tooltipTitle} placement="top">
        {/* Ensure CardContent exists */}
        <CardContent sx={{ pt: StatusIcon && status !== 'idle' ? 3 : 2 }}>
          <Stack spacing={1} alignItems="center">
            <LevelIcon sx={{ fontSize: 48, color: levelInfo.baseColor, mb: 1 }} />
            <Typography fontWeight="bold" variant="body1" color="text.primary"> {levelInfo.name} </Typography>
            <Typography variant="caption" color="text.secondary"> Score: {score} | Lvl: {level} </Typography>
            <Divider sx={{ width: '60%', my: 1}} />
            <Stack direction="row" alignItems="center" spacing={0.5}>
                 <TravelExploreIcon sx={{ fontSize: '0.8rem', color: 'text.disabled' }} />
                 <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic'}}> Geo-Risk: N/A (Demo) </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Tooltip>
    </Card>
  );
}

export default InvestmentDistrict;