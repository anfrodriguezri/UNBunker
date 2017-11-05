'use strict';
function ChallengeOneCtrl($state, ResponseService, UserService) {
	let challengeOneCtrl = this;

	angular.extend(challengeOneCtrl, {
		twitterUser: 'TheRock',
		comment: 'Me gusta el Bon Yurt',
		sendResponse: function(){

			setTimeout(function(){
				let socialFeed = angular.element('#text-area').val();
				socialFeed = socialFeed.split('|');

				let twitterUser = challengeOneCtrl.twitterUser;
				let comment = challengeOneCtrl.comment;

				ResponseService.sendTwitterComment(twitterUser, socialFeed, comment).then(function(response){
					console.log( response.data );
					UserService.cacheUserPersonality(response.data);
					$state.go('challenges.response');
				}).catch(function(response){
					console.log( response );
				});
			}, 5000);
		}
	});
}

module.exports = { 
	templateUrl: './challenges/challengeOne/challengeOne.comp.html',
	controller: ChallengeOneCtrl,
	bindings: {
	}
}