var timer = {
	prevTimer : null,
	timeoutId : null,
	intervalId : null,
	audio : null,
};

createAudioElem();

function startTimer(time) {
	// If timer already running then reset only timeoutId and intervalId
	if (timer.timeoutId && timer.intervalId) {
			resetTimerSoft();
		}

		setIcon('16timer_enabled');
		setBadgeColor('#83B8C9');

		timer.prevTimer = time; // To save last used timer
		// Beggins showing how much time left on browserAction button
		updateBadge(time);

		// Runs the timer
		timer.timeoutId = window.setTimeout(function () {
				chrome.notifications.create('' + time, {
						type : 'basic',
						priority: 2,
						message: 'Timer app',
						title : Math.round(time/60000) + 'minutes',
						iconUrl: 'images/timer_128x128.png'
				},  function () {
								turnAudio('on');
								resetTimer();
								autoMuteAudio(24);

								chrome.notifications.onClicked.addListener(function (id) {
										chrome.notifications.clear(id, function () {
												turnAudio('off');
										});
								});
				});
		}, time);
}


function resetTimer () {
	setIcon('16timer_disabled');
	setBadgeText('');
	window.clearInterval(timer.intervalId);
	window.clearTimeout(timer.timeoutId);
	timer.timeoutId = null;
	timer.intervalId = null;
}
// Resets timer without tough blinking of the browser action button
function resetTimerSoft () {
	window.clearInterval(timer.intervalId);
	window.clearTimeout(timer.timeoutId);
	timer.timeoutId = null;
	timer.intervalId = null;
}

function startPrevTimer () {
	startTimer(timer.prevTimer);
}

function updateBadge (time) {
	var finish = Date.now() + time;
	showTimeLeftTo(finish);

	timer.intervalId = window.setInterval(function () {
			showTimeLeftTo(finish);
	}, 1000);
}

function showTimeLeftTo (to) {
	setBadgeText( formatDate(to - Date.now()) );
}

function formatDate (date) {
	/**
	* [creates fancy date output from date passed in it]
	* @param  {[number]} date [date representation in milliseconds]
	* @return {[string]}      [formatted string for timer graphical output]
	*/
	var d = new Date(date),
		formattedDate,
		mins = d.getMinutes(),
		secs = d.getSeconds();
	if (secs < 10) secs = '0' + secs;
	formattedDate = mins + ':' + secs;
	return formattedDate;
}

function setIcon (name) {
	chrome.browserAction.setIcon(
		{
				path : 'images/' + name + '.png'
		},
		function () {});
}

function setBadgeText (value) {
	chrome.browserAction.setBadgeText({
		text: value
	});
}

function setBadgeColor (value) {
	chrome.browserAction.setBadgeBackgroundColor({
		color : value
	});
}

function createAudioElem () {
	timer.audio = document.createElement('AUDIO');
	timer.audio.setAttribute('loop' , 'true');
	timer.audio.setAttribute('autoplay', 'true');
	document.body.appendChild(timer.audio);
}

function turnAudio (string) {
	switch (string) {
		case 'on' : 	timer.audio.setAttribute('src', 'audio/alarm2.mp3');
									break;
		case 'off' : 	timer.audio.setAttribute('src', '');
									break;
		default : 		break;
		}
}

function autoMuteAudio (sec) {
	setTimeout(function () {
		turnAudio('off');
	}, 1000 * sec);
}
