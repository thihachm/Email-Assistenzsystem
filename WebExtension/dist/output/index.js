/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************************!*\
  !*** ./src/agents/displayAgent/index.js ***!
  \******************************************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0L2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL2FnZW50cy9kaXNwbGF5QWdlbnQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFRoZSBjbGFzcyBEaXNwbGF5IEFnZW50LiBJdCBnZXRzIGluamVjdGVkIGludG8gdGhlIGVtYWlsXHJcbiAqIGNvbnRleHQgd2hlbiBjbGlja2luZyBhbiBlbWFpbCBhbmQgZ2VuZXJhdGVzIG5lY2Vzc2FyeVxyXG4gKiBtYXJrdXAgYW5kIGV2ZW50cyBzbyB0aGUgdXNlciBjYW4gY29tbXVuaWNhdGUgd2l0aCB0aGUgXHJcbiAqIGJhY2tlbmQgKE9ic2VydmVyIENsYXNzKSBhbmQgaW5pdGlhdGUgcGVyc29uYWxcclxuICogaW5mb3JtYXRpb25tYW5hZ2VtZW50IHRhc2tzIGxpa2UgaW5zZXJ0aW9uIG9yIGRvd25sb2FkLlxyXG4gKlxyXG4gKi9cclxuXHJcbi8vIGhlbHBlciB0byBjcmVhdGUgdGhlIGJ1dHRvbiBncm91cCAoaW5zZXJ0L2Rvd25sb2FkKVxyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVCdXR0b25Hcm91cChldmVudCkge1xyXG4gIGNvbnN0IGJ0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgYnRXcmFwcGVyLmNsYXNzTmFtZSA9IFwiYnV0dG9uR3JvdXBXcmFwcGVyXCI7XHJcblxyXG4gIGNvbnN0IGJ0Q2FsZW5kYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gIGJ0Q2FsZW5kYXIuY2xhc3NOYW1lID0gXCJleHRlbnNpb25CdXR0b25cIjtcclxuICBidENhbGVuZGFyLmlubmVyVGV4dCA9IFwiSW5zZXJ0IGludG8gQ2FsZW5kYXJcIjtcclxuICBidENhbGVuZGFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICBjb21tYW5kOiBcInRyaWdnZXJDYWxlbmRhckVudHJ5XCIsXHJcbiAgICAgIHJlY2lldmVyOiBcIk91dHB1dEFnZW50XCIsXHJcbiAgICAgIHNlbmRlcjogXCJEaXNwbGF5QWdlbnRcIixcclxuICAgICAgZGF0YTogeyBldmVudCB9LFxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgYnRXcmFwcGVyLmFwcGVuZENoaWxkKGJ0Q2FsZW5kYXIpO1xyXG5cclxuICBjb25zdCBpY3Nkb3dubG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgaWNzZG93bmxvYWQuY2xhc3NOYW1lID0gXCJleHRlbnNpb25CdXR0b25cIjtcclxuICBpY3Nkb3dubG9hZC5pbm5lclRleHQgPSBcIkRvd25sb2FkIElDU1wiO1xyXG4gIGljc2Rvd25sb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xyXG4gICAgICBjb21tYW5kOiBcInRyaWdnZXJJY3NEb3dubG9hZFwiLFxyXG4gICAgICByZWNpZXZlcjogXCJPdXRwdXRBZ2VudFwiLFxyXG4gICAgICBzZW5kZXI6IFwiRGlzcGxheUFnZW50XCIsXHJcbiAgICAgIGRhdGE6IHsgZXZlbnQgfSxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIGJ0V3JhcHBlci5hcHBlbmRDaGlsZChpY3Nkb3dubG9hZCk7XHJcblxyXG4gIHJldHVybiBidFdyYXBwZXI7XHJcbn1cclxuXHJcbmNvbnN0IHNob3dOb3RpZmljYXRpb24gPSBhc3luYyAoKSA9PiB7XHJcblxyXG4gIC8vYXNrIGZvciBldmVudHMgdXBvbiBpbmplY3RpbmdcclxuICBsZXQgZXZlbnRzID0gYXdhaXQgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcclxuICAgIGNvbW1hbmQ6IFwiaGFzRXZlbnRcIixcclxuICAgIHJlY2lldmVyOiBcIkV2ZW50QWdlbnRcIixcclxuICAgIHNlbmRlcjogXCJEaXNwbGF5QWdlbnRcIixcclxuICB9KTtcclxuXHJcbiAgaWYgKGV2ZW50cyAmJiBldmVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XHJcbiAgICBtYWluLmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG5cclxuICAgIGNvbnN0IHN1bW1hcnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcclxuICAgIHN1bW1hcnkuaW5uZXJUZXh0ID1cclxuICAgICAgZXZlbnRzLmxlbmd0aCArIFwiIGV2ZW50XCIgKyAoZXZlbnRzLmxlbmd0aCA+IDEgPyBcInNcIiA6IFwiXCIpICsgXCIgZm91bmQuXCI7XHJcbiAgICBkZXRhaWxzLmFwcGVuZENoaWxkKHN1bW1hcnkpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29udGVudC5jbGFzc05hbWUgPSBcImZhcV9fY29udGVudFwiO1xyXG4gICAgZGV0YWlscy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAvL2NyZWF0ZSBhIHJvdyBmb3IgZWFjaCBldmVudFxyXG4gICAgZXZlbnRzLmZvckVhY2goYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNpbmdsZWV2ZW50d3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHNpbmdsZWV2ZW50d3JhcHBlci5jbGFzc05hbWUgPSBcInNpbmdsZUV2ZW50V3JhcHBlclwiO1xyXG5cclxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIG5vdGlmaWNhdGlvblRleHQuY2xhc3NOYW1lID0gXCJldmVudE5vdGlmaWNhdGlvblRleHRcIjtcclxuICAgICAgbm90aWZpY2F0aW9uVGV4dC5pbm5lclRleHQgPSBcIi0gXCIgKyBldmVudFswXTtcclxuICAgICAgc2luZ2xlZXZlbnR3cmFwcGVyLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvblRleHQpO1xyXG5cclxuICAgICAgY29uc3Qgc3ViamVjdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzdWJqZWN0SW5wdXQuY2xhc3NOYW1lID0gXCJzdWJqZWN0SW5wdXRcIjtcclxuICAgICAgc3ViamVjdElucHV0LnBsYWNlaG9sZGVyID0gZXZlbnRbXCJzdWJqZWN0XCJdO1xyXG4gICAgICBzaW5nbGVldmVudHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ViamVjdElucHV0KTtcclxuXHJcbiAgICAgIGNvbnN0IGJ0R3JvdXAgPSBhd2FpdCBjcmVhdGVCdXR0b25Hcm91cChldmVudCk7XHJcbiAgICAgIHNpbmdsZWV2ZW50d3JhcHBlci5hcHBlbmRDaGlsZChidEdyb3VwKTtcclxuICAgICAgY29udGVudC5hcHBlbmRDaGlsZChzaW5nbGVldmVudHdyYXBwZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUobWFpbiwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKTtcclxuICB9XHJcbn07XHJcblxyXG5zaG93Tm90aWZpY2F0aW9uKCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==