import * as Observer from "./observer.js";
import { EventAgent } from "./agents/eventAgent";
import { OptionsAgent } from "./agents/optionsAgent";
import { OutputAgent } from "./agents/outputAgent";

/**
 * Main function that gets called whenever Thunderbird has finished
 * loading the DOM.
 *
 * In Thunderbird, all WebExtension API can be accessed through the
 * browser.* namespace, as with Firefox, but also through the
 * messenger.* namespace, which is a better fit for Thunderbird.
 */
const init = async () => {
  
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

  // Registers all needed agents

  // OptionsAgent
  const optionsAgent = new OptionsAgent("OptionsAgent", true);
  Observer.registerAgent("OptionsAgent", optionsAgent);

  // EventAgent
  const eventAgent = new EventAgent("EventAgent", true);
  Observer.registerAgent("EventAgent", eventAgent);

  // OutputAgent
  const outputAgent = new OutputAgent("OutputAgent", true);
  Observer.registerAgent("OutputAgent", outputAgent);

  /**
   * Add a handler for communication with other parts of the extension,
   * like the messageDisplayScript.
   *
   * There should be only one handler in the background script
   * for all incoming messages.
   */
  messenger.runtime.onMessage.addListener(Observer.observeMessages);

  await optionsAgent.init();
  await outputAgent.init();
  await eventAgent.init();
};

/**
 * Execute the startup handler whenever Thunderbird has finished
 * loading the DOM
 */
await document.addEventListener("DOMContentLoaded", init);
