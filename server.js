const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json'
};

function serveStatic(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('Not found');
        }
        const ext = path.extname(filePath);
        res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
        res.end(data);
    });
}

function proxyApi(req, res, apiPath) {
    const options = {
        hostname: 'api.ultravox.ai',
        path: apiPath,
        method: req.method,
        headers: Object.assign({}, req.headers, {host: 'api.ultravox.ai'})
    };
    const proxyReq = https.request(options, proxyRes => {
        let data = '';
        proxyRes.on('data', chunk => data += chunk);
        proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
            res.end(data);
        });
    });
    req.pipe(proxyReq);
    proxyReq.on('error', err => {
        res.writeHead(500);
        res.end(JSON.stringify({error: 'Unable to reach Ultravox API'}));
    });
}

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url);
    if (parsed.pathname.startsWith('/api/')) {
        proxyApi(req, res, parsed.pathname.replace('/api', ''));
    } else {
        let filePath = path.join(__dirname, 'public', parsed.pathname === '/' ? 'index.html' : parsed.pathname);
        serveStatic(filePath, res);
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
