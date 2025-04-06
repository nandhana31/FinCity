import React from 'react';
// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
// MUI Icons
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FortIcon from '@mui/icons-material/Fort';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import VerifiedIcon from '@mui/icons-material/Verified';

// Determine base appearance based on Level
const getLevelInfo = (level) => {
    // ... (no changes needed in this helper function) ...
    switch (level) {
        case 0: return { IconComponent: SavingsIcon, name: "Coin Pouch", baseColor: 'grey.500', baseBg: 'grey.100' };
        case 1: return { IconComponent: AccountBalanceIcon, name: "City Treasury", baseColor: 'info.main', baseBg: 'info.50' };
        case 2: return { IconComponent: FortIcon, name: "Fortress Vault", baseColor: 'primary.main', baseBg: 'primary.50' };
        default: return { IconComponent: SavingsIcon, name: "Savings District", baseColor: 'grey.500', baseBg: 'grey.100' };
    }
};

// Determine temporary status overlay icon and color
const getStatusOverlay = (status) => {
    // *** FIX: Added check for undefined/null status ***
    if (!status) {
        return { statusIcon: null, statusColor: 'default', label: 'Status Loading...' };
    }
    // *** END FIX ***
   switch (status) {
    case 'growing': return { statusIcon: EnergySavingsLeafIcon, statusColor: 'info', label: 'Growing!' };
    case 'stable': return { statusIcon: VerifiedIcon, statusColor: 'success', label: 'Stable' };
    default: return { statusIcon: null, statusColor: 'default', label: 'Status Idle' };
  }
};

// Accept level prop from the data object
function SavingsDistrict({ status = 'idle', score = 50, level = 0 }) {
   const levelInfo = getLevelInfo(level);
   const statusOverlay = getStatusOverlay(status); // Now guaranteed to return an object
   const LevelIcon = levelInfo.IconComponent;
   // These destructuring calls are now safe
   const StatusIcon = statusOverlay.statusIcon;
   const statusColor = statusOverlay.statusColor;
   const statusLabel = statusOverlay.label;

   // Determine final styles
   const finalBorderColor = status !== 'idle' && statusColor !== 'default' ? `${statusColor}.main` : levelInfo.baseColor;
   const baseBgColor = levelInfo.baseBg;
   const statusBgTint = status === 'growing' ? 'info.light' : status === 'stable' ? 'success.light' : baseBgColor;
   const finalBgColor = status !== 'idle' ? statusBgTint : baseBgColor;

   const tooltipTitle = `Lvl ${level} ${levelInfo.name} (${statusLabel}) - Score: ${score}`;

   return (
    <Card
        variant="outlined"
        sx={{
            borderColor: finalBorderColor, bgcolor: finalBgColor, minWidth: '160px', // Adjusted slightly
            textAlign: 'center', position: 'relative', overflow: 'visible', boxShadow: 3,
            transition: 'all 0.3s ease-in-out', '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 }
        }}
      >
        {/* Status Badge - Only show if status is not idle AND StatusIcon exists */}
        {StatusIcon && status !== 'idle' && (
          <Badge
            badgeContent={<StatusIcon sx={{ fontSize: '1rem' }} />}
            color={statusColor}
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
                    <Typography fontWeight="bold" variant="body1" color="text.primary">
                       {levelInfo.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Score: {score} | Lvl: {level}
                    </Typography>
                </Stack>
            </CardContent>
        </Tooltip>
    </Card>
   );
}

export default SavingsDistrict;