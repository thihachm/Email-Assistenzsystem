let agents = {}
let outputBasePath = ""
let debugQuery = []
let couterToClearLog = 100
const entriesToWriteLog = 6
const DEBUG = true

const setBasePath = async () => {
    const { basepath } = await browser.storage.local.get("basepath").then((item) => {
        return item
    })
    basepath ? console.log("Writing output to " + basepath + ".") : ""
    outputBasePath = basepath || ""
}

/**
 * 
 */
const log = async (message) => {
    const text = "[" + new Date().toLocaleTimeString() + "]: " + message
    if (DEBUG) { console.log(message) }
    debugQuery.push(text)
    if (debugQuery.length >= entriesToWriteLog && outputBasePath != "") {
        const output = debugQuery.join(",")
        console.log(output);
        const resp = browser.myapi.writeJson(outputBasePath, output)
        if (resp || couterToClearLog === 0) {
            console.log("Writing log to file succeeded.");
            couterToClearLog = 100
            debugQuery = []
        } else {
            console.log("Writing log to file failed.");
            couterToClearLog--
        }
    }
    if (outputBasePath == "") {
        console.log("Setup output base path in extension settings first.");
    }
    // const timer = setInterval(async function () {
    //     if (debugQuery.length > 0 && outputBasePath != "") {
    //         const text = debugQuery.shift()
    //         console.log(text);
    //         await browser.myapi.writeJson(outputBasePath, text)
    //     }
    //     if (debugQuery.length === 0) clearInterval(timer);
    // }, 5000);
}
/**
 * 
 */
const writeEvent = async (evt) => {
    const text = "[" + new Date().toLocaleTimeString() + "]: " + evt
    if (DEBUG) { console.log(evt) }
    if (outputBasePath != "") {
        browser.myapi.writeEvent(outputBasePath, JSON.stringify(evt), evt[0], evt['mailID'])
    }
}

/**
 * 
 */
const registerAgent = (name, agent) => {
    // const alreadyRegistered = agents.filter(element => element.name == agent.name)
    // if (alreadyRegistered.length == 0) {
    //     agents.push(agent)
    // }
    agents[name] = agent
};

/**
 * Handles the commands received from an observed message.
 */
const doHandleCommand = async (message, sender) => {
    const { command, reciever, _sender, data } = message

    if (command == "log") {
        log(message.text)
        return
    }
    if (command == "updateBasePath") {
        setBasePath()
        return
    } else {
        log(_sender + " -> " + command + " -> " + reciever)
    }

    //updateDebugLocation hat observer als reciever
    if (reciever) {
        // const { tab: { id: tabId } } = sender
        const tabId = sender?.tab?.id
        return agents[reciever].recieve(command, data, tabId)
    }
};

/**
 * Handle the received message by filtering for all messages
 * whose "type" property is set to "command".
 */
const observeMessages = (message, sender, sendResponse) => {
    if (message && message.hasOwnProperty("command")) {
        return doHandleCommand(message, sender);
    }
};

export { observeMessages, registerAgent, setBasePath, log, writeEvent }