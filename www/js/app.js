'use strict';

class ShortPolling {
  constructor() {
    this.locked = false;
    this.timer = null;
  }
  poll() {
    axios.get('/api/shortPolling')
      .then(response => {
        const ul = document.querySelector('#content .short-polling');
        ul.insertAdjacentHTML('beforeEnd', `<li>${new Date(response.data.timeStamp)}</li>`);
        ul.scrollTop = ul.scrollHeight - ul.offsetHeight;
        this.timer = setTimeout(() => {
          this.poll();
        }, 1000);
      })
      .catch(error => {
        console.log(error);
      });
  }
  start() {
    if (this.locked) {
      return;
    }
    this.locked = true;
    this.poll();
  }
  end() {
    this.locked = false;
    clearTimeout(this.timer);
  }
  clear() {
    document.querySelector('#content .short-polling').innerHTML = '';
  }
}

class LongPolling {
  constructor() {
    this.started = false;
  }
  poll() {
    if (!this.started) {
      return;
    }
    axios.get('/api/longPolling')
      .then(response => {
        const ul = document.querySelector('#content .long-polling');
        ul.insertAdjacentHTML('beforeEnd', `<li>${new Date(response.data.timeStamp)}</li>`);
        ul.scrollTop = ul.scrollHeight - ul.offsetHeight;
        this.poll();
      })
      .catch(error => {
        console.log(error);
      });
  }
  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.poll();
  }
  end() {
    this.started = false;
  }
  clear() {
    document.querySelector('#content .long-polling').innerHTML = '';
  }
}

class ServerSentEvents {
  constructor() {
    this.eventSource = null;
  }
  start() {
    if (this.eventSource) {
      return;
    }
    this.eventSource = new EventSource('/api/serverSentEvents');
    this.eventSource.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      const ul = document.querySelector('#content .server-sent-events');
      ul.insertAdjacentHTML('beforeEnd', `<li>${new Date(data.timeStamp)}</li>`);
      ul.scrollTop = ul.scrollHeight - ul.offsetHeight;
    }, false);
  }
  end() {
    this.eventSource && (this.eventSource.close());
    this.eventSource = null;
  }
  clear() {
    document.querySelector('#content .server-sent-events').innerHTML = '';
  }
}

const shortPolling = new ShortPolling();
const longPolling = new LongPolling();
const serverSentEvents = new ServerSentEvents();