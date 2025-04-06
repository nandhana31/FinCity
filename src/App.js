import React, { useState, useCallback, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Box from '@mui/material/Box';

// Import Components
import HUD from './components/HUD';
import CityDisplay from './components/CityDisplay';
import ControlPanel from './components/ControlPanel';
import ChatBot from './ChatBot'; // <-- *** IMPORT CHATBOT ***

// --- CONFIGURATION ---
const ALPHA_VANTAGE_API_KEY = 'QDVC9IPDN38OPHNO'; // Use your actual key
const NEGATIVE_KEYWORDS = ['loss', 'risk', 'down', 'warn', 'drop', 'fail', 'investigation', 'probe', 'slump', 'crisis', 'cut', 'layoff', 'scandal', 'halt', 'bankruptcy', 'closure', 'decline', 'downgrade', 'concern'];
const UPGRADE_COST = 2;
const MAX_LEVEL = 2;
const LEVEL_SCORE_BOOST = 15;
const SAVINGS_TIPS = [ /* Your tips arrays */ ];
const UPGRADE_TIPS = [ /* Your tips arrays */ ];
// ---------------------

const Alert = React.forwardRef(function Alert(props, ref) { /* Keep Alert */ });

function App() {
  // --- STATE (Keep all existing state) ---
  const [cityScore, setCityScore] = useState(60);
  const [investmentData, setInvestmentData] = useState({ status: 'idle', score: 50, lastCheckedTicker: '' });
  const [spendingData, setSpendingData] = useState({ status: 'idle', score: 50 });
  const [savingsData, setSavingsData] = useState({ status: 'idle', score: 50 });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [investmentLevel, setInvestmentLevel] = useState(0);
  const [spendingLevel, setSpendingLevel] = useState(0);
  const [savingsLevel, setSavingsLevel] = useState(0);
  const [blueprintCount, setBlueprintCount] = useState(1);
  const [hasSpendingOpportunity, setHasSpendingOpportunity] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // --- HELPER FUNCTIONS (Keep existing helpers + useCallback wrappers) ---
  const addAlert = useCallback((message) => { /* ... */ }, []);
  const showSnackbar = useCallback((message, severity = 'info') => { /* ... */ }, []);
  const handleSnackbarClose = useCallback((event, reason) => { /* ... */ }, []);
  useEffect(() => { /* ... Keep score calculation effect ... */ });


  // --- ACTION HANDLERS (Keep existing handlers + useCallback wrappers) ---
  const handleCheckRisk = useCallback(async (ticker) => { /* ... Keep full logic ... */ }, [investmentLevel, showSnackbar, addAlert]);
  const handleSimulateSpending = useCallback(() => { /* ... Keep full logic ... */ }, [spendingLevel, showSnackbar, addAlert]);
  const handleOptimizeSpending = useCallback(() => { /* ... Keep full logic ... */ }, [hasSpendingOpportunity, showSnackbar, addAlert]);
  const handleSimulateFeeFound = useCallback(() => { /* ... Keep full logic ... */ }, [spendingLevel, showSnackbar, addAlert]);
  const handleLogSavings = useCallback(() => { /* ... Keep full logic ... */ }, [showSnackbar, addAlert]);
  const handleUpgradeDistrict = useCallback((district) => { /* ... Keep full logic ... */ }, [blueprintCount, investmentLevel, spendingLevel, savingsLevel, showSnackbar, addAlert]);


  // --- RENDER ---
  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg" >
            {/* Use main Stack for overall layout */}
            <Stack spacing={3}>
                {/* --- Top Section: Titles, HUD, City --- */}
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }} align="center" gutterBottom> FinCity Architect </Typography>
                <Typography variant="h6" component="h2" color="text.secondary" align="center" fontStyle="italic" > Build your financial future, brick by brick. </Typography>
                <HUD
                    cityScore={cityScore} investmentScore={investmentData.score} spendingHealth={spendingData.score} savingsProgress={savingsData.score}
                    alerts={alerts} blueprintCount={blueprintCount} investmentLevel={investmentLevel} spendingLevel={spendingLevel} savingsLevel={savingsLevel}
                />
                <CityDisplay
                    investmentData={{...investmentData, level: investmentLevel}} spendingData={{...spendingData, level: spendingLevel}} savingsData={{...savingsData, level: savingsLevel}}
                    hasSpendingOpportunity={hasSpendingOpportunity}
                 />

                {/* --- Middle Section: Controls --- */}
                <ControlPanel
                    onCheckRisk={handleCheckRisk} onSimulateSpending={handleSimulateSpending} onSimulateFeeFound={handleSimulateFeeFound} onLogSavings={handleLogSavings} onOptimizeSpending={handleOptimizeSpending}
                    loading={isLoading} showSnackbar={showSnackbar} blueprintCount={blueprintCount} investmentLevel={investmentLevel} spendingLevel={spendingLevel} savingsLevel={savingsLevel}
                    onUpgrade={handleUpgradeDistrict} upgradeCost={UPGRADE_COST} maxLevel={MAX_LEVEL}
                />

                {/* --- Bottom Section: ChatBot --- */}
                <ChatBot /> {/* <-- *** RENDER CHATBOT HERE *** */}


                {/* Snackbar stays at the end (doesn't affect layout) */}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}> {snackbarMessage} </Alert>
                </Snackbar>

            </Stack> {/* End of main Stack */}
        </Container>
    </Box>
  );
}

export default App;