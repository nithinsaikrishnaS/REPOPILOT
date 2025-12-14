const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('<h1>Repopilot Agent is Running 🤖</h1><p>Please access the Web App at <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

// Health Check
app.get('/status', (req, res) => {
    res.json({ status: 'ok', message: 'Repopilot Agent is running' });
});

app.listen(PORT, () => {
    console.log(`Repopilot Local Agent running at http://localhost:${PORT}`);
});
