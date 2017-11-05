'use strict';

require('./ng-front.css');

var angular = require('angular');
require('@uirouter/angularjs');
require('angular-cache');

var app = angular.module('CRBApp', ['ui.router', 'angular-cache'])
.config(function($stateProvider, $urlRouterProvider, CacheFactoryProvider){
	let states = require('./routeStates').getStates();

	states.forEach(function(state) {
		$stateProvider.state(state);
	});
	
	$urlRouterProvider.when("", "/login");
	$urlRouterProvider.otherwise('/login');

	angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
});

require('./ng-front.config');

require('./services');

require('./components');

