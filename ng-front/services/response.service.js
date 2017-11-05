module.exports = function ResponseService($http, CacheFactory, config){
	let responseService = this;
	
	angular.extend(responseService, {
		
		sendTwitterComment: function(twitterUser, socialFeed, comment){
			return $http.post( config.backend + '/twitter-personality-insight', {twitterUser: twitterUser, socialFeed: socialFeed});
		}
	});
}
