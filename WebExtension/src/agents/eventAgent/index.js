import { Agent } from "../agent"
import * as Observer from '../../observer.js'

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
  * @param {Object} data
  * @param {Number} tabId
  */
  recieve(command, data, tabId) {
    switch (command) {
      case "hasEvent":
        return this.hasEvent(tabId)
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
  async hasEvent(tabId) {
    // get the current message from the given tab
    const messageHeader = await browser.messageDisplay.getDisplayedMessage(tabId)
    if (messageHeader) {
      const emailBody = await this.getEmailBody(messageHeader.id, "plain")
      const events = await this.searchForEvents(emailBody, messageHeader.id)
      return events || []
    }
  }

  /**
   * Searches for an event.
   * @param {String} emailbody
   */
  async searchForEvents(emailbody, mailid) {

    const rules = await Observer.observeMessages({
      command: "getAllRules",
      reciever: "OptionsAgent",
      _sender: "EventAgent"
    })

    // NOTIZ: sendMessage innerhalb des background scripts nicht möglich?
    // console.log(browser.runtime);
    // let rules = await browser.runtime.sendMessage({
    //   command: "getRules",
    //   reciever: "OptionsAgent",
    //   sender: "EventAgent"
    // });
    // console.log(rules);

    // Erste überlegung -> gefunden = return
    let events = []
    rules.every(pattern => {
      if (pattern.active) {
        events = this.testPattern(emailbody, pattern)
        if (events && events.length > 0) {
          //exit loop
          return false;
        }
      }
      //continue
      return true;
    })

    events.forEach(evt => {
      evt["mailID"] = mailid
      this.writeEvent(evt)
    })
    return events
  }

  /**
    * Tests given regular expression and returns a result.
    * @param {String} emailbody
    * @param {Object} regex
    */
  testPattern(emailbody, regex) {
    const re = new RegExp(regex.pattern, 'gm')
    let m
    let allMatches = []
    while ((m = re.exec(emailbody)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === re.lastIndex) {
        re.lastIndex++
      }
      // console.log(m)
      m["pattern"] = regex.pattern
      if (!this.findDuplicateEvents(allMatches, m)) {
        allMatches.push(Object.assign({},m))
      }
      // m.forEach((match, groupIndex) => {
      //   console.log("Found match, group " + groupIndex + ": " + match);
      // });
    }
    let debugstr = []
    allMatches.every(arr => debugstr.push(arr[0]))
    this.log("EventAgent found " + allMatches.length + " match" + (allMatches.length > 1 ? "es" : "") + ". [" + debugstr.join("|") + "]");
    return allMatches
  }

  /**
  * 
  * @param {Array} events
  * @param {Object} event
  */
  findDuplicateEvents(events, event) {
    return events.find(evt => {
      // console.log(evt[0] + "==" + event[0] + ":" + (evt[0] == event[0]));
      return evt[0] == event[0]
    })
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