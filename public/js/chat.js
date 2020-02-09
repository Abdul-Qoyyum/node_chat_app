const socket = io();
socket.on("connect",function(){
  const params = $.deparam(window.location.search);

  socket.emit("join",params,function(err){
   if(err){
     alert(err);
     window.location.href = "/";
   }

  });

//wait for the dom to finish loading
$(document).ready(function(){
 const scrollToBottom = () => {
    //selectors
    let messages = $("#messages");
    let newMessage = $("#messages").children("li:last-child");

    //heights
    let scrollHeight = messages.prop("scrollHeight");
    let clientHeight = messages.prop("clientHeight");
    let scrollTop = messages.prop("scrollTop");
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

if(scrollHeight + clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
   messages.scrollTop(scrollHeight);
   }
  }

 socket.on("updateUsersList",function(users){
    let ol = $("<ol></ol>");

    users.forEach(function(user){
      ol.append($("<li></li>").text(user));
     });

   $("#users").html(ol);

  });


$("#messages-form").on("submit",e => {
  e.preventDefault();

  let message = $("[name=message]");

  socket.emit("createMessage",{
    from : "User",
    message : message.val()
    },function(){
   message.val("");
    });
  scrollToBottom();
  });

  //save the get location button
  let locationButton = $("#send-location");
  //handle the location button...
  locationButton.on("click",()=> {
if(!navigator.geolocation){
  return alert("Geolocation is not supported by your browser.");
}

locationButton.attr("disabled","disabled").text("Sending location...");

navigator.geolocation.getCurrentPosition(function(position){

locationButton.removeAttr("disabled").text("Send location");

  socket.emit("createLocationMessage",{
  latitude : position.coords.latitude,
  longitude:position.coords.longitude
  });

},function(){

locationButton.removeAttr("disabled").text("Send location");

});

    scrollToBottom();

  });

 });//end Jquery document ready function


});


socket.on("generateLocationMessage",function(message){
  let template = $("#location-message-template").html();
  let html = Mustache.render(template,{
  from : message.from,
  url : message.url,
  createdAt : message.createdAt
  });
  $("#messages").append(html);

 });


socket.on("newMessage",function(msg){
  let template = $("#message-template").html();
  let html = Mustache.render(template,{
  from : msg.from,
  text : msg.message,
  createdAt : msg.createdAt
  });
  //render message on the page
  $("#messages").append(html);

});


socket.on("disconnect",function(){
console.log("A user has disconnected.");
});