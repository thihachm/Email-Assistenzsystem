import { log, observeMessages } from "../observer";

/**
 *
 *  Abstract agent class with default functions.
 * 
 */
export class Agent {
  // the name of the agent
  name = "";

  // debug field to turn on
  // or off logging functionality
  debug = false;

  /**
   *
   * Sets the name and the debug
   * state of the agent.
   *
   */
  constructor(name, debug) {
    this.name = name;
    this.debug = debug;
  }

  /**
   *
   * Returns the name of the agent.
   *
   */
  get name() {
    return this.name;
  }

  /**
   *
   * Returns the current debug 
   * state of the agent.
   * 
   */
  get debug() {
    return this.debug;
  }

  /**
   *
   * This function is a wrapper around 
   * the log function of the observer class.
   *
   */
  log(messages) {
    if (this.debug) {
      log(messages, this.name);
    }
    return () => {};
  }

  /**
   *
   *
   */
  sendMessage(message) {
    if (!message.hasOwnProperty("sender")) {
      message["sender"] = this.name;
    }
    return observeMessages(message);
  }
}
