module.exports = {
	getStates: function(){
		return [
					{
						name: 'login', url: '/login', component: 'loginPageComp'
			      	},
			      	{
						name: 'challenges', url: '/challenges', component: 'challengesComp',
						resolve: {
							username: function(UserService, $state){
								username = UserService.getUsername();
								if( !username )
									$state.go('login');

								return username;
							}
						}
			      	},
			      	{
			      		name: 'challenges.one', url: '/one', component: 'challengeOneComp',
			      		resolve: {
							username: function(UserService, $state){
								username = UserService.getUsername();
								if( !username )
									$state.go('login');

								return username;
							}
						}
			      	},
			      	{
			      		name: 'challenges.response', url: '/response', component: 'challengesResponseComp',
			      		resolve: {
							username: function(UserService, $state){
								username = UserService.getUsername();
								if( !username )
									$state.go('login');

								return username;
							}
						}
			      	}
				];
	}
};