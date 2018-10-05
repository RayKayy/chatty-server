const getColor = require('randomcolor');

const imgRegex = /^(https?:\/\/).+(.jpg|.gif|.png)$/

const checkContentImg = content => {
  return content.split(' ').filter(str => imgRegex.test(str));
}

const uniqueColor = (used) => {
  let newColor = getColor();
  while (used.includes(newColor)) {
    newColor = getColor();
  }
  return newColor;
}

module.exports = { uniqueColor, checkContentImg };