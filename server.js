'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.oct': 'application/octet-stream',
  '.png': 'image/png'
};
const documentRoot = 'www/';
const requestHandler = (request, response) => {
  let filePath = request.url;

  if (filePath === '/') {
    filePath += 'index.html';
  }
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || mimeTypes.oct;

  fs.readFile(path.join('www', filePath), (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        response.writeHead(404);
        response.end();
      } else {
        response.writeHead(500);
        response.end();
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
};

http.createServer(requestHandler).listen(8080);

console.log('HTTP server is listening at port 8080');