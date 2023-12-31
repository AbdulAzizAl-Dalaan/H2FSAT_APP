let questionCount = 0;
// AUTO FORMATTING WILL BREAK THE - IN THE EJS TAG
current_survey_questions.forEach((question, index) => {
  // repopulate the questions for the first time
  addQuestion(question, index);
});

function repopulateQuestions() {
  // delete everything in the questions div
  questionCount = 0;
  const questionsDiv = document.getElementById("questions");
  questionsDiv.innerHTML = "";
  current_survey_questions.forEach((question, index) => {
    addQuestion(question, index);
  });
  if (current_survey_questions.length === 0) {
    questionCount = 0;
    document.getElementById("num_questions").value = questionCount;
  }
}

function deleteQuestion(questionNumber) {
  // delete from current_survey_questions
  saveQuestionsState();
  current_survey_questions.splice(questionNumber - 1, 1);
}

function changeQuestionType(questionNumber) {
  // change question type in current_survey_questions
  const questionTypeSelect = document.querySelector(
    `select[name="question_${questionNumber}_type"]`
  );
  const questionType = questionTypeSelect.value;
  current_survey_questions[questionNumber - 1].type = questionType;
  saveQuestionsState();
  repopulateQuestions();
}

function saveQuestionsState() {
  // clear the current_survey_questions array
  current_survey_questions = [];

  const questionsDiv = document.getElementById("questions");
  const questionDivs = questionsDiv.children;

  // iterate through the question divs and save the state into current_survey_questions
  for (let i = 0; i < questionDivs.length; i += 2) {
    const questionTypeFormGroup = questionDivs[i];
    const questionFieldsDiv = questionDivs[i + 1];

    const questionTitle =
      questionTypeFormGroup.querySelector('input[type="text"]');
    const questionTypeSelect = questionTypeFormGroup.querySelector("select");
    const questionType = questionTypeSelect.value;
    const questionTitleValue = questionTitle.value;

    // create a new question object
    const question = {
      prompt: questionTitleValue,
      type: questionType,
      answers: [],
    };

    if (questionType === "checkbox" || questionType === "multiple_choice") {
      // get all the options
      const options = questionFieldsDiv.querySelectorAll('input[type="text"]');
      options.forEach((option) => {
        const optionValue = option.value;
        const optionObj = {
          text: optionValue,
        };
        question.answers.push(optionObj);
      });
    } else if (questionType === "number_range") {
      const topRangeInput =
        questionFieldsDiv.querySelector('input[name*="top"]');
      const bottomRangeInput = questionFieldsDiv.querySelector(
        'input[name*="bottom"]'
      );
      const topRangeValue = topRangeInput.value;
      const bottomRangeValue = bottomRangeInput.value;
      question.top_range = topRangeValue;
      question.bottom_range = bottomRangeValue;
    }

    // push the question into current_survey_questions
    current_survey_questions.push(question);
    console.log(current_survey_questions);
  }
}

function addQuestion(question = null, index = null) {
  // handles the question input fields
  questionCount++;

  // creates the dropdown
  const questionTypeSelect = document.createElement("select");
  questionTypeSelect.classList.add("form-control", "textbox-space");
  questionTypeSelect.setAttribute("name", `question_${questionCount}_type`);
  questionTypeSelect.setAttribute(
    "onchange",
    `toggleQuestionFields(${null}, ${questionCount}, ${questionTypeSelect})`
  );

  const checkboxOption = document.createElement("option");
  checkboxOption.setAttribute("value", "checkbox");
  checkboxOption.textContent = "Checkbox";
  questionTypeSelect.appendChild(checkboxOption);

  const multipleChoiceOption = document.createElement("option");
  multipleChoiceOption.setAttribute("value", "multiple_choice");
  multipleChoiceOption.textContent = "Multiple Choice";
  questionTypeSelect.appendChild(multipleChoiceOption);

  const textOption = document.createElement("option");
  textOption.setAttribute("value", "text");
  textOption.textContent = "Text";
  questionTypeSelect.appendChild(textOption);

  const numberRangeOption = document.createElement("option");
  numberRangeOption.setAttribute("value", "number_range");
  numberRangeOption.textContent = "Number Range";
  questionTypeSelect.appendChild(numberRangeOption);

  const questionTypeFormGroup = document.createElement("div");
  questionTypeFormGroup.classList.add("form-group");

  const questionFieldsDiv = document.createElement("div");
  questionFieldsDiv.setAttribute("id", `question_${questionCount}_fields`);

  const questionTitle = document.createElement("input");
  questionTitle.setAttribute("type", "text");
  questionTitle.classList.add("form-control", "question-title-space");
  questionTitle.setAttribute("name", `question_${questionCount}_title`);
  questionTitle.setAttribute("placeholder", `Question ${questionCount} Title`);
  questionTitle.required = true;
  questionTypeFormGroup.appendChild(questionTitle);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "button");
  deleteButton.classList.add("btn", "btn-danger", "ml-2", "button-space");
  deleteButton.textContent = "Delete Question";
  deleteButton.addEventListener("click", function () {
    // get the question number from the id of the questionTypeFormGroup
    const questionNumber = questionTypeFormGroup.firstChild.name.split("_")[1];
    console.log("Deleting question " + questionNumber);
    deleteQuestion(questionNumber);
    repopulateQuestions();
  });

  const questionsDiv = document.getElementById("questions");
  questionTypeFormGroup.append(questionTypeSelect, deleteButton);
  questionsDiv.appendChild(questionTypeFormGroup);
  questionsDiv.appendChild(questionFieldsDiv);

  questionTypeSelect.addEventListener("change", function () {
    console.log("in change: " + questionTypeSelect.value);
    const questionTypeNumber =
      questionTypeFormGroup.firstChild.name.split("_")[1];
    toggleQuestionFields(null, questionTypeNumber, questionTypeSelect);
  });

  if (question !== null) {
    questionTitle.value = question.prompt;
    questionTypeSelect.value = question.type;
    toggleQuestionFields(question, questionCount, questionTypeSelect);
  } else {
    questionTypeSelect.value = "checkbox";
    toggleQuestionFields(null, questionCount, questionTypeSelect);
  }
  document.getElementById("num_questions").value = questionCount;
  console.log(questionTypeSelect);
}

