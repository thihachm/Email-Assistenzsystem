import { Agent } from '../agent'
import * as icsapi from "ics" // https://github.com/adamgibbons/ics
import * as DateParser from "any-date-parser" //https://github.com/kensnyder/any-date-parser

export class OutputAgent extends Agent {

    calendarId = ""
    calendarProvider = {}

    constructor(name) {
        super(name)
        const { calendar: calendarProvider } = messenger;
        this.calendarProvider = calendarProvider
        this.attemptCreateCalendar()
        this.addListeners()
    }

    /**
    * The interface to communicate with the agent. 
    * @param {String} command
    * @param {Object} data
    * @param {Number} tabId
    */
    recieve(command, data, tabId) {
        switch (command) {
            case "triggerIcsDownload":
                this.createIcsDownload(data.event)
                break;
            case "triggerCalendarEntry":
                this.createCalendarEntry(data)
                break;
            default:
                break;
        }
    }

    //#region CALENDAR

    /**
    * Adds listeners to different calendar events for debug purposes.
    */
    addListeners() {
        this.calendarProvider.calendars.onCreated.addListener((calendar) => {
            console.log("Created calendar", calendar);
        });
        this.calendarProvider.calendars.onUpdated.addListener((calendar, changeInfo) => {
            console.log("Updated calendar", calendar, changeInfo);
        });
        this.calendarProvider.calendars.onRemoved.addListener((id) => {
            console.log("Removed calendar", id);
        });
        this.calendarProvider.items.onCreated.addListener((item) => {
            console.log("Created item", item);
        }, { returnFormat: "ical" });
        this.calendarProvider.items.onUpdated.addListener((item, changeInfo) => {
            console.log("Updated item", item, changeInfo);
        }, { returnFormat: "ical" });
        this.calendarProvider.items.onRemoved.addListener((calendarId, id) => {
            console.log("Deleted item", id);
        });
        this.calendarProvider.items.onAlarm.addListener((item, alarm) => {
            console.log("Alarm item", item, alarm);
        }, { returnFormat: "ical" });
        this.calendarProvider.provider.onItemCreated.addListener(async (calendar, item) => {
            console.log("Provider add to calendar", item);
            item.metadata = { created: true };
            return item;
        }, { returnFormat: "ical" });
        this.calendarProvider.provider.onItemUpdated.addListener(async (calendar, item, oldItem) => {
            console.log("Provider modify in calendar", item, oldItem);
            item.metadata = { updated: true };
            return item;
        }, { returnFormat: "ical" });
        this.calendarProvider.provider.onItemRemoved.addListener(async (calendar, item) => {
            console.log("Provider remove from calendar", item);
        });

        // let ticks = {};
        this.calendarProvider.provider.onInit.addListener(async (calendar) => {
            console.log("Initializing", calendar);
        });
        // this.calendarProvider.provider.onSync.addListener(async (calendar) => {
        //     console.log("Synchronizing", calendar, "tick", ticks[calendar.id]);

        //     if (!ticks[calendar.id]) {
        //         ticks[calendar.id] = 0;

        //         await this.calendarProvider.items.create(calendar.cacheId, {
        //             id: "findme",
        //             type: "event",
        //             title: "New Event",
        //             startDate: icalDate(new Date()),
        //             endDate: icalDate(new Date()),
        //             metadata: { etag: 123 }
        //         });
        //     } else if (ticks[calendar.id] == 1) {
        //         await this.calendarProvider.items.update(calendar.cacheId, "findme", {
        //             title: "Updated",
        //             startDate: icalDate(new Date()),
        //             endDate: icalDate(new Date()),
        //             metadata: { etag: 234 }
        //         });
        //     } else if (ticks[calendar.id] == 2) {
        //         await this.calendarProvider.calendars.clear(calendar.cacheId);
        //     } else {
        //         ticks[calendar.id] = -1;
        //     }

        //     ticks[calendar.id]++;
        // });
        // this.calendarProvider.provider.onResetSync.addListener(async (calendar) => {
        //     console.log("Reset sync for", calendar);
        //     delete ticks[calendar.id];
        // });
    }

    /**
    * Creates a calendar. 
    */
    async attemptCreateCalendar() {
        let queryProps = { name: "ERS Calendar" }
        let foundCalendar = await this.calendarProvider.calendars.query(queryProps)

        if (foundCalendar.length == 0) {
            await this.calendarProvider.calendars.create({
                name: "ERS Calendar",
                type: "storage",
                color: "red",
                url: "moz-storage-calendar://"
            });
        } else {
            this.log("Found existing calendar " + foundCalendar[0].id + ".");
            this.log(JSON.stringify(foundCalendar));
            this.calendarId = foundCalendar[0].id
        }
    }

    /**
    * Creates a calendar entry .
    * @param {Object} data
    */
    createCalendarEntry(data) {
        const { event } = data
        if (event) {
            const parsedDate = DateParser.fromString(event[0])
            const eventproperties = this.createIcsProperties(parsedDate)
            const ics = this.createIcsString(eventproperties)

            let item = {
                id: crypto.randomUUID(),
                type: "event",
                title: "summary",
                description: "description",
                startDate: this.formatDateForCalendarEntry(parsedDate),
                endDate: this.formatDateForCalendarEntry(parsedDate),
                formats: { use: null, ical: ics },
            };
            this.calendarProvider.items.create(this.calendarId, item);
        }
    }

    //#endregion

    //#region ICAL

    /**
    * 
    * @param {Object} groups
    */
    createIcsDownload(event) {
        console.log("Creating markup for ICal download. Attempting to parse eventstring: " + event[0]);
        const eventproperties = this.createIcsProperties(event[0])
        const ical = this.createIcsString(eventproperties)
        if (ical) {
            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download
            browser.downloads.download({
                url: URL.createObjectURL(new Blob([ical], { type: 'text/calendar;charset=utf-8' })),
                filename: "event.ical"
            })
        }
    }

    /**
    * @param {Object} groups
    * @see {https://github.com/adamgibbons/ics}
    */
    createIcsProperties(date) {
        const arr = icsapi.convertTimestampToArray(date)
        return {
            title: '',
            start: arr,
            duration: { hours: 0, minutes: 30 },
            description: "generated by extension"
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
    * @param {Date} date
    */
    formatDateForCalendarEntry(date) {
        return date.toISOString().replace(/\.\d+Z$/, "").replace(/[:-]/g, "");
    }
    //#endregion
}