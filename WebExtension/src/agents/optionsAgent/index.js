import { Agent } from "../agent"
import { defaultKnowledgebase } from "../../knowledgebase"

export class OptionsAgent extends Agent {

    constructor(name) {
        super(name)
        this.buildKnowledgebase()
    }

    /**
    * 
    * @param {String} command
    * @param {Object} data
    * @param {Number} tabId
    */
    recieve(command, data, tabId) {
        const event = data?.event
        switch (command) {
            case "approveEvent":
                event["approved"] = true
                this.log("Event " + event[0] + " in mail " + event["mailID"] + " was approved by user.")
                this.writeEvent(event)
                break;
            case "rejectEvent":
                event["approved"] = false
                this.log("Event " + event[0] + " in mail " + event["mailID"] + " was rejected by user.")
                this.writeEvent(event)
                break;
            case "clearKnowledgebase":
                this.clearKnowledgebase()
                break;
            case "storeDefaultKnowledgebase":
                this.storeKnowledgebase()
                break;
            case "storeEntry":
                this.storeEntryInKnowledgebase(data.key, data.value)
                break;
            case "getAllRules":
                return this.getAllRules()
                break;
            case "toggleRule":
                return this.toggleRule(data)
                break;
            default:
                break;
        }
    }

    /** 
    * 
    */
    async storeKnowledgebase(knowledgebase) {
        if (knowledgebase) {
            this.log(JSON.stringify(knowledgebase));
            await browser.storage.local.set({ knowledgebase });
        } else {
            this.log(JSON.stringify(defaultKnowledgebase));
            await browser.storage.local.set({ knowledgebase: defaultKnowledgebase });
        }
    }

    /** 
    * 
    */
    async getEntireKnowledgebase() {
        const { knowledgebase } = await browser.storage.local.get("knowledgebase").then((item) => {
            return item
        })
        return knowledgebase
    }

    /** 
    * 
    */
    async clearKnowledgebase() {
        this.log("Removing knowledgebase from memory.");
        await browser.storage.local.remove("knowledgebase")
    }

    /** 
    * 
    * @param {Object} key
    * @param {Object} value
    */
    async storeEntryInKnowledgebase(path, value) {
        this.log("Storing: " + path + ":" + value);
        const knowledgebase = await this.getEntireKnowledgebase()
        let keys = path.split(".")
        knowledgebase[keys[0]][keys[1]][keys[2]] = value
        // knowledgebase[key] = value
        // await browser.storage.local.set({ knowledgebase });
        // const newknowledgebase = key.split(".").reduce(
        //     (res, key) => {
        //         if (res.hasOwnProperty(key)) {
        //             if (typeof res[key] === "object") {
        //                 return res[key]
        //             } else {
        //                 res[key]['active'] = value
        //                 return res
        //             }
        //         }
        //     },
        //     knowledgebase
        // );
        // console.log(newknowledgebase);
        // const res = this.set(knowledgebase, null, key + ".active", 0, value)
        console.log(res);
    }

    /** 
    * 
    */
    set(object, prevobject, path, pathindex, value) {
        const currentLevel = path.split(".")[pathindex]
        if (object.hasOwnProperty(currentLevel)) {
            // console.log("typeof " + typeof object[currentLevel]);
            if (typeof object[currentLevel] === "object") {
                // console.log(object[currentLevel]);
                prevobject = object
                return this.set(object[currentLevel], prevobject, path, pathindex + 1, value)
            } else {
                object[currentLevel] = value
                // console.log("Setting: " + object[currentLevel] + " " + value);
            }
        }
        path.split(".")[pathindex]
    }

    /** 
    * 
    * @param {Object} key
    */
    async getEntryFromKnowledgebase(path) {

        console.log("Looking up: " + path);
        const knowledgebase = await this.getEntireKnowledgebase()

        if (knowledgebase.hasOwnProperty(key)) {
            console.log("Getting item from storage: " + knowledgebase[key]);
            return knowledgebase[key]
        }
    }

    /** 
    * 
    * @param {Object} obj
    * @param {String} path
    */
    get(obj, path, defaultValue) {
        const result = String.prototype.split
            .call(path, /[,[\].]+?/)
            .filter(Boolean)
            .reduce(
                (res, key) => (res !== null && res !== undefined ? res[key] : res),
                obj
            );
        return result === undefined || result === obj ? defaultValue : result;
    }

    /** 
    * 
    */
    async getAllRules() {
        const { knowledgebase } = await browser.storage.local.get("knowledgebase").then((item) => {
            return item
        })
        const { de, en } = knowledgebase
        const rules = []
        for (const key in de) {
            if (Object.hasOwnProperty.call(de, key)) {
                const rule = de[key];
                if (rule.active) {
                    rules.push(rule)
                }
            }
        }
        for (const key in en) {
            if (Object.hasOwnProperty.call(en, key)) {
                const rule = en[key];
                if (rule.active) {
                    rules.push(rule)
                }
            }
        }
        return rules;
    }

    /** 
    * 
    */
    async toggleRule(data) {
        const { path, enabled } = data
        const knowledgebase = await this.getEntireKnowledgebase()
        let keys = path.split(".")
        knowledgebase[keys[0]][keys[1]]['active'] = enabled
        await browser.storage.local.set({ knowledgebase });
    }

    /** 
    * 
    */
    async buildKnowledgebase() {
        const { basepath } = await browser.storage.local.get("basepath").then((item) => (item))
        let knowledgebase
        if (basepath) {
            knowledgebase = await browser.myapi.readDB(basepath)
        }
        if (knowledgebase) {
            this.log("Found valid database file...");
            this.storeKnowledgebase(knowledgebase)
        } else {
            knowledgebase = await this.getEntireKnowledgebase()
            if (knowledgebase) {
                this.log("Existing knowledgebase found in memory. Restoring...");
                console.log(knowledgebase)
            } else {
                this.log("No existing knowledgebase found in memory. Creating knowledgebase with default entries.");
                await this.storeKnowledgebase()
            }
        }


    }
}  