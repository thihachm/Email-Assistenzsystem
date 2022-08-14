/**
 * Validates and extracts RFC822 message body.
 * @param {MessagePart} messagepart
 * @param {Object} body
 */
export function extractMessage(messagepart, body) {
  if (!body) { body = {} }
  if ("parts" in messagepart) {
    for (let index = 0; index < messagepart.parts.length; index++) {
      extractMessage(messagepart.parts[index], body)
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
export async function getEmailBody(messageId, format) {
  let body = await browser.messages.getFull(messageId).then(
    (messagepart) => extractMessage(messagepart)
  );
  return format === "plain" ? body.plain : format === "html" ? body.html : ""
}