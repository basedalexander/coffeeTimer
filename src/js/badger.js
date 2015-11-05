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
