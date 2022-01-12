const colors = require('colors');
module.exports = {
  failure: (...error) => {
    console.error(colors.red(...error));
  },
  success: (...info) => {
    console.log(colors.green(...info));
  },
  info: (...info) => {
    console.log(...info)
  },
};