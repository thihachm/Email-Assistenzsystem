import { Agent } from "../agent";
import { defaultKnowledgebase } from "../../knowledgebase";

export class OptionsAgent extends Agent {
  /**
   *
   * @param {String} name The name of the agent.
   * @param {Boolean} debug Enables logging functionality for this agent.
   */
  constructor(name, debug) {
    super(name, debug);
  }

  /**
   *
   * Initiates all necessary parameters for the agent to work.
   * This function gets called by the environment upon creation.
   *
   */
  init = async () => {
    await this.loadSettings();
    await this.loadKnowledgebase();
  };

  /**
   *
   * The interface to communicate with this agent.
   *
   * @param {String} command the name of the function the agent should execute
   * @param {Object} data the data that gets passed along to the function
   *
   */
  recieve = async (command, data) => {
    switch (command) {
      case "clearKnowledgebase":
        this.clearKnowledgebase();
        break;
      case "resetKnowledgebase":
        this.resetKnowledgebase();
        break;
      case "getAllRules":
        return this.getAllRules();
      case "toggleRule":
        return this.toggleRule(data);
      case "addNewRule":
        return this.addNewRule(data);
      case "set":
        return await this.set(data.key, data.value);
      case "get":
        return await this.get(data.key);
      default:
        this.log(["Unknown command."]);
        break;
    }
  };

  /**
   * Tries to set a value in the local storage area
   * of the webextension by a given key.
   *
   * @param {*} key The key to set the value for.
   * @param {*} value The value to set.
   */
  set = async (key, value) => {
    let obj = {};
    obj[key] = value;
    await browser.storage.local
      .set(obj)
      .then(() => {
        this.log(["Succesfully set " + key + " to " + value]);
      })
      .catch(() => {
        this.log(["Failed setting " + key + " to " + value]);
      });
  };

  /**
   *
   * Returns a Promise of the value for given key
   * from local storage.
   * @param {*} key The key to search for in the storage.
   * @return {Promise}
   */
  get = (key) => {
    return browser.storage.local.get(key);
  };

  /**
   *
   * Attempts to load the settings from the settings.json
   * and save the content in the local storage area of
   * the extension.
   *
   */
  loadSettings = async () => {
    this.log(["Build settings from settings.json file..."]);
    const settings = await fetch(
      browser.runtime.getURL("config/settings.json")
    ).then((res) => res.json());
    for (const key in settings) {
      await this.set(key, settings[key]);
    }
    this.log(["Done."]);
  };

  /**
   *
   * Recreates the database either from file
   * or from default values.
   *
   */
  loadKnowledgebase = async () => {
    this.log(["Build knowledgebase from db.json file..."]);
    // web accesable_ressources in manifest and
    // fetch/XmlHttpRequest allows to read those files
    // no need for experiment api
    let db;
    try {
      db = await fetch(browser.runtime.getURL("config/db.json")).then((res) =>
        res.json()
      );
    } catch (error) {
      this.log(["Failed to read db from db.json.", error]);
    }

    if (db) {
      this.log(["Found database file..."]);
      // if the database object is not empty set it into storage
      if (Object.keys(db).length !== 0) {
        await this.set("db", db);
        return;
      }
      this.log(["Database file contains empty object."]);
    }

    // take default rules
    this.log(["Using default database file..."]);
    await this.set("db", defaultKnowledgebase);
    browser.myapi.writeJson(defaultKnowledgebase, "db");
    this.log(["Done."]);
  };

  /**
   *
   * Attempts to clear the database
   * in storage and inside the file.
   * 
   */
  clearKnowledgebase = async () => {
    this.log(["Clearing knowledgebase..."]);
    await this.set("db", { de: {}, en: {} });
    await browser.myapi.writeJson({ de: {}, en: {} }, "db");
    this.log(["Done.", ""]);
  };

  /**
   *
   * Attempts to reset the database
   * to default.
   * 
   */
  resetKnowledgebase = async () => {
    this.log(["Resetting knowledgebase..."]);
    await this.set("db", defaultKnowledgebase);
    await browser.myapi.writeJson(defaultKnowledgebase, "db");
    this.log(["Done.", ""]);
  };

  /**
   *
   * Get all rules stored inside
   * the database.
   * 
   */
  getAllRules = async () => {
    const { db } = await browser.storage.local.get("db").then((item) => {
      return item;
    });
    const { de, en } = db;
    const rules = [];
    for (const key in de) {
      if (Object.hasOwnProperty.call(de, key)) {
        const rule = de[key];
        if (rule.enabled) {
          rules.push(rule);
        }
      }
    }
    for (const key in en) {
      if (Object.hasOwnProperty.call(en, key)) {
        const rule = en[key];
        if (rule.enabled) {
          rules.push(rule);
        }
      }
    }
    this.log([rules]);
    return rules;
  };

  /**
   *
   * Adds a new rule to the database.
   * @param {Object} data
   */
  addNewRule = async (data) => {
    const { pattern, language, example } = data;

    let { db } = await this.get("db");
    console.log(db);
    let lastKey = Object.keys(db[language])[
      Object.keys(db[language]).length - 1
    ];

    try {
      lastKey = parseInt(lastKey);
      const nextKey = lastKey + 1;
      db[language][nextKey] = { enabled: true, pattern, example };
      await this.set("db", db);
      await browser.myapi.writeJson(db, "db");
    } catch (error) {}
  };

  /**
   * 
   * Turn a rule on or off.
   * @param {Object} data
   * 
   */
  toggleRule = async (data) => {
    const { path, enabled } = data;
    let keys = path.split(".");
    let { db } = await this.get("db");
    db[keys[0]][keys[1]]["enabled"] = enabled;
    this.set("db", db);
    await browser.myapi.writeJson(db, "db");
  };
  
}