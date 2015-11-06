"use strict";

var Timer = function () {
  var badger = require('./badger'),
    notify = require('./notify'),
    timer = {
      prevTimer: null,
      timeoutId: null
    };


  function clear() {
    notify.hide();
    badger.reset();
    clearTimeout(timer.timeoutId);
    timer.timeoutId = null;
  }

  function isRunning () {
    return !!timer.timeoutId;
  }

  function start (time) {
    if (isRunning() || notify.isActive()) {
      clear();
    }

    // Save timer
    timer.lastUsed = time;

    // Runs the timer
    timer.timeoutId = setTimeout(function () {
      notify.show();
      reset();
    }, time);

    badger.startShowingTime(time);
  }

  function reset () {
    badger.clear();
    clear();
  }

  function repeat () {
    start(timer.lastUsed);
  }

  this.start = start;
  this.reset = reset;
  this.repeat = repeat;
};

module.exports = Timer;
