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
"use strict";

var Timer = function () {
  var audio = require('./audio'),
    badger = require('./badger'),
    notify = require('./notify'),
    timer = {
      prevTimer: null,
      timeoutId: null
    };

  function clearTimer () {
    clearTimeout(timer.timeoutId);
    timer.timeoutId = null;
    badger.clear();
  }

  function isRunning () {
    return !!timer.timeoutId;
  }

  function start (time) {
    if (isRunning()) {
      clearTimer();
    }

    // Save timer
    timer.lastUsed = time;
    badger.startShowingTime(time);

    // Runs the timer
    timer.timeoutId = setTimeout(function () {
      notify.show();
      reset();
    }, time);

  }

  function reset () {
    badger.clear();
    clearTimer();
  }

  function repeat () {
    start(timer.lastUsed);
  }

  this.start = start;
  this.reset = reset;
  this.repeat = repeat;
};

module.exports = Timer;

},{"./audio":3,"./badger":5,"./notify":6}],3:[function(require,module,exports){
'use strict';

var audio = new Audio(''),
    volume = 0.4;

document.body.appendChild(audio);

module.exports = {
  play: function () {
    audio.src = 'audio/alarm2.mp3';
  },
  stop: function () {
    audio.src = '';
  }
};

},{}],4:[function(require,module,exports){
"use strict";

var Timer = require('./Timer'),
  Router = require('./Router'),
  router = new Router('backend');


var timer = new Timer();

router
  .on('start', function (message) {
    timer.start(message.value);
  })
  .on('reset', function () {
    timer.reset();
  })
  .on('repeat', function () {
    timer.repeat();
  });


},{"./Router":1,"./Timer":2}],5:[function(require,module,exports){
'use strict';

console.info('badger module');

var updateIntervalId;

function enableIcon () {
  chrome.browserAction.setIcon({
      path: 'images/16timer_enabled.png'
    },
    function () {});
}

function disableIcon () {
  chrome.browserAction.setIcon({
      path: 'images/16timer_disabled.png'
    },
    function () {});
}

function setText (value) {
  chrome.browserAction.setBadgeText({
    text: value
  });
}

function clearText () {
  chrome.browserAction.setBadgeText({
    text: ''
  });
}

function setBgColor (value) {
  chrome.browserAction.setBadgeBackgroundColor({
    color: value
  });
}

function printTime (goal) {
  var formattedDate = formatDate(goal - Date.now());
  setText(formattedDate);
}

function formatDate(date) {
  var d = new Date(date),
    mins = d.getMinutes(),
    secs = d.getSeconds(),
    formattedDate;
  if (secs < 10) {
    secs = '0' + secs;
  }
  formattedDate = mins + ':' + secs;
  return formattedDate;
}

function startShowingTime (time) {
  var goal = Date.now() + time;
  enableIcon();
  setBgColor('#845730');
  printTime(goal);

  updateIntervalId = setInterval(function () {
    printTime(goal);
  }, 1000);
}

function clear () {
  clearInterval(updateIntervalId);
  updateIntervalId = null;
  disableIcon();
  clearText();
}


module.exports = {
  startShowingTime: startShowingTime,
  clear: clear
};

},{}],6:[function(require,module,exports){
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
},{"./audio":3}]},{},[4])


//# sourceMappingURL=background-bundle.js.map
