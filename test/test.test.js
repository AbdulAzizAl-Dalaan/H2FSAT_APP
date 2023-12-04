const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('File Upload Test', function() {
  this.timeout(10000);

  before(async function() {
    this.timeout(10000);
    driver = await new Builder().forBrowser('chrome').build();
    
    await driver.get('http://localhost:3000');
    

    
    
    const loginLink = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Login as Unit Leader or Admin')]")), 100000);
    await driver.executeScript("arguments[0].click();", loginLink);
    


  });

  it('should navigate to passlogin and login', async function() {
    
    await driver.wait(until.urlIs('http://localhost:3000/passlogin'), 100000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/passlogin');
    
    
    // const emailInput = await driver.findElement(By.id('login'));
    const emailInput = await driver.wait(until.elementIsVisible(driver.findElement(By.id('login'))), 10000);

    
    

    const passwordInput = await driver.wait(until.elementIsVisible(driver.findElement(By.id('password'))), 10000);

    

    await emailInput.sendKeys('brian.adams@army.mil');
    
    await passwordInput.sendKeys('1234');
    

    const submitButton = await driver.findElement(By.css('input[type="submit"]'));
    await submitButton.click();
    
    
  });

  

  it('should check some functionality after login', async function() {
    this.timeout(10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/home');
  });

  it('should navigate to Upload page from Home', async function() {
    this.timeout(10000);
    const uploadLink = await driver.findElement(By.linkText('Upload Excel'));
    await uploadLink.click();

    const currentUrl = await driver.getCurrentUrl();
    
    expect(currentUrl).to.equal('http://localhost:3000/upload');
  });

  it('should upload file and show success message', async function() {
    this.timeout(30000);
    await driver.get('http://localhost:3000/upload');
    
    //selecting from the dropdown
    const dropdown = await driver.findElement(By.name('surveySelection'));
    await dropdown.sendKeys('New Survey'); //selecting new survey

    //sending the new file path
    const fileInput = await driver.findElement(By.name('file'));
    await fileInput.sendKeys('C:\\Users\\Aaron Strakaa\\OneDrive - Washington State University (email.wsu.edu)\\Desktop\\application testing\\H2FSAT_APP\\test\\Survey One 22.csv');

    //check if theres an alert and handle it
    try {
        let alert = await driver.switchTo().alert();
        await alert.accept();
    } catch (error) {
        
    }

    //waiting for submit button
    let clickableSubmitButton = await driver.wait(until.elementLocated(By.css('input[type="submit"]')), 10000);
    await driver.executeScript("arguments[0].click();", clickableSubmitButton);

    //wait for navigation to the home page
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=uploaded'), 10000);

    //wait for the success message to be displayed
    const successAlert = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 10000);
    const alertText = await successAlert.getText();
    expect(alertText).to.contain('CSV data successfully uploaded');

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/home/?msg=uploaded');
});


it('should take me back to upload page', async function() {
  this.timeout(10000);
  const uploadLink = await driver.findElement(By.linkText('Upload Excel'));
  await uploadLink.click();

  const currentUrl = await driver.getCurrentUrl();
  
  expect(currentUrl).to.equal('http://localhost:3000/upload');
});


it('should upload file into survey one', async function() {
  this.timeout(30000);
  await driver.get('http://localhost:3000/upload');
  
  
  const dropdown = await driver.findElement(By.name('surveySelection'));
  await dropdown.sendKeys('Survey One'); 

  
  const fileInput = await driver.findElement(By.name('file'));
  await fileInput.sendKeys('C:\\Users\\Aaron Strakaa\\OneDrive - Washington State University (email.wsu.edu)\\Desktop\\application testing\\H2FSAT_APP\\test\\Survey One 22.csv');

  
  try {
      let alert = await driver.switchTo().alert();
      await alert.accept();
  } catch (error) {
      
  }

  
  let clickableSubmitButton = await driver.wait(until.elementLocated(By.css('input[type="submit"]')), 10000);
  await driver.executeScript("arguments[0].click();", clickableSubmitButton);

  
  await driver.wait(until.urlIs('http://localhost:3000/home/?msg=uploaded'), 10000);

  
  const successAlert = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 10000);
  const alertText = await successAlert.getText();

  
  expect(alertText).to.contain('CSV data successfully uploaded');

  

  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).to.equal('http://localhost:3000/home/?msg=uploaded');
});

after(async function() {
  this.timeout(20000);
  await driver.quit();
});


});
