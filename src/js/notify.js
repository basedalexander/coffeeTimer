'use strict';
var audio = require('./audio');

console.info('notify module');

var opts = {
  type: 'basic',
  buttons: [{
    title: 'Snooze 1 minute',
    iconUrl: 'images/zzz.png'
  }, {
    title: 'Stop',
    iconUrl: 'images/close.png'
  }],
  isClickable: false,
  priority: 2,
  message: 'coffeeTimer',
  title: 'title',
  iconUrl: 'images/timer_128x128.png'
};



module.exports = {
  show: function () {
    chrome.notifications.create('timerId', opts, function () {
      audio.play();
      chrome.notifications.onClicked.addListener(function (id) {
        chrome.notifications.clear(id, function () {
          audio.stop();
        });
      });
    });
  }
};