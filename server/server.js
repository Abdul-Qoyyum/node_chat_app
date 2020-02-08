const http = require("http");
const moment = require("moment");
const sockets = require("socket.io");
const express = require('express');
const port = process.env.PORT || 3000;
const path = require("path").join(`${__dirname}/../public`);
const {generateMessage, generateLocationMessage } = require("./utils");
const app = express();
app.use("/",express.static(path));
const server = http.createServer(app);
const io = sockets(server);

io.on("connection",(socket) => {
socket.broadcast.emit("newMessage", generateMessage("Admin","New user joined chat."));

socket.emit("newMessage",generateMessage("Admin", "Welcome to the chat app."));

socket.on("createMessage",(msg,callback) => {
 io.emit("newMessage",generateMessage(msg.from, msg.message));
  callback("Response from the server");
  });
socket.on("createLocationMessage",coords=>{
const {latitude, longitude } = coords;
io.emit("generateLocationMessage",generateLocationMessage("Admin", latitude,longitude));
 });
});

server.listen(port,()=>{
console.log(`App is listening on port ${port}`)});