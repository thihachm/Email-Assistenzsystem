import { getEmailBody } from "./emailUtils"

/**
 * Fired when the selected messages change in any mail tab.
 * Required permissions: [messagesRead]
 * @param {Tab} tab
 * @param {MessageList} selectedMessages
 * @see {@link https://webextension-api.thunderbird.net/en/latest/mailTabs.html?highlight=onSelectedMessagesChanged#onselectedmessageschanged}
 */
async function onSelectedMessagesChanged(tab, selectedMessages) {
  console.log("onSelectedMessagesChanged Event ...")
}

/**
 * Fired when a message is displayed.
 * Required permissions: [messagesRead]
 * @param {Tab} tab
 * @param {MessageHeader} message
 * @see {@link https://webextension-api.thunderbird.net/en/latest/messageDisplay.html#onmessagedisplayed}
 */
async function onMessageDisplayed(tab, message) {
  console.log("onMessageDisplayed Event ...")
  let body = await getEmailBody(message.id, "plain")
  console.log("body: " + body);
}

/**
 * Fired when a new message is received, and has been through junk classification and message filters.
 * Required permissions: [messagesRead, accountsRead]
 * @param {MailFolder} folder
 * @param {MessageList} messages
 * @see {@link https://webextension-api.thunderbird.net/en/latest/messages.html#onnewmailreceived}
 */
async function onNewMailReceived(folder, messages) {
  console.log("onNewMailReceived Event ...")
  messages.messages.forEach(async message => {
    let body = await getEmailBody(message.id, "plain")
    console.log("body: " + body);
  });
}

/**
 * Main
 */
const init = async () => {

  // Add Listeners
  await messenger.mailTabs.onSelectedMessagesChanged.addListener(
    onSelectedMessagesChanged
  )
  await messenger.messageDisplay.onMessageDisplayed.addListener(
    onMessageDisplayed
  )
  await messenger.messages.onNewMailReceived.addListener(
    onNewMailReceived
  )

};
init();