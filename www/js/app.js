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

const shortPolling = new ShortPolling();