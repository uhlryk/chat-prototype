var uuid = require('uuid');
var validator = require('validator');

module.exports = function(http){
  var connectionList = [];
  var roomList = [];
  var io = require('socket.io')(http,{ path: '/socket' });

  io.on('connection', function(socket){
    var connection = createConnection(socket);
    addUser(connection);
    socket.on('login', function(data){
      var nickname="";
      if(data && data.nickname && validator.isLength(data.nickname, 1,20)){
        nickname = data.nickname;
      } else{
        nickname= "user_" + connection.user.id.toString().slice(0, 8);
      }
      connection.user.nickname = nickname;
      socket.emit('login', { nickname: connection.user.nickname, id:  connection.user.id});
    });
    socket.on('rooms', function(){
      socket.emit('rooms', roomList);
    });
    socket.on('newRoom', function(data){
      if(data && data.name && validator.isLength(data.name, 1,20)){
        var room = addRoom(data.name);
        emitNewRoom(room);
      }
    });
    socket.on('enterRoom', function(data){
      var room;
      roomList.forEach(function(oneRoom){
        if(oneRoom.id === data.id){
          room = oneRoom;
        }
      });
      if(room){
        if(connection.activeRoom.id && room.id !== connection.activeRoom.id){
          emitLeaveRoom(connection);
        }
        if(room.id !== connection.activeRoom.id){
          enterRoom(connection, room);
          emitEnterRoom(connection);
        }
      }
    });
    socket.on('disconnect', function(){
      if(connection.activeRoom){
        emitLeaveRoom(connection);
      }
      removeConnection(connection);
      connection=null;
    });
    socket.on('message', function(data){
      if(data && data.text && validator.isLength(data.text, 1,100)){
        connectionList.forEach(function(otherConnection){
          if(otherConnection.user.id !== connection.user.id && otherConnection.activeRoom.id === connection.activeRoom.id){
            otherConnection.socket.emit('message', {text:data.text, author:connection.user.nickname});
          } else if(otherConnection.user.id === connection.user.id){
            connection.socket.emit('message', {text:data.text, owner:true});
          }
        });
      }
    });
  });
  function addRoom(name){
    var room = {
      name: name,
      id: uuid.v4()
    };
    roomList.push(room);
    return room;
  }
  function createConnection(socket){
    var connection = {
      socket: socket,
      user: {
        nickname: "",
        id: 0
      },
      activeRoom: {
        name:"",
        id:0
      }
    };
    connectionList.push(connection);
    return connection;
  }
  function addUser(connection){
    connection.user.id = uuid.v4();
  }
  function removeConnection(connection){
    var i = connectionList.indexOf(connection);
    delete connectionList[i];
  }
  function enterRoom(connection, room){
    connection.activeRoom.name = room.name;
    connection.activeRoom.id = room.id;
  }
  function emitLeaveRoom(connection){
    connectionList.forEach(function(otherConnection){
      if(otherConnection.user.id !== connection.user.id && otherConnection.activeRoom.id === connection.activeRoom.id){
        otherConnection.socket.emit('leaveRoom', {nickname:connection.user.nickname});
      }
    });
  }
  function emitEnterRoom(connection){
    connectionList.forEach(function(otherConnection){
      if(otherConnection.user.id !== connection.user.id && otherConnection.activeRoom.id === connection.activeRoom.id){
        otherConnection.socket.emit('enterRoom', {nickname:connection.user.nickname});
      }
    });
  }
  function emitNewRoom(newRoom){
    connectionList.forEach(function(otherConnection){
      otherConnection.socket.emit('newRoom', newRoom);
    });
  }
};