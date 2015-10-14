/*jslint node: true */
'use strict';
(function(){
  require('./config');
  require('./controllers');
  require('./services');
  var app = angular.module('ChatApp', ['ngAnimate', 'angularMoment', 'ui.router','dynamicNumber', 'btford.socket-io','Config', 'ChatApp.Controllers', 'ChatApp.Services']);
  app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider){
    $stateProvider
    .state('404', {
      url: '/404',
      templateUrl:'js/views/404.html'
    })
    .state('login', {
      url:'/',
      templateUrl:'js/views/login.html',
      controller:'LoginController',
      resolve: {
        access: ['connection',function (connection) {
          console.log("state: login");
          connection.user.nickname="";
          connection.user.id=0;
          connection.activeRoom.name="";
          connection.activeRoom.id=0;
          return {access:true};
        }]
      }
    })
    .state('chat', {
      url :'/chat/:room',
      templateUrl: 'js/views/chat.html',
      controller: 'ChatController',
      resolve: {
        access: ['$q', 'connection',function ($q, connection) {
          console.log("state: chat");
          if (!connection.user.id || !connection.activeRoom.id) {
            return $q.reject("room");
          }
          return true;
        }]
      }
    })
    .state('rooms', {
      url :'/rooms',
      templateUrl: 'js/views/rooms.html',
      controller: 'RoomsController',
      resolve: {
        access: ['$q', 'connection',function ($q, connection) {
          console.log("state: rooms");
          console.log(connection.user);
          if (!connection.user.id) {
            return $q.reject("nickname");
          }
          return true;
        }]
      }
    })
    ;
    $urlRouterProvider.otherwise('/404.html');
    $locationProvider.html5Mode(true);
  }]);
  angular.module('ChatApp').run(['$state', '$rootScope','connection', function($state, $rootScope,connection) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      switch(error){
        case 'room':
          $state.go("rooms");
        break;
        //case 'nickname':
        default:
          $state.go("login");
      }
    });
    $state.go('login');
  }]);
})();