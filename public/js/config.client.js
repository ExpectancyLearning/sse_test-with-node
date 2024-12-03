// public/js/config.client.js
window.AppConfig = {
    isProduction: window.location.hostname !== 'localhost' && 
                  window.location.hostname !== '127.0.0.1',
    get baseUrl() {
        return this.isProduction ? '/nodejs_apps/sse_test' : '';
    }
};