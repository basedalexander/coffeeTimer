'use strict';

var audio = new Audio('');

audio.volume = 0.4;

document.body.appendChild(audio);

module.exports = {
  play: function () {
    audio.src = 'audio/alarm2.mp3';
    audio.play();
  },
  stop: function () {
    audio.src = '';
  }
};
