exports.processRequest = (request, response) => {
  const data = {
    timeStamp: Date.now()
  };
  response.writeHead(200, { 'content-type': 'application/json' });
  response.write(JSON.stringify(data));
  response.end();
};