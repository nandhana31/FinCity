import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge'; // Import Badge
// MUI Icons
import StorefrontIcon from '@mui/icons-material/Storefront'; // Main icon for spending
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PaymentsIcon from '@mui/icons-material/Payments';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'; // Blueprint/Opportunity Icon

const getDistrictStyle = (status) => {
   switch (status) {
    case 'high': // High spending, needs optimization
      return { bgcolor: 'rgba(255, 167, 38, 0.1)', borderColor: 'warning.main', IconComponent: StorefrontIcon, iconColor: 'warning.dark', label: 'Spending Needs Optimization', statusIcon: ShoppingCartCheckoutIcon, statusColor: 'warning' };
    case 'optimized': // Spending is healthy
      return { bgcolor: 'rgba(102, 187, 106, 0.1)', borderColor: 'success.main', IconComponent: StorefrontIcon, iconColor: 'success.dark', label: 'Spending Optimized', statusIcon: ThumbUpAltOutlinedIcon, statusColor: 'success' };
    default: // Default / idle state
      return { bgcolor: 'grey.200', borderColor: 'grey.400', IconComponent: PaymentsIcon, iconColor: 'text.secondary', label: 'Spending Overview', statusIcon: null, statusColor: 'default' };
  }
};

// Accept hasOpportunity prop
function SpendingDistrict({ status = 'idle', score = 50, hasOpportunity }) {
   const style = getDistrictStyle(status);
   const { IconComponent, statusIcon: StatusIcon } = style;

   return (
    <Card
        variant="outlined"
        sx={{
          borderColor: style.borderColor,
          bgcolor: style.bgcolor,
          minWidth: '160px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'visible',
           boxShadow: 3,
           transition: 'all 0.3s ease-in-out',
           '&:hover': {
               transform: 'translateY(-3px)',
               boxShadow: 6,
           }
        }}
      >
        {/* Status Badge */}
        {StatusIcon && (
          <Badge
            badgeContent={<StatusIcon sx={{ fontSize: '1rem' }} />}
            color={style.statusColor}
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
            sx={{ position: 'absolute', top: -8, right: -8, '& .MuiBadge-badge': { border: `2px solid ${style.borderColor}`, padding: '0 4px', backgroundColor: style.bgcolor } }}
          />
        )}
        {/* Opportunity Badge - Conditionally render based on prop */}
        {hasOpportunity && (
             <Badge
                badgeContent={<TipsAndUpdatesIcon sx={{ fontSize: '1.2rem' }} />} // Blueprint Icon
                color="info" // Use info color for opportunities
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                sx={{ position: 'absolute', bottom: -10, right: -10, '& .MuiBadge-badge': { border: `2px solid info.main`, padding: '0 4px', backgroundColor: 'info.light', animation: 'glow 1.5s infinite alternate' } }}
             />
        )}
         {/* Keyframes for glowing effect - add globally or in index.css */}
         <style>{`
            @keyframes glow {
                0% { box-shadow: 0 0 3px 1px #03a9f4; } /* Light blue glow */
                100% { box-shadow: 0 0 8px 3px #03a9f4; }
            }
        `}</style>
        <Tooltip title={`${style.label} (Score: ${score}) ${hasOpportunity ? '- Opportunity Available!' : ''}`} placement="top">
            <CardContent>
            <Stack spacing={1} alignItems="center">
                <IconComponent sx={{ fontSize: 48, color: style.iconColor, mb: 1 }} />
                <Typography fontWeight="bold" variant="body1" color="text.primary">
                Spending
                </Typography>
                 <Typography variant="caption" color="text.secondary">
                    Score: {score}
                </Typography>
            </Stack>
            </CardContent>
        </Tooltip>
    </Card>
   );
}

export default SpendingDistrict;