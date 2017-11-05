'use strict';
function LoginPageCtrl($state, UserService, config) {
	let loginPageCtrl = this;

	angular.extend(loginPageCtrl, {
		login: function(){
			let username = loginPageCtrl.username;
			UserService.cacheUser(username);

			$state.go('challenges.one');
		}
	});
}

module.exports = { 
	templateUrl: './loginPage/loginPage.comp.html',
	controller: LoginPageCtrl,
	bindings: {
	}
}