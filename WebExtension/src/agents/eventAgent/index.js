import { Agent } from "../agent";
import * as Observer from "../../observer.js";

export class EventAgent extends Agent {
  /**
   *
   * @param {String} name The name of the agent.
   * @param {Boolean} debug Enables logging functionality for this agent.
   */
  constructor(name, debug) {
    super(name, debug);
  }

  /**
   *
   * Initiates all necessary parameters for the agent to work.
   * This function gets called by the environment upon creation.
   *
   */
  init = async () => {};

  /**
   * The interface to communicate with this agent.
   * @param {String} command the name of the function the agent should execute
   * @param {Object} data the data that gets passed along to the function
   */
  recieve(command, data, tabId) {
    switch (command) {
      case "hasEvent":
        return this.hasEvent(tabId);
      default:
        this.log(["Unknown command."]);
        break;
    }
  }

  /**
   * Send a message to a browser tab with given tabId.
   * Not working as of now.
   * @param {Number} tabId
   * @param {Object} message
   */
  async send(tabId, message) {
    await browser.tabs.sendMessage(tabId, message);
  }

  /**
   * Searches for an event in the email body of a tab.
   * @param {Number} tabId The tab id to query the displayed message.
   */
  async hasEvent(tabId) {
    // get the current message from the given tab
    const messageHeader = await browser.messageDisplay.getDisplayedMessage(
      tabId
    );

    if (messageHeader) {
      const emailBody = await this.getEmailBody(messageHeader.id, "plain");
      const events = await this.searchForEvents(
        emailBody,
        messageHeader.id,
        messageHeader.subject
      );
      console.log(events);
      return events || [];
    }
  }

  /**
   *
   * Searches for an event inside a given text.
   *
   * @param {String} emailbody The email text.
   * @param {Number} mailId The id of the email.
   * @param {String} subject The subject of the email.
   * @returns {Array} events
   */
  async searchForEvents(emailbody, mailId, subject) {
    const rules = await Observer.observeMessages({
      command: "getAllRules",
      reciever: "OptionsAgent",
      sender: "EventAgent",
    });

    let events = [];
    rules.every((pattern) => {
      if (pattern.enabled) {
        events = this.testPattern(emailbody, pattern);
        if (events && events.length > 0) {
          //exit loop
          return false;
        }
      }
      //continue
      return true;
    });

    events.forEach((evt) => {
      (evt["mailID"] = mailId), (evt["subject"] = subject);
    });
    return events;
  }

  /**
   * Tests given regular expression and returns a result.
   * @param {String} emailbody
   * @param {Object} regex
   */
  testPattern(emailbody, regex) {
    const re = new RegExp(regex.pattern, "gm");
    let match;
    let allMatches = [];
    while ((match = re.exec(emailbody)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === re.lastIndex) {
        re.lastIndex++;
      }
      match["pattern"] = regex.pattern;
      if (!this.findDuplicateEvents(allMatches, match)) {
        allMatches.push(Object.assign({}, match));
      }
    }
    let debugstr = [];
    allMatches.every((arr) => debugstr.push(arr[0]));
    this.log([
      allMatches.length +
        " match" +
        (allMatches.length > 1 ? "es" : "") +
        ". [" +
        debugstr.join("|") +
        "]",
    ]);
    return allMatches;
  }

  /**
   * Returns true if the event is already in
   * the events array. Returns false otherwise.
   * @param {Array} events Array of event objects.
   * @param {Object} event The event to find a duplicate of.
   * @returns {Boolean}
   */
  findDuplicateEvents(events, event) {
    return events.find((evt) => {
      // console.log(evt[0] + "==" + event[0] + ":" + (evt[0] == event[0]));
      return evt[0] == event[0];
    });
  }

  /**
   * Validates and extracts message body.
   * @param {MessagePart} messagepart The part of the message to find
   * @param {Object} body
   */
  extractMessage(messagepart, body) {
    if (!body) {
      body = {};
    }
    if ("parts" in messagepart) {
      for (let index = 0; index < messagepart.parts.length; index++) {
        this.extractMessage(messagepart.parts[index], body);
      }
    }
    if (messagepart.hasOwnProperty("body")) {
      if (
        messagepart.hasOwnProperty("contentType") &&
        messagepart.contentType === "text/plain"
      ) {
        body.plain = messagepart.body;
      } else if (
        messagepart.hasOwnProperty("contentType") &&
        messagepart.contentType === "text/html"
      ) {
        body.html = messagepart.body;
      }
    }
    return body;
  }

  /**
   * Gets the corresponding email to the message id,
   * extracts the actual message and returns data
   * based on the value of the format variable.
   * 'plain' and 'html' are possible format options.
   * @param {Number} messageId
   * @param {String} format
   */
  async getEmailBody(messageId, format) {
    let body = await browser.messages
      .getFull(messageId)
      .then((messagepart) => this.extractMessage(messagepart));
    return format === "plain" ? body.plain : format === "html" ? body.html : "";
  }
}
