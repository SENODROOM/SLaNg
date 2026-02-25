/**
 * Simple web server for SLaNg Math Library Demo
 * Run with: node server.js
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Parse URL
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found, try adding .html extension
            if (!extname) {
                filePath += '.html';
                fs.access(filePath, fs.constants.F_OK, (err2) => {
                    if (err2) {
                        serve404(res);
                    } else {
                        serveFile(filePath, 'text/html', res);
                    }
                });
            } else {
                serve404(res);
            }
            return;
        }

        serveFile(filePath, contentType, res);
    });
});

function serveFile(filePath, contentType, res) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                serve404(res);
            } else {
                serve500(res, err);
            }
            return;
        }

        res.writeHead(200, { 
            'Content-Type': contentType,
            'Content-Length': content.length
        });
        res.end(content);
    });
}

function serve404(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Not Found</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 100px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                }
                h1 { font-size: 4rem; margin-bottom: 20px; }
                p { font-size: 1.2rem; }
                a { color: #ffd700; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>Page not found</p>
            <p><a href="/">Return to SLaNg Demo</a></p>
        </body>
        </html>
    `);
}

function serve500(res, err) {
    console.error('Server Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>500 - Server Error</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 100px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    min-height: 100vh;
                }
                h1 { font-size: 4rem; margin-bottom: 20px; }
                p { font-size: 1.2rem; }
                a { color: #ffd700; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>500</h1>
            <p>Internal server error</p>
            <p><a href="/">Return to SLaNg Demo</a></p>
        </body>
        </html>
    `);
}

server.listen(PORT, () => {
    console.log(`🚀 SLaNg Math Library Demo Server`);
    console.log(`📍 Server running at http://localhost:${PORT}`);
    console.log(`🌐 Open your browser and navigate to http://localhost:${PORT}`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
    console.log('');
    console.log('Available routes:');
    console.log('  /                 - Main demo page');
    console.log('  /index.html       - Main demo page');
    console.log('  /api/status       - Server status');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
