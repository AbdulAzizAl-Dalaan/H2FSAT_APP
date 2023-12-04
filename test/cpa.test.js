const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('Cognitive Performance Test', function() {
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

it('should navigate to Edit of Cognitive Performance assessment checking I cannot do this', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Cognitive Performance']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);


    //waiting and checking url
    await driver.wait(until.urlContains('/?msg=editcore'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/?msg=editcore');
    await driver.sleep(4000);
    
});


it('should navigate to Delete of Cognitive Performance assessment checking I cannot do this', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=editcore'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home/?msg=editcore');

    const deleteButtonXPath = "//h5[strong[normalize-space()='Movement Screening']]/ancestor::div[contains(@class,'card')]//button[contains(@class, 'deleteBtn')]";
    const deleteButton = await driver.findElement(By.xpath(deleteButtonXPath));
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButton);
    await driver.executeScript("arguments[0].click();", deleteButton);

    //clicking delete warning
    await driver.wait(until.elementLocated(By.id('deleteModal')), 10000);
    const modalDeleteButton = await driver.findElement(By.xpath("//div[@id='deleteModal']//button[@type='submit']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", modalDeleteButton);
    await driver.executeScript("arguments[0].click();", modalDeleteButton);

    //waiting and checking url
    await driver.wait(until.urlContains('/?msg=delcore'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/?msg=delcore');
    await driver.sleep(4000);
    
    
});






after(async function() {
    this.timeout(20000);
    await driver.quit();
});

});