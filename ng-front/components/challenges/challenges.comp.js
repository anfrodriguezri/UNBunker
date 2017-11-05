'use strict';
function ChallengesCtrl($state, UserService, config) {
	let challengesCtrl = this;

	angular.extend(challengesCtrl, {
		
	});
}

module.exports = { 
	templateUrl: './challenges/challenges.comp.html',
	controller: ChallengesCtrl,
	bindings: {
		username: '<'
	}
}