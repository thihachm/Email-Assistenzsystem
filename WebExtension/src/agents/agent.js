import { log, writeEvent } from "../observer"

export class Agent {

    name = ""

    constructor(name) {
        this.name = name;
    }

    get name() {
        return this.name;
    }

    get log() {
        return log
    }
    get writeEvent() {
        return writeEvent
    }

}