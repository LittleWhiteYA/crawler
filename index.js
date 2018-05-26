require('dotenv').config();
// const { Builder, By, Capabilities, WebDriver } = require('selenium-webdriver');
const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

const { USERNAME, PASSWORD } = process.env;

(async () => {
  /*
  const required = Capabilities.firefox();
  console.log({ required });
  const driver = WebDriver.createSession(, { required });
  */
  const driver = await new Builder().forBrowser('firefox').build();

  console.log(driver);

  await driver.get(
    'https://www.jkforum.net/member.php?mod=logging&action=login'
  );
  await driver.findElement(By.name('username')).sendKeys(USERNAME);
  await driver.findElement(By.name('password')).sendKeys(PASSWORD);
  while (true) {
    try {
      console.log('wait 5s');
      await driver.sleep(5000);
      await driver.findElement(By.css('.pn.pnc')).click();
      break;
    } catch (err) {
      console.error('click error!');
    }
  }

  while (true) {
    try {
      await driver.get('https://www.jkforum.net/business');
      // await driver.get(URL);
      await driver.findElement(By.id('checkAll')).click();
      driver.findElement(By.id('setAllFreeBtn')).click();
      await driver.sleep(1000);
      break;
    } catch (err) {
      console.error(err);
      await driver.sleep(5000);
    }
  }
  try {
    console.log('wait for ajax');
    await driver.sleep(5000);

    console.log('store screenshot!');
    const base64Data = await driver.takeScreenshot();
    fs.writeFileSync(
      `out_${new Date().getMilliseconds()}.png`,
      base64Data,
      'base64'
    );

    await driver.findElement(By.id('captcha_input')).sendKeys('123');
  } catch (err) {
    console.error(err);
  } finally {
    await driver.sleep(5000);
    await driver.quit();
  }
})();
