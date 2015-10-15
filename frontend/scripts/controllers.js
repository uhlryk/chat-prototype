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
    connection.socket.emit('newRoom',{name:$scope.newroom});
    $scope.newroom = "";
  };
  $scope.selectRoom = function(id, name){
    // if(connection.activeRoom.id) {
    //   connection.socket.emit('leaveRoom');
    // }
    connection.activeRoom.name = name;
    connection.activeRoom.id = id;
    connection.socket.emit('enterRoom',{id : connection.activeRoom.id});
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
  connection.socket.on('newRoom', function(data){
    $scope.rooms.push(data);
  });
}])
.controller('ChatController', ['$scope','$state' ,'connection', function($scope, $state, connection){
  $scope.messageList = [];
  $scope.changeRoom = function() {
    $state.go('rooms');
  };
  connection.socket.on('enterRoom', function(data){
    console.log('enterRoom '+data.nickname);
    $scope.messageList.push({
      type:'enterRoom',
      text:'enter room',
      user:data.nickname
    });
  });
  connection.socket.on('leaveRoom', function(data){
    console.log('leaveRoom '+data.nickname);
    $scope.messageList.push({
      type:'leaveRoom',
      text:'leave room',
      user:data.nickname
    });
  });
  connection.socket.on('message', function(data){
    console.log('author '+data.author +  'message '+data.text);
    if(data.owner === true){
      $scope.messageList.push({
        type:'ownerMessage',
        text:data.text
      });
    } else{
      $scope.messageList.push({
        type:'otherMessage',
        text:data.text,
        user:data.author
      });
    }
  });
  $scope.send = function(){
    connection.socket.emit('message', {text:$scope.message});
    $scope.message="";
  };
}])
;
