$(function() {
	Math.seedrandom();
	Array.prototype.getRandom = function() {
		return this[Math.floor(Math.random() * this.length)];
	};

	var allLetters = ['A', 'B', 'V', 'G', 'D', 'Đ', 'E', 'Ž', 'Z', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'Ć', 'U', 'F', 'H', 'C', 'Č', 'Š'];

	var requiredLetters = ['A', 'B', 'E', 'Ž', 'N', 'R', 'C'];

	var theMatrix = [
		['B'],
		['R'],
		['A', 'E'],
		['C', 'N', 'N', 'Ž', 'Ž'],
		['A', 'E'],
		['C', 'N', 'N', 'Ž', 'Ž'],
		['A', 'A', 'A', 'E'],
		['C', 'C', 'C', 'N', 'Ž']
	];

	var newName = '';
	var currentName = 'BRANEŽAC';
	var lastNameLetters = $('.letter');
	var lettersToStop = 0;
	var generateButton = $('#generateButton');
	var facebookButton = $('#facebookButton');
	var congratulations = $('#congratulations');

	var toggleGeneration;
	(function() {
		var currentStatus = false;
		toggleGeneration = function(newStatus) {
			if (newStatus === currentStatus) {
				return false;
			}
			generateButton.prop('disabled', newStatus);
			facebookButton.prop('disabled', newStatus);
			currentStatus = newStatus;
			return true;
		};
	})();

	generateName();
	generateButton.on('click', generateName);

	function generateName() {
		if (!toggleGeneration(true)) {
			return;
		}
		while (!newNameHasRequiredLetters()) {
			newName = '';
			theMatrix.forEach(function(letters) {
				newName += letters.getRandom();
			});
		}
		startJumblingLetters(20);
		setTimeout(function() {
			stopJumblingLetters(function() {
				currentName = newName;
				newName = '';
			});
		}, 2000);
	}

	function newNameHasRequiredLetters() {
		var success = true;
		requiredLetters.forEach(function(letter) {
			if (newName.indexOf(letter) < 0) {
				success = false;
			}
		});
		return success;
	}

	function startJumblingLetters(jumbleSpeed) {
		lastNameLetters.each(function(index) {
			var theLetter = $(this);
			var letterInterval = setInterval(function() {
				var newLetter = allLetters.getRandom();
				theLetter.text(newLetter);
				if (lettersToStop > 0 && newName.charAt(index) === newLetter) {
					clearInterval(letterInterval);
					lettersToStop -= 1;
				}
			}, jumbleSpeed);
		});
	}

	function stopJumblingLetters(onComplete) {
		lettersToStop = lastNameLetters.length;
		var stoppedPollingInterval = setInterval(function() {
			if (!lettersToStop) {
				clearInterval(stoppedPollingInterval);
				if (typeof onComplete === 'function') {
					onComplete();
				}
				toggleGeneration(false);
			}
		}, 500);
	}

	facebookButton.on('click', function() {
		FB.ui({
			method: 'feed',
			link: 'https://djcvijic.github.io/burgija.info/',
			picture: 'https://djcvijic.github.io/burgija.info/img/opengraph.png',
			description: 'My Burgija name is STEVAN ' + currentName + '! What\'s yours?',
			caption: 'My Burgija name is STEVAN ' + currentName + '! What\'s yours?'
		}, function(response) {
			if (response && response.post_id && response.post_id.length) {
				facebookButton.prop('disabled', true).fadeOut();
				congratulations.fadeIn();
				setTimeout(function() {
					congratulations.fadeOut();
					facebookButton.fadeIn().prop('disabled', false);
				}, 5000);
			}
		});
	});
});
