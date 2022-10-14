async function createButtonGroup(event) {
  const btWrapper = document.createElement("div");
  btWrapper.className = "buttonGroupWrapper";

  const btCalendar = document.createElement("button");
  btCalendar.className = "extensionButton";
  btCalendar.innerText = "Insert into Calendar";
  btCalendar.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ command: "triggerCalendarEntry", reciever: "OutputAgent", _sender: "DisplayAgent", data: { event } });
  })
  btWrapper.appendChild(btCalendar);

  const icsdownload = document.createElement("button");
  icsdownload.className = "extensionButton";
  icsdownload.innerText = "Download ICS";
  icsdownload.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ command: "triggerIcsDownload", reciever: "OutputAgent", _sender: "DisplayAgent", data: { event } });
  });
  btWrapper.appendChild(icsdownload);

  const approve = document.createElement("a");
  approve.className = "approve";
  approve.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ command: "approveEvent", reciever: "OptionsAgent", _sender: "DisplayAgent", data: { event } });
  });
  btWrapper.appendChild(approve);

  const reject = document.createElement("a");
  reject.className = "reject";
  reject.addEventListener("click", async () => {
    await browser.runtime.sendMessage({ command: "rejectEvent", reciever: "OptionsAgent", _sender: "DisplayAgent", data: { event } });
  });
  btWrapper.appendChild(reject);

  return btWrapper
}

const showNotification = async () => {
  let events = await browser.runtime.sendMessage({
    command: "hasEvent",
    reciever: "EventAgent",
    _sender: "DisplayAgent"
  });

  if (events && events.length > 0) {
    const main = document.createElement("div");
    const details = document.createElement("details");
    main.appendChild(details)
    const summary = document.createElement("summary");
    summary.innerText = events.length + " event" + (events.length > 1 ? "s" : "") + " found.";
    details.appendChild(summary)
    const content = document.createElement("div");
    content.className = "faq__content";
    details.appendChild(content)

    events.forEach(async (event) => {
      const singleeventwrapper = document.createElement("div");
      singleeventwrapper.className = "singleEventWrapper";

      const notificationText = document.createElement("div");
      notificationText.className = "eventNotificationText";
      notificationText.innerText = "- " + event[0];
      singleeventwrapper.appendChild(notificationText);

      // const patternText = document.createElement("div");
      // patternText.className = "patternText";
      // patternText.innerText = event["pattern"];
      // singleeventwrapper.appendChild(patternText);

      const btGroup = await createButtonGroup(event)
      singleeventwrapper.appendChild(btGroup);
      content.appendChild(singleeventwrapper)
    });


    document.body.insertBefore(main, document.body.firstChild);
  }

};

showNotification();

