// config.js
const fs = require('fs');
const path = require('path');
const os = require('os');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    fs.appendFileSync(path.join(__dirname, 'debug.log'), logMessage);
}

log('=== Config Loading ===');
log(`Hostname: ${os.hostname()}`);
log(`Current directory: ${__dirname}`);

// Check if we're on the production server based on file path
const isProductionPath = __dirname.includes('/home/chameleon/public_html');
log(`Is production path: ${isProductionPath}`);

const config = {
    isProduction: isProductionPath,
    get baseUrl() {
        return this.isProduction ? '/nodejs_apps/sse_test' : '';
    }
};

log(`Final config: ${JSON.stringify(config, null, 2)}`);

module.exports = config;