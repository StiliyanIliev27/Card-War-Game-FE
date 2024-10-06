const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://localhost:7100',
            secure: false, // This will allow self-signed certificates
            changeOrigin: true,
        })
    );
};
