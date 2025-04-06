import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge'; // Import Badge
// MUI Icons
import BusinessIcon from '@mui/icons-material/Business'; // Main icon for investments
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudQueueIcon from '@mui/icons-material/CloudQueue'; // Moderate risk / smog

const getDistrictStyle = (status) => {
  switch (status) {
    case 'risky':
      return { bgcolor: 'rgba(239, 83, 80, 0.1)', borderColor: 'error.main', IconComponent: BusinessIcon, iconColor: 'error.dark', label: 'High Risk Detected!', statusIcon: WarningAmberIcon, statusColor: 'error' };
    case 'moderate':
      return { bgcolor: 'rgba(255, 167, 38, 0.1)', borderColor: 'warning.main', IconComponent: BusinessIcon, iconColor: 'warning.dark', label: 'Moderate Risk / Needs Attention', statusIcon: CloudQueueIcon, statusColor: 'warning' };
    case 'healthy':
      return { bgcolor: 'rgba(102, 187, 106, 0.1)', borderColor: 'success.main', IconComponent: BusinessIcon, iconColor: 'success.dark', label: 'Stable Investments', statusIcon: CheckCircleOutlineIcon, statusColor: 'success' };
    default:
      return { bgcolor: 'grey.200', borderColor: 'grey.400', IconComponent: ShowChartIcon, iconColor: 'text.secondary', label: 'Awaiting Data', statusIcon: null, statusColor: 'default' };
  }
};

function InvestmentDistrict({ status = 'idle', score = 50 }) {
  const style = getDistrictStyle(status);
  const { IconComponent, statusIcon: StatusIcon } = style; // Destructure icon components

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: style.borderColor,
        bgcolor: style.bgcolor,
        minWidth: '160px', // Slightly wider
        textAlign: 'center',
        position: 'relative', // Needed for Badge positioning
        overflow: 'visible', // Allow badge to overlap border slightly
         boxShadow: 3, // Add some shadow
         transition: 'all 0.3s ease-in-out',
         '&:hover': {
             transform: 'translateY(-3px)',
             boxShadow: 6,
         }
      }}
    >
      {/* Status Badge - conditionally rendered */}
      {StatusIcon && (
        <Badge
          badgeContent={<StatusIcon sx={{ fontSize: '1rem' }} />} // Smaller icon in badge
          color={style.statusColor}
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
              position: 'absolute',
              top: -8, // Adjust position
              right: -8,
              '& .MuiBadge-badge': { // Style the badge itself
                border: `2px solid ${style.borderColor}`,
                padding: '0 4px',
                backgroundColor: style.bgcolor // Match card background slightly
              }
           }}
        />
      )}
      <Tooltip title={`${style.label} (Score: ${score})`} placement="top">
        <CardContent>
          <Stack spacing={1} alignItems="center">
            <IconComponent sx={{ fontSize: 48, color: style.iconColor, mb: 1 }} /> {/* Larger main icon */}
            <Typography fontWeight="bold" variant="body1" color="text.primary">
              Investments
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

export default InvestmentDistrict;