const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

let driver;

describe('Create, Edit, and Delete Survey Test', function() {
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

it('should navigate to Create Assessment page from Home', async function() {
    this.timeout(10000);
    const uploadLink = await driver.findElement(By.linkText('Create Assessment'));
    await uploadLink.click();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal('http://localhost:3000/create');
});


it('should allow toggling of password input', async function() {
    this.timeout(10000);
  
    //looking for require password box
    const secureCheckbox = await driver.findElement(By.id('secure'));
    await secureCheckbox.click();
  
    //seeing if password is enabled
    const passwordInput = await driver.findElement(By.id('password'));
    let isDisabled = await passwordInput.getAttribute('disabled');
    expect(isDisabled).to.equal(null); //this reqires the password
    
    //now diabling the password
    await secureCheckbox.click();
    isDisabled = await passwordInput.getAttribute('disabled');
    expect(isDisabled).to.equal('true'); //password should not be enabled for the next tests
});



it('should allow addition of a question', async function() {
    this.timeout(10000);
    
    
    //finding the add question button
    const addQuestionButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Add Question']")), 10000);
    await driver.executeScript("document.querySelector('button.btn.btn-primary').click();");
    
    //making sure the options are in view
    const questionFields = await driver.findElements(By.css('#questions .form-group'));
    expect(questionFields.length).to.be.above(0); 
});



it('should allow addition of questions of different forms', async function() {
    this.timeout(20000);

    //assigning assessment title
    const titleInput = await driver.findElement(By.id('title'));
    await titleInput.sendKeys('Test Assessment');
  
    const descriptionTextArea = await driver.findElement(By.id('description'));
    await descriptionTextArea.sendKeys('This is a test assessment.');

    //adding the first question
    const firstQuestionTitle = await driver.findElement(By.name('question_1_title'));
    await firstQuestionTitle.sendKeys('First Question');
    
    const firstQuestionType = await driver.findElement(By.name('question_1_type'));
    await firstQuestionType.sendKeys('checkbox');
    
    const option1Input = await driver.findElement(By.name('question_1_option_1'));
    await option1Input.sendKeys('Option 1 Text');
    
    const option2Input = await driver.findElement(By.name('question_1_option_2'));
    await option2Input.sendKeys('Option 2 Text');

    const addOptionButton = await driver.findElement(By.xpath("//button[contains(text(),'Add Option')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", addOptionButton);
    await driver.wait(until.elementIsEnabled(addOptionButton), 10000);
    await driver.wait(until.elementIsVisible(addOptionButton), 10000);
    await driver.executeScript("arguments[0].click();", addOptionButton);

    await driver.wait(until.elementLocated(By.name(`question_1_option_3`)), 10000);
    const option3Input = await driver.findElement(By.name('question_1_option_3'));
    await option3Input.sendKeys('Option 3 Text');

    //adding the second question
    const addQuestionButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Add Question']")), 10000);
    await driver.executeScript("arguments[0].click();", addQuestionButton);

    const secondQuestionTitle = await driver.findElement(By.name('question_2_title'));
    await secondQuestionTitle.sendKeys('Second Multiple Choice Question');

    const secondQuestionType = await driver.findElement(By.name('question_2_type'));
    await secondQuestionType.sendKeys('multiple choice'); 

    for (let i = 1; i <= 2; i++) {
        const optionInput = await driver.findElement(By.name(`question_2_option_${i}`));
        await optionInput.sendKeys(`Multiple Choice ${i}`);
    }

    const secondQuestionFieldsDiv = await driver.findElement(By.id('question_2_fields'));
    const addOptionButtonq2 = await secondQuestionFieldsDiv.findElement(By.xpath(".//button[contains(text(),'Add Option')]"));

    await driver.executeScript("arguments[0].scrollIntoView(true);", addOptionButtonq2);
    await driver.wait(until.elementIsEnabled(addOptionButtonq2), 10000);
    await driver.wait(until.elementIsVisible(addOptionButtonq2), 10000);
    await driver.executeScript("arguments[0].click();", addOptionButtonq2);


    const optionInputq23 = await driver.findElement(By.name(`question_2_option_3`));
    await optionInputq23.sendKeys(`Multiple Choice 3`);


    //adding a thrid question that is of type text
    const addQuestionButtonForThird = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Add Question']")), 10000);
    await driver.executeScript("arguments[0].click();", addQuestionButtonForThird);

    const thirdQuestionTitle = await driver.findElement(By.name('question_3_title'));
    await thirdQuestionTitle.sendKeys('Third Text Question');
    const thirdQuestionTitleValue = await thirdQuestionTitle.getAttribute('value');
    expect(thirdQuestionTitleValue).to.equal('Third Text Question');

    
    const thirdQuestionType = await driver.findElement(By.name('question_3_type'));
    await thirdQuestionType.sendKeys('text');
    const thirdQuestionTypeValue = await thirdQuestionType.getAttribute('value');
    expect(thirdQuestionTypeValue).to.equal('text');  
    


    //adding the fourth question of type number range
    const addQuestionButtonForFourth = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Add Question']")), 10000);
    await driver.executeScript("arguments[0].click();", addQuestionButtonForFourth);
    
    const fourthQuestionTitle = await driver.findElement(By.name('question_4_title'));
    await fourthQuestionTitle.sendKeys('Fourth Number Range Question');
    const fourthQuestionTitleValue = await fourthQuestionTitle.getAttribute('value');
    expect(fourthQuestionTitleValue).to.equal('Fourth Number Range Question');
    
    const fourthQuestionType = await driver.findElement(By.name('question_4_type'));
    await fourthQuestionType.sendKeys('number range');
    
    const numberInputs = await driver.findElements(By.css('input[type="number"]'));
    const topRangeInput = numberInputs[0];  
    const bottomRangeInput = numberInputs[1];  
    

    await topRangeInput.sendKeys('10');  
    await bottomRangeInput.sendKeys('1');  

    const topRangeValue = await topRangeInput.getAttribute('value');
    expect(topRangeValue).to.equal('10');
    const bottomRangeValue = await bottomRangeInput.getAttribute('value');
    expect(bottomRangeValue).to.equal('1');
    


});





it('should submit the form with valid inputs', async function() {
    this.timeout(20000);

    const submitButton = await driver.findElement(By.css('.btn-warning'));
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await driver.wait(until.elementIsEnabled(submitButton), 10000);
    await driver.wait(until.elementIsVisible(submitButton), 10000);
    await driver.executeScript("arguments[0].click();", submitButton);

    await driver.wait(until.urlContains('home'), 100000); 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home');
});




it('should navigate to the Edit Assessment page when Edit button is clicked', async function() {
    this.timeout(10000); 
  
    
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
    const homeUrl = await driver.getCurrentUrl();
    expect(homeUrl).to.equal('http://localhost:3000/home');

    //finding the test we just made so we can press edit
    const editButtonXPath = "//h5[strong[normalize-space()='Test Assessment']]/ancestor::div[contains(@class,'card')]//a[contains(@href, '/edit/') and contains(text(),'Edit')]";
    const editButton = await driver.findElement(By.xpath(editButtonXPath));
    await driver.executeScript("arguments[0].click();", editButton);

    //waiting for edit page to show up
    await driver.wait(until.urlContains('/edit/'), 10000); 
  
    //getting the url along with the surveyid of the test we made
    const editUrl = await driver.getCurrentUrl();
    expect(editUrl).to.match(/http:\/\/localhost:3000\/edit\/\d+/); 
});


it('should allow editing of an existing assessment', async function() {
    this.timeout(20000);


    //changing title
    const titleInput = await driver.findElement(By.id('title'));
    await titleInput.clear();
    await titleInput.sendKeys('Test Assessment Edited');

    //changing description
    const descriptionTextArea = await driver.findElement(By.id('description'));
    await descriptionTextArea.clear();
    await descriptionTextArea.sendKeys('This is a test assessment edited.');

    //changing question title
    const firstQuestionTitle = await driver.findElement(By.name('question_1_title'));
    await firstQuestionTitle.clear();
    await firstQuestionTitle.sendKeys('FQ1 Edited');

    //changing option 1
    const option1Input = await driver.findElement(By.name('question_1_option_1'));
    await option1Input.clear();
    await option1Input.sendKeys('OP1 Edited');

    //changing option 2
    const option2Input = await driver.findElement(By.name('question_1_option_2'));
    await option2Input.clear();
    await option2Input.sendKeys('OP2 Edited');

    //changing option 3
    const option3Input = await driver.findElement(By.name('question_1_option_3'));
    await option3Input.clear();
    await option3Input.sendKeys('OP3 Edited');
    


    //editing the second question
    const secondQuestionTitle = await driver.findElement(By.name('question_2_title'));
    await secondQuestionTitle.clear();
    await secondQuestionTitle.sendKeys('Second Question Edited');

    //changing options
    for (let i = 1; i <= 3; i++) {
        const optionInput = await driver.findElement(By.name(`question_2_option_${i}`));
        await optionInput.clear();
        await optionInput.sendKeys(`Option ${i} Edited`);
    }

    //editing the third question
    const thirdQuestionTitle = await driver.findElement(By.name('question_3_title'));
    await thirdQuestionTitle.clear();
    await thirdQuestionTitle.sendKeys('Third Question Edited');

    //edit the fourth question (Number Range type)
    const fourthQuestionTitle = await driver.findElement(By.name('question_4_title'));
    await fourthQuestionTitle.clear();
    await fourthQuestionTitle.sendKeys('Fourth Question Edited');

    const numberInputs = await driver.findElements(By.css('input[type="number"]'));
    const fourthTopRangeInput = numberInputs[0];  
    const fourthBottomRangeInput = numberInputs[1];  
    await fourthTopRangeInput.clear();
    await fourthTopRangeInput.sendKeys('9');
    await fourthBottomRangeInput.clear();
    await fourthBottomRangeInput.sendKeys('2');



    
});


it('should allow deletion of the fourth question', async function() {
    this.timeout(20000);

    const deleteButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Delete Question')]"));
    const deleteButtonForFourth = deleteButtons[3]; 
    await driver.executeScript("arguments[0].click();", deleteButtonForFourth);


    
    await driver.sleep(2000);
});



it('should submit the edited assessment', async function() {
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

    
});




it('should delete an existing assessment', async function() {
    this.timeout(20000);

    
    await driver.get('http://localhost:3000/home');

    
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
    
    const assessmentTitle = 'Test Assessment Edited';
    const deleteButtonXPath = `//h5[strong[normalize-space()="${assessmentTitle}"]]/ancestor::div[contains(@class,'custom-card')]//button[contains(@class,'deleteBtn')]`;

    //waiting for delete button
    const deleteButton = await driver.wait(until.elementLocated(By.xpath(deleteButtonXPath)), 10000);
    
    //getting the delete button into view
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteButton);
    
    
    await driver.wait(async () => {
        const isEnabled = await deleteButton.isEnabled();
        const isDisplayed = await deleteButton.isDisplayed();
        return isEnabled && isDisplayed;
    }, 10000);
    
    await driver.executeScript("arguments[0].click();", deleteButton);
    

    //waiting for popup
    const deleteModalSelector = '#deleteModal';
    await driver.wait(until.elementLocated(By.css(deleteModalSelector)), 10000);

    //clicking the confirm delete of test
    const confirmDeleteButtonSelector = `${deleteModalSelector} .modal-footer .btn-danger`;
    const confirmDeleteButton = await driver.findElement(By.css(confirmDeleteButtonSelector));
    await driver.executeScript("arguments[0].click();", confirmDeleteButton);

    
    const expectedUrl = 'http://localhost:3000/home/?msg=delete';
    await driver.wait(until.urlIs(expectedUrl), 20000);

    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/home/?msg=delete');
});


after(async function() {
    this.timeout(20000);
    await driver.quit();
});


});
