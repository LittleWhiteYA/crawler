const fs = require('fs');
const rest = require('restler');

const { API_USERNAME, API_PASSWORD, TYPEID, SOFTID, SOFTKEY } = process.env;

module.exports = function callImageRecognition(url, filename) {
  return new Promise(resolve => {
    rest
      .post(url, {
        multipart: true,
        data: {
          username: API_USERNAME,
          password: API_PASSWORD,
          typeid: TYPEID,
          softid: SOFTID,
          softkey: SOFTKEY,
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
