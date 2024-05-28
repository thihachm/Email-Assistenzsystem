/**
 * The class Display Agent. It gets injected into the email
 * context when clicking an email and generates necessary
 * markup and events so the user can communicate with the 
 * backend (Observer Class) and initiate personal
 * informationmanagement tasks like insertion or download.
 *
 */

// helper to create the button group (insert/download)
async function createButtonGroup(event) {
  const btWrapper = document.createElement("div");
  btWrapper.className = "buttonGroupWrapper";

  const btCalendar = document.createElement("button");
  btCalendar.className = "extensionButton";
  btCalendar.innerText = "Insert into Calendar";
  btCalendar.addEventListener("click", async () => {
    await browser.runtime.sendMessage({
      command: "triggerCalendarEntry",
      reciever: "OutputAgent",
      sender: "DisplayAgent",
      data: { event },
    });
  });
  btWrapper.appendChild(btCalendar);

  const icsdownload = document.createElement("button");
  icsdownload.className = "extensionButton";
  icsdownload.innerText = "Download ICS";
  icsdownload.addEventListener("click", async () => {
    await browser.runtime.sendMessage({
      command: "triggerIcsDownload",
      reciever: "OutputAgent",
      sender: "DisplayAgent",
      data: { event },
    });
  });
  btWrapper.appendChild(icsdownload);

  return btWrapper;
}

const showNotification = async () => {

  //ask for events upon injecting
  let events = await browser.runtime.sendMessage({
    command: "hasEvent",
    reciever: "EventAgent",
    sender: "DisplayAgent",
  });

  if (events && events.length > 0) {
    const main = document.createElement("div");
    const details = document.createElement("details");
    main.appendChild(details);

    const summary = document.createElement("summary");
    summary.innerText =
      events.length + " event" + (events.length > 1 ? "s" : "") + " found.";
    details.appendChild(summary);

    const content = document.createElement("div");
    content.className = "faq__content";
    details.appendChild(content);

    //create a row for each event
    events.forEach(async (event) => {
      const singleeventwrapper = document.createElement("div");
      singleeventwrapper.className = "singleEventWrapper";

      const notificationText = document.createElement("div");
      notificationText.className = "eventNotificationText";
      notificationText.innerText = "- " + event[0];
      singleeventwrapper.appendChild(notificationText);

      const subjectInput = document.createElement("input");
      subjectInput.className = "subjectInput";
      subjectInput.placeholder = event["subject"];
      singleeventwrapper.appendChild(subjectInput);

      const btGroup = await createButtonGroup(event);
      singleeventwrapper.appendChild(btGroup);
      content.appendChild(singleeventwrapper);
    });

    document.body.insertBefore(main, document.body.firstChild);
  }
};

showNotification();
