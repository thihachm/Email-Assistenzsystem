import { Agent } from '../agent'
import * as icsapi from "ics" // https://github.com/adamgibbons/ics

export class OutputAgent extends Agent {

    calendarProvider = {}

    constructor(name) {
        super(name)
        const { calendar: calendarProvider } = messenger;
        this.calendarProvider = calendarProvider
    }

  /**
  * The interface to communicate with the agent. 
  * @param {String} command
  * @param {Object} event
  * @param {Number} tabId
  */
    recieve(command, event, tabId) {
        switch (command) {
            case "triggericsdownload":
                console.log("triggericsdownload");
                this.createIcsDownload(event)
                break;
            default:
                break;
        }
    }

    /**
    * Adds listeners to different calendar events for debug purposes.
    */
    addListeners() {
        calendarProvider.calendars.onCreated.addListener((calendar) => {
            console.log("Created calendar", calendar);
        });
        calendarProvider.calendars.onUpdated.addListener((calendar, changeInfo) => {
            console.log("Updated calendar", calendar, changeInfo);
        });
        calendarProvider.calendars.onRemoved.addListener((id) => {
            console.log("Removed calendar", id);
        });
        calendarProvider.items.onCreated.addListener((item) => {
            console.log("Created item", item);
        }, { returnFormat: "ical" });
        calendarProvider.items.onUpdated.addListener((item, changeInfo) => {
            console.log("Updated item", item, changeInfo);
        }, { returnFormat: "ical" });
        calendarProvider.items.onRemoved.addListener((calendarId, id) => {
            console.log("Deleted item", id);
        });
        calendarProvider.items.onAlarm.addListener((item, alarm) => {
            console.log("Alarm item", item, alarm);
        }, { returnFormat: "ical" });
        calendarProvider.provider.onItemCreated.addListener(async (calendar, item) => {
            console.log("Provider add to calendar", item);
            item.metadata = { created: true };
            return item;
        }, { returnFormat: "ical" });
        calendarProvider.provider.onItemUpdated.addListener(async (calendar, item, oldItem) => {
            console.log("Provider modify in calendar", item, oldItem);
            item.metadata = { updated: true };
            return item;
        }, { returnFormat: "ical" });
        calendarProvider.provider.onItemRemoved.addListener(async (calendar, item) => {
            console.log("Provider remove from calendar", item);
        });

        let ticks = {};
        calendarProvider.provider.onInit.addListener(async (calendar) => {
            console.log("Initializing", calendar);
        });
        calendarProvider.provider.onSync.addListener(async (calendar) => {
            console.log("Synchronizing", calendar, "tick", ticks[calendar.id]);

            if (!ticks[calendar.id]) {
                ticks[calendar.id] = 0;

                await calendarProvider.items.create(calendar.cacheId, {
                    id: "findme",
                    type: "event",
                    title: "New Event",
                    startDate: icalDate(new Date()),
                    endDate: icalDate(new Date()),
                    metadata: { etag: 123 }
                });
            } else if (ticks[calendar.id] == 1) {
                await calendarProvider.items.update(calendar.cacheId, "findme", {
                    title: "Updated",
                    startDate: icalDate(new Date()),
                    endDate: icalDate(new Date()),
                    metadata: { etag: 234 }
                });
            } else if (ticks[calendar.id] == 2) {
                await calendarProvider.calendars.clear(calendar.cacheId);
            } else {
                ticks[calendar.id] = -1;
            }

            ticks[calendar.id]++;
        });
        calendarProvider.provider.onResetSync.addListener(async (calendar) => {
            console.log("Reset sync for", calendar);
            delete ticks[calendar.id];
        });
    }

    /**
    * 
    * @param {Object} groups
    */
    recieveMessage(message) {
        const { command } = message;
    }

    /**
    * Creates a calendar entry 
    * @param {Number} calendarId
    * @param {Object} ics
    */
    createCalendarEntry(calendarId, ics) {

        //@TODO generate uuid 
        const testuuid = "2a358cee-6489-4f14-a57f-c104db4dc2f1"

        let item = {
            id: testuuid,
            calendarId,
            format: "ical",
            item: ics
        };
        calendarProvider.items.create(calendarId, item);
    }

    /**
    * 
    * @param {Object} groups
    */
    createIcsDownload(event) {
        if (event.groups) {
            const eventproperties = this.createIcsProperties(event.groups)
            const ics = this.createIcsString(eventproperties)
            if (ics) {
                // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
                browser.downloads.download({
                    url: URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' })),
                    filename: "event.ics"
                })
            }
        }
    }

    /**
    * 
    * @param {Object} eventproperties
    */
    createIcsString(eventproperties) {
        const { error, value } = icsapi.createEvent(eventproperties)
        if (error) {
            console.log(error)
            return
        }
        return value
    }

    /**
    * @param {Object} groups
    * @see {https://github.com/adamgibbons/ics}
    */
    createIcsProperties(groups) {
        let start = []
        if (Object.hasOwnProperty.call(groups, "year")) {
            let year = groups["year"]
            if (year.length == 2) {
                year = "20" + year
            }
            start.push(Number(year))
        }
        if (Object.hasOwnProperty.call(groups, "month")) {
            let month = groups["month"]
            start.push(Number(month))
        }
        if (Object.hasOwnProperty.call(groups, "day")) {
            let day = groups["day"]
            start.push(Number(day))
        }
        return {
            title: '',
            start,
            duration: {},
        }
    }

    /**
    * @param {Date} date
    */
    icalDate(date) {
        return date.toISOString().replace(/\.\d+Z$/, "").replace(/[:-]/g, "");
    }

}