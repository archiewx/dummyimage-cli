const got = require('got');

const defaultOptions = {
  size: '500x300',
  color: 'fff',
  bgColor: '000',
};

exports.defaultOptions = defaultOptions;

function mergeOption(options) {
  return Object.keys(options).reduce((acc, key) => {
    if (options[key]) acc[key] = options[key];
    else acc[key] = defaultOptions[key];
    return acc;
  }, {});
}

function createDummyImage(options) {
  const mOption = mergeOption(options);
  const { size, color, bgColor, text } = mOption;

  const host = `https://dummyimage.com/${size}/${bgColor}/${color}&text=${text || size}`;
  return host;
}

exports.downloadDummyImage = function downloadDummyImage(options) {
  const dummyHost = createDummyImage(options);
  return got(dummyHost).buffer();
};

/**
 *
 * @param {string} color
 */
exports.removeHexColorPrefix = function (color) {
  if (typeof color === 'string' && color.startsWith('#')) return color.substring(1);
  return color;
};
