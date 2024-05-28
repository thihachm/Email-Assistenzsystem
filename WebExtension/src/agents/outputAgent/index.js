import { Agent } from "../agent";
import * as icsapi from "ics"; // https://github.com/adamgibbons/ics
import * as DateParser from "any-date-parser"; //https://github.com/kensnyder/any-date-parser

export class OutputAgent extends Agent {
  calendarId = "";
  calendar;
  calendarName = "";
  defaultCalendarName = "ERS Calendar";

  /**
   *
   * @param {String} agentName The name of the agent.
   * @param {Boolean} debug Enables logging functionality for this agent.
   */
  constructor(agentName, debug) {
    super(agentName, debug);
  }

  /**
   *
   * Initiates all necessary parameters for the agent to work.
   * This function gets called by the environment upon creation.
   * Initialize the calendar name and attempts to create a calendar
   * with default name in case none is existent.
   *
   */
  init = async () => {
    // ask agent if there is a calendarName in storage
    const { calendarName } = await this.sendMessage({
      reciever: "OptionsAgent",
      command: "get",
      data: { key: "calendarName" },
    });
    if (typeof calendarName == "undefined") {
      // default calendar name
      this.calendarName = this.defaultCalendarName;
      this.sendMessage({
        command: "set",
        reciever: "OptionsAgent",
        data: { key: "calendarName", value: this.defaultCalendarName },
      });
      this.log(["Using default calendar name: " + this.defaultCalendarName]);
    } else {
      // given calendar name by environment
      this.log(["Found existing calendar name."]);
      this.calendarName = calendarName;
    }

    await this.findExistingCalendar(this.calendarName);
    if (typeof this.calendar == "undefined") {
      this.attemptCreateCalendar(this.calendarName);
    }

    this.addListeners();
  };

  /**
   *
   * The interface to communicate with this agent.
   *
   * @param {String} command the name of the function the agent should execute
   * @param {Object} data the data that gets passed along to the function
   */
  recieve = async (command, data) => {
    switch (command) {
      case "triggerIcsDownload":
        this.createIcsDownload(data.event);
        break;
      case "triggerCalendarEntry":
        this.createCalendarEntry(data.event);
        break;
      case "attemptCreateCalendar":
        this.attemptCreateCalendar(data.name);
        break;
      default:
        this.log(["Unknown command."]);
        break;
    }
  };

  //#region CALENDAR

  /**
   * Adds listener onCreated for usernotification.
   */
  addListeners = () => {
    messenger.calendar.items.onCreated.addListener(
      (item) => {
        console.log("Created item", item);
        browser.notifications.create({
          type: "basic",
          title: "New calender entry",
          message: item.title,
        });
      },
      { returnFormat: "ical" }
    );
  };

  /**
   * Attempts to create a calendar.
   */
  attemptCreateCalendar = async (calendarName) => {
    this.log(["Attempt to create a calendar with name: " + calendarName]);
    await messenger.calendar.calendars.create({
      name: calendarName,
      type: "storage",
      color: "red",
      url: "moz-storage-calendar://",
    });
  };

  /**
   *
   * Find a calendar by its name.
   *
   * @param {String} name The name of the calendar.
   * @returns
   */
  findExistingCalendar = async (name) => {
    this.log(["Try finding calendar by name: " + name], this.name);

    // possible query params:
    //{
    //     type,
    //     url,
    //     name,
    //     color,
    //     readOnly,
    //     enabled,
    // }
    const foundCalendar = await messenger.calendar.calendars.query({ name });

    if (foundCalendar.length == 0) {
      return false;
    }

    this.log([
      "Found existing calendar " + foundCalendar[0].id + "...",
      foundCalendar,
    ]);
    this.calendarId = foundCalendar[0].id;
    this.calendar = foundCalendar;
    return true;
  };

  /**
   * Creates a calendar entry.
   * @param {Object} event
   */
  createCalendarEntry = (event) => {
    if (event) {
      const parsedDate = DateParser.fromString(event[0]);
      this.log(["parsed date: ", parsedDate]);

      const eventproperties = this.createIcsProperties(parsedDate);
      const ics = this.createIcsString(eventproperties);

      const entry = {
        id: crypto.randomUUID(),
        type: "event",
        title: event["subject"],
        description: event["input"],
        categories: ["Assistenzsystem"],
        startDate: this.formatDateForCalendarEntry(parsedDate),
        endDate: this.formatDateForCalendarEntry(parsedDate),
        formats: { use: null, ical: ics },
      };
      messenger.calendar.items.create(this.calendarId, entry);
    }
  };

  //#endregion

  //#region ICAL

  /**
   * Creates an ical string to offer to the browser's
   * download functionality. It starts the download.
   *
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
   * @param {Object} event
   */
  createIcsDownload(event) {
    if (event) {
      this.log([
        "Creating markup for ICal download. Attempting to parse eventstring: " +
          event[0],
      ]);
      const parsedDate = DateParser.fromString(event[0]);
      this.log("parsedDate: " + parsedDate);
      const eventproperties = this.createIcsProperties(parsedDate);
      const ical = this.createIcsString(eventproperties);
      if (ical) {
        browser.downloads.download({
          url: URL.createObjectURL(
            new Blob([ical], { type: "text/calendar;charset=utf-8" })
          ),
          filename: "event.ics",
        });
      }
    }
  }

  /**
   * @param {Date} date
   * @see https://github.com/adamgibbons/ics
   */
  createIcsProperties(date) {
    this.log(["createIcsProperties(date) got: ", date]);

    const arr = icsapi.convertTimestampToArray(date);
    return {
      title: "",
      start: arr,
      duration: { hours: 0, minutes: 30 },
      description: "generated by extension",
    };
  }

  /**
   *
   * @param {Object} eventproperties
   */
  createIcsString(eventproperties) {
    this.log(["createIcsString(eventproperties) got: ", eventproperties]);
    const { error, value } = icsapi.createEvent(eventproperties);
    if (error) {
      console.log(error);
      return;
    }
    return value;
  }

  /**
   * @param {Date} date
   */
  formatDateForCalendarEntry(date) {
    return date
      .toISOString()
      .replace(/\.\d+Z$/, "")
      .replace(/[:-]/g, "");
  }

  //#endregion
}
