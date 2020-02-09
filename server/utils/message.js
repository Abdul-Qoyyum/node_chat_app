const moment = require("moment");
const date = moment().valueOf();

const generateMessage = (from, message) => {
  return {
    from,
    message,
    createdAt : moment(date).format("h:mm a")
  }
};



const generateLocationMessage = (from, latitude, longitude) => {

  return {
  from,
  url : `http://www.google.com/maps?q=${latitude},${longitude}`,
  createdAt : moment(date).format("h:mm a")
  }

};

module.exports = {
  generateMessage,
  generateLocationMessage
};