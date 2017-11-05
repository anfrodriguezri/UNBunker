'use strict';
let CRBApp = require('angular').module('CRBApp');

CRBApp.service('UserService', require('./user.service.js'));
CRBApp.service('ResponseService', require('./response.service.js'));