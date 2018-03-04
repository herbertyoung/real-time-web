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
const processRequest = (request, response) => {
  let filePath = request.url;

  if (filePath === '/') {
    filePath += 'index.html';
  }
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || mimeTypes.oct;

  if (filePath.startsWith('/api')) {
    try {
      const handler = require(path.join('www', filePath));
      if (handler.processRequest && typeof handler.processRequest === 'function') {
        handler.processRequest(request, response); // dynamic resources
      } else {
        response.writeHead(404);
        response.end();
      }
    } catch (e) {
      response.writeHead(500);
      response.end();
    }
  } else {
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
  }
};

http.createServer(processRequest).listen(8080);

console.log('HTTP server is listening at port 8080');