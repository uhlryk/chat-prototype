/*jslint node: true */
"use strict";

module.exports = angular.module('ChatApp.Services',[])
.factory('connection', ['socketFactory','DOMAIN_URL','SOCKET_PATH',function (socketFactory,DOMAIN_URL, SOCKET_PATH) {
  return {
    socket: socketFactory({
      ioSocket: io.connect(DOMAIN_URL, { path: SOCKET_PATH })
    }),
    user: {
      nickname: "",
      id: 0
    },
    activeRoom: {
      name:"",
      id:0
    }
  };
}]);
