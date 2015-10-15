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
}])
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
})
.directive('autoFocus', function($timeout) {
  return {
    restrict: 'AC',
    link: function(_scope, _element) {
      $timeout(function(){
        _element[0].focus();
      }, 0);
    }
  };
});

