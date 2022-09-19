let agents = {}

/**
 * Ensure only one agent per goal.
 */
const registerAgent = (name, agent) => {
    // const alreadyRegistered = agents.filter(element => element.name == agent.name)
    // if (alreadyRegistered.length == 0) {
    //     agents.push(agent)
    // }
    agents[name] = agent
};

/**
 * command handler: handles the commands received from the content script
 */
const doHandleCommand = async (message, sender) => {
    const { command, reciever, event } = message
    const { tab: { id: tabId } } = sender

    if (command == "debug") {
        const { value } = message;
        console.log(value);
        return
    }

    return agents[reciever].prototype.recieve(command, event, tabId)
};

/**
 * handle the received message by filtering for all messages
 * whose "type" property is set to "command".
 */
const observeMessages = (message, sender, sendResponse) => {
    if (message && message.hasOwnProperty("command")) {
        return doHandleCommand(message, sender);
    }
};

export { observeMessages, registerAgent }