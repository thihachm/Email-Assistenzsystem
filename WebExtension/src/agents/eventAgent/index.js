import { db } from "../../db"
import { Agent } from "../agent"

// const testevent = {
//     title: '',
//     start: [2018, 5, 30, 6, 30],
//     duration: { hours: 6, minutes: 30 },
//     description: 'Annual 10-kilometer run in Boulder, Colorado',
//     location: 'Folsom Field, University of Colorado (finish line)',
//     url: 'http://www.bolderboulder.com/',
//     geo: { lat: 40.0095, lon: 105.2669 },
//     categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//     status: 'CONFIRMED',
//     busyStatus: 'BUSY',
//     organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//     attendees: [
//         { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//         { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//     ]
// }

export class EventAgent extends Agent {

  constructor(name) {
    super(name)
  }

  /**
  * The interface to communicate with the agent. 
  * @param {String} command
  * @param {Object} event
  * @param {Number} tabId
  */
  recieve(command, event, tabId) {
    switch (command) {
      case "hasEvent":
        const events = this.hasEvent(event, tabId)
        return events
        break;
      default:
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
    await browser.tabs.sendMessage(tabId, message)
  }

  /**
  * Searches for an event. 
  * @param {String} event
  * @param {Number} tabId
  */
  async hasEvent(event, tabId) {
    // get the current message from the given tab
    const messageHeader = await browser.messageDisplay.getDisplayedMessage(tabId)
    // console.log("Checking if there is an event in email[" + messageHeader.id + "] ...");

    if (messageHeader) {
      const emailBody = await this.getEmailBody(messageHeader.id, "plain")
      const events = await this.searchForEvents(emailBody)
      console.log(events);
      return events || []
    }
  }

  /**
   * Searches for an event.
   * @param {String} emailbody
   */
  async searchForEvents(emailbody) {
    const language = determineLanguage(emailbody) || "de"
    const patterns = db[language]
    let events = []
    patterns.forEach(pattern => {
      const event = this.applyPattern(emailbody, pattern)
      if (event) {
        events.push(event)
      }
    })
    return events
  }

  /**
    * Applies given regular expression and returns a result.
    * @param {String} emailbody
    * @param {Object} regex
    */
  applyPattern(emailbody, regex) {
    const re = new RegExp(regex.pattern, 'g');
    const event = re.exec(emailbody)
    if (event) {
      return event
    }
  }

  /**
   * Validates and extracts RFC822 message body.
   * @param {MessagePart} messagepart
   * @param {Object} body
   */
  extractMessage(messagepart, body) {
    if (!body) { body = {} }
    if ("parts" in messagepart) {
      for (let index = 0; index < messagepart.parts.length; index++) {
        this.extractMessage(messagepart.parts[index], body)
      }
    }
    if (messagepart.hasOwnProperty('body')) {
      if (messagepart.hasOwnProperty('contentType') && messagepart.contentType === "text/plain") {
        body.plain = messagepart.body
      } else if (messagepart.hasOwnProperty('contentType') && messagepart.contentType === "text/html") {
        body.html = messagepart.body
      }
    }
    return body
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
    let body = await browser.messages.getFull(messageId).then(
      messagepart => this.extractMessage(messagepart)
    )
    return format === "plain" ? body.plain : format === "html" ? body.html : ""
  }

}