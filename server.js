// please write a simple nodejs server to serve static files from the src directory of this project
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'src', req.url);
    
    // If the requested URL is a directory, serve index.html inside that directory
    if (fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // If file doesn't exist, return 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Determine the content type based on file extension
        let contentType = 'text/plain';
        const ext = path.extname(filePath);
        if (ext === '.html') {
            contentType = 'text/html';
        } else if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'text/javascript';
        }

        // Set the appropriate content type header
        res.writeHead(200, { 'Content-Type': contentType });
        // Serve the file content
        res.end(data);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
