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