function toggleQuestionFields(
  question = null,
  questionNumber,
  questionTypeSelect
) {
  const questionType = questionTypeSelect.value;

  const questionFieldsDiv = document.getElementById(
    `question_${questionNumber}_fields`
  );
  questionFieldsDiv.innerHTML = "";

  if (questionType === "checkbox" || questionType == "multiple_choice") {
    const selectOptionsFormGroup = document.createElement("div");
    selectOptionsFormGroup.classList.add("form-group");

    const checkboxOptionsLabel = document.createElement("label");
    checkboxOptionsLabel.setAttribute(
      "for",
      `question_${questionNumber}_options`
    );
    checkboxOptionsLabel.textContent =
      questionType === "checkbox"
        ? "Checkbox Options:"
        : "Multiple Choice Options:";

    const addOptionButton = document.createElement("button");
    addOptionButton.setAttribute("type", "button");
    addOptionButton.classList.add("btn", "btn-primary", "button-space");
    addOptionButton.textContent = "Add Option";
    addOptionButton.addEventListener("click", () => {
      optionIndex++; // Increment the index
      const newOptionInput = document.createElement("input");
      newOptionInput.setAttribute("type", "text");
      newOptionInput.classList.add("form-control", "textbox-space");
      newOptionInput.setAttribute(
        "name",
        `question_${questionNumber}_option_${optionIndex}`
      );
      newOptionInput.setAttribute(
        "id",
        `question_${questionNumber}_option_${optionIndex}`
      );
      newOptionInput.required = true;
      newOptionInput.setAttribute("placeholder", `Option ${optionIndex}`);
      selectOptionsFormGroup.insertBefore(newOptionInput, addOptionButton);
    });

    const removeOptionButton = document.createElement("button");
    removeOptionButton.setAttribute("type", "button");
    removeOptionButton.classList.add(
      "btn",
      "btn-danger",
      "button-right",
      "button-space"
    );
    removeOptionButton.textContent = "Remove Option";
    removeOptionButton.addEventListener("click", () => {
      if (optionIndex > 2) {
        // Ensure first 2 options are not removable
        // Find the last input in the selectOptionsFormGroup
        let lastOptionInput = null;
        for (let i = selectOptionsFormGroup.children.length - 1; i >= 0; i--) {
          if (
            selectOptionsFormGroup.children[i].tagName.toLowerCase() ===
              "input" &&
            selectOptionsFormGroup.children[i].type === "text"
          ) {
            lastOptionInput = selectOptionsFormGroup.children[i];
            break;
          }
          lastOptionInput;
        }
        if (lastOptionInput) {
          selectOptionsFormGroup.removeChild(lastOptionInput);
        }
        optionIndex--; // Decrement the index
      }
    });

    selectOptionsFormGroup.appendChild(checkboxOptionsLabel);

    let optionIndex = 2;

    if (question !== null) {
      question.answers.forEach((answer, idx) => {
        const optionInput = document.createElement("input");
        optionInput.setAttribute("type", "text");
        optionInput.classList.add("form-control", "textbox-space");
        optionInput.setAttribute(
          "name",
          `question_${questionNumber}_option_${idx + 1}`
        );
        optionInput.setAttribute(
          "id",
          `question_${questionNumber}_option_${idx + 1}`
        );
        optionInput.setAttribute("placeholder", `Option ${idx + 1}`);
        optionInput.value = answer.text; // Set the value from the question.answers array
        optionInput.required = true;
        selectOptionsFormGroup.appendChild(optionInput);
        optionIndex = idx + 1;
      });
    } else {
      const defaultOption1 = document.createElement("input");
      defaultOption1.setAttribute("type", "text");
      defaultOption1.classList.add("form-control", "textbox-space");
      defaultOption1.setAttribute(
        "name",
        `question_${questionNumber}_option_1`
      );
      defaultOption1.setAttribute("id", `question_${questionNumber}_option_1`);
      defaultOption1.setAttribute("placeholder", "Option 1");
      defaultOption1.required = true;

      const defaultOption2 = document.createElement("input");
      defaultOption2.setAttribute("type", "text");
      defaultOption2.classList.add("form-control", "textbox-space");
      defaultOption2.setAttribute(
        "name",
        `question_${questionNumber}_option_2`
      );
      defaultOption2.setAttribute("id", `question_${questionNumber}_option_2`);
      defaultOption2.setAttribute("placeholder", "Option 2");
      defaultOption2.required = true;
      selectOptionsFormGroup.appendChild(defaultOption1);
      selectOptionsFormGroup.appendChild(defaultOption2);
    }
    selectOptionsFormGroup.appendChild(addOptionButton);
    selectOptionsFormGroup.appendChild(removeOptionButton);

    questionFieldsDiv.appendChild(selectOptionsFormGroup);
  } else if (questionType === "number_range") {
    const numberRangeQuestionFormGroup = document.createElement("div");
    numberRangeQuestionFormGroup.classList.add("form-group");

    const numberRangeQuestionLabel = document.createElement("label");
    numberRangeQuestionLabel.setAttribute(
      "for",
      `question_${questionNumber}_number_range_question`
    );
    numberRangeQuestionLabel.textContent = "Number Range Question:";

    const numberRangeTopInput = document.createElement("input");
    numberRangeTopInput.setAttribute("type", "number");
    numberRangeTopInput.classList.add("form-control", "textbox-space");
    numberRangeTopInput.setAttribute(
      "name",
      `question_${questionNumber}_number_range_top`
    );
    numberRangeTopInput.setAttribute(
      "id",
      `question_${questionNumber}_number_range_top`
    );
    numberRangeTopInput.setAttribute("placeholder", "Top Range Number");
    numberRangeTopInput.required = true;

    const numberRangeBottomInput = document.createElement("input");
    numberRangeBottomInput.setAttribute("type", "number");
    numberRangeBottomInput.classList.add("form-control", "textbox-space");
    numberRangeBottomInput.setAttribute(
      "name",
      `question_${questionNumber}_number_range_bottom`
    );
    numberRangeBottomInput.setAttribute(
      "id",
      `question_${questionNumber}_number_range_bottom`
    );
    numberRangeBottomInput.setAttribute("placeholder", "Bottom Range Number");
    numberRangeBottomInput.required = true;

    numberRangeTopInput.addEventListener("input", function () {
      validateNumberRange(
        numberRangeTopInput,
        numberRangeBottomInput,
        questionNumber
      );
    });

    numberRangeBottomInput.addEventListener("input", function () {
      validateNumberRange(
        numberRangeTopInput,
        numberRangeBottomInput,
        questionNumber
      );
    });

    if (question !== null) {
      numberRangeBottomInput.value = question.bottom_range;
      numberRangeTopInput.value = question.top_range;
    }

    numberRangeQuestionFormGroup.appendChild(numberRangeQuestionLabel);
    numberRangeQuestionFormGroup.appendChild(numberRangeTopInput);
    numberRangeQuestionFormGroup.appendChild(numberRangeBottomInput);

    questionFieldsDiv.appendChild(numberRangeQuestionFormGroup);
  }
}

function validateNumberRange(topInput, bottomInput, questionNumber) {
  const topValue = parseFloat(topInput.value);
  const bottomValue = parseFloat(bottomInput.value);

  if (!isNaN(topValue) && !isNaN(bottomValue) && topValue <= bottomValue) {
    alert(
      `Top range must be greater than bottom range for Question ${questionNumber}`
    );
    topInput.value = "";
    bottomInput.value = "";
  }
}
