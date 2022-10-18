// import { observeMessages, registerAgent } from './observer.js'
import * as Observer from './observer.js'
import { EventAgent } from './agents/eventAgent'
import { OptionsAgent } from './agents/optionsAgent'
import { OutputAgent } from './agents/outputAgent';

/**
 * Main
 */
const init = async () => {

  //Setup output location
  await Observer.setBasePath()

  /**
 * Use the startup phase to tell Thunderbird that it should load
 * the Display Agent whenever a message is displayed
 * Required permissions: [messagesModify]
 * 
 */
  messenger.messageDisplayScripts.register({
    js: [{ file: "./output/index.js" }],
    css: [{ file: "./output/index.css" }],
  });

  /**
   * Add a handler for communication with other parts of the extension,
   * like our messageDisplayScript.
   *
   * 👉 There should be only one handler in the background script
   *    for all incoming messages
   */
  browser.runtime.onMessage.addListener(Observer.observeMessages);

  Observer.registerAgent("EventAgent", new EventAgent("EventAgent"))
  Observer.registerAgent("OptionsAgent", new OptionsAgent("OptionsAgent"))
  Observer.registerAgent("OutputAgent", new OutputAgent("OutputAgent"))

};

/**
 * Execute the startup handler whenever Thunderbird starts
 */
document.addEventListener("DOMContentLoaded", init);