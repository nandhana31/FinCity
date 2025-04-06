import React, { useState, useCallback, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import Box from '@mui/material/Box';
import ChatBot from './ChatBot.js'; // Ensure path is correct

// Import Components
import HUD from './components/HUD';
import CityDisplay from './components/CityDisplay';
import ControlPanel from './components/ControlPanel';

// --- CONFIGURATION ---
const ALPHA_VANTAGE_API_KEY = 'QDVC9IPDN38OPHNO'; // <-- ENSURE YOUR KEY IS HERE
const NEGATIVE_KEYWORDS = ['loss', 'risk', 'down', 'warn', 'drop', 'fail', 'investigation', 'probe', 'slump', 'crisis', 'cut', 'layoff', 'scandal', 'halt', 'bankruptcy', 'closure', 'decline', 'downgrade', 'concern'];
const UPGRADE_COST = 2;
const MAX_LEVEL = 2;
const LEVEL_SCORE_BOOST = 15;
const SAVINGS_TIPS = [
    "Tip: Aim for 3-6 months of expenses in an emergency fund!",
    "Tip: Automate savings transfers each payday!",
    "Tip: Consider high-yield savings accounts for better returns.",
];
const UPGRADE_TIPS = [
    "Tip: Diversifying income sources improves stability!",
    "Tip: Regularly reviewing investment allocations is key!",
    "Tip: Understanding expense ratios matters for investments!",
];
// Clamp helper
const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));
// ---------------------

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  // --- STATE ---
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
  // Note: hasSpendingOpportunity state doesn't seem used by handlers, included for consistency if needed later
  const [hasSpendingOpportunity, setHasSpendingOpportunity] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // --- HELPER FUNCTIONS ---
  const addAlert = useCallback((message) => {
    setAlerts(prevAlerts => [...(prevAlerts || []), `${new Date().toLocaleTimeString()}: ${message}`].slice(-5));
  }, []);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  // --- useEffect for overall score calculation ---
  useEffect(() => {
      const invScore = investmentData.score;
      // Invert spending score for calculation (lower is better)
      const spdScoreEffect = 100 - spendingData.score;
      const savScore = savingsData.score;
      // Adjust calculation - simple average for now
      const newOverallScore = clampScore((invScore + spdScoreEffect + savScore) / 3);

      if (newOverallScore !== cityScore) {
          console.log(`--- useEffect: Recalculating City Score. Prev: ${cityScore}, New: ${newOverallScore} (Based on Inv:${invScore}, Spd:${spendingData.score} -> Effect:${spdScoreEffect}, Sav:${savScore})`);
          setCityScore(newOverallScore);
      }
  // Update dependency array if cityScore logic changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investmentData.score, spendingData.score, savingsData.score]); // Removed cityScore to prevent loop


  // --- ACTION HANDLERS ---

  // --- Check Risk (Previously Fixed - Kept as is) ---
  const handleCheckRisk = useCallback(async (ticker) => {
     console.log(`--- handleCheckRisk CALLED with ticker: '${ticker}' ---`);
     if (!ticker) { console.log("handleCheckRisk: Exiting, no ticker."); return; }
     if (!ALPHA_VANTAGE_API_KEY || ALPHA_VANTAGE_API_KEY === '0GH4IGVG6VP8KFRG' || ALPHA_VANTAGE_API_KEY.length < 5) {
         console.log("handleCheckRisk: Exiting, API key missing or invalid placeholder.");
         showSnackbar('API Key Missing/Invalid. Please configure in App.js', 'error'); return;
     }
     console.log("handleCheckRisk: Setting isLoading to true");
     setIsLoading(true);
     addAlert(`🔍 Detective scanning news for ${ticker}...`);
     setInvestmentData(prev => ({ ...prev, status: 'idle', lastCheckedTicker: ticker }));
     try {
         console.log(`handleCheckRisk: Making API call to Alpha Vantage for ${ticker}...`);
         const response = await axios.get(`https://www.alphavantage.co/query`, { params: { function: 'NEWS_SENTIMENT', tickers: ticker, apikey: ALPHA_VANTAGE_API_KEY, limit: 10 } });
         console.log(">>> Alpha Vantage Response:", response.data);

         let isRisky = false; let riskReason = `Initial scan for ${ticker} appears stable.`; let newStatus = 'healthy'; let foundRiskDetail = null; let riskScoreChange = 0;

         if (response.data && response.data.feed && response.data.feed.length > 0) {
             let cumulativeSentiment = 0; let relevantArticles = 0;
             for (const item of response.data.feed) {
                 const title = (item.title || '').toLowerCase(); const summary = (item.summary || '').toLowerCase(); let itemSentimentScore = null;
                 if (item.ticker_sentiment && item.ticker_sentiment.length > 0) { const tickerSentiment = item.ticker_sentiment.find(ts => ts.ticker === ticker); if (tickerSentiment && typeof tickerSentiment.ticker_sentiment_score !== 'undefined') { itemSentimentScore = parseFloat(tickerSentiment.ticker_sentiment_score); if (!isNaN(itemSentimentScore)) { cumulativeSentiment += itemSentimentScore; relevantArticles++; } } }
                 if (itemSentimentScore !== null && itemSentimentScore < -0.20) { isRisky = true; newStatus = 'risky'; foundRiskDetail = `Sentiment Alert! Low score (${itemSentimentScore.toFixed(2)}). Ref: "${item.title.substring(0, 70)}..."`; break; }
                 else if (NEGATIVE_KEYWORDS.some(keyword => title.includes(keyword) || summary.includes(keyword))) { if(itemSentimentScore === null || itemSentimentScore <= 0.15) { isRisky = true; newStatus = 'risky'; const foundKeyword = NEGATIVE_KEYWORDS.find(keyword => title.includes(keyword) || summary.includes(keyword)); foundRiskDetail = `Risk Signal: Keyword '${foundKeyword}' detected. Ref: "${item.title.substring(0, 70)}..."`; break; } }
             }
             if (!isRisky && relevantArticles > 0) { const avgSentiment = cumulativeSentiment / relevantArticles; riskReason = `Analysis: Avg sentiment ${avgSentiment.toFixed(2)} (${relevantArticles} articles).`; if (avgSentiment < -0.05) { newStatus = 'moderate'; foundRiskDetail = `Caution: ${riskReason}`; } else { newStatus = 'healthy'; } }
             else if (!isRisky) { riskReason = `Analysis: No significant negative signals found for ${ticker}.`; newStatus = 'healthy'; }
             else if (isRisky && foundRiskDetail) { riskReason = foundRiskDetail; }
             console.log(`handleCheckRisk: Processing complete. Determined Status: ${newStatus}, Risk Reason: ${riskReason}`);
         } else if (response.data.Information) {
             console.log(">>> handleCheckRisk: API Info message detected.");
             riskReason = `API Info: ${response.data.Information}`; newStatus = 'idle'; riskScoreChange = 0;
             showSnackbar(riskReason, 'info'); addAlert(`API Info for ${ticker}: ${response.data.Information}`);
         } else {
             console.log(">>> handleCheckRisk: No feed data found.");
             riskReason = `No recent news feed found for ${ticker}.`; newStatus = 'idle'; riskScoreChange = 0;
             showSnackbar(riskReason, 'info');
         }
         console.log(`handleCheckRisk: Status before score calc: ${newStatus}`);
         if (newStatus !== 'idle') {
             if (newStatus === 'risky') { riskScoreChange = -20 - (investmentLevel * 5); }
             else if (newStatus === 'moderate') { riskScoreChange = -10 - (investmentLevel * 2); }
             else if (newStatus === 'healthy') { riskScoreChange = 5 + (investmentLevel * 2); }
         }
         console.log(`handleCheckRisk: Calculated riskScoreChange: ${riskScoreChange}`);
         setInvestmentData(prev => {
             const newScore = clampScore(prev.score + riskScoreChange);
             console.log(`handleCheckRisk: Updating investment state: Prev Score=${prev.score}, Change=${riskScoreChange}, New Score=${newScore}, New Status=${newStatus}`);
             if (prev.status !== newStatus || prev.score !== newScore) {
                 return { ...prev, status: newStatus, score: newScore };
             }
             return prev;
         });
         if (newStatus !== 'idle' && !response.data?.Information) {
            if (newStatus === 'risky' || newStatus === 'moderate') {
                 addAlert(`🚨 Risk Alert (${ticker}): ${riskReason}`);
                 showSnackbar(riskReason, (newStatus === 'risky' ? "error" : "warning"));
             } else if (newStatus === 'healthy') {
                 addAlert(`✅ Analysis Complete (${ticker}): ${riskReason}`);
                 showSnackbar(riskReason, "success");
             }
         }
     } catch (error) {
         console.error("!!! handleCheckRisk CATCH BLOCK ERROR:", error);
         const errorMsg = "Could not fetch Alpha Vantage data. Check console/API Key.";
         addAlert(`Error checking risk for ${ticker}.`);
         setInvestmentData(prev => ({ ...prev, status: 'idle', score: prev.score }));
         showSnackbar(errorMsg, "error");
     } finally {
         console.log("--- handleCheckRisk: Setting isLoading to false in finally block. ---");
         setIsLoading(false);
     }
  }, [investmentLevel, showSnackbar, addAlert]); // Added investmentLevel dependency


  // --- Simulate High Spending ---
  const handleSimulateSpending = useCallback(() => {
    console.log("--- handleSimulateSpending CALLED ---");
    const increaseAmount = 15 + (spendingLevel * 5); // Higher level, bigger impact
    const newSpendScore = clampScore(spendingData.score + increaseAmount);
    const savePenalty = 5; // High spending slightly impacts savings
    const newSaveScore = clampScore(savingsData.score - savePenalty);

    console.log(`Simulate Spending: Spend Score ${spendingData.score} -> ${newSaveScore}. Save Score ${savingsData.score} -> ${newSaveScore}`);

    setSpendingData(prev => ({ ...prev, score: newSpendScore }));
    setSavingsData(prev => ({ ...prev, score: newSaveScore }));

    addAlert("💸 Simulated a period of high spending.");
    showSnackbar("Spending habits worsened, impacting savings slightly.", "warning");

  }, [spendingLevel, spendingData.score, savingsData.score, addAlert, showSnackbar]); // Added dependencies


  // --- Optimize Spending ---
  const handleOptimizeSpending = useCallback(() => {
    console.log("--- handleOptimizeSpending CALLED ---");
    // Removed dependency/check on hasSpendingOpportunity for simplicity now
    const decreaseAmount = 10 + (spendingLevel * 3); // Higher level, better optimization
    const newSpendScore = clampScore(spendingData.score - decreaseAmount);
    const blueprintReward = 1; // Reward optimization

    console.log(`Optimize Spending: Spend Score ${spendingData.score} -> ${newSpendScore}. Blueprints +${blueprintReward}`);

    setSpendingData(prev => ({ ...prev, score: newSpendScore }));
    setBlueprintCount(prev => prev + blueprintReward);

    addAlert("💡 Optimized spending habits!");
    showSnackbar(`Spending optimized! Gained ${blueprintReward} blueprint.`, "success");
    // Maybe reset hasSpendingOpportunity if you use it: setHasSpendingOpportunity(false);

  }, [spendingLevel, spendingData.score, blueprintCount, addAlert, showSnackbar]); // Added dependencies


  // --- Simulate Fee Found ---
  const handleSimulateFeeFound = useCallback(() => {
    console.log("--- handleSimulateFeeFound CALLED ---");
    const feeImpactReduction = 5 + (spendingLevel * 2); // Higher level, better at reducing fee impact
    const newSpendScore = clampScore(spendingData.score - feeImpactReduction);
    const saveBoost = 3; // Finding fees nudges savings awareness
    const newSaveScore = clampScore(savingsData.score + saveBoost);

    console.log(`Fee Found: Spend Score ${spendingData.score} -> ${newSpendScore}. Save Score ${savingsData.score} -> ${newSaveScore}`);

    setSpendingData(prev => ({ ...prev, score: newSpendScore }));
    setSavingsData(prev => ({...prev, score: newSaveScore}));

    addAlert("⚠️ Simulated finding an unnecessary fee.");
    showSnackbar("Fee found and addressed, improving spending score.", "info");

  }, [spendingLevel, spendingData.score, savingsData.score, addAlert, showSnackbar]); // Added dependencies


  // --- Log Savings ---
  const handleLogSavings = useCallback(() => {
    console.log("--- handleLogSavings CALLED ---");
    const boostAmount = 10 + (savingsLevel * 5); // Higher level, bigger boost
    const newSaveScore = clampScore(savingsData.score + boostAmount);

    console.log(`Log Savings: Save Score ${savingsData.score} -> ${newSaveScore}`);

    setSavingsData(prev => ({ ...prev, score: newSaveScore }));

    const randomTip = SAVINGS_TIPS[Math.floor(Math.random() * SAVINGS_TIPS.length)];
    addAlert("💰 Savings logged successfully!");
    showSnackbar(randomTip, "success");

  }, [savingsLevel, savingsData.score, addAlert, showSnackbar]); // Added dependencies


  // --- Upgrade District ---
  const handleUpgradeDistrict = useCallback((district) => {
    console.log(`--- handleUpgradeDistrict CALLED for: ${district} ---`);
    let currentLevel, setLevel, setData, currentScore;

    // Determine which district to upgrade
    if (district === 'investment') {
        currentLevel = investmentLevel; setLevel = setInvestmentLevel; setData = setInvestmentData; currentScore = investmentData.score;
    } else if (district === 'spending') {
        currentLevel = spendingLevel; setLevel = setSpendingLevel; setData = setSpendingData; currentScore = spendingData.score;
    } else if (district === 'savings') {
        currentLevel = savingsLevel; setLevel = setSavingsLevel; setData = setSavingsData; currentScore = savingsData.score;
    } else {
        console.error("Upgrade Error: Invalid district provided:", district);
        return;
    }

    // Check conditions
    if (blueprintCount < UPGRADE_COST) {
        console.log(`Upgrade Failed: Not enough blueprints (${blueprintCount}/${UPGRADE_COST})`);
        showSnackbar(`Need ${UPGRADE_COST} blueprints to upgrade ${district} (Have ${blueprintCount})`, "error");
        return;
    }
    if (currentLevel >= MAX_LEVEL) {
        console.log(`Upgrade Failed: ${district} already at max level (${MAX_LEVEL})`);
        showSnackbar(`${district.charAt(0).toUpperCase() + district.slice(1)} district is already at max level!`, "info");
        return;
    }

    // Perform Upgrade
    const newLevel = currentLevel + 1;
    const newScore = clampScore(currentScore + LEVEL_SCORE_BOOST);
    const newBlueprintCount = blueprintCount - UPGRADE_COST;

    console.log(`Upgrading ${district}: Level ${currentLevel} -> ${newLevel}. Score ${currentScore} -> ${newScore}. Blueprints ${blueprintCount} -> ${newBlueprintCount}`);

    setLevel(newLevel); // Update level state
    setData(prev => ({ ...prev, score: newScore })); // Update score state
    setBlueprintCount(newBlueprintCount); // Update blueprint count

    const randomTip = UPGRADE_TIPS[Math.floor(Math.random() * UPGRADE_TIPS.length)];
    addAlert(`🚀 ${district.charAt(0).toUpperCase() + district.slice(1)} district upgraded to Level ${newLevel}!`);
    showSnackbar(`${district.charAt(0).toUpperCase() + district.slice(1)} upgraded! ${randomTip}`, "success");

  }, [
      blueprintCount, investmentLevel, spendingLevel, savingsLevel,
      investmentData.score, spendingData.score, savingsData.score, // Need scores for boost calculation
      showSnackbar, addAlert // Helper functions
  ]); // Added dependencies


  // --- RENDER ---
  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg" >
            <Stack spacing={3}>
                 {/* Header */}
                 <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }} align="center" gutterBottom> FinCity Architect </Typography>
                 <Typography variant="h6" component="h2" color="text.secondary" align="center" fontStyle="italic" > Build your financial future, brick by brick. </Typography>

                {/* Pass all necessary props */}
                <HUD
                    cityScore={cityScore}
                    investmentScore={investmentData.score}
                    spendingHealth={spendingData.score} // Pass the score directly
                    savingsProgress={savingsData.score} // Pass the score directly
                    alerts={alerts}
                    blueprintCount={blueprintCount}
                    investmentLevel={investmentLevel}
                    spendingLevel={spendingLevel}
                    savingsLevel={savingsLevel}
                />
                <CityDisplay
                    investmentData={{...investmentData, level: investmentLevel}}
                    spendingData={{...spendingData, level: spendingLevel}}
                    savingsData={{...savingsData, level: savingsLevel}}
                    hasSpendingOpportunity={hasSpendingOpportunity} // Pass state if needed by CityDisplay
                />
                <ControlPanel
                    onCheckRisk={handleCheckRisk}
                    onSimulateSpending={handleSimulateSpending} // Pass correct handler
                    onSimulateFeeFound={handleSimulateFeeFound} // Pass correct handler
                    onLogSavings={handleLogSavings} // Pass correct handler
                    onOptimizeSpending={handleOptimizeSpending} // Pass correct handler
                    onUpgrade={handleUpgradeDistrict} // Pass correct handler
                    loading={isLoading}
                    showSnackbar={showSnackbar} // Pass helper if ControlPanel needs it directly (optional)
                    blueprintCount={blueprintCount}
                    investmentLevel={investmentLevel}
                    spendingLevel={spendingLevel}
                    savingsLevel={savingsLevel}
                    upgradeCost={UPGRADE_COST}
                    maxLevel={MAX_LEVEL}
                />
                {/* Make sure ChatBot path is correct and component works */}
                <ChatBot />

                 {/* Snackbar */}
                 <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                     <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}> {snackbarMessage} </Alert>
                 </Snackbar>
            </Stack>
        </Container>
    </Box>
  );
}

export default App;