const http = require("http");
const moment = require("moment");
const sockets = require("socket.io");
const express = require('express');

const port = process.env.PORT || 3000;
const path = require("path").join(`${__dirname}/../public`);
const {generateMessage, generateLocationMessage } = require("./utils/message");
const {isRealString} = require("./utils/validation");
const { Users } = require("./utils/Users");

//instantiate the user class...
const users = new Users();

const app = express();
app.use("/",express.static(path));
const server = http.createServer(app);
const io = sockets(server);

io.on("connection",(socket) => {

socket.on("createMessage",(msg,callback) => {

  const user = users.getUser(socket.id);
  if(user && msg.message.trim().length > 0){
   io.to(user.room).emit("newMessage",generateMessage(user.name, msg.message));
  }
  callback("Response from the server");
  });

socket.on("createLocationMessage",coords=>{
  const user = users.getUser(socket.id);
  const {latitude, longitude } = coords;
  if(user){
   io.to(user.room).emit("generateLocationMessage",generateLocationMessage(user.name, latitude,longitude));
  }
 });

  socket.on("join",(params,callback) => {
     if(!isRealString(params.name) && !isRealString(params.room)){
       return callback("Display name or Room name cannot be empty.");
     }
       callback();

     socket.join(params.room);

     users.removeUser(socket.id);
     users.addUser(socket.id,params.name,params.room);
     let roomList = users.getUserList(params.room);

     io.to(params.room).emit("updateUsersList",roomList);

     socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin",`${params.name} joined chat.`));

     socket.emit("newMessage",generateMessage("Admin", "Welcome to the chat app."));


  });


  socket.on("disconnect",() => {
    //get the current user by id
    let user = users.removeUser(socket.id);

    if(user){
     socket.to(user.room).emit("newMessage",generateMessage("Admin",`${user.name} has left.`));
     socket.to(user.room).emit("updateUsersList",users.getUserList(user.room));
    }
    });



});//end io connection...

server.listen(port,()=>{
console.log(`App is listening on port ${port}`)});