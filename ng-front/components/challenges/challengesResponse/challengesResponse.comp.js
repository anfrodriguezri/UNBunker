'use strict';
function ChallengesResponseCtrl($state, UserService, config) {
	let challengesResponseCtrl = this;

	angular.extend(challengesResponseCtrl, {
		personality: UserService.getPersonality()
		
	});
}

module.exports = { 
	templateUrl: './challenges/challengesResponse/challengesResponse.comp.html',
	controller: ChallengesResponseCtrl,
	bindings: {
		username: '<'
	}
}