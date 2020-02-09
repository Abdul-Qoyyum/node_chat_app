//validate the input field to be string
//and must not be empty
const isRealString = (str) => {
  return typeof str == "string" && str.trim().length > 0;
};

module.exports = {
  isRealString
}