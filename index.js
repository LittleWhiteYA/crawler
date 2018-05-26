require('dotenv').config();
const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

const callImageRecognition = require('./callImageRecognition');
const opImages = require('./imagemin');

const { USERNAME, PASSWORD, IR_URL } = process.env;

(async () => {
  const driver = await new Builder().forBrowser('firefox').build();

  await driver.get(
    'https://www.jkforum.net/member.php?mod=logging&action=login'
  );
  await driver.findElement(By.name('username')).sendKeys(USERNAME);
  await driver.findElement(By.name('password')).sendKeys(PASSWORD);
  while (true) {
    try {
      console.log('wait 10s');
      await driver.sleep(10000);
      await driver.findElement(By.css('.pn.pnc')).click();
      break;
    } catch (err) {
      console.error('click error!');
    }
  }

  while (true) {
    try {
      await driver.get('https://www.jkforum.net/business');
      await driver.findElement(By.id('checkAll')).click();
      driver.findElement(By.id('setAllFreeBtn')).click();
      await driver.sleep(1000);

      console.log('wait for ajax');
      await driver.sleep(5000);

      console.log('store screenshot!');
      const base64Data = await driver.takeScreenshot();

      const filename = `out_${new Date().getMilliseconds()}.png`;
      fs.writeFileSync(`images/${filename}`, base64Data, 'base64');
      await opImages(`images/${filename}`);

      let result;
      do {
        console.log('wait for image recognition.');
        result = await callImageRecognition(IR_URL, `opImages/${filename}`);
        console.log({ result });
      } while (!result.Result);

      await driver.findElement(By.id('captcha_input')).sendKeys(result.Result);
      await driver.findElement(By.className('pn pnc xs1')).click();
    } catch (err) {
      console.error(err);
    } finally {
      await driver.sleep(60000);
    }
  }
})();
