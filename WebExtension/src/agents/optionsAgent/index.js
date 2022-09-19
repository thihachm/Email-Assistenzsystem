import { Agent } from "../agent"
import { db } from "../../db"

export class OptionsAgent extends Agent {

    constructor(name) {
        super(name)
    }

    /**
    * 
    * @param {Object} groups
    */
    recieve(command, event, tabId) {
        switch (command) {
            case "approveevent":
                break;
            case "rejectevent":
                break;
            default:
                break;
        }
    }

}  