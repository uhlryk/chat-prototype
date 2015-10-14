/*jslint node: true */
"use strict";
module.exports = angular.module('ChatApp.Controllers',[])
.controller("LoginController", ['$scope','$state', 'connection',function($scope,$state, connection){
  $scope.login = function(){
    connection.socket.emit('login',{nickname:$scope.nick});
  };
  connection.socket.on('login', function(data){
    connection.user.nickname = data.nickname;
    connection.user.id = data.id;
    $state.go('rooms');
  });
}])
.controller('RoomsController', ['$scope','$state','connection', function($scope, $state, connection){
  $scope.activeRoom = connection.activeRoom;
  $scope.rooms = [];
  $scope.create = function(){
    connection.socket.emit('newroom',{name:$scope.newroom});
    $scope.newroom = "";
  };
  $scope.selectRoom = function(id, name){
    connection.activeRoom.name = name;
    connection.activeRoom.id = id;
    $state.go('chat', { "room": connection.activeRoom.id});
  };
  $scope.backToRoom = function(){
    $state.go('chat', { "room": connection.activeRoom.id});
  };
  connection.socket.emit('rooms');
  connection.socket.on('rooms', function(data) {
    data.forEach(function(room){
      if(room.id !== $scope.activeRoom.id) {
        $scope.rooms.push(room);
      }
    });
  });
  connection.socket.on('newroom', function(data){
    $scope.rooms.push(data);
  });
}])
.controller('ChatController', ['$scope','$state' ,'connection', function($scope, $state, connection){
  $scope.changeRoom = function() {
    $state.go('rooms');
  };
}])

;
