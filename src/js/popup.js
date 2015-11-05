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
