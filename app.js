// app.js
console.log('=== App Starting ===');
console.log('Current directory:', __dirname);
console.log('Process env:', process.env.NODE_ENV, process.env.PASSENGER_APP_ENV);

const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`Running in ${config.isProduction ? 'production' : 'development'} mode`);
console.log(`Using base URL: ${config.baseUrl}`);

// Serve static files
app.use(config.baseUrl, express.static(path.join(__dirname, 'public')));

// Main page
app.get(config.baseUrl + '/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SSE endpoint
app.get(config.baseUrl + '/stream', (req, res) => {
    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({message: "Connected!"})}\n\n`);

    let count = 0;
    const maxCount = 20;

    // Send updates every second
    const interval = setInterval(() => {
        count++;
        const data = {
            count,
            message: `Update ${count}`,
            time: new Date().toLocaleTimeString()
        };
        
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        if (count >= maxCount) {
            res.write(`data: ${JSON.stringify({message: "Stream complete"})}\n\n`);
            clearInterval(interval);
            res.end();
        }
    }, 1000);

    // Handle client disconnect
    req.on('close', () => {
        clearInterval(interval);
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`App available at ${config.baseUrl || '/'}`);
});

// Export for Passenger
if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}
module.exports = server;