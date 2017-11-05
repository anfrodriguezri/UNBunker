'use strict';
function ChallengesResponseCtrl($state, UserService, config, $log) {
	let challengesResponseCtrl = this;

	angular.extend(challengesResponseCtrl, {
		personalityInsight: UserService.getPersonality(),
		log: function(message) {
      		$log.debug(message);
    	}
	});
}

module.exports = { 
	templateUrl: './challenges/challengesResponse/challengesResponse.comp.html',
	controller: ChallengesResponseCtrl,
	bindings: {
		username: '<'
	}
}