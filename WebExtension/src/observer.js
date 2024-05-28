/**
 *
 * The observer class provides the log function
 * that gets injected into every agent and is used
 * for logging purpose when agents communicate between
 * eachother.
 * 
 */

// the agents that were registered
let agents = {};


/**
 * 
 * @param {Array[]} messages Messages that getting logged to console.
 * @param {String} source Name of the source that is logging the messages.
 * 
 */
const log = async (messages, source) => {
  messages.forEach((message) =>
    console.log(
      "[" +
        new Date().toLocaleTimeString() +
        "]" +
        (source ? "[" + source + "]" : "") +
        ": ",
      message
    )
  );
};

/**
 * 
 * Register an agent so the observer has access
 * to its communication.
 * @param {String} name Name of the agent.
 * @param {Object} agent The agent object.
 */
const registerAgent = (name, agent) => {
  agents[name] = agent;
};


/**
 * 
 * Handles the commands received from an observed message
 * of one of the agents.
 * @param {Object} message The message object for communication with agents.
 * @param {Number} tabId Optional tab id of initiating agent.
 */
const doHandleCommand = async (message, tabId) => {
  let { command, reciever, sender, data } = message;

  switch (command) {
    case "log":
      log([message.text], "Observer");
      return;
    default:
      log([sender + " -> " + command + " -> " + reciever], "Observer");
      if (data) {
        log([data], "Observer");
      }
      break;
  }

  if (reciever) {
    return agents[reciever].recieve(command, data, tabId);
  } else {
    log(["No reciever specified."], "Observer");
  }
};

/**
 * 
 * Handle the received message by filtering for all messages
 * whose "type" property is set to "command".
 * @param {Object} message The message object for communication with agents.
 * @param {Object} sender The sender object.
 * @see https://developer.thunderbird.net/add-ons/hello-world-add-on/using-content-scripts#receiving-a-runtime-message
 */
const observeMessages = (message, sender) => {
  if (message && message.hasOwnProperty("command")) {
    // The parameter tabId is necessary for the event agent
    // for querying the email content of the active and shown tab
    const tabId = sender?.tab?.id;
    return doHandleCommand(message, tabId);
  }
};

export { observeMessages, registerAgent, log };
