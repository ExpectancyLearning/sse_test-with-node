// public/js/sse.js
document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');
    const { baseUrl } = window.AppConfig;
    
    console.log(`Running in ${window.AppConfig.isProduction ? 'production' : 'development'} mode`);
    console.log('Using base URL:', baseUrl);
    
    const evtSource = new EventSource(`${baseUrl}/stream`);
    
    evtSource.onopen = function() {
        console.log('SSE connection opened');
    };
    
    evtSource.onmessage = function(event) {
        console.log('Message received:', event.data);
        try {
            const data = JSON.parse(event.data);
            const newElement = document.createElement('div');
            if (data.time) {
                newElement.textContent = `${data.time} - ${data.count || ''}: ${data.message}`;
            } else {
                newElement.textContent = data.message;
            }
            output.appendChild(newElement);
            
            if (data.message === "Stream complete") {
                console.log('Stream completed, closing connection');
                evtSource.close();
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    };
    
    evtSource.onerror = function(err) {
        console.error('SSE Error:', err);
        output.insertAdjacentHTML('beforeend', 
            `<div style="color:red">Connection error at ${new Date().toLocaleTimeString()}</div>`);
    };
});