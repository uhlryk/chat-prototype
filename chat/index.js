var uuid = require('uuid');
module.exports = function(http){
  var socketList = [];
  var roomList = [];
  var io = require('socket.io')(http,{ path: '/socket' });

  io.on('connection', function(socket){
    var user = addUser(socket);
    console.log(user.id + ' connected');
    socket.on('login', function(data){
      console.log(user.id + ' login nickname: '+ data.nickname);
      //send back nick, it is usefull when nick is duplicated and server add number suffix
      user.nickname = data.nickname;
      socket.emit('login', { nickname: user.nickname, id:  user.id});
    });
    socket.on('rooms', function(){
      socket.emit('rooms', roomList);
    });
    socket.on('newroom', function(data){
      var room = addRoom(data.name);
      socket.emit('newroom', room);
    });
    socket.on('disconnect', function(){
      console.log(user.id + ' disconnected');
      removeUser(user);
      user=null;
    });
    socket.on('message', function(message){
      console.log(user.id + ' message: "'+ message+'"');
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
  function addUser(socket, id){
    var user = {
      id: uuid.v4(),
      socket: socket,
      nickname:"",
      rooms:[]
    };
    socketList.push(user);
    return user;
  }
  function removeUser(user){
    var i = socketList.indexOf(user);
    delete socketList[i];
  }
};