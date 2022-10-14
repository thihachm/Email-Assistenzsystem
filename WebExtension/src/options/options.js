"use strict";

(function (context) {

  const deRulesArea = document.querySelector("#de .areaRules");
  const enRulesArea = document.querySelector("#en .areaRules");
  const clearDBButton = document.querySelector("#clr");
  const basepathwrapper = document.querySelector("#basepath");
  // const logwrapper = document.querySelector("#logwrapper");

  function populateEvents() {
    clearDBButton.addEventListener('click', async (e) => {
      e.preventDefault()
      await browser.runtime.sendMessage({ command: "clearKnowledgebase", reciever: "OptionsAgent" });
      await browser.runtime.sendMessage({ command: "storeDefaultKnowledgebase", reciever: "OptionsAgent" });
      await updateUI()
    });

    // const el_logLocationButton = document.querySelector("#logwrapper button");
    // el_logLocationButton.addEventListener('click', async (e) => {
    //   e.preventDefault()
    //   const el_debugLocationInput = document.querySelector("#logwrapper input[type='text']");
    //   await browser.storage.local.set({
    //     debuglocation: el_debugLocationInput?.value || ""
    //   });
    //   await browser.runtime.sendMessage({ command: "updateDebugLocation" });
    // });

    const el_basepathLocationButton = document.querySelector("#basepath button");
    el_basepathLocationButton.addEventListener('click', async (e) => {
      e.preventDefault()
      const el_basepathLocationInput = document.querySelector("#basepath input[type='text']");
      await browser.storage.local.set({
        basepath: el_basepathLocationInput?.value || ""
      });
      await browser.runtime.sendMessage({ command: "updateBasePath" });
    });

    const matches = document.querySelectorAll(".rules input[type='checkbox']");
    matches.forEach(element => {
      element.addEventListener('click', async (e) => {
        await browser.runtime.sendMessage({
          command: "toggleRule",
          reciever: "OptionsAgent",
          _sender: "OptionsPage",
          data: {
            path: e.target.value,
            enabled: e.target.checked
          }
        });
      });
    })
  }

  async function populateValues() {
    const { knowledgebase } = await browser.storage.local.get("knowledgebase").then((item) => {
      return item
    })
    if (knowledgebase) {
      deRulesArea.innerHTML = ""
      enRulesArea.innerHTML = ""
      const { de, en } = knowledgebase
      for (const key in de) {
        if (Object.hasOwnProperty.call(de, key)) {
          const pattern = de[key];
          const el_wrapper = document.createElement("div");
          el_wrapper.className = "rulerow";

          const el_patternActive = document.createElement("input");
          el_patternActive.setAttribute("type", "checkbox");
          el_patternActive.checked = pattern.active
          el_patternActive.value = "de." + key
          el_wrapper.appendChild(el_patternActive)

          let group = createGroup(pattern, "pattern")
          el_wrapper.appendChild(group)

          group = createGroup(pattern, "example")
          el_wrapper.appendChild(group)

          deRulesArea.appendChild(el_wrapper)
        }
      }
      for (const key in en) {
        if (Object.hasOwnProperty.call(en, key)) {
          const pattern = en[key];
          const el_wrapper = document.createElement("div");
          el_wrapper.className = "rulerow";

          const el_patternActive = document.createElement("input");
          el_patternActive.setAttribute("type", "checkbox");
          el_patternActive.checked = pattern.active
          el_patternActive.value = "en." + key
          el_wrapper.appendChild(el_patternActive)

          let group = createGroup(pattern, "pattern")
          el_wrapper.appendChild(group)

          group = createGroup(pattern, "example")
          el_wrapper.appendChild(group)

          enRulesArea.appendChild(el_wrapper)
        }
      }
    }
    
    const { basepath } = await browser.storage.local.get("basepath").then((item) => {
      return item
    })
    const el_basepathLocationInput = document.querySelector("#basepath input[type='text']");
    el_basepathLocationInput.value = basepath || ""
    el_basepathLocationInput.placeholder = "D:\\\\"
  }

  //#region Basic functions

  function createGroup(pattern, type) {
    const el_formGroup = document.createElement("div");
    const el_formGroupSpan = document.createElement("span");
    const el_formGroupInput = document.createElement("input");
    el_formGroupInput.setAttribute("type", "text");

    //classes
    el_formGroup.className = "form-group";
    el_formGroupInput.className = "form-field";

    //values
    el_formGroupSpan.innerText = type == "pattern" ? "Pattern" : "Example"
    el_formGroupInput.value = type == "pattern" ? pattern.pattern : pattern.example

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
      el_formGroupInput.addEventListener('input', testInput);
      el_formGroupInput.addEventListener('focus', testInput);
      testInput(null, pattern.example)
    }

    //attaching
    el_formGroup.appendChild(el_formGroupSpan)
    el_formGroup.appendChild(el_formGroupInput)

    return el_formGroup
  }

  function createBasicInputGroup(label) {
    const el_formGroup = document.createElement("div");
    const el_formGroupSpan = document.createElement("span");
    const el_formGroupInput = document.createElement("input");
    el_formGroupInput.setAttribute("type", "text");
    el_formGroup.className = "form-group";
    el_formGroupInput.className = "form-field";
    el_formGroupSpan.innerText = label || ""
    el_formGroup.appendChild(el_formGroupSpan)
    el_formGroup.appendChild(el_formGroupInput)
    return el_formGroup
  }

  function createBasicButton(text) {
    const el_basicButton = document.createElement("button");
    el_basicButton.className = "browser-style"
    el_basicButton.innerText = text || ""
    return el_basicButton
  }
  //#endregion

  async function updateUI() {
    await populateValues()
  }

  async function initUI() {
    
    // logwrapper.appendChild(createBasicInputGroup("Location"))
    // logwrapper.appendChild(createBasicButton("Save"))
    basepathwrapper.appendChild(createBasicInputGroup("Location"))
    basepathwrapper.appendChild(createBasicButton("Save"))

    await populateValues()
    populateEvents()
  }

  initUI()

})(this)