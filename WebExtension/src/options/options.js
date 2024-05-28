"use strict";

(function (context) {
  const deRulesArea = document.querySelector("#de .areaRules");
  const enRulesArea = document.querySelector("#en .areaRules");
  const newRulesAreaPattern = document.querySelector("#newRule .areaPattern");
  const newRulesAreaLanguage = document.querySelector("#newRule .areaLanguage");
  const newRulesAreaExample = document.querySelector("#newRule .areaExample");
  const newRulesButton = document.querySelector("#btNewRule");
  const clearDBButton = document.querySelector("#clr");
  const resetDBButton = document.querySelector("#reset");
  const calendarNameWrapper = document.querySelector("#calendarName");

  //#region basic functions

  function createGroup(pattern, type) {
    const el_formGroup = document.createElement("div");
    const el_formGroupSpan = document.createElement("span");
    const el_formGroupInput = document.createElement("input");
    el_formGroupInput.setAttribute("type", "text");

    //classes
    el_formGroup.className = "form-group";
    el_formGroupInput.className = "form-field";

    //values
    el_formGroupSpan.innerText = type == "pattern" ? "Pattern" : "Example";
    el_formGroupInput.value =
      type == "pattern" ? pattern.pattern : pattern.example;

    //events
    function testInput(e, t) {
      let text = e?.target?.value || t;
      const re = new RegExp("^" + pattern.pattern + "$");
      if (re.test(text)) {
        el_formGroupSpan.classList.add("matches");
        el_formGroupInput.classList.add("matches");
      } else {
        el_formGroupSpan.classList.remove("matches");
        el_formGroupInput.classList.remove("matches");
      }
    }
    if (type == "example") {
      el_formGroupInput.addEventListener("input", testInput);
      el_formGroupInput.addEventListener("focus", testInput);
      testInput(null, pattern.example);
    }

    //attaching
    el_formGroup.appendChild(el_formGroupSpan);
    el_formGroup.appendChild(el_formGroupInput);

    return el_formGroup;
  }

  function createBasicInputGroup(label) {
    const el_formGroup = document.createElement("div");
    const el_formGroupSpan = document.createElement("span");
    const el_formGroupInput = document.createElement("input");
    el_formGroupInput.setAttribute("type", "text");
    el_formGroup.className = "form-group";
    el_formGroupInput.className = "form-field";
    el_formGroupSpan.innerText = label || "";
    el_formGroup.appendChild(el_formGroupSpan);
    el_formGroup.appendChild(el_formGroupInput);
    return el_formGroup;
  }

  function createBasicButton(text, additionalAttributes) {
    const el_basicButton = document.createElement("button");
    el_basicButton.className = "browser-style";
    el_basicButton.innerText = text || "";

    for (const key in additionalAttributes) {
      if (Object.hasOwnProperty.call(additionalAttributes, key)) {
        const value = additionalAttributes[key];
        el_basicButton.style[key] = value;
      }
    }

    return el_basicButton;
  }

  //#endregion
  //#region event functions

  function clearDbClickEvent() {
    clearDBButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await browser.runtime.sendMessage({
        command: "clearKnowledgebase",
        reciever: "OptionsAgent",
        sender: "DisplayAgent",
      });
      await updateUI();
    });
  }

  function resetDbClickEvent() {
    resetDBButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await browser.runtime.sendMessage({
        command: "resetKnowledgebase",
        reciever: "OptionsAgent",
        sender: "DisplayAgent",
      });
      await updateUI();
    });
  }

  function calendarNameInputEvent() {
    const el_calendarNameSaveButton = document.querySelector(
      "#calendarName button"
    );
    el_calendarNameSaveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const el_calendarNameInput = document.querySelector(
        "#calendarName input[type='text']"
      );
      // Prevent setting empty calendar name
      if (el_calendarNameInput?.value == "") {
        return;
      }
      await browser.runtime.sendMessage({
        command: "set",
        reciever: "OptionsAgent",
        sender: "OptionsPanel",
        data: { key: "calendarName", value: el_calendarNameInput?.value },
      });
      await browser.runtime.sendMessage({
        command: "attemptCreateCalendar",
        reciever: "OutputAgent",
        sender: "OptionsPanel",
        data: { name: el_calendarNameInput?.value },
      });
    });
  }

  function toggleRuleEvent() {
    const matches = document.querySelectorAll(".rules input[type='checkbox']");
    matches.forEach((element) => {
      element.addEventListener("click", async (e) => {
        await browser.runtime.sendMessage({
          command: "toggleRule",
          reciever: "OptionsAgent",
          sender: "OptionsPage",
          data: {
            path: e.target.value,
            enabled: e.target.checked,
          },
        });
      });
    });
  }

  function addNewRuleClickEvent() {
    newRulesButton.addEventListener("click", async (e) => {
      e.preventDefault();
      // pattern
      const newRulePatternInputValue = document.querySelector(
        "#newRule .areaPattern input"
      );
      const pattern = newRulePatternInputValue?.value;
      if (!pattern) {
        return;
      }

      // language
      const newRuleLanguageInputValue = document.querySelector(
        '#newRule .areaLanguage input[name="lang"]:checked'
      );
      const language = newRuleLanguageInputValue?.value;
      if (!language) {
        return;
      }

      // example
      const newRuleExampleInputValue = document.querySelector(
        "#newRule .areaExample input"
      );
      const example = newRuleExampleInputValue?.value;
      if (!example) {
        return;
      }

      const data = {
        pattern,
        language,
        example,
      };
      await browser.runtime.sendMessage({
        command: "addNewRule",
        reciever: "OptionsAgent",
        sender: "DisplayAgent",
        data,
      });
      await updateUI();
    });
  }
  //#endregion

  function addNewRulesArea() {
    // new rule row
    let el_wrapper = document.createElement("div");
    el_wrapper.className = "rulerow";
    let group = createGroup({ pattern: "" }, "pattern");
    el_wrapper.appendChild(group);
    newRulesAreaPattern.appendChild(el_wrapper);

    el_wrapper = document.createElement("div");
    const el_formGroup = document.createElement("div");
    el_formGroup.className = "form-group";
    const el_formGroupInput = document.createElement("input");
    const el_formGroupSpan = document.createElement("span");
    el_formGroupInput.setAttribute("type", "text");
    el_formGroupInput.className = "form-field";
    el_formGroupSpan.innerText = "Test";
    el_formGroupInput.placeholder = "New Pattern";
    el_formGroup.appendChild(el_formGroupSpan);
    el_formGroup.appendChild(el_formGroupInput);
    el_wrapper.appendChild(el_formGroup);
    newRulesAreaExample.appendChild(el_wrapper);

    el_wrapper = document.createElement("div");
    const el_LanguageInputRadioDE = document.createElement("input");
    const el_LanguageLabelRadioDE = document.createElement("label");
    el_LanguageInputRadioDE.id = "langDE";
    el_LanguageInputRadioDE.type = "radio";
    el_LanguageInputRadioDE.name = "lang";
    el_LanguageInputRadioDE.value = "de";
    el_LanguageLabelRadioDE.htmlFor = "langDE";
    el_LanguageLabelRadioDE.innerText = "DE";
    const el_LanguageInputRadioEN = document.createElement("input");
    const el_LanguagelabelRadioEN = document.createElement("label");
    el_LanguageInputRadioEN.id = "langEN";
    el_LanguageInputRadioEN.type = "radio";
    el_LanguageInputRadioEN.name = "lang";
    el_LanguageInputRadioEN.value = "en";
    el_LanguagelabelRadioEN.htmlFor = "langEN";
    el_LanguagelabelRadioEN.innerText = "EN";
    el_wrapper.appendChild(el_LanguageInputRadioDE);
    el_wrapper.appendChild(el_LanguageLabelRadioDE);
    el_wrapper.appendChild(el_LanguageInputRadioEN);
    el_wrapper.appendChild(el_LanguagelabelRadioEN);
    newRulesAreaLanguage.appendChild(el_wrapper);
  }

  function populateEvents() {
    clearDbClickEvent();
    resetDbClickEvent();
    addNewRuleClickEvent();
    calendarNameInputEvent();
    toggleRuleEvent();
  }

  async function populateValues() {
    const { calendarName } = await browser.storage.local
      .get("calendarName")
      .then((item) => {
        return item;
      });
    const el_calendarNameInput = document.querySelector(
      "#calendarName input[type='text']"
    );
    el_calendarNameInput.value = calendarName || "";
    el_calendarNameInput.placeholder = "Calendar Name";

    const { db } = await browser.storage.local.get("db").then((item) => {
      return item;
    });

    if (db) {
      const { de, en } = db;
      for (const key in de) {
        if (Object.hasOwnProperty.call(de, key)) {
          const pattern = de[key];
          const el_wrapper = document.createElement("div");
          el_wrapper.className = "rulerow";

          const el_patternActive = document.createElement("input");
          el_patternActive.setAttribute("type", "checkbox");
          el_patternActive.checked = pattern.enabled;
          el_patternActive.value = "de." + key;
          el_wrapper.appendChild(el_patternActive);

          let group = createGroup(pattern, "pattern");
          el_wrapper.appendChild(group);

          group = createGroup(pattern, "example");
          el_wrapper.appendChild(group);

          deRulesArea.appendChild(el_wrapper);
        }
      }
      for (const key in en) {
        if (Object.hasOwnProperty.call(en, key)) {
          const pattern = en[key];
          const el_wrapper = document.createElement("div");
          el_wrapper.className = "rulerow";

          const el_patternActive = document.createElement("input");
          el_patternActive.setAttribute("type", "checkbox");
          el_patternActive.checked = pattern.enabled;
          el_patternActive.value = "en." + key;
          el_wrapper.appendChild(el_patternActive);

          let group = createGroup(pattern, "pattern");
          el_wrapper.appendChild(group);

          group = createGroup(pattern, "example");
          el_wrapper.appendChild(group);

          enRulesArea.appendChild(el_wrapper);
        }
      }
    }

    // group = createGroup({ pattern: "" }, "test");
    // const el_formGroup = document.createElement("div");
    // el_formGroup.className = "form-group";
    // const el_formGroupInput = document.createElement("input");
    // const el_formGroupSpan = document.createElement("span");
    // el_formGroupInput.setAttribute("type", "text");
    // el_formGroupInput.className = "form-field";
    // el_formGroupSpan.innerText = "Test";
    // el_formGroupInput.placeholder = "New Pattern";
    // function testInput(e, t) {
    //   let text = e?.target?.value || t;
    //   const re = new RegExp("^" + el_formGroupInput.value + "$");
    //   if (re.test(text)) {
    //     el_formGroupSpan.classList.add("matches");
    //     el_formGroupInput.classList.add("matches");
    //   } else {
    //     el_formGroupSpan.classList.remove("matches");
    //     el_formGroupInput.classList.remove("matches");
    //   }
    // }
    // el_formGroupInput.addEventListener("input", testInput);
    // el_formGroupInput.addEventListener("focus", testInput);
    // el_formGroup.appendChild(el_formGroupSpan);
    // el_formGroup.appendChild(el_formGroupInput);
    // el_wrapper.appendChild(el_formGroup);
  }

  async function removeValues() {
    // remove inner html
    // from both rule areas
    // before (re)building
    deRulesArea.innerHTML = "";
    enRulesArea.innerHTML = "";
  }

  async function updateUI() {
    removeValues();
    await populateValues();
  }

  async function initUI() {
    calendarNameWrapper.appendChild(createBasicInputGroup("Name"));
    calendarNameWrapper.appendChild(
      createBasicButton("Save", {
        height: "28px",
        width: "100px",
      })
    );
    addNewRulesArea();
    await populateValues();
    populateEvents();
  }

  initUI();
})(this);
