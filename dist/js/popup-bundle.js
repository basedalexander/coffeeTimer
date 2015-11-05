(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

console.info('Router module');


module.exports = Router;


function Router (identifier) {

  // Unique identifier for current script
  var id = identifier,
    listeners = {},
    self = this;

  function send (name, value, cb) {

    // @link https://developer.chrome.com/extensions/runtime#method-sendMessage
    chrome.runtime.sendMessage({
        id: id,
        name: name,
        value: value
      },
      cb);
  }

  function on (name, handler) {

    // Save handler in router object.
    listeners[name] = function (message, sender, cb) {

      // If message was send from another Router instance or
      // message name is not what we expecting then do nothing.
      if (message.id !== id && message.name === name) {

        // Handle message
        cb(handler(message));
      }
    };

    // @link https://developer.chrome.com/extensions/runtime#event-onMessage
    chrome.runtime.onMessage.addListener(listeners[name]);

    return self;
  }

  function deregister (name) {
    if (name in listeners) {
      chrome.runtime.onMessage.removeListener(listeners[name]);
      delete listeners[name];
    }
  }

  this.send = send;
  this.on = on;
  this.deregister = deregister;
}


},{}],2:[function(require,module,exports){
'use strict';

var Router = require('./Router'),
    router = new Router('frontend');

var timerButtons = document.querySelectorAll('[data-timer]'),
  timerReset = document.querySelector('[data-timer-reset]'),
  timerRepeatLast = document.querySelector('[data-timer-repeat'),
  i;

for (i = 0; i < timerButtons.length; i = i + 1) {
  var button = timerButtons[i],
    time = button.getAttribute('data-timer') * 60000;
  button.innerHTML = button.getAttribute('data-timer') + ' min';
  addHandler(button, time);
}

timerReset.addEventListener('click', function () {
  router.send('reset');
});
timerRepeatLast.addEventListener('click', function () {
  router.send('repeat');
});


function addHandler(button, time) {
  button.addEventListener('click', function () {
    router.send('start', time);
  });
}

},{"./Router":1}]},{},[2])


//# sourceMappingURL=popup-bundle.js.map
