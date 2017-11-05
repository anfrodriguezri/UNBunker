module.exports = function UserService(CacheFactory){
	let userService = this;
	
	angular.extend(userService, {
		profileCache: null,
		cacheUser: function(username){
	   		userService.profileCache.put('username', username);
		},
		getUsername: function(){
			return userService.profileCache.get('username'); 
		},
		cacheUserPersonality: function(personality){
			userService.profileCache.put('personality', personality);
		},
		getPersonality: function(){
			return userService.profileCache.get('personality');
		}
	});

	if (!CacheFactory.get('profileCache')) {
		userService.profileCache = CacheFactory('profileCache');
	}
}