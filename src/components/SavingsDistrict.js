import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
// MUI Icons
import SavingsIcon from '@mui/icons-material/Savings'; // Main icon
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const getDistrictStyle = (status) => {
   switch (status) {
    case 'growing':
      return { bgcolor: 'rgba(3, 169, 244, 0.1)', borderColor: 'info.main', IconComponent: SavingsIcon, iconColor: 'info.dark', label: 'Savings Growing!', statusIcon: EnergySavingsLeafIcon, statusColor: 'info' };
    case 'stable':
       return { bgcolor: 'rgba(102, 187, 106, 0.1)', borderColor: 'success.main', IconComponent: SavingsIcon, iconColor: 'success.dark', label: 'Savings Stable', statusIcon: AccountBalanceIcon, statusColor: 'success' };
    default:
      return { bgcolor: 'grey.200', borderColor: 'grey.400', IconComponent: SavingsIcon, iconColor: 'text.secondary', label: 'Savings Overview', statusIcon: null, statusColor: 'default' };
  }
};

function SavingsDistrict({ status = 'idle', score = 50 }) {
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
        <Tooltip title={`${style.label} (Score: ${score})`} placement="top">
             <CardContent>
                <Stack spacing={1} alignItems="center">
                    <IconComponent sx={{ fontSize: 48, color: style.iconColor, mb: 1 }} />
                    <Typography fontWeight="bold" variant="body1" color="text.primary">
                    Savings
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

export default SavingsDistrict;