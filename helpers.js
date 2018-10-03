const getColor = require('randomcolor');

const checkContentImg = content => {
  return content.split(' ').filter(str => {
    if ((str.slice(-4) === '.jpg') || (str.slice(-4) === '.png') || (str.slice(-4) === '.gif')) {
      return str;
    }
  });
}

const uniqueColor = (used) => {
  let newColor = getColor();
  while (used.includes(newColor)) {
    newColor = getColor();
  }
  return newColor;
}

module.exports = { uniqueColor, checkContentImg };