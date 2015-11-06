'use strict';
var audio = require('./audio');

console.info('notify module');

var opts = {
  type: 'basic',
  //buttons: [{
  //  title: 'Snooze 1 minute',
  //  iconUrl: 'images/zzz.png'
  //}, {
  //  title: 'Stop',
  //  iconUrl: 'images/close.png'
  //}],
  isClickable: false,
  priority: 2,
  title: 'Time up!',
  message: '<3',
  contextMessage: 'coffeeTimer',
  iconUrl: 'images/timer_128x128.png'
  },

  active = false,
  id = 'timerId';



module.exports = {
  show: function () {
    chrome.notifications.create(id, opts, function () {
      audio.play();
      active = true;
      chrome.notifications.onClicked.addListener(function (id) {
        chrome.notifications.clear(id);
        audio.stop();
      });
    });
  },
  hide: function () {
      chrome.notifications.clear(id, function () {} );
      audio.stop();
      active = false;
  },
  isActive: function () {
    return active;
  }
};