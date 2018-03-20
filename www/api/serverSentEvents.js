const EventEmitter = require('events');
class Emitter extends EventEmitter {}

exports.processRequest = (request, response) => {
  const emitter = new Emitter();
  const checkForUpdates = () => {
    let timer;
    const loop = () => {
      if (Math.floor(Math.random() * 20) % 6 === 0) {
        emitter.emit('update');
      }
      timer = setTimeout(loop, 1000);
    };
    emitter.on('close', () => {
      clearTimeout(timer);
    });
    loop();
  };
  const handleClose = () => {
    emitter.emit('close');
    emitter.removeAllListeners('update');
  };

  request.connection.on('timeout', () => {
    handleClose();
  });
  request.connection.on('end', () => {
    handleClose();
  });
  response.writeHead(200, {
    'Content-Type': "text/event-stream",
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  emitter.on('update', () => {
    const data = {
      timeStamp: Date.now()
    };
    response.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  checkForUpdates();
};