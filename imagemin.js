const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = function opImages(filename) {
  return imagemin([filename], 'opImages', {
    plugins: [imageminPngquant({ quality: '65-80' })],
  });
};
