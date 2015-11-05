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
    badger.startShowingTime(time);

    // Save timer
    timer.lastUsed = time;

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
