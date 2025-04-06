import React from 'react';
// MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
// MUI Icons
import StorefrontIcon from '@mui/icons-material/Storefront';
import HubIcon from '@mui/icons-material/Hub';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// Determine base appearance based on Level
const getLevelInfo = (level) => {
    // ... (no changes needed in this helper function) ...
     switch (level) {
        case 0: return { IconComponent: StorefrontIcon, name: "Marketplace", baseColor: 'grey.500', baseBg: 'grey.100' };
        case 1: return { IconComponent: HubIcon, name: "Optimized Hub", baseColor: 'info.main', baseBg: 'info.50'};
        case 2: return { IconComponent: PriceCheckIcon, name: "Smart Market", baseColor: 'primary.main', baseBg: 'primary.50'};
        default: return { IconComponent: StorefrontIcon, name: "Spending District", baseColor: 'grey.500', baseBg: 'grey.100' };
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
    case 'high': return { statusIcon: ShoppingCartCheckoutIcon, statusColor: 'warning', label: 'Optimize!' };
    case 'optimized': return { statusIcon: ThumbUpAltOutlinedIcon, statusColor: 'success', label: 'Optimized' };
    default: return { statusIcon: null, statusColor: 'default', label: 'Status Idle' };
  }
};

// Accept level and hasOpportunity props
function SpendingDistrict({ status = 'idle', score = 50, level = 0, hasOpportunity = false }) {
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
   const statusBgTint = status === 'high' ? 'warning.light' : status === 'optimized' ? 'success.light' : baseBgColor;
   const finalBgColor = status !== 'idle' ? statusBgTint : baseBgColor;

   const opportunityText = hasOpportunity && level < 2 ? '- Blueprint Insight Available!' : ''; // Assuming MAX_LEVEL is 2
   const tooltipTitle = `Lvl ${level} ${levelInfo.name} (${statusLabel}) - Score: ${score} ${opportunityText}`;

   return (
    <Card
        variant="outlined"
        sx={{
            borderColor: finalBorderColor, bgcolor: finalBgColor, minWidth: '160px',
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
            sx={{ position: 'absolute', top: -8, right: -8, '& .MuiBadge-badge': { border: `2px solid ${finalBorderColor}`, padding: '0 4px', backgroundColor: finalBgColor } }}
          />
        )}
        {/* Opportunity Badge - Only show if opportunity exists AND district isn't max level */}
        {hasOpportunity && level < 2 && (
             <Badge
                badgeContent={<TipsAndUpdatesIcon sx={{ fontSize: '1.2rem' }} />}
                color="info"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ position: 'absolute', bottom: -10, right: -10, '& .MuiBadge-badge': { border: `2px solid info.main`, padding: '0 4px', backgroundColor: 'info.light', animation: 'glow 1.5s infinite alternate' } }}
             />
        )}
        {/* Keep keyframes needed for glow */}
        <style>{` @keyframes glow { 0% { box-shadow: 0 0 3px 1px #03a9f4; } 100% { box-shadow: 0 0 8px 3px #03a9f4; } } `}</style>

        <Tooltip title={tooltipTitle} placement="top">
            {/* Ensure CardContent exists */}
            <CardContent sx={{ pt: StatusIcon && status !== 'idle' ? 3 : 2 }}>
                <Stack spacing={1} alignItems="center">
                    <LevelIcon sx={{ fontSize: 48, color: levelInfo.baseColor, mb: 1 }} />
                    <Typography fontWeight="bold" variant="body1" color="text.primary"> {levelInfo.name} </Typography>
                    <Typography variant="caption" color="text.secondary"> Score: {score} | Lvl: {level} </Typography>
                </Stack>
            </CardContent>
        </Tooltip>
    </Card>
   );
}

export default SpendingDistrict;