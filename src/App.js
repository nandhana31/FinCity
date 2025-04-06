import React, { useState, useCallback, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Box from '@mui/material/Box'; // Import Box for background styling

// Import Components
import HUD from './components/HUD';
import CityDisplay from './components/CityDisplay';
import ControlPanel from './components/ControlPanel';

// --- CONFIGURATION ---
const ALPHA_VANTAGE_API_KEY = 'QDVC9IPDN38OPHNO'; // <-- PASTE YOUR KEY HERE
const NEGATIVE_KEYWORDS = ['loss', 'risk', 'down', 'warn', 'drop', 'fail', 'investigation', 'probe', 'slump', 'crisis', 'cut', 'layoff', 'scandal', 'halt', 'bankruptcy', 'closure', 'decline', 'downgrade', 'concern'];
// ---------------------

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  // --- STATE VARIABLES ---
  const [cityScore, setCityScore] = useState(60);
  const [investmentData, setInvestmentData] = useState({ status: 'idle', score: 50, lastCheckedTicker: '' });
  const [spendingData, setSpendingData] = useState({ status: 'idle', score: 50 });
  const [savingsData, setSavingsData] = useState({ status: 'idle', score: 50 });
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ---- NEW STATE ----
  const [blueprintCount, setBlueprintCount] = useState(0);
  const [hasSpendingOpportunity, setHasSpendingOpportunity] = useState(false);
  // ------------------

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // --- HELPER FUNCTIONS ---
  const addAlert = (message) => {
    setAlerts(prevAlerts => [...(prevAlerts || []), `${new Date().toLocaleTimeString()}: ${message}`].slice(-5));
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
      const invScore = investmentData.score;
      const spdScore = spendingData.score;
      const savScore = savingsData.score;
      const newOverallScore = Math.round((invScore + spdScore + savScore) / 3);
      if (newOverallScore !== cityScore) {
          setCityScore(newOverallScore);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investmentData.score, spendingData.score, savingsData.score]);

  // --- ACTION HANDLERS ---

  const handleCheckRisk = async (ticker) => {
    // ... (Keep the existing handleCheckRisk logic exactly the same as the previous version) ...
     if (!ticker) return;
     if (!ALPHA_VANTAGE_API_KEY || ALPHA_VANTAGE_API_KEY === 'YOUR_ALPHA_VANTAGE_KEY_HERE') {
         showSnackbar('Please add your Alpha Vantage key in App.js', 'error'); return;
     }
     setIsLoading(true); addAlert(`Checking risk for ${ticker} using Alpha Vantage...`);
     setInvestmentData(prev => ({ ...prev, status: 'idle', lastCheckedTicker: ticker }));
     try {
         const response = await axios.get(`https://www.alphavantage.co/query`, { params: { function: 'NEWS_SENTIMENT', tickers: ticker, apikey: ALPHA_VANTAGE_API_KEY, limit: 10 } });
         console.log("Alpha Vantage Response for", ticker, ":", response.data);
         let isRisky = false; let riskReason = `appears stable based on initial analysis for ${ticker}.`; let riskScoreChange = 15; let newStatus = 'healthy'; let foundRiskDetail = null;
         if (response.data && response.data.feed && response.data.feed.length > 0) {
             let cumulativeSentiment = 0; let relevantArticles = 0;
             for (const item of response.data.feed) {
                 const title = (item.title || '').toLowerCase(); const summary = (item.summary || '').toLowerCase(); let itemSentimentScore = null;
                 if (item.ticker_sentiment && item.ticker_sentiment.length > 0) {
                     const tickerSentiment = item.ticker_sentiment.find(ts => ts.ticker === ticker);
                     if (tickerSentiment && typeof tickerSentiment.ticker_sentiment_score !== 'undefined') { itemSentimentScore = parseFloat(tickerSentiment.ticker_sentiment_score); if (!isNaN(itemSentimentScore)) { cumulativeSentiment += itemSentimentScore; relevantArticles++; } }
                 }
                 if (itemSentimentScore !== null && itemSentimentScore < -0.15) { isRisky = true; newStatus = 'risky'; riskScoreChange = -25; foundRiskDetail = `Negative sentiment score (${itemSentimentScore.toFixed(2)}) detected. Title: ${item.title.substring(0, 100)}...`; break; }
                 else if (NEGATIVE_KEYWORDS.some(keyword => title.includes(keyword) || summary.includes(keyword))) { if (itemSentimentScore === null || itemSentimentScore <= 0.1) { isRisky = true; newStatus = 'risky'; riskScoreChange = -20; foundRiskDetail = `Negative keyword ("${NEGATIVE_KEYWORDS.find(keyword => title.includes(keyword) || summary.includes(keyword))}") found. Title: ${item.title.substring(0, 100)}...`; break; } }
             }
             if (!isRisky && relevantArticles > 0) { const avgSentiment = cumulativeSentiment / relevantArticles; riskReason = `Avg sentiment score: ${avgSentiment.toFixed(2)} across ${relevantArticles} articles.`; if (avgSentiment < -0.05) { newStatus = 'moderate'; riskScoreChange = -10; foundRiskDetail = riskReason; } else if (avgSentiment >= 0.15) { newStatus = 'healthy'; riskScoreChange = 15; } else { newStatus = 'healthy'; riskScoreChange = 5; } }
             else if (!isRisky) { riskReason = `No significant negative signals found for ${ticker}.`; newStatus = 'healthy'; riskScoreChange = 10; }
             else if (isRisky && foundRiskDetail) { riskReason = foundRiskDetail; }
         } else if (response.data.Information) { riskReason = `Could not fetch detailed news. API Info: ${response.data.Information}`; newStatus = 'idle'; riskScoreChange = 0; showSnackbar(riskReason, 'info'); addAlert(`API Info for ${ticker}: ${response.data.Information}`); }
         else { riskReason = `No recent news feed found for ${ticker} via Alpha Vantage.`; newStatus = 'idle'; riskScoreChange = 0; showSnackbar(riskReason, 'info'); }
         setInvestmentData(prev => ({ ...prev, status: newStatus, score: Math.max(0, Math.min(100, prev.score + riskScoreChange)) }));
         if (newStatus === 'risky' || newStatus === 'moderate') { addAlert(`Risk detected for ${ticker}: ${riskReason}`); showSnackbar(riskReason, (newStatus === 'risky' ? "error" : "warning")); }
         else if (newStatus === 'healthy') { addAlert(`${ticker} check complete: ${riskReason}`); showSnackbar(riskReason, "success"); }
     } catch (error) {
         console.error("API Error:", error); const errorMsg = "Could not fetch Alpha Vantage data. Check console."; addAlert(`Error checking risk for ${ticker} via Alpha Vantage.`);
         setInvestmentData(prev => ({ ...prev, status: 'idle', score: prev.score })); showSnackbar(errorMsg, "error");
     } finally { setIsLoading(false); }
  };

  // MODIFIED: Simulate High Spending - also trigger opportunity
  const handleSimulateSpending = () => {
    setSpendingData(prev => ({ status: 'high', score: Math.max(0, prev.score - 20) }));
    setHasSpendingOpportunity(true); // <<< SET OPPORTUNITY
    const msg = 'High spending detected! Opportunity for optimization available.';
    addAlert('High spending activity simulated. Blueprint Opportunity created!');
    showSnackbar(msg, 'warning');
  };

  // MODIFIED: Optimize Spending - consume opportunity, gain blueprint
  const handleOptimizeSpending = () => {
    let blueprintEarned = 0;
    // Only gain blueprint if there was an opportunity
    if(hasSpendingOpportunity) {
        blueprintEarned = 1;
        setBlueprintCount(prev => prev + 1);
        setHasSpendingOpportunity(false); // <<< CONSUME OPPORTUNITY
         showSnackbar("Optimization successful! +1 Blueprint earned.", 'success');
    } else {
         showSnackbar("Spending already optimized or no opportunity present.", 'info');
    }

    setSpendingData(prev => ({ status: 'optimized', score: Math.min(100, prev.score + 30) }));
    addAlert(`Spending optimization applied. ${blueprintEarned > 0 ? '+1 Blueprint.' : ''}`);
  };

   // MODIFIED: Log Savings - gain blueprint
  const handleLogSavings = () => {
      setSavingsData(prev =>({ status: 'growing', score: Math.min(100, prev.score + 25) }));
      setBlueprintCount(prev => prev + 1); // <<< ADD BLUEPRINT
      const msg = 'Savings goal progress logged! +1 Blueprint earned!';
      addAlert(msg);
      showSnackbar(msg, 'success');
  };

  // --- RENDER ---
  return (
    // Add a background to the whole page container for better contrast
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg" >
            <Stack spacing={3}>
                <Typography variant="h4" component="h1" color="primary.main" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
                FinCity Architect
                </Typography>
                <Typography variant="h6" component="h2" color="text.secondary" align="center" fontStyle="italic" >
                Build your financial future, brick by brick.
                </Typography>

                {/* Pass blueprintCount to HUD */}
                <HUD
                cityScore={cityScore}
                investmentScore={investmentData.score}
                spendingHealth={spendingData.score}
                savingsProgress={savingsData.score}
                alerts={alerts}
                blueprintCount={blueprintCount} // Pass blueprint count
                />

                {/* Pass hasSpendingOpportunity to CityDisplay */}
                <CityDisplay
                investmentData={investmentData}
                spendingData={spendingData}
                savingsData={savingsData}
                hasSpendingOpportunity={hasSpendingOpportunity} // Pass opportunity flag
                />

                <ControlPanel
                onCheckRisk={handleCheckRisk}
                onSimulateSpending={handleSimulateSpending}
                onLogSavings={handleLogSavings}
                onOptimizeSpending={handleOptimizeSpending}
                loading={isLoading}
                showSnackbar={showSnackbar}
                />

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </Stack>
        </Container>
    </Box>
  );
}

export default App;