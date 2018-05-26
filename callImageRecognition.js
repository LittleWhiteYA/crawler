const fs = require('fs');
const rest = require('restler');

module.exports = function callImageRecognition(url, filename) {
  return new Promise(resolve => {
    rest
      .post(url, {
        multipart: true,
        data: {
          username: 'ow65544978',
          password: 'qaz123456',
          typeid: '1040',
          softid: '104944',
          softkey: 'dd8fe811b5df4459970137691cd525ae',
          image: rest.file(
            filename,
            null,
            fs.statSync(filename).size,
            null,
            'image/png'
          ),
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .on('complete', data => {
        const captcha = JSON.parse(data);

        resolve(captcha);
      });
  });
};
