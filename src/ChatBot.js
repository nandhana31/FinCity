// src/ChatBot.js
import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([{ sender: 'bot', text: "Hi! Ask me about your FinCity finances." }]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // Q&A sets
  const qaSets = [
    { keywords: ["stability score", "overall stability"], answer: "Your overall city stability score represents the combined health of your Investments, Spending, and Savings segments. A higher score means your finances are managed more safely." },
    { keywords: ["improve investments", "investment district"], answer: "To improve your Investments District, diversify your portfolio and reduce exposure to volatile assets by staying updated on market trends using the 'Check Risk' feature." },
    { keywords: ["tech stocks", "tech risk"], answer: "Tech stocks can be volatile due to rapid industry changes and market sentiment. Balancing them with more stable investments can help reduce your risk." },
    { keywords: ["optimize spending", "spending"], answer: "Optimizing spending means cutting unnecessary expenses (like unused subscriptions detected by the app) and using the earned Blueprints to upgrade your Spending Hub." },
    { keywords: ["innovation blueprint", "blueprint", "earn blueprints"], answer: "Innovation Blueprints are rewards earned for smart financial actions like logging savings or optimizing spending when an opportunity arises. Use them to upgrade your city districts!" },
    { keywords: ["diversification", "diversify"], answer: "Diversification means spreading your investments across various asset classes (stocks, REITs, etc.) to minimize the impact of any single investment's poor performance." },
    { keywords: ["high spending", "spending too high"], answer: "High spending can be simulated here, but in a full version, the app would analyze transactions. Reduce recurring expenses to improve your Spending Health score." },
    { keywords: ["risk ticker", "alerts"], answer: "Use the 'Check Risk' feature with a stock or REIT ticker. The app analyzes news sentiment via Alpha Vantage to provide alerts on potential risks affecting your Investment District." },
    { keywords: ["reduce risk", "lower risk"], answer: "To reduce investment risk, use the 'Check Risk' tool regularly, consider diversifying (add different tickers!), and potentially upgrade your Investment District with Blueprints." },
    { keywords: ["emergency fund", "emergency"], answer: "An emergency fund (represented by upgrading your Savings District) acts as a safety net for unexpected expenses, boosting stability." },
    { keywords: ["budget", "plan"], answer: "Budgeting involves planning income and expenses. While not fully implemented here, optimizing spending reflects good budgeting." },
    { keywords: ["high risk", "risk score"], answer: "A low Investment Risk score (or a red/orange district) indicates vulnerability. Analyze the alerts and consider diversifying or adjusting your holdings." },
    { keywords: ["monitor market", "market sentiment"], answer: "Use the 'Check Risk' button. It fetches real-time news sentiment data from Alpha Vantage to help you monitor the market's mood towards your investments." }, // <-- Your query should match this
    { keywords: ["optimize spending benefits", "benefits of optimizing spending"], answer: "Optimizing spending improves your Spending score, Overall Stability, and earns Blueprints for city upgrades – a win-win!" },
    { keywords: ["financial literacy", "improve financial literacy"], answer: "FinCity Architect helps you learn by doing! Seeing how actions affect your city, reading tips, and understanding risk alerts improves your financial know-how." },
    { keywords: ["upgrade", "city development"], answer: "You can upgrade your Investment, Spending, or Savings districts using Blueprints earned from positive actions. Upgrades improve the base score and visual look of the district!"},
    { keywords: ["how it works", "what does this app do"], answer: "FinCity Architect gamifies finance! Check investment risks (CBRE focus), simulate optimizing spending/savings based on insights (Capital One focus), earn Blueprints, and upgrade your virtual city reflecting your financial health." },
    { keywords: ["hello", "hi", "help"], answer: "Hello! I'm FinBot. Ask me about your city scores, districts, blueprints, risks, or general financial concepts like budgeting or diversification."}
  ];

  // *** FIX: Added the actual function logic back ***
  const findAnswer = (userMsg) => {
    const lowerMsg = userMsg.toLowerCase();
    for (let i = 0; i < qaSets.length; i++) {
      const { keywords, answer } = qaSets[i];
      // Check if any keyword in the set is included in the user's message
      if (keywords.some(keyword => lowerMsg.includes(keyword.toLowerCase()))) { // Also ensure keywords are checked case-insensitively
        return answer;
      }
    }
    // Default response if no keywords match
    return "I'm not sure how to answer that. Try asking about stability scores, blueprints, risk checks, upgrades, or financial tips.";
  };
  // *** END FIX ***

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMessage = message;
    setChatLog(prev => [...prev, { sender: 'user', text: userMessage }]);
    const response = findAnswer(userMessage); // This will now return a string
    setTimeout(() => {
        // Ensure response is valid before adding
        if (response) {
             setChatLog(prev => [...prev, { sender: 'bot', text: response }]);
        } else {
            // Fallback if findAnswer somehow still fails (shouldn't with default)
             setChatLog(prev => [...prev, { sender: 'bot', text: "Sorry, I encountered an issue finding an answer." }]);
        }
    }, 300);
    setMessage('');
  };

  return (
    <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom align="center">FinBot Assistant</Typography>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, height: '250px', overflowY: 'auto', mb: 1.5, bgcolor: 'grey.50' }}>
        <Stack spacing={1.5}>
            {chatLog.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: entry.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper elevation={1} sx={{ p: 1, bgcolor: entry.sender === 'user' ? 'primary.light' : 'background.paper', maxWidth: '75%', borderRadius: entry.sender === 'user' ? '10px 10px 0 10px' : '10px 10px 10px 0', }}>
                    <Typography variant="body2">{entry.text}</Typography>
                </Paper>
            </Box>
            ))}
            <div ref={chatEndRef} />
        </Stack>
      </Box>
      <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex' }}>
        <TextField fullWidth size="small" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask FinBot..." sx={{ mr: 1 }} />
        <Button type="submit" variant="contained" endIcon={<SendIcon />}> Send </Button>
      </Box>
    </Paper>
  );
}

export default ChatBot;