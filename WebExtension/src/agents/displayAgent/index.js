"use strict";

function createButtonGroup(event) {
  const btWrapper = document.createElement("div");
  btWrapper.className = "buttonGroupWrapper";

  const btCalendar = document.createElement("button");
  btCalendar.className = "extensionButton";
  btCalendar.innerText = "Insert into Calendar";
  btCalendar.addEventListener("click", async () => {
    browser.runtime.sendMessage({ command: "triggercalendarentry", reciever: "OutputAgent", event });
  })
  btWrapper.appendChild(btCalendar);

  const icsdownload = document.createElement("button");
  icsdownload.className = "extensionButton";
  icsdownload.innerText = "Download ICS";
  icsdownload.addEventListener("click", async () => {
    browser.runtime.sendMessage({ command: "triggericsdownload", reciever: "OutputAgent", event });
  });
  btWrapper.appendChild(icsdownload);

  const approve = document.createElement("a");
  approve.className = "approve";
  approve.addEventListener("click", async () => {
    browser.runtime.sendMessage({ command: "approveevent", reciever: "OptionsAgent", event });
  });
  btWrapper.appendChild(approve);

  const reject = document.createElement("a");
  reject.className = "reject";
  reject.addEventListener("click", async () => {
    browser.runtime.sendMessage({ command: "rejectevent", reciever: "OptionsAgent", event });
  });
  btWrapper.appendChild(reject);


  return btWrapper
}

const showNotification = async () => {
  await browser.runtime.onMessage.addListener((data, sender) => {
    console.log("Message from the background script:");
  });

  let events = await browser.runtime.sendMessage({
    command: "hasEvent",
    reciever: "EventAgent",
  });

  if (events && events.length > 0) {
    const main = document.createElement("div");
    const details = document.createElement("details");
    main.appendChild(details)
    const summary = document.createElement("summary");
    summary.innerText = events.length + " event found.";
    details.appendChild(summary)
    const content = document.createElement("div");
    content.className = "faq__content";
    details.appendChild(content)

    events.forEach(event => {
      const singleeventwrapper = document.createElement("div");
      singleeventwrapper.className = "singleEventWrapper";

      const notificationText = document.createElement("div");
      notificationText.className = "eventNotificationText";
      notificationText.innerText = "Am " + event[0];
      singleeventwrapper.appendChild(notificationText);

      const btGroup = createButtonGroup(event)
      singleeventwrapper.appendChild(btGroup);
      content.appendChild(singleeventwrapper)
    });

    // insert it as the very first element in the message
    document.body.insertBefore(main, document.body.firstChild);
  }

};

showNotification();

