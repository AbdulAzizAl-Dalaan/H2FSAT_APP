const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('Movement Screening Test', function() {
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

    await emailInput.sendKeys('brian.harder@army.mil');
    await passwordInput.sendKeys('1234');
    
    const submitButton = await driver.findElement(By.css('input[type="submit"]'));
    await submitButton.click();
    
    
});

  

it('should check some functionality after login', async function() {
    this.timeout(10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/home');
});

it('should navigate to Edit and delete of movement screening assessment checking I cannot do any of these things', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Movement Screening']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);

    //waiting for edit page to show up
    await driver.wait(until.urlContains('/?msg=editcore'), 10000); 

   

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
    
    
});


it('should enter password and start Movement Screening assessment', async function() {
    this.timeout(10000); 

    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=delcore'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home/?msg=delcore');

    //locating movement screening
    const formXPath = "//h5[strong[normalize-space()='Movement Screening']]/ancestor::div[contains(@class,'card')]//form";
    const form = await driver.findElement(By.xpath(formXPath));

    //enter in password
    const passwordInput = await form.findElement(By.id('password'));
    await passwordInput.sendKeys('1234');

    //clicking start assessment
    const startButton = await form.findElement(By.xpath(".//button[contains(text(),'Start Assessment')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", startButton);
    await driver.executeScript("arguments[0].click();", startButton);
    

    //waiting and checking url
    await driver.wait(until.urlContains('home/3'), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('home/3');
    await driver.sleep(1000);

    
});

it('should fill in and submit the Movement Screening assessment', async function() {
    this.timeout(30000); 
    
    await driver.sleep(1000);

    const questionInput = await driver.findElement(By.id(`answer_1`)); 
    await questionInput.sendKeys('test');
    
    //entering in the first 6 questions
    for (let i = 2; i <= 6; i++) {
        const questionInput = await driver.findElement(By.id(`answer_${i}`)); 
        await questionInput.sendKeys('3');
    }
    
    
    //submit button
    const submitButton = await driver.findElement(By.css("input[type='submit'][value='Submit']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await driver.executeScript("arguments[0].click();", submitButton);
    

    //waiting and checking url
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=fms'), 20000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home/?msg=fms');
    await driver.sleep(1000);
    
});

it('should fill in and submit the Movement Screening assessment for the 7th question', async function() {
    this.timeout(30000); 


    const formXPath = "//h5[strong[normalize-space()='Movement Screening']]/ancestor::div[contains(@class,'card')]//form";
    const form = await driver.findElement(By.xpath(formXPath));

    //entering password
    const passwordInput = await form.findElement(By.id('password'));
    await passwordInput.sendKeys('1234');

    //clicking start assessment
    const startButton = await form.findElement(By.xpath(".//button[contains(text(),'Start Assessment')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", startButton);
    await driver.executeScript("arguments[0].click();", startButton);
    

    //waiting and checking url
    await driver.wait(until.urlContains('home/3'), 10000);
    const currentUrl1 = await driver.getCurrentUrl();
    expect(currentUrl1).to.include('home/3');
    await driver.sleep(1000);

    //graders name
    const questionInput = await driver.findElement(By.id(`answer_1`)); 
    await questionInput.sendKeys('test2');
    
    
    //entering in the 7th question information
    const questionInput1 = await driver.findElement(By.id(`answer_7`)); 
    await questionInput1.sendKeys('3');
    
    
    //submit button
    const submitButton = await driver.findElement(By.css("input[type='submit'][value='Submit']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await driver.executeScript("arguments[0].click();", submitButton);


    //waiting and checking url
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=fms'), 20000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home/?msg=fms');
    await driver.sleep(1000);
    
});





it('should fill in and submit the Movement Screening assessment for the 8th question', async function() {
    this.timeout(30000); 


    const formXPath = "//h5[strong[normalize-space()='Movement Screening']]/ancestor::div[contains(@class,'card')]//form";
    const form = await driver.findElement(By.xpath(formXPath));

    //entering password
    const passwordInput = await form.findElement(By.id('password'));
    await passwordInput.sendKeys('1234');

    //clicking start assessment
    const startButton = await form.findElement(By.xpath(".//button[contains(text(),'Start Assessment')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", startButton);
    await driver.executeScript("arguments[0].click();", startButton);
    

    //waiting and checking url
    await driver.wait(until.urlContains('home/3'), 10000);
    const currentUrl1 = await driver.getCurrentUrl();
    expect(currentUrl1).to.include('home/3');

    await driver.sleep(1000);
    //graders name
    const questionInput = await driver.findElement(By.id(`answer_1`)); 
    await questionInput.sendKeys('test3');
    
    
    //filling in the last question in fms
    const questionInput1 = await driver.findElement(By.id(`answer_8`)); 
    await questionInput1.sendKeys('3');
    
    
    //submitting
    const submitButton = await driver.findElement(By.css("input[type='submit'][value='Submit']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await driver.executeScript("arguments[0].click();", submitButton);

    //waiting and checking url
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=fms'), 20000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home/?msg=fms');
    await driver.sleep(1000);
    
});



after(async function() {
    this.timeout(20000);
    await driver.quit();
});

});