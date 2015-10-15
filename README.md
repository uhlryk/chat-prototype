# chat prototype
Prototype of chat application

The aim was to create communication applications and test replacement of REST api with websockets (for example get available rooms)

Some REST

## Technology:
websocket - socket.io

frontend - angular.js, bootstrap3

backend - node.js express

## Features:
1. Users write nickname
2. If user nicname field leave blank than name will be generate
3, Each user has generated id.
4, List of rooms
5. Each user can add new room with any name
6. User can enter any room
7. User can change room
8. User in room can write messages and receive room events (somebody enter, somebody leave, somebody write message)

## Installation:

    git clone https://github.com/uhlryk/chat-prototype.git
    cd chat-prototype
    npm install
    bower install
    gulp all
    npm start

go to url:

    http://localhost:3000/
