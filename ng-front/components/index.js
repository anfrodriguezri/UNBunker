let CRBApp = require('angular').module('CRBApp');

CRBApp.component('loginPageComp', require('./loginPage/loginPage.comp.js'));
CRBApp.component('challengesComp', require('./challenges/challenges.comp.js'));

CRBApp.component('challengeOneComp', require('./challenges/challengeOne/challengeOne.comp.js'));
CRBApp.component('challengesResponseComp', require('./challenges/challengesResponse/challengesResponse.comp.js'));