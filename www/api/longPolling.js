const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const emitter = new Emitter();

const checkForUpdates = () => {
  let timer;
  const loop = () => {
    if (Math.floor(Math.random() * 10) % 5 === 0) {
      emitter.emit('update');
    } else {
      timer = setTimeout(loop, 1000);
    }
  };
  loop();
};

exports.processRequest = (request, response) => {
  emitter.once('update', () => {
    const data = {
      timeStamp: Date.now()
    };
    response.writeHead(200, { 'content-type': 'application/json' });
    response.write(JSON.stringify(data));
    response.end();
  });
  checkForUpdates();
};