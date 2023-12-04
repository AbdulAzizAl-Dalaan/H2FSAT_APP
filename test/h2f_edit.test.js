const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('Knowledge Check Test', function() {
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

it('should navigate to Edit h2F assessment page', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Knowledge Check']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);

    //waiting for edit page to show up
    await driver.wait(until.urlContains('/edit/'), 10000); 
  
    //getting the url along with the surveyid of the test we made
    const editUrl = await driver.getCurrentUrl();
    expect(editUrl).to.match(/http:\/\/localhost:3000\/edit\/\d+/);
    
});





it('should add and fill out a new question in the Knowledge Check assessment', async function() {
    this.timeout(100000);

    //add button
    const addQuestionButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Add Question']")), 10000);
    await driver.executeScript("arguments[0].click();", addQuestionButton);

    
    await driver.sleep(1000);

    //title
    const questionTitles = await driver.findElements(By.css('input[type="text"].question-title-space'));
    const newQuestionTitle = questionTitles[questionTitles.length - 1];
    await newQuestionTitle.sendKeys('test physical');

    //question type
    const questionTypeSelects = await driver.findElements(By.css('select.form-control.textbox-space'));
    const newQuestionTypeSelect = questionTypeSelects[questionTypeSelects.length - 1];
    await newQuestionTypeSelect.sendKeys('Sleep');

    
    await driver.sleep(1000);

    //filling in options
    const optionInputs = await driver.findElements(By.css('input[type="text"].form-control.textbox-space'));
    await optionInputs[optionInputs.length - 2].sendKeys('Option 1');
    await optionInputs[optionInputs.length - 1].sendKeys('Option 2');

    //creating a container for the 11th question
    const eleventhQuestionContainer = await driver.wait(until.elementLocated(By.id('question_31_fields')), 10000);

    //adding option 3
    const addOptionButtonFor11th = await eleventhQuestionContainer.findElement(By.xpath(".//button[contains(text(),'Add Option')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", addOptionButtonFor11th);
    await driver.wait(until.elementIsEnabled(addOptionButtonFor11th), 10000);
    await driver.executeScript("arguments[0].click();", addOptionButtonFor11th);

    
    await driver.sleep(1000);

    //fill in option 3
    const optionInputsFor11th = await eleventhQuestionContainer.findElements(By.css("input[type='text'].form-control.textbox-space"));
    const newOptionInputFor11th = optionInputsFor11th[optionInputsFor11th.length - 1];
    await newOptionInputFor11th.sendKeys('Option 3');

    //correct answer is option 3
    const correctAnswerRadios = await eleventhQuestionContainer.findElements(By.css("input[type='radio']"));
    const correctAnswerRadioForOption3 = correctAnswerRadios[correctAnswerRadios.length - 1];
    await correctAnswerRadioForOption3.click();
    
    
});


it('should submit the edited Knowledge Check assessment', async function() {
    this.timeout(20000);

    
    const saveButton = await driver.findElement(By.css("input[type='submit'][value='Save Assessment']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", saveButton);
    await driver.wait(until.elementIsEnabled(saveButton), 10000);
    await driver.wait(until.elementIsVisible(saveButton), 10000);
    await saveButton.click();

    //checking to see if at home
    await driver.wait(until.urlContains('home'), 100000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home');
    
    //await driver.sleep(5000);

    
});

it('should navigate back to Edit Knowledge Check assessment page', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=editsuccess'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home/?msg=editsuccess');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Knowledge Check']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);

    //waiting for edit page to show up
    await driver.wait(until.urlContains('/edit/'), 10000); 
  
    //getting the url along with the surveyid of the test we made
    const editUrl = await driver.getCurrentUrl();
    expect(editUrl).to.match(/http:\/\/localhost:3000\/edit\/\d+/);

    
    
});


it('should edit the 11th question in the Knowledge Check assessment', async function() {
    this.timeout(100000);
    
    //11th question container
    const eleventhQuestionContainer = await driver.wait(until.elementLocated(By.id('question_31_fields')), 10000);

    const questionTitles = await driver.findElements(By.css('input[type="text"].question-title-space'));
    const newQuestionTitle = questionTitles[questionTitles.length - 1];
    await newQuestionTitle.clear();
    await newQuestionTitle.sendKeys('test physical edited');


    const questionTypeSelects = await driver.findElements(By.css('select.form-control.textbox-space'));
    const newQuestionTypeSelect = questionTypeSelects[questionTypeSelects.length - 1];
    await newQuestionTypeSelect.sendKeys('Mental');

    

    //editing option 1 and 2
    const optionInputs = await eleventhQuestionContainer.findElements(By.css("input[type='text'].form-control.textbox-space"));
    await optionInputs[0].clear();
    await optionInputs[0].sendKeys('Option 1 Edited');
    await optionInputs[1].clear();
    await optionInputs[1].sendKeys('Option 2 Edited');

    //deleting option 3
    const removeOptionButtons = await eleventhQuestionContainer.findElements(By.xpath(".//button[contains(text(),'Remove Option')]"));
    const removeOptionButtonForOption3 = removeOptionButtons[removeOptionButtons.length - 1];
    await driver.executeScript("arguments[0].click();", removeOptionButtonForOption3);

    //setting option 1 as the correct answer
    const correctAnswerRadios = await eleventhQuestionContainer.findElements(By.css("input[type='radio']"));
    await driver.executeScript("arguments[0].click();", correctAnswerRadios[0]);

    

    
});

it('should submit the edited Knowledge Check assessment again', async function() {
    this.timeout(20000);

    await driver.sleep(15000);
    const saveButton = await driver.findElement(By.css("input[type='submit'][value='Save Assessment']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", saveButton);
    await driver.wait(until.elementIsEnabled(saveButton), 10000);
    await driver.wait(until.elementIsVisible(saveButton), 10000);
    await driver.executeScript("arguments[0].click();",saveButton);
    //await saveButton.click();
    

    //checking to see if at home
    await driver.wait(until.urlContains('home'), 100000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home');
    
    //await driver.sleep(5000);

    
});


it('should navigate back to Edit Knowledge Check assessment page so we can delete the added question', async function() {
    this.timeout(100000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home/?msg=editsuccess'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home/?msg=editsuccess');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Knowledge Check']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);

    //waiting for edit page to show up
    await driver.wait(until.urlContains('/edit/'), 10000); 
  
    //getting the url along with the surveyid of the test we made
    const editUrl = await driver.getCurrentUrl();
    expect(editUrl).to.match(/http:\/\/localhost:3000\/edit\/\d+/);
    

    
    
});



it('should delete the edited question in the Knowledge Check assessment', async function() {
    this.timeout(100000);

    
    await driver.sleep(5000);

    //getting all the question title inputs
    const questionTitles = await driver.findElements(By.css('input[type="text"].question-title-space'));
    let deleteButtonForEditedQuestion;

    for (const titleInput of questionTitles) {
        const title = await titleInput.getAttribute('value');

        if (title === 'test physical edited') {
            //get the question number
            const nameAttribute = await titleInput.getAttribute('name');
            const questionNumber = nameAttribute.split('_')[1];

            //finding the delete button for the edited question
            deleteButtonForEditedQuestion = await driver.findElement(By.xpath(`//div[@id='question_${questionNumber}_fields']/preceding-sibling::div//button[contains(text(),'Delete Question')]`));
            break;
        }
    }

    if (!deleteButtonForEditedQuestion) {
        throw new Error('Edited question not found');
    }

    //deleting the question i created in test
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButtonForEditedQuestion);
    await driver.executeScript("arguments[0].click();", deleteButtonForEditedQuestion);

});


it('should submit the edited Knowledge Check assessment for the last time without the edited question', async function() {
    this.timeout(20000);

    
    const saveButton = await driver.findElement(By.css("input[type='submit'][value='Save Assessment']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", saveButton);
    await driver.wait(until.elementIsEnabled(saveButton), 10000);
    await driver.wait(until.elementIsVisible(saveButton), 10000);
    await saveButton.click();
    

    //checking to see if at home
    await driver.wait(until.urlContains('home'), 100000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home');
    
    await driver.sleep(1000);

    
});



after(async function() {
    this.timeout(20000);
    await driver.quit();
});

});