/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/any-date-parser/index.js":
/*!***********************************************!*\
  !*** ./node_modules/any-date-parser/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// import our main modules
const Parser = __webpack_require__(/*! ./src/Parser/Parser.js */ "./node_modules/any-date-parser/src/Parser/Parser.js");
const Format = __webpack_require__(/*! ./src/Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");
const LocaleHelper = __webpack_require__(/*! ./src/LocaleHelper/LocaleHelper.js */ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js");
// import our formats
const atSeconds = __webpack_require__(/*! ./src/formats/atSeconds/atSeconds.js */ "./node_modules/any-date-parser/src/formats/atSeconds/atSeconds.js");
const microsoftJson = __webpack_require__(/*! ./src/formats/microsoftJson/microsoftJson.js */ "./node_modules/any-date-parser/src/formats/microsoftJson/microsoftJson.js");
const ago = __webpack_require__(/*! ./src/formats/ago/ago.js */ "./node_modules/any-date-parser/src/formats/ago/ago.js");
const chinese = __webpack_require__(/*! ./src/formats/chinese/chinese.js */ "./node_modules/any-date-parser/src/formats/chinese/chinese.js");
const dayMonth = __webpack_require__(/*! ./src/formats/dayMonth/dayMonth.js */ "./node_modules/any-date-parser/src/formats/dayMonth/dayMonth.js");
const dayMonthname = __webpack_require__(/*! ./src/formats/dayMonthname/dayMonthname.js */ "./node_modules/any-date-parser/src/formats/dayMonthname/dayMonthname.js");
const dayMonthnameYear = __webpack_require__(/*! ./src/formats/dayMonthnameYear/dayMonthnameYear.js */ "./node_modules/any-date-parser/src/formats/dayMonthnameYear/dayMonthnameYear.js");
const dayMonthYear = __webpack_require__(/*! ./src/formats/dayMonthYear/dayMonthYear.js */ "./node_modules/any-date-parser/src/formats/dayMonthYear/dayMonthYear.js");
const defaultLocale = __webpack_require__(/*! ./src/data/defaultLocale.js */ "./node_modules/any-date-parser/src/data/defaultLocale.js");
const monthDay = __webpack_require__(/*! ./src/formats/monthDay/monthDay.js */ "./node_modules/any-date-parser/src/formats/monthDay/monthDay.js");
const monthDayYear = __webpack_require__(/*! ./src/formats/monthDayYear/monthDayYear.js */ "./node_modules/any-date-parser/src/formats/monthDayYear/monthDayYear.js");
const monthnameDay = __webpack_require__(/*! ./src/formats/monthnameDay/monthnameDay.js */ "./node_modules/any-date-parser/src/formats/monthnameDay/monthnameDay.js");
const monthnameDayYear = __webpack_require__(/*! ./src/formats/monthnameDayYear/monthnameDayYear.js */ "./node_modules/any-date-parser/src/formats/monthnameDayYear/monthnameDayYear.js");
const time12Hours = __webpack_require__(/*! ./src/formats/time12Hours/time12Hours.js */ "./node_modules/any-date-parser/src/formats/time12Hours/time12Hours.js");
const time24Hours = __webpack_require__(/*! ./src/formats/time24Hours/time24Hours.js */ "./node_modules/any-date-parser/src/formats/time24Hours/time24Hours.js");
const today = __webpack_require__(/*! ./src/formats/today/today.js */ "./node_modules/any-date-parser/src/formats/today/today.js");
const twitter = __webpack_require__(/*! ./src/formats/twitter/twitter.js */ "./node_modules/any-date-parser/src/formats/twitter/twitter.js");
const yearMonthDay = __webpack_require__(/*! ./src/formats/yearMonthDay/yearMonthDay.js */ "./node_modules/any-date-parser/src/formats/yearMonthDay/yearMonthDay.js");

// create a default parser instance and register all the default formats
const parser = new Parser();
parser
	// all formats can have time strings at the end
	.addFormats([
		time24Hours,
		time12Hours,
		// from most unambiguous and popular to least
		yearMonthDay,
		dayMonthnameYear,
		monthnameDayYear,
		monthDayYear,
		dayMonthYear,
		chinese,
		twitter,
		today,
		ago,
		monthnameDay,
		dayMonthname,
		monthDay,
		dayMonth,
		atSeconds,
		microsoftJson,
	]);

// make it easy to consume our other main modules and functions
parser.Parser = Parser;
parser.Format = Format;
parser.LocaleHelper = LocaleHelper;
parser.defaultLocale = defaultLocale;

// create functions on Date
parser.fromString = Date.fromString = parser.exportAsFunction();
parser.fromAny = Date.fromAny = parser.exportAsFunctionAny();

if (typeof window !== 'undefined') {
	/* istanbul ignore next */
	window.anyDateParser = parser;
}

// export our default parser
module.exports = parser;


/***/ }),

/***/ "./node_modules/any-date-parser/src/Format/Format.js":
/*!***********************************************************!*\
  !*** ./node_modules/any-date-parser/src/Format/Format.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const LocaleHelper = __webpack_require__(/*! ../LocaleHelper/LocaleHelper.js */ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js");
const defaultLocale = __webpack_require__(/*! ../data/defaultLocale.js */ "./node_modules/any-date-parser/src/data/defaultLocale.js");

/**
 * Represents a parsable date format
 */
class Format {
	/**
	 * Given a definition, create a parsable format
	 * @param {Object} definition  The format definition
	 * @property {String} template  A template for RegExp that can handle multiple languages
	 * @property {RegExp} matcher  An actual RegExp to match against
	 * @property {Array} units  If the template or RegExp match exact units, you can define the units
	 * @property {Function} handler  A flexible alternative to units; must return an object
	 * @property {Array} locales  A list of locales that this format should be restricted to
	 */
	constructor({
		template = null,
		matcher = null,
		units = null,
		handler = null,
		locales = null,
	}) {
		if (!Array.isArray(units) && typeof handler !== 'function') {
			throw new Error(
				'new Format must receive a "units" array or "handler" function'
			);
		}
		if (typeof template !== 'string' && !(matcher instanceof RegExp)) {
			throw new Error(
				'new Format must receive a "template" string or "matcher" RegExp'
			);
		}
		/**
		 * @type {String} template  A template for RegExp that can handle multiple languages
		 */
		this.template = template;

		/**
		 * @type {Array} units  If the template or RegExp match exact units, you can define the units
		 */
		this.units = units;

		/**
		 * @type {RegExp} matcher  An actual RegExp to match against
		 */
		this.matcher = matcher;

		/**
		 * @type {Function} handler  A flexible alternative to units; must return an object
		 */
		this.handler = handler;

		/**
		 * @type {String[]} locales  A list of locales that this format should be restricted to
		 */
		this.locales = locales;

		/**
		 * A cache of RegExp indexed by locale name
		 * @type {Object}
		 */
		this.regexByLocale = {};
	}

	/**
	 * Build the RegExp from the template for a given locale
	 * @param {String} locale  The language locale such as en-US, pt-BR, zh, es, etc.
	 * @returns {RegExp}  A RegExp that matches when this format is recognized
	 */
	getRegExp(locale = defaultLocale) {
		if (this.template) {
			if (!this.regexByLocale[locale]) {
				this.regexByLocale[locale] = LocaleHelper.factory(locale).compile(
					this.template
				);
			}
			return this.regexByLocale[locale];
		}
		return this.matcher;
	}

	/**
	 * Run this format's RegExp against the given string
	 * @param {String} string  The date string
	 * @param {String} locale  The language locale such as en-US, pt-BR, zh, es, etc.
	 * @returns {Array|null}  Array of matches or null on non-match
	 */
	getMatches(string, locale = defaultLocale) {
		return string.match(this.getRegExp(locale));
	}

	/**
	 * Given matches against this RegExp, convert to object
	 * @param {String[]} matches  An array of matched parts
	 * @param {String} locale  The language locale such as en-US, pt-BR, zh, es, etc.
	 * @returns {Object}  Object which may contain year, month, day, hour, minute, second, millisecond, offset, invalid
	 */
	toDateTime(matches, locale = defaultLocale) {
		const locHelper = LocaleHelper.factory(locale);
		if (this.units) {
			return locHelper.getObject(this.units, matches);
		}
		const dt = this.handler(matches, locale);
		if (!dt || dt.invalid) {
			return dt;
		}
		return locHelper.castObject(dt);
	}

	/**
	 * Attempt to parse a string in this format
	 * @param {String} string  The date string
	 * @param {String} locale  The language locale such as en-US, pt-BR, zh, es, etc.
	 * @returns {Object|null}  Null if format can't handle this string, Object for result or error
	 */
	attempt(string, locale = defaultLocale) {
		string = String(string).trim();
		const matches = this.getMatches(string, locale);
		if (matches) {
			const dt = this.toDateTime(matches, locale);
			if (dt && !dt.invalid) {
				return dt;
			}
		}
		return null;
	}

	/**
	 * Return the current date (used to support unit testing)
	 * @returns {Date}
	 */
	now() {
		return new Date();
	}
}

module.exports = Format;


/***/ }),

/***/ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js":
/*!***********************************************************************!*\
  !*** ./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const baseLookups = __webpack_require__(/*! ../data/baseLookups.js */ "./node_modules/any-date-parser/src/data/baseLookups.js");
const { latn, other } = __webpack_require__(/*! ../data/templates.js */ "./node_modules/any-date-parser/src/data/templates.js");
const { buildDigits } = __webpack_require__(/*! ../data/numberingSystems.js */ "./node_modules/any-date-parser/src/data/numberingSystems.js");
const defaultLocale = __webpack_require__(/*! ../data/defaultLocale.js */ "./node_modules/any-date-parser/src/data/defaultLocale.js");
const units = __webpack_require__(/*! ../data/units.js */ "./node_modules/any-date-parser/src/data/units.js");

// keep track of singletons by locale name
const cache = {};

class LocaleHelper {
	/**
	 * Get a singleton instance with the given locale
	 * @param {String} locale such as en, en-US, es, fr-FR, etc.
	 * @returns {LocaleHelper}
	 */
	static factory(locale = defaultLocale) {
		if (!cache[locale.toLowerCase()]) {
			cache[locale.toLowerCase()] = new LocaleHelper(locale);
		}
		return cache[locale.toLowerCase()];
	}

	/**
	 * Create a new instance with the given locale
	 * @param {String} locale such as en, en-US, es, fr-FR, etc.
	 */
	constructor(locale = defaultLocale) {
		/**
		 * The locale string
		 * @type {String}
		 */
		this.locale = locale;
		/**
		 * Lookups for zone, year, meridiem, month, dayname, digit
		 * @type {Object} lookups
		 */
		this.lookups = { ...baseLookups };
		/**
		 * Template variables including MONTHNAME, MONTH, ZONE, etc.
		 * @type {Object} vars
		 */
		this.vars = { ...latn };
		const fmt = new Intl.NumberFormat(this.locale);
		/**
		 * The numbering system to use (latn=standard arabic digits)
		 * @type {String} numberingSystem
		 */
		this.numberingSystem = fmt.resolvedOptions().numberingSystem;
		this.build();
		// console.log({
		// 	numberingSystem: this.numberingSystem,
		// 	month: this.lookups.month,
		// 	dayname: this.lookups.dayname,
		// 	MONTHNAME: this.vars.MONTHNAME,
		// 	DAYNAME: this.vars.DAYNAME,
		// });
	}

	/**
	 * Cast a string to an integer, minding numbering system
	 * @param {String|Number} digitString  Such as "2020" or "二〇二〇"
	 * @returns {Number}
	 */
	toInt(digitString) {
		if (typeof digitString === 'number') {
			return digitString;
		}
		if (this.numberingSystem === 'latn') {
			return parseInt(digitString, 10);
		}
		let latn = '';
		for (let i = 0; i < digitString.length; i++) {
			latn += String(this.lookups.digit[digitString[i]]);
		}
		return parseInt(latn, 10);
	}

	/**
	 * Build lookups for digits, month names, day names, and meridiems based on the locale
	 */
	build() {
		if (this.numberingSystem !== 'latn') {
			this.buildNumbers();
		}
		if (!/^en/i.test(this.locale)) {
			this.buildMonthNames();
			this.buildDaynames();
			this.buildMeridiems();
		}
	}

	/**
	 * Build lookups for digits
	 */
	buildNumbers() {
		const nsName = this.numberingSystem;
		const { group, lookup } = buildDigits(nsName);
		this.lookups.digit = lookup;
		for (const name in other) {
			/* istanbul ignore next */
			if (!other.hasOwnProperty(name)) {
				continue;
			}
			this.vars[name] = other[name].replace(/\*/g, group);
		}
	}

	/**
	 * Build lookup for month names
	 */
	buildMonthNames() {
		const vars = {};
		const lookup = {};
		if (/^fi/i.test(this.locale)) {
			const months =
				'tammi|helmi|maalis|huhti|touko|kesä|heinä|elo|syys|loka|marras|joulu';
			months.split('|').forEach((month, idx) => {
				['', 'k', 'kuu', 'kuuta'].forEach((suffix, i) => {
					const maybePeriod = i < 2 ? '\\.?' : '';
					vars[month + suffix + maybePeriod] = true;
					lookup[month + suffix] = idx + 1;
				});
			});
		} else {
			const dates = [];
			const findMonth = item => item.type === 'month';
			for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
				dates.push(new Date(2017, monthIdx, 1));
			}
			const dateStyles = ['full', 'long', 'medium'];
			for (const dateStyle of dateStyles) {
				const format = Intl.DateTimeFormat(this.locale, { dateStyle });
				for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
					const parts = format.formatToParts(dates[monthIdx]);
					let text = parts.find(findMonth).value.toLowerCase();
					if (/^ko/i.test(this.locale)) {
						// Korean word for month is sometimes used
						text += '월';
					}
					if (dateStyle === 'medium') {
						// some languages (including arabic and chinese) don't have a 'medium' size
						if (/^ar|zh/i.test(this.locale)) {
							return;
						}
						text = text.replace(/\.$/, '');
						vars[`${text}\\.?`] = true;
					} else {
						vars[text] = true;
					}
					lookup[text] = monthIdx + 1;
				}
			}
			const format = Intl.DateTimeFormat(this.locale, { month: 'short' });
			for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
				const parts = format.formatToParts(dates[monthIdx]);
				let text = parts.find(findMonth).value.toLowerCase();
				text = text.replace(/\.$/, '');
				vars[`${text}\\.?`] = true;
				lookup[text] = monthIdx + 1;
			}
		}
		this.vars.MONTHNAME = Object.keys(vars).join('|');
		this.lookups.month = lookup;
	}

	/**
	 * Build lookup for day name
	 */
	buildDaynames() {
		const dates = [];
		const findDay = item => item.type === 'weekday';
		for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
			dates.push(new Date(2017, 0, dayIndex + 1));
		}
		const weekdays = ['long', 'short'];
		const list = [];
		const lookup = {};
		for (const weekday of weekdays) {
			const format = Intl.DateTimeFormat(this.locale, { weekday });
			for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
				const parts = format.formatToParts(dates[dayIndex]);
				let text = parts.find(findDay).value.toLowerCase();
				if (weekday === 'short') {
					text = text.replace(/\.$/, '');
					list.push(`${text}\\.?`);
				} else {
					list.push(text);
				}
				lookup[text] = dayIndex;
			}
		}
		this.vars.DAYNAME = list.join('|');
		this.lookups.dayname = lookup;
	}

	/**
	 * Build lookup for meridiems (e.g. AM/PM)
	 */
	buildMeridiems() {
		const dates = [new Date(2017, 0, 1), new Date(2017, 0, 1, 23, 0, 0)];
		const findDayPeriod = item => item.type === 'dayPeriod';
		const list = [];
		const lookup = {};
		const format = Intl.DateTimeFormat(this.locale, { timeStyle: 'long' });
		for (let i = 0; i < 2; i++) {
			const parts = format.formatToParts(dates[i]);
			const dayPeriod = parts.find(findDayPeriod);
			if (!dayPeriod) {
				// this locale does not use AM/PM
				return;
			}
			const text = dayPeriod.value.toLowerCase();
			list.push(text);
			lookup[text] = i * 12;
		}
		this.vars.MERIDIEM = list.join('|');
		this.lookups.meridiem = lookup;
	}

	/**
	 * Given a list of unit names and matches, build result object
	 * @param {Array} units  Unit names such as "year", "month" and "millisecond"
	 * @param {Array} matches  The values matched by a Format's RegExp
	 * @returns {Object}
	 */
	getObject(units, matches) {
		const object = {};
		units.forEach((unit, i) => {
			if (!unit) {
				return;
			}
			let match = matches[i + 1];
			match = match.toLowerCase();
			match = match.replace(/\.$/, '');
			if (unit === 'offset') {
				object.offset = this.offsetToMinutes(match);
			} else if (this.lookups[unit]) {
				object[unit] = this.lookups[unit][match] || this.toInt(match);
			} else {
				object[unit] = this.toInt(match);
			}
		});
		return object;
	}

	/**
	 * Take a response object and cast each unit to Number
	 * @param {Object} object  An object with one or more units
	 * @returns {Object}  An object with same units but Numeric
	 */
	castObject(object) {
		const casted = {};
		units.forEach(unit => {
			if (unit in object) {
				casted[unit] = this.toInt(object[unit]);
			}
		});
		if (typeof object.offset === 'string') {
			casted.offset = this.offsetToMinutes(object.offset);
		} else if (typeof object.offset === 'number') {
			casted.offset = object.offset;
		}
		return casted;
	}

	/**
	 * Convert an offset string to Numeric minutes (e.g. "-0500", "+5", "+03:30")
	 * @param {String} offsetString
	 * @returns {Number}
	 */
	offsetToMinutes(offsetString) {
		const captured = offsetString.match(/^([+-])(..?):?(..)?$/);
		if (captured) {
			const [, sign, hours, minutes] = captured;
			return (
				(sign === '-' ? -1 : 1) *
				(this.toInt(hours) * 60 + this.toInt(minutes || 0))
			);
		}
		return 0;
	}

	/**
	 * Compile template into a RegExp and return it
	 * @param {String} template  The template string
	 * @returns {RegExp}
	 */
	compile(template) {
		const regexString = template.replace(/_([A-Z0-9]+)_/g, ($0, $1) => {
			if (!this.vars[$1]) {
				throw new Error(`Template string contains invalid variable _${$1}_`);
			}
			return this.vars[$1];
		});
		return new RegExp(regexString, 'i');
	}
}

module.exports = LocaleHelper;


/***/ }),

/***/ "./node_modules/any-date-parser/src/Parser/Parser.js":
/*!***********************************************************!*\
  !*** ./node_modules/any-date-parser/src/Parser/Parser.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaultLocale = __webpack_require__(/*! ../data/defaultLocale.js */ "./node_modules/any-date-parser/src/data/defaultLocale.js");
const Format = __webpack_require__(/*! ../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js"); // required to generate index.d.ts
const fromString = __webpack_require__(/*! ../fromString/fromString.js */ "./node_modules/any-date-parser/src/fromString/fromString.js");
const fromAny = __webpack_require__(/*! ../fromAny/fromAny.js */ "./node_modules/any-date-parser/src/fromAny/fromAny.js");

class Parser {
	/**
	 * Initialize an object with an empty array of registered formats
	 */
	constructor() {
		this.formats = [];
	}

	/**
	 * Register a format object representing a parseable date format
	 * @param {Format} format  The Format to add
	 * @returns {Parser}
	 * @chainable
	 */
	addFormat(format) {
		this.formats.push(format);
		format.parser = this;
		return this;
	}

	/**
	 * Register multiple formats
	 * @param {Format[]} formats  The array of Formats to add
	 * @returns {Parser}
	 * @chainable
	 */
	addFormats(formats) {
		formats.forEach(format => this.addFormat(format));
		return this;
	}

	/**
	 * Unregister a format
	 * @param {Format} format  The Format to remove
	 * @returns {Boolean}  true if format was found and removed, false if it wasn't registered
	 */
	removeFormat(format) {
		const idx = this.formats.indexOf(format);
		if (idx > -1) {
			const old = this.formats[idx];
			this.formats.splice(idx, 1);
			old.parser = null;
			return true;
		}
		return false;
	}

	/**
	 * Attempt to parse a date string
	 * @param {String} date  A parseable date string
	 * @param {String} locale  The name of the locale
	 * @returns {Object}
	 */
	attempt(date, locale = defaultLocale) {
		for (const format of this.formats) {
			if (
				Array.isArray(format.locales) &&
				format.locales.length > 0 &&
				!format.locales.includes(new Intl.Locale(locale).baseName)
			) {
				// some formats only make sense for certain locales, e.g. month/day/year
				continue;
			}
			const dt = format.attempt(date, locale);
			if (dt) {
				return dt;
			}
		}
		// Uh Oh! We don't know that one
		let string = String(date).slice(0, 200);
		if (string === '') {
			string = 'empty string';
		}
		return { invalid: `Unable to parse ${string}` };
	}

	/**
	 * Export this parser as a single function that takes a string
	 * @param {String} locale  The default locale it should use
	 * @returns {Function}
	 */
	exportAsFunction(locale = defaultLocale) {
		return fromString(this, locale);
	}

	/**
	 * Export this parser as a single function that takes a string or Date
	 * @param {String} locale  The default locale it should use
	 * @returns {Function}
	 */
	exportAsFunctionAny(locale = defaultLocale) {
		return fromAny(fromString(this, locale));
	}
}

module.exports = Parser;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/baseLookups.js":
/*!**************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/baseLookups.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const twoDigitYears = __webpack_require__(/*! ./twoDigitYears.js */ "./node_modules/any-date-parser/src/data/twoDigitYears.js");
const timezoneNames = __webpack_require__(/*! ./timezoneNames.js */ "./node_modules/any-date-parser/src/data/timezoneNames.js");

const baseLookups = {
	zone: timezoneNames,
	year: twoDigitYears,
	meridiem: { am: 0, pm: 12, 'a.m.': 0, 'p.m.': 12 },
	month: {
		january: 1,
		jan: 1,
		february: 2,
		feb: 2,
		march: 3,
		mar: 3,
		april: 4,
		apr: 4,
		may: 5,
		june: 6,
		jun: 6,
		july: 7,
		jul: 7,
		august: 8,
		aug: 8,
		september: 9,
		sep: 9,
		october: 10,
		oct: 10,
		november: 11,
		nov: 11,
		december: 12,
		dec: 12,
	},
	dayname: {
		sunday: 0,
		sun: 0,
		monday: 1,
		mon: 1,
		tuesday: 2,
		tue: 2,
		wednesday: 3,
		wed: 3,
		thursday: 4,
		thu: 4,
		friday: 5,
		fri: 5,
		saturday: 6,
		sat: 6,
	},
	digit: {},
};

module.exports = baseLookups;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/defaultLocale.js":
/*!****************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/defaultLocale.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const normalizeLocale = __webpack_require__(/*! ./normalizeLocale.js */ "./node_modules/any-date-parser/src/data/normalizeLocale.js");

let defaultLocale;
/* istanbul ignore next */
if (typeof navigator !== 'undefined') {
	// browser: locale is on navigator object
	const nav = navigator;
	defaultLocale = Array.isArray(nav.languages)
		? nav.languages[0]
		: nav.language;
} else if (typeof process !== 'undefined') {
	// node: locale is an env var
	const env = process.env;
	defaultLocale = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}
/* istanbul ignore next */
if (!defaultLocale) {
	defaultLocale = 'en-US';
}

module.exports = normalizeLocale(defaultLocale);


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/normalizeLocale.js":
/*!******************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/normalizeLocale.js ***!
  \******************************************************************/
/***/ ((module) => {

/**
 * Given a locale string from an operating system or process env, normalize the name
 * @param {String} name  A name such as fr_FR, en-US, en-us.utf-8
 * @returns {String}
 * @see https://github.com/sindresorhus/os-locale/blob/main/index.js for similar code
 */
function normalizeLocale(name) {
	// some systems use underscores
	name = name.replace(/_/g, '-');
	// some systems append strings like .UTF-8
	name = name.replace(/[.:][\w-]*$/, '');
	try {
		return new Intl.Locale(name).baseName;
	} catch (e) {
		return 'en-US';
	}
}

module.exports = normalizeLocale;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/numberingSystems.js":
/*!*******************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/numberingSystems.js ***!
  \*******************************************************************/
/***/ ((module) => {

const startCodes = {
	arab: 1632,
	arabext: 1776,
	bali: 6992,
	beng: 2534,
	deva: 2406,
	fullwide: 65296,
	gujr: 2790,
	khmr: 6112,
	knda: 3302,
	laoo: 3792,
	limb: 6470,
	mlym: 3430,
	mong: 6160,
	mymr: 4160,
	orya: 2918,
	tamldec: 3046,
	telu: 3174,
	thai: 3664,
	tibt: 3872,
};

// full-width numbers, hanidec numbers, latin numbers (\d)
const chineseGroup = '[０１２３４５６７８９〇一二三四五六七八九\\d]';

const defaultLookup = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	'０': 0,
	'１': 1,
	'２': 2,
	'３': 3,
	'４': 4,
	'５': 5,
	'６': 6,
	'７': 7,
	'８': 8,
	'９': 9,
	〇: 0,
	一: 1,
	二: 2,
	三: 3,
	四: 4,
	五: 5,
	六: 6,
	七: 7,
	八: 8,
	九: 9,
};

const cache = {};

function buildDigits(nsName) {
	if (cache[nsName]) {
		return cache[nsName];
	}
	if (nsName === 'fullwide' || nsName === 'hanidec') {
		return { group: chineseGroup, lookup: { ...defaultLookup } };
	}
	const startCode = startCodes[nsName];
	/* istanbul ignore next */
	if (!startCode) {
		// unknown numbering system; treat like latn
		return { group: '\\d', lookup: { ...defaultLookup } };
	}
	const start = String.fromCharCode(startCode);
	const end = String.fromCharCode(startCode + 9);
	const lookup = {};
	for (let i = 0; i < 10; i++) {
		lookup[String.fromCharCode(startCode + i)] = i;
	}
	// console.log({ nsName, start, end, lookup });
	cache[nsName] = {
		group: `[${start}-${end}]`,
		lookup,
	};
	return cache[nsName];
}

module.exports = { chineseGroup, defaultLookup, startCodes, buildDigits };


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/templates.js":
/*!************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/templates.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const timezoneNames = __webpack_require__(/*! ./timezoneNames.js */ "./node_modules/any-date-parser/src/data/timezoneNames.js");

const latn = {
	MONTHNAME:
		'january|february|march|april|may|june|july|august|september|october|november|december|jan\\.?|feb\\.?|mar\\.?|apr\\.?|may\\.?|jun\\.?|jul\\.?|aug\\.?|sep\\.?|oct\\.?|nov\\.?|dec\\.?',
	DAYNAME:
		'sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun\\.?|mon\\.?|tue\\.?|wed\\.?|thu\\.?|fri\\.?|sat\\.?',
	ZONE: '\\(?(' + Object.keys(timezoneNames).join('|') + ')\\)?',
	MERIDIEM: '[ap]\\.?m?\\.?',
	ORDINAL: 'st|nd|rd|th|\\.',
	YEAR: '[1-9]\\d{3}|\\d{2}',
	MONTH: '1[0-2]|0?[1-9]',
	MONTH2: '1[0-2]|0[1-9]',
	DAY: '3[01]|[12]\\d|0?[1-9]',
	DAY2: '3[01]|[12]\\d|0[1-9]',
	OFFSET: '[+-][01]?\\d?\\:?(?:[0-5]\\d)?',
	H24: '[01]\\d|2[0-3]',
	H12: '0?[1-9]|1[012]',
	MIN: '[0-5]\\d',
	SEC: '[0-5]\\d|60',
	MS: '\\d{9}|\\d{6}|\\d{1,3}',
	SPACE: '[\\s,-]',
};

const other = {
	...latn,
	YEAR: '*{4}|*{2}',
	MONTH: '*{1,2}',
	MONTH2: '*{2}',
	DAY: '*{1,2}',
	DAY2: '*{2}',
	OFFSET: '[+-]*{1,2}\\:?*{0,2}',
	H24: '*{2}',
	H12: '*{1,2}',
	MIN: '*{2}',
	SEC: '*{2}',
	MS: '*{9}|*{6}|*{3}',
};

module.exports = { latn, other };


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/timezoneNames.js":
/*!****************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/timezoneNames.js ***!
  \****************************************************************/
/***/ ((module) => {

// some hand-picked common timezone names
const timezoneNames = {
	'Eastern Daylight Time': -240,
	'Eastern Standard Time': -300,
	'Central Daylight Time': -300,
	'Central Standard Time': -360,
	'Mountain Daylight Time': -360,
	'Mountain Standard Time': -420,
	'Pacific Daylight Time': -420,
	'Pacific Standard Time': -480,
	ACDT: 630, // Australian Central Daylight Savings Time
	ACST: 570, // Australian Central Standard Time
	ACT: 480, // ASEAN Common Time
	ADT: -180, // Atlantic Daylight Time
	AEDT: 660, // Australian Eastern Daylight Savings Time
	AEST: 600, // Australian Eastern Standard Time
	AFT: 270, // Afghanistan Time
	AKDT: -480, // Alaska Daylight Time
	AKST: -540, // Alaska Standard Time
	AMST: -180, // Amazon Summer Time (Brazil)
	AMT: -240, // Amazon Time (Brazil)
	ART: -180, // Argentina Time
	AST: 180, // Arabia Standard Time
	AWDT: 540, // Australian Western Daylight Time
	AWST: 480, // Australian Western Standard Time
	AZOST: -60, // Azores Standard Time
	AZT: 240, // Azerbaijan Time
	BDT: 360, // Bangladesh Daylight Time (Bangladesh Daylight saving time keeps UTC+06 offset)
	BIOT: 360, // British Indian Ocean Time
	BIT: -720, // Baker Island Time
	BOT: -240, // Bolivia Time
	BRST: -120, // Brasilia Summer Time
	BRT: -180, // Brasilia Time
	BTT: 360, // Bhutan Time
	CAT: 120, // Central Africa Time
	CCT: 390, // Cocos Islands Time
	CDT: -300, // Central Daylight Time (North America)
	CEDT: 120, // Central European Daylight Time
	CEST: 120, // Central European Summer Time (Cf. HAEC)
	CET: 60, // Central European Time
	CHADT: 825, // Chatham Daylight Time
	CHAST: 765, // Chatham Standard Time
	CHOT: 480, // Choibalsan
	ChST: 600, // Chamorro Standard Time
	CHUT: 600, // Chuuk Time
	CIST: -480, // Clipperton Island Standard Time
	CIT: 480, // Central Indonesia Time
	CKT: -600, // Cook Island Time
	CLST: -180, // Chile Summer Time
	CLT: -240, // Chile Standard Time
	COST: -240, // Colombia Summer Time
	COT: -300, // Colombia Time
	CST: -360, // Central Standard Time (North America)
	CT: 480, // China time
	CVT: -60, // Cape Verde Time
	CXT: 420, // Christmas Island Time
	DAVT: 420, // Davis Time
	DDUT: 600, // Dumont d'Urville Time
	DFT: 60, // AIX specific equivalent of Central European Time
	EASST: -300, // Easter Island Standard Summer Time
	EAST: -360, // Easter Island Standard Time
	EAT: 180, // East Africa Time
	ECT: -300, // Ecuador Time
	EDT: -240, // Eastern Daylight Time (North America)
	EEDT: 180, // Eastern European Daylight Time
	EEST: 180, // Eastern European Summer Time
	EET: 120, // Eastern European Time
	EGST: 0, // Eastern Greenland Summer Time
	EGT: -60, // Eastern Greenland Time
	EIT: 540, // Eastern Indonesian Time
	EST: -300, // Eastern Standard Time (North America)
	FET: 180, // Further-eastern European Time
	FJT: 720, // Fiji Time
	FKST: -180, // Falkland Islands Standard Time
	FKT: -240, // Falkland Islands Time
	FNT: -120, // Fernando de Noronha Time
	GALT: -360, // Galapagos Time
	GAMT: -540, // Gambier Islands
	GET: 240, // Georgia Standard Time
	GFT: -180, // French Guiana Time
	GILT: 720, // Gilbert Island Time
	GIT: -540, // Gambier Island Time
	GMT: 0, // Greenwich Mean Time
	GST: -120, // South Georgia and the South Sandwich Islands
	GYT: -240, // Guyana Time
	HADT: -540, // Hawaii-Aleutian Daylight Time
	HAEC: 120, // Heure Avancée d'Europe Centrale francised name for CEST
	HAST: -600, // Hawaii-Aleutian Standard Time
	HKT: 480, // Hong Kong Time
	HMT: 300, // Heard and McDonald Islands Time
	HOVT: 420, // Khovd Time
	HST: -600, // Hawaii Standard Time
	IBST: 0, // International Business Standard Time
	ICT: 420, // Indochina Time
	IDT: 180, // Israel Daylight Time
	IOT: 180, // Indian Ocean Time
	IRDT: 270, // Iran Daylight Time
	IRKT: 480, // Irkutsk Time
	IRST: 210, // Iran Standard Time
	IST: 120, // Israel Standard Time
	JST: 540, // Japan Standard Time
	KGT: 360, // Kyrgyzstan time
	KOST: 660, // Kosrae Time
	KRAT: 420, // Krasnoyarsk Time
	KST: 540, // Korea Standard Time
	LHST: 630, // Lord Howe Standard Time
	LINT: 840, // Line Islands Time
	MAGT: 720, // Magadan Time
	MART: -510, // Marquesas Islands Time
	MAWT: 300, // Mawson Station Time
	MDT: -360, // Mountain Daylight Time (North America)
	MET: 60, // Middle European Time Same zone as CET
	MEST: 120, // Middle European Summer Time Same zone as CEST
	MHT: 720, // Marshall Islands
	MIST: 660, // Macquarie Island Station Time
	MIT: -510, // Marquesas Islands Time
	MMT: 390, // Myanmar Time
	MSK: 180, // Moscow Time
	MST: -420, // Mountain Standard Time (North America)
	MUT: 240, // Mauritius Time
	MVT: 300, // Maldives Time
	MYT: 480, // Malaysia Time
	NCT: 660, // New Caledonia Time
	NDT: -90, // Newfoundland Daylight Time
	NFT: 660, // Norfolk Time
	NPT: 345, // Nepal Time
	NST: -150, // Newfoundland Standard Time
	NT: -150, // Newfoundland Time
	NUT: -660, // Niue Time
	NZDT: 780, // New Zealand Daylight Time
	NZST: 720, // New Zealand Standard Time
	OMST: 360, // Omsk Time
	ORAT: 300, // Oral Time
	PDT: -420, // Pacific Daylight Time (North America)
	PET: -300, // Peru Time
	PETT: 720, // Kamchatka Time
	PGT: 600, // Papua New Guinea Time
	PHOT: 780, // Phoenix Island Time
	PKT: 300, // Pakistan Standard Time
	PMDT: -120, // Saint Pierre and Miquelon Daylight time
	PMST: -180, // Saint Pierre and Miquelon Standard Time
	PONT: 660, // Pohnpei Standard Time
	PST: -480, // Pacific Standard Time (North America)
	PYST: -180, // Paraguay Summer Time (South America)
	PYT: -240, // Paraguay Time (South America)
	RET: 240, // Réunion Time
	ROTT: -180, // Rothera Research Station Time
	SAKT: 660, // Sakhalin Island time
	SAMT: 240, // Samara Time
	SAST: 120, // South African Standard Time
	SBT: 660, // Solomon Islands Time
	SCT: 240, // Seychelles Time
	SGT: 480, // Singapore Time
	SLST: 330, // Sri Lanka Standard Time
	SRET: 660, // Srednekolymsk Time
	SRT: -180, // Suriname Time
	SST: 480, // Singapore Standard Time
	SYOT: 180, // Showa Station Time
	TAHT: -600, // Tahiti Time
	THA: 420, // Thailand Standard Time
	TFT: 300, // Indian/Kerguelen
	TJT: 300, // Tajikistan Time
	TKT: 780, // Tokelau Time
	TLT: 540, // Timor Leste Time
	TMT: 300, // Turkmenistan Time
	TOT: 780, // Tonga Time
	TVT: 720, // Tuvalu Time
	UCT: 0, // Coordinated Universal Time
	ULAT: 480, // Ulaanbaatar Time
	USZ1: 120, // Kaliningrad Time
	UTC: 0, // Coordinated Universal Time
	UYST: -120, // Uruguay Summer Time
	UYT: -180, // Uruguay Standard Time
	UZT: 300, // Uzbekistan Time
	VET: -240, // Venezuelan Standard Time
	VLAT: 600, // Vladivostok Time
	VOLT: 240, // Volgograd Time
	VOST: 360, // Vostok Station Time
	VUT: 660, // Vanuatu Time
	WAKT: 720, // Wake Island Time
	WAST: 120, // West Africa Summer Time
	WAT: 60, // West Africa Time
	WEDT: 60, // Western European Daylight Time
	WEST: 60, // Western European Summer Time
	WET: 0, // Western European Time
	WIT: 420, // Western Indonesian Time
	WST: 480, // Western Standard Time
	YAKT: 540, // Yakutsk Time
	YEKT: 300, // Yekaterinburg Time
	Z: 0, // Zulu Time (Coordinated Universal Time)
};

module.exports = timezoneNames;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/twoDigitYears.js":
/*!****************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/twoDigitYears.js ***!
  \****************************************************************/
/***/ ((module) => {

// 2-digit years: 1951 through 2050
const twoDigitYears = {};
for (let i = 1; i < 100; i++) {
	const key = (i < 9 ? '0' : '') + i;
	twoDigitYears[key] = i + (i > 51 ? 1900 : 2000);
}

module.exports = twoDigitYears;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/unitShortcuts.js":
/*!****************************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/unitShortcuts.js ***!
  \****************************************************************/
/***/ ((module) => {

const unitShortcuts = {
	y: 'year',
	M: 'month',
	d: 'day',
	w: 'week',
	h: 'hour',
	m: 'minute',
	s: 'second',
	ms: 'millisecond',
};

module.exports = unitShortcuts;


/***/ }),

/***/ "./node_modules/any-date-parser/src/data/units.js":
/*!********************************************************!*\
  !*** ./node_modules/any-date-parser/src/data/units.js ***!
  \********************************************************/
/***/ ((module) => {

const units = [
	'year',
	'month',
	'day',
	'hour',
	'minute',
	'second',
	'millisecond',
];

module.exports = units;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/ago/ago.js":
/*!*************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/ago/ago.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");
const unitShortcuts = __webpack_require__(/*! ../../data/unitShortcuts.js */ "./node_modules/any-date-parser/src/data/unitShortcuts.js");

const ago = new Format({
	/* prettier-ignore */
	//          $1          $2        $3                                                                                   $4
	matcher: /^(\+|-|in|) ?([\d.]+) ?(years?|months?|weeks?|days?|hours?|minutes?|seconds?|milliseconds?|ms|s|m|h|w|d|M|y)( ago)?$/i,
	handler: function ([, sign, amount, unit, isAgo]) {
		amount = parseFloat(amount);
		if (unit.length <= 2) {
			unit = unitShortcuts[unit];
		} else {
			unit = unit.replace(/s$/, '');
			unit = unit.toLowerCase();
		}
		if (unit === 'week') {
			unit = 'day';
			amount *= 7;
		}
		if (sign === '-' || isAgo) {
			amount *= -1;
		}
		const now = this.now();
		if (unit === 'millisecond') {
			now.setUTCMilliseconds(now.getUTCMilliseconds() + amount);
		} else if (unit === 'second') {
			now.setUTCSeconds(now.getUTCSeconds() + amount);
		} else if (unit === 'minute') {
			now.setUTCMinutes(now.getUTCMinutes() + amount);
		} else if (unit === 'hour') {
			now.setUTCHours(now.getUTCHours() + amount);
		} else if (unit === 'day') {
			now.setUTCDate(now.getUTCDate() + amount);
		} else if (unit === 'month') {
			now.setUTCMonth(now.getUTCMonth() + amount);
		} else if (unit === 'year') {
			now.setUTCFullYear(now.getUTCFullYear() + amount);
		}
		return {
			year: now.getUTCFullYear(),
			month: now.getUTCMonth() + 1,
			day: now.getUTCDate(),
			hour: now.getUTCHours(),
			minute: now.getUTCMinutes(),
			second: now.getUTCSeconds(),
			millisecond: now.getUTCMilliseconds(),
		};
	},
});

module.exports = ago;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/atSeconds/atSeconds.js":
/*!*************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/atSeconds/atSeconds.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const atSeconds = new Format({
	template: '^@(\\d+)$',
	handler: function (matches) {
		const seconds = parseInt(matches[1], 10);
		const date = new Date(seconds * 1000);
		return {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth() + 1,
			day: date.getUTCDate(),
			hour: date.getUTCHours(),
			minute: date.getUTCMinutes(),
			second: date.getUTCSeconds(),
		};
	},
});

module.exports = atSeconds;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/chinese/chinese.js":
/*!*********************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/chinese/chinese.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");
const LocaleHelper = __webpack_require__(/*! ../../LocaleHelper/LocaleHelper.js */ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js");
const { chineseGroup: d } = __webpack_require__(/*! ../../data/numberingSystems.js */ "./node_modules/any-date-parser/src/data/numberingSystems.js");

let locHelper;

const chinese = new Format({
	/* prettier-ignore */
	//           $1                         $2                  $3
	template: `^(${d}{4}|${d}{2})\\s*年\\s*(${d}{1,2})\\s*月\\s*(${d}{1,2})\\s*日$`,
	handler: function ([, year, month, day]) {
		if (!locHelper) {
			// sometimes zh has numbering system "latn" instead of fullwide or hanidec
			locHelper = new LocaleHelper('zh');
			locHelper.numberingSystem = 'hanidec';
			locHelper.buildNumbers();
		}
		return locHelper.castObject({ year, month, day });
	},
});

module.exports = chinese;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/dayMonthYear/dayMonthYear.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/dayMonthYear/dayMonthYear.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const dayMonthYear = new Format({
	/* prettier-ignore */
	//           $1     $2        $3          $4
	template: "^(_DAY_)([\\/. -])(_MONTH_)\\2(_YEAR_)$",
	units: ['day', null, 'month', 'year'],
});

module.exports = dayMonthYear;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/dayMonth/dayMonth.js":
/*!***********************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/dayMonth/dayMonth.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const dayMonth = new Format({
	/* prettier-ignore */
	//           $1            $2
	template: "^(_DAY_)[\\/. ](_MONTH_)$",
	units: ['day', 'month'],
});

module.exports = dayMonth;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/dayMonthnameYear/dayMonthnameYear.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/dayMonthnameYear/dayMonthnameYear.js ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const dayMonthnameYear = new Format({
	/* prettier-ignore */
	//                                $1                   $2    $3              $4
	template: "^(?:(?:_DAYNAME_),? )?(_DAY_)(?:_ORDINAL_)?([ -])(_MONTHNAME_)\\2(_YEAR_)$",
	units: ['day', null, 'month', 'year'],
});

module.exports = dayMonthnameYear;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/dayMonthname/dayMonthname.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/dayMonthname/dayMonthname.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const dayMonthname = new Format({
	/* prettier-ignore */
	//           $1                       $2
	template: "^(_DAY_)(?:_ORDINAL_)?[ -](_MONTHNAME_)$",
	units: ['day', 'month'],
});

module.exports = dayMonthname;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/microsoftJson/microsoftJson.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/microsoftJson/microsoftJson.js ***!
  \*********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const microsoftJson = new Format({
	matcher: /^\/Date\((\d+)([+-]\d{4})?\)\/$/,
	handler: function (matches) {
		const milliseconds = parseInt(matches[1], 10);
		const date = new Date(milliseconds);
		return {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth() + 1,
			day: date.getUTCDate(),
			hour: date.getUTCHours(),
			minute: date.getUTCMinutes(),
			second: date.getUTCSeconds(),
			millisecond: date.getUTCMilliseconds(),
			offset: matches[2] || 0,
		};
	},
});

module.exports = microsoftJson;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/monthDayYear/monthDayYear.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/monthDayYear/monthDayYear.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const monthDayYear = new Format({
	/* prettier-ignore */
	//           $1       $2      $3        $4
	template: "^(_MONTH_)([\\/-])(_DAY_)\\2(_YEAR_)$",
	units: ['month', null, 'day', 'year'],
	// only certain locales use this date
	// see https://en.wikipedia.org/wiki/Date_format_by_country
	// see https://www.localeplanet.com/icu/
	locales: [
		'ee-TG', // Togo (Ewe)
		'en-AS', // American Samoa
		'en-CA', // Canada
		'en-FM', // Federated States of Micronesia
		'en-GH', // Ghana
		'en-GU', // Guam
		'en-KE', // Kenya
		'en-KY', // Cayman Islands
		'en-MH', // Marshall Islands
		'en-MP', // Northern Mariana Islands
		'en-US', // United States
		'en-VI', // US Virgin Islands
		'en-WS', // Western Samoa
		'sm-AS', // American Samoa (Samoan)
		'sm-SM', // Samoa
	],
});

module.exports = monthDayYear;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/monthDay/monthDay.js":
/*!***********************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/monthDay/monthDay.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const monthDay = new Format({
	/* prettier-ignore */
	//           $1                 $2
	template: "^(_MONTH_)(?:[\\/-])(_DAY_)$",
	units: ['month', 'day'],
});

module.exports = monthDay;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/monthnameDayYear/monthnameDayYear.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/monthnameDayYear/monthnameDayYear.js ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const monthnameDayYear = new Format({
	/* prettier-ignore */
	//                                $1             $2                      $3
	template: '^(?:(?:_DAYNAME_),? )?(_MONTHNAME_)? (_DAY_)(?:_ORDINAL_)?,? (_YEAR_)$',
	units: ['month', 'day', 'year'],
});

module.exports = monthnameDayYear;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/monthnameDay/monthnameDay.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/monthnameDay/monthnameDay.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const monthnameDay = new Format({
	/* prettier-ignore */
	//                                $1             $2
	template: '^(?:(?:_DAYNAME_),? )?(_MONTHNAME_)? (_DAY_)(?:_ORDINAL_)?$',
	units: ['month', 'day'],
});

module.exports = monthnameDay;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/time12Hours/time12Hours.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/time12Hours/time12Hours.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const LocaleHelper = __webpack_require__(/*! ../../LocaleHelper/LocaleHelper.js */ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js");
const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

// lots of 12h time such as "11:59", "11:59pm", "11:59:33 pm", "11:59:33 p.m."
const time12Hours = new Format({
	/* prettier-ignore */
	//           $1                               $2                 $3           $4                 $5
	template: '^(.*?)_SPACE_*(?:at|on|T|)_SPACE_*(_H12_|_H24_)(?:\\:(_MIN_)(?:\\:(_SEC_))?)?_SPACE_*(_MERIDIEM_)$',
	handler: function (matches, locale) {
		let [, dateExpr, hour, minute, second, ampm] = matches;
		let result = {};
		if (dateExpr) {
			result = this.parser.attempt(dateExpr, locale);
			if (result.invalid) {
				// let other matchers have a chance
				return null;
			}
		}
		const tpl = LocaleHelper.factory(locale);
		if (ampm) {
			const offset = tpl.lookups.meridiem[ampm.toLowerCase()] || 0;
			hour = parseFloat(hour);
			if (hour === 12) {
				hour = offset;
			} else if (hour > 12 && offset === 12) {
				hour += 0;
			} else {
				hour += offset;
			}
		}
		result.hour = hour;
		if (minute) {
			result.minute = minute;
		}
		if (second) {
			result.second = second;
		}
		return result;
	},
});

module.exports = time12Hours;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/time24Hours/time24Hours.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/time24Hours/time24Hours.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const LocaleHelper = __webpack_require__(/*! ../../LocaleHelper/LocaleHelper.js */ "./node_modules/any-date-parser/src/LocaleHelper/LocaleHelper.js");
const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");
const timezoneNames = __webpack_require__(/*! ../../data/timezoneNames.js */ "./node_modules/any-date-parser/src/data/timezoneNames.js");

// lots of 24h time such as "23:59", "T23:59:59+0700", "23:59:59 GMT-05:00", "23:59:59 CST", "T23:59:59Z"
const time24Hours = new Format({
	/* prettier-ignore */
	//           $1                               $2        $3           $4              $5                                $6                 $7
	template: '^(.*?)_SPACE_*(?:at|on|T|)_SPACE_*(_H24_)\\:(_MIN_)(?:\\:(_SEC_)(?:[\\.,](_MS_))?)?_SPACE_*(?:GMT)?_SPACE_*(_OFFSET_)?_SPACE_*(_ZONE_)?$',
	handler: function (matches, locale) {
		let [, dateExpr, hour, minute, second, millisecond, offset, zone] = matches;
		let result = {};
		if (dateExpr) {
			result = this.parser.attempt(dateExpr, locale);
			if (result.invalid) {
				return result;
			}
		}
		result.hour = hour;
		result.minute = minute;
		if (second) {
			result.second = second;
		}
		if (millisecond && millisecond.length > 3) {
			result.millisecond = millisecond.slice(0, 3);
		} else if (millisecond) {
			result.millisecond = millisecond;
		}
		if (zone && !offset && zone in timezoneNames) {
			result.offset = timezoneNames[zone];
		} else if (offset) {
			const locHelper = LocaleHelper.factory(locale);
			result.offset = locHelper.offsetToMinutes(offset);
		}
		return result;
	},
});

module.exports = time24Hours;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/today/today.js":
/*!*****************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/today/today.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const today = new Format({
	matcher: /^(now|today|tomorrow|yesterday)/i,
	handler: function (match) {
		const now = this.now();
		const keyword = match[1].toLowerCase();
		switch (keyword) {
			case 'tomorrow':
				// JavaScript automatically handles flowing from one day to the next
				// For example, 31 jan 2020 will auto convert to 1 feb 2020
				now.setUTCDate(now.getUTCDate() + 1);
				break;
			case 'yesterday':
				now.setUTCDate(now.getUTCDate() - 1);
				break;
		}
		const result = {
			year: now.getUTCFullYear(),
			month: now.getUTCMonth() + 1,
			day: now.getUTCDate(),
		};
		if (keyword === 'now') {
			result.hour = now.getUTCHours();
			result.minute = now.getUTCMinutes();
			result.second = now.getUTCSeconds();
			result.millisecond = now.getUTCMilliseconds();
		}
		return result;
	},
});

module.exports = today;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/twitter/twitter.js":
/*!*********************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/twitter/twitter.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

// example: "Fri Apr 09 12:53:54 +0000 2010"
const twitter = new Format({
	/* prettier-ignore */
	//                         $1            $2      $3      $4      $5      $6         $7
	template: '^(?:_DAYNAME_) (_MONTHNAME_) (_DAY_) (_H24_):(_MIN_):(_SEC_) (_OFFSET_) (_YEAR_)$',
	units: ['month', 'day', 'hour', 'minute', 'second', 'offset', 'year'],
});

module.exports = twitter;


/***/ }),

/***/ "./node_modules/any-date-parser/src/formats/yearMonthDay/yearMonthDay.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/any-date-parser/src/formats/yearMonthDay/yearMonthDay.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Format = __webpack_require__(/*! ../../Format/Format.js */ "./node_modules/any-date-parser/src/Format/Format.js");

const yearMonthDay = new Format({
	/* prettier-ignore */
	//           $1      $2  $3          $4
	template: "^(_YEAR_)(-?)(_MONTH_)\\2(_DAY_)$",
	units: ['year', null, 'month', 'day'],
});

module.exports = yearMonthDay;


/***/ }),

/***/ "./node_modules/any-date-parser/src/fromAny/fromAny.js":
/*!*************************************************************!*\
  !*** ./node_modules/any-date-parser/src/fromAny/fromAny.js ***!
  \*************************************************************/
/***/ ((module) => {

function fromAny(fromString) {
	return function fromAny(any, locale) {
		if (any instanceof Date) {
			return any;
		}
		if (typeof any === 'number') {
			return new Date(any);
		}
		return fromString(any, locale);
	};
}

module.exports = fromAny;


/***/ }),

/***/ "./node_modules/any-date-parser/src/fromString/fromString.js":
/*!*******************************************************************!*\
  !*** ./node_modules/any-date-parser/src/fromString/fromString.js ***!
  \*******************************************************************/
/***/ ((module) => {

function fromString(parser, defaultLocale) {
	return function fromStringFunction(string, locale = defaultLocale) {
		const parsed = parser.attempt(string, locale);
		if (parsed.invalid) {
			return parsed;
		}
		// set to Jan 1 to prevent setting non-existent days
		const date = new Date(2000, 0, 1);
		// first setting day, then year, then month
		// to handle months with fewer days and years without Feb 29
		if (typeof parsed.day === 'number') {
			date.setUTCDate(parsed.day);
		}
		if (typeof parsed.year === 'number') {
			date.setUTCFullYear(parsed.year);
		}
		if (typeof parsed.month === 'number') {
			date.setUTCMonth(parsed.month - 1);
		}
		// default to first unit for time components
		date.setUTCHours(parsed.hour || 0);
		date.setUTCMinutes(parsed.minute || 0);
		date.setUTCSeconds(parsed.second || 0);
		date.setUTCMilliseconds(parsed.millisecond || 0);
		if (typeof parsed.offset === 'number') {
			return new Date(date - parsed.offset * 60 * 1000);
		}
		return date;
	};
}

module.exports = fromString;


/***/ }),

/***/ "./node_modules/ics/dist/defaults.js":
/*!*******************************************!*\
  !*** ./node_modules/ics/dist/defaults.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _nanoid = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");

var _utils = __webpack_require__(/*! ./utils */ "./node_modules/ics/dist/utils/index.js");

var defaults = {
  title: 'Untitled event',
  productId: 'adamgibbons/ics',
  method: 'PUBLISH',
  uid: (0, _nanoid.nanoid)(),
  timestamp: (0, _utils.formatDate)(null, 'utc'),
  start: (0, _utils.formatDate)(null, 'utc')
};
var _default = defaults;
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/ics/dist/index.js":
/*!****************************************!*\
  !*** ./node_modules/ics/dist/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertTimestampToArray = convertTimestampToArray;
exports.createEvent = createEvent;
exports.createEvents = createEvents;

var _nanoid = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");

var _pipeline = __webpack_require__(/*! ./pipeline */ "./node_modules/ics/dist/pipeline/index.js");

function assignUniqueId(event) {
  event.uid = event.uid || (0, _nanoid.nanoid)();
  return event;
}

function validateAndBuildEvent(event) {
  return (0, _pipeline.validateEvent)((0, _pipeline.buildEvent)(event));
}

function applyInitialFormatting(_ref) {
  var error = _ref.error,
      value = _ref.value;

  if (error) {
    return {
      error: error,
      value: null
    };
  }

  return {
    error: null,
    value: (0, _pipeline.formatEvent)(value)
  };
}

function reformatEventsByPosition(_ref2, idx, list) {
  var error = _ref2.error,
      value = _ref2.value;
  if (error) return {
    error: error,
    value: value
  };

  if (idx === 0) {
    // beginning of list
    return {
      value: value.slice(0, value.indexOf('END:VCALENDAR')),
      error: null
    };
  }

  if (idx === list.length - 1) {
    // end of list
    return {
      value: value.slice(value.indexOf('BEGIN:VEVENT')),
      error: null
    };
  }

  return {
    error: null,
    value: value.slice(value.indexOf('BEGIN:VEVENT'), value.indexOf('END:VEVENT') + 12)
  };
}

function catenateEvents(accumulator, _ref3, idx) {
  var error = _ref3.error,
      value = _ref3.value;

  if (error) {
    accumulator.error = error;
    accumulator.value = null;
    return accumulator;
  }

  if (accumulator.value) {
    accumulator.value = accumulator.value.concat(value);
    return accumulator;
  }

  accumulator.value = value;
  return accumulator;
}

function convertTimestampToArray(timestamp) {
  var inputType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'local';
  var dateArray = [];
  var d = new Date(timestamp);
  dateArray.push(inputType === 'local' ? d.getFullYear() : d.getUTCFullYear());
  dateArray.push((inputType === 'local' ? d.getMonth() : d.getUTCMonth()) + 1);
  dateArray.push(inputType === 'local' ? d.getDate() : d.getUTCDate());
  dateArray.push(inputType === 'local' ? d.getHours() : d.getUTCHours());
  dateArray.push(inputType === 'local' ? d.getMinutes() : d.getUTCMinutes());
  return dateArray;
}

function createEvent(attributes, cb) {
  if (!attributes) {
    Error('Attributes argument is required');
  }

  assignUniqueId(attributes);

  if (!cb) {
    // No callback, so return error or value in an object
    var _validateAndBuildEven = validateAndBuildEvent(attributes),
        _error = _validateAndBuildEven.error,
        _value = _validateAndBuildEven.value;

    if (_error) return {
      error: _error,
      value: _value
    };
    var event = '';

    try {
      event = (0, _pipeline.formatEvent)(_value);
    } catch (error) {
      return {
        error: error,
        value: null
      };
    }

    return {
      error: null,
      value: event
    };
  } // Return a node-style callback


  var _validateAndBuildEven2 = validateAndBuildEvent(attributes),
      error = _validateAndBuildEven2.error,
      value = _validateAndBuildEven2.value;

  if (error) return cb(error);
  return cb(null, (0, _pipeline.formatEvent)(value));
}

function createEvents(events, cb) {
  if (!events) {
    return {
      error: Error('one argument is required'),
      value: null
    };
  }

  if (events.length === 1) {
    return createEvent(events[0], cb);
  }

  var _events$map$map$map$m = events.map(assignUniqueId).map(validateAndBuildEvent).map(applyInitialFormatting).map(reformatEventsByPosition).reduce(catenateEvents, {
    error: null,
    value: null
  }),
      error = _events$map$map$map$m.error,
      value = _events$map$map$map$m.value;

  if (!cb) {
    return {
      error: error,
      value: value
    };
  }

  return cb(error, value);
}

/***/ }),

/***/ "./node_modules/ics/dist/pipeline/build.js":
/*!*************************************************!*\
  !*** ./node_modules/ics/dist/pipeline/build.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = buildEvent;

var _defaults = _interopRequireDefault(__webpack_require__(/*! ../defaults */ "./node_modules/ics/dist/defaults.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function buildEvent() {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = attributes.title,
      productId = attributes.productId,
      method = attributes.method,
      uid = attributes.uid,
      sequence = attributes.sequence,
      start = attributes.start,
      startType = attributes.startType,
      duration = attributes.duration,
      end = attributes.end,
      description = attributes.description,
      url = attributes.url,
      geo = attributes.geo,
      location = attributes.location,
      status = attributes.status,
      categories = attributes.categories,
      organizer = attributes.organizer,
      attendees = attributes.attendees,
      alarms = attributes.alarms,
      recurrenceRule = attributes.recurrenceRule,
      created = attributes.created,
      lastModified = attributes.lastModified,
      calName = attributes.calName,
      htmlContent = attributes.htmlContent; // fill in default values where necessary

  var output = Object.assign({}, _defaults["default"], attributes); // remove falsey values

  return Object.entries(output).reduce(function (clean, entry) {
    return entry[1] ? Object.assign(clean, _defineProperty({}, entry[0], entry[1])) : clean;
  }, {});
}

/***/ }),

/***/ "./node_modules/ics/dist/pipeline/format.js":
/*!**************************************************!*\
  !*** ./node_modules/ics/dist/pipeline/format.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = formatEvent;

var _utils = __webpack_require__(/*! ../utils */ "./node_modules/ics/dist/utils/index.js");

function formatEvent() {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var title = attributes.title,
      productId = attributes.productId,
      method = attributes.method,
      uid = attributes.uid,
      sequence = attributes.sequence,
      timestamp = attributes.timestamp,
      start = attributes.start,
      startType = attributes.startType,
      startInputType = attributes.startInputType,
      startOutputType = attributes.startOutputType,
      duration = attributes.duration,
      end = attributes.end,
      endInputType = attributes.endInputType,
      endOutputType = attributes.endOutputType,
      description = attributes.description,
      url = attributes.url,
      geo = attributes.geo,
      location = attributes.location,
      status = attributes.status,
      categories = attributes.categories,
      organizer = attributes.organizer,
      attendees = attributes.attendees,
      alarms = attributes.alarms,
      recurrenceRule = attributes.recurrenceRule,
      busyStatus = attributes.busyStatus,
      classification = attributes.classification,
      created = attributes.created,
      lastModified = attributes.lastModified,
      calName = attributes.calName,
      htmlContent = attributes.htmlContent;
  var icsFormat = '';
  icsFormat += 'BEGIN:VCALENDAR\r\n';
  icsFormat += 'VERSION:2.0\r\n';
  icsFormat += 'CALSCALE:GREGORIAN\r\n';
  icsFormat += (0, _utils.foldLine)("PRODID:".concat(productId)) + '\r\n';
  icsFormat += (0, _utils.foldLine)("METHOD:".concat(method)) + '\r\n';
  icsFormat += calName ? (0, _utils.foldLine)("X-WR-CALNAME:".concat(calName)) + '\r\n' : '';
  icsFormat += "X-PUBLISHED-TTL:PT1H\r\n";
  icsFormat += 'BEGIN:VEVENT\r\n';
  icsFormat += "UID:".concat(uid, "\r\n");
  icsFormat += (0, _utils.foldLine)("SUMMARY:".concat(title ? (0, _utils.setSummary)(title) : title)) + '\r\n';
  icsFormat += "DTSTAMP:".concat(timestamp, "\r\n"); // All day events like anniversaries must be specified as VALUE type DATE

  icsFormat += "DTSTART".concat(start && start.length == 3 ? ";VALUE=DATE" : "", ":").concat((0, _utils.formatDate)(start, startOutputType || startType, startInputType), "\r\n"); // End is not required for all day events on single days (like anniversaries)

  if (!end || end.length !== 3 || start.length !== end.length || start.some(function (val, i) {
    return val !== end[i];
  })) {
    if (end) {
      icsFormat += "DTEND".concat(end.length === 3 ? ";VALUE=DATE" : "", ":").concat((0, _utils.formatDate)(end, endOutputType || startOutputType || startType, endInputType || startInputType), "\r\n");
    }
  }

  icsFormat += sequence ? "SEQUENCE:".concat(sequence, "\r\n") : '';
  icsFormat += description ? (0, _utils.foldLine)("DESCRIPTION:".concat((0, _utils.setDescription)(description))) + '\r\n' : '';
  icsFormat += url ? (0, _utils.foldLine)("URL:".concat(url)) + '\r\n' : '';
  icsFormat += geo ? (0, _utils.foldLine)("GEO:".concat((0, _utils.setGeolocation)(geo))) + '\r\n' : '';
  icsFormat += location ? (0, _utils.foldLine)("LOCATION:".concat((0, _utils.setLocation)(location))) + '\r\n' : '';
  icsFormat += status ? (0, _utils.foldLine)("STATUS:".concat(status)) + '\r\n' : '';
  icsFormat += categories ? (0, _utils.foldLine)("CATEGORIES:".concat(categories)) + '\r\n' : '';
  icsFormat += organizer ? (0, _utils.foldLine)("ORGANIZER;".concat((0, _utils.setOrganizer)(organizer))) + '\r\n' : '';
  icsFormat += busyStatus ? (0, _utils.foldLine)("X-MICROSOFT-CDO-BUSYSTATUS:".concat(busyStatus)) + '\r\n' : '';
  icsFormat += classification ? (0, _utils.foldLine)("CLASS:".concat(classification)) + '\r\n' : '';
  icsFormat += created ? 'CREATED:' + (0, _utils.formatDate)(created) + '\r\n' : '';
  icsFormat += lastModified ? 'LAST-MODIFIED:' + (0, _utils.formatDate)(lastModified) + '\r\n' : '';
  icsFormat += htmlContent ? (0, _utils.foldLine)("X-ALT-DESC;FMTTYPE=text/html:".concat(htmlContent)) + '\r\n' : '';

  if (attendees) {
    attendees.map(function (attendee) {
      icsFormat += (0, _utils.foldLine)("ATTENDEE;".concat((0, _utils.setContact)(attendee))) + '\r\n';
    });
  }

  icsFormat += recurrenceRule ? "RRULE:".concat(recurrenceRule, "\r\n") : '';
  icsFormat += duration ? "DURATION:".concat((0, _utils.formatDuration)(duration), "\r\n") : '';

  if (alarms) {
    alarms.map(function (alarm) {
      icsFormat += (0, _utils.setAlarm)(alarm);
    });
  }

  icsFormat += "END:VEVENT\r\n";
  icsFormat += "END:VCALENDAR\r\n";
  return icsFormat;
}

/***/ }),

/***/ "./node_modules/ics/dist/pipeline/index.js":
/*!*************************************************!*\
  !*** ./node_modules/ics/dist/pipeline/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "buildEvent", ({
  enumerable: true,
  get: function get() {
    return _build["default"];
  }
}));
Object.defineProperty(exports, "formatEvent", ({
  enumerable: true,
  get: function get() {
    return _format["default"];
  }
}));
Object.defineProperty(exports, "validateEvent", ({
  enumerable: true,
  get: function get() {
    return _validate["default"];
  }
}));

var _build = _interopRequireDefault(__webpack_require__(/*! ./build */ "./node_modules/ics/dist/pipeline/build.js"));

var _format = _interopRequireDefault(__webpack_require__(/*! ./format */ "./node_modules/ics/dist/pipeline/format.js"));

var _validate = _interopRequireDefault(__webpack_require__(/*! ./validate */ "./node_modules/ics/dist/pipeline/validate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/***/ }),

/***/ "./node_modules/ics/dist/pipeline/validate.js":
/*!****************************************************!*\
  !*** ./node_modules/ics/dist/pipeline/validate.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _schema = _interopRequireDefault(__webpack_require__(/*! ../schema */ "./node_modules/ics/dist/schema/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _schema["default"];
exports["default"] = _default;

/***/ }),

/***/ "./node_modules/ics/dist/schema/index.js":
/*!***********************************************!*\
  !*** ./node_modules/ics/dist/schema/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = validateEvent;

var yup = _interopRequireWildcard(__webpack_require__(/*! yup */ "./node_modules/yup/es/index.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// yup url validation blocks localhost, so use a more flexible regex instead
// taken from https://github.com/jquense/yup/issues/224#issuecomment-417172609
// This does mean that the url validation error is
// "url must match the following: ...." as opposed to "url must be a valid URL"
var urlRegex = /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
var dateTimeSchema = yup.array().min(3).max(7).of(yup.lazy(function (item, options) {
  var itemIndex = parseInt(options.path.match(/.*\[(\d+)]/)[1]);
  return [yup.number().integer(), yup.number().integer().min(1).max(12), yup.number().integer().min(1).max(31), yup.number().integer().min(0).max(23), yup.number().integer().min(0).max(60), yup.number().integer().min(0).max(60)][itemIndex];
}));
var durationSchema = yup.object().shape({
  before: yup["boolean"](),
  //option to set before alaram
  weeks: yup.number(),
  days: yup.number(),
  hours: yup.number(),
  minutes: yup.number(),
  seconds: yup.number()
}).noUnknown();
var contactSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  rsvp: yup["boolean"](),
  dir: yup.string().matches(urlRegex),
  partstat: yup.string(),
  role: yup.string()
}).noUnknown();
var organizerSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  dir: yup.string()
}).noUnknown();
var alarmSchema = yup.object().shape({
  action: yup.string().matches(/audio|display|email/).required(),
  trigger: yup.mixed().required(),
  description: yup.string(),
  duration: durationSchema,
  repeat: yup.number(),
  attach: yup.string(),
  attachType: yup.string(),
  summary: yup.string(),
  attendee: contactSchema,
  'x-prop': yup.mixed(),
  'iana-prop': yup.mixed()
}).noUnknown();
var schema = yup.object().shape({
  summary: yup.string(),
  timestamp: yup.mixed(),
  title: yup.string(),
  productId: yup.string(),
  method: yup.string(),
  uid: yup.string().required(),
  sequence: yup.number(),
  start: dateTimeSchema.required(),
  duration: durationSchema,
  startType: yup.string().matches(/utc|local/),
  startInputType: yup.string().matches(/utc|local/),
  startOutputType: yup.string().matches(/utc|local/),
  end: dateTimeSchema,
  endInputType: yup.string().matches(/utc|local/),
  endOutputType: yup.string().matches(/utc|local/),
  description: yup.string(),
  url: yup.string().matches(urlRegex),
  geo: yup.object().shape({
    lat: yup.number(),
    lon: yup.number()
  }),
  location: yup.string(),
  status: yup.string().matches(/TENTATIVE|CANCELLED|CONFIRMED/i),
  categories: yup.array().of(yup.string()),
  organizer: organizerSchema,
  attendees: yup.array().of(contactSchema),
  alarms: yup.array().of(alarmSchema),
  recurrenceRule: yup.string(),
  busyStatus: yup.string().matches(/TENTATIVE|FREE|BUSY|OOF/i),
  classification: yup.string(),
  created: dateTimeSchema,
  lastModified: dateTimeSchema,
  calName: yup.string(),
  htmlContent: yup.string()
}).test('xor', "object should have end or duration", function (val) {
  var hasEnd = !!val.end;
  var hasDuration = !!val.duration;
  return hasEnd && !hasDuration || !hasEnd && hasDuration || !hasEnd && !hasDuration;
}).noUnknown();

function validateEvent(candidate) {
  try {
    var value = schema.validateSync(candidate, {
      abortEarly: false,
      strict: true
    });
    return {
      error: null,
      value: value
    };
  } catch (error) {
    return {
      error: Object.assign({}, error),
      value: undefined
    };
  }
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/fold-line.js":
/*!**************************************************!*\
  !*** ./node_modules/ics/dist/utils/fold-line.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = foldLine;

function foldLine(line) {
  var parts = [];
  var length = 75;

  while (line.length > length) {
    parts.push(line.slice(0, length));
    line = line.slice(length);
    length = 74;
  }

  parts.push(line);
  return parts.join('\r\n\t');
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/format-date.js":
/*!****************************************************!*\
  !*** ./node_modules/ics/dist/utils/format-date.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = formatDate;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pad = function pad(n) {
  return n < 10 ? "0".concat(n) : "".concat(n);
};

function formatDate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var outputType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utc';
  var inputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'local';

  if (Array.isArray(args) && args.length === 3) {
    var _args = _slicedToArray(args, 3),
        year = _args[0],
        month = _args[1],
        date = _args[2];

    return "".concat(year).concat(pad(month)).concat(pad(date));
  }

  var outDate = new Date(new Date().setUTCSeconds(0, 0));

  if (Array.isArray(args) && args.length > 0 && args[0]) {
    var _args2 = _slicedToArray(args, 6),
        _year = _args2[0],
        _month = _args2[1],
        _date = _args2[2],
        _args2$ = _args2[3],
        hours = _args2$ === void 0 ? 0 : _args2$,
        _args2$2 = _args2[4],
        minutes = _args2$2 === void 0 ? 0 : _args2$2,
        _args2$3 = _args2[5],
        seconds = _args2$3 === void 0 ? 0 : _args2$3;

    if (inputType === 'local') {
      outDate = new Date(_year, _month - 1, _date, hours, minutes, seconds);
    } else {
      outDate = new Date(Date.UTC(_year, _month - 1, _date, hours, minutes, seconds));
    }
  }

  if (outputType === 'local') {
    return [outDate.getFullYear(), pad(outDate.getMonth() + 1), pad(outDate.getDate()), 'T', pad(outDate.getHours()), pad(outDate.getMinutes()), pad(outDate.getSeconds())].join('');
  }

  return [outDate.getUTCFullYear(), pad(outDate.getUTCMonth() + 1), pad(outDate.getUTCDate()), 'T', pad(outDate.getUTCHours()), pad(outDate.getUTCMinutes()), pad(outDate.getUTCSeconds()), 'Z'].join('');
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/format-duration.js":
/*!********************************************************!*\
  !*** ./node_modules/ics/dist/utils/format-duration.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = formatDuration;

function formatDuration() {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var weeks = attributes.weeks,
      days = attributes.days,
      hours = attributes.hours,
      minutes = attributes.minutes,
      seconds = attributes.seconds;
  var formattedDuration = 'P';
  formattedDuration += weeks ? "".concat(weeks, "W") : '';
  formattedDuration += days ? "".concat(days, "D") : '';
  formattedDuration += 'T';
  formattedDuration += hours ? "".concat(hours, "H") : '';
  formattedDuration += minutes ? "".concat(minutes, "M") : '';
  formattedDuration += seconds ? "".concat(seconds, "S") : '';
  return formattedDuration;
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/format-text.js":
/*!****************************************************!*\
  !*** ./node_modules/ics/dist/utils/format-text.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = formatText;

function formatText(text) {
  return text.replace(/\\/gm, "\\\\").replace(/\r?\n/gm, "\\n").replace(/;/gm, "\\;").replace(/,/gm, "\\,");
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/index.js":
/*!**********************************************!*\
  !*** ./node_modules/ics/dist/utils/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "formatDate", ({
  enumerable: true,
  get: function get() {
    return _formatDate["default"];
  }
}));
Object.defineProperty(exports, "setGeolocation", ({
  enumerable: true,
  get: function get() {
    return _setGeolocation["default"];
  }
}));
Object.defineProperty(exports, "setContact", ({
  enumerable: true,
  get: function get() {
    return _setContact["default"];
  }
}));
Object.defineProperty(exports, "setOrganizer", ({
  enumerable: true,
  get: function get() {
    return _setOrganizer["default"];
  }
}));
Object.defineProperty(exports, "setAlarm", ({
  enumerable: true,
  get: function get() {
    return _setAlarm["default"];
  }
}));
Object.defineProperty(exports, "setDescription", ({
  enumerable: true,
  get: function get() {
    return _setDescription["default"];
  }
}));
Object.defineProperty(exports, "setSummary", ({
  enumerable: true,
  get: function get() {
    return _setSummary["default"];
  }
}));
Object.defineProperty(exports, "formatDuration", ({
  enumerable: true,
  get: function get() {
    return _formatDuration["default"];
  }
}));
Object.defineProperty(exports, "foldLine", ({
  enumerable: true,
  get: function get() {
    return _foldLine["default"];
  }
}));
Object.defineProperty(exports, "setLocation", ({
  enumerable: true,
  get: function get() {
    return _setLocation["default"];
  }
}));

var _formatDate = _interopRequireDefault(__webpack_require__(/*! ./format-date */ "./node_modules/ics/dist/utils/format-date.js"));

var _setGeolocation = _interopRequireDefault(__webpack_require__(/*! ./set-geolocation */ "./node_modules/ics/dist/utils/set-geolocation.js"));

var _setContact = _interopRequireDefault(__webpack_require__(/*! ./set-contact */ "./node_modules/ics/dist/utils/set-contact.js"));

var _setOrganizer = _interopRequireDefault(__webpack_require__(/*! ./set-organizer */ "./node_modules/ics/dist/utils/set-organizer.js"));

var _setAlarm = _interopRequireDefault(__webpack_require__(/*! ./set-alarm */ "./node_modules/ics/dist/utils/set-alarm.js"));

var _setDescription = _interopRequireDefault(__webpack_require__(/*! ./set-description */ "./node_modules/ics/dist/utils/set-description.js"));

var _setSummary = _interopRequireDefault(__webpack_require__(/*! ./set-summary */ "./node_modules/ics/dist/utils/set-summary.js"));

var _formatDuration = _interopRequireDefault(__webpack_require__(/*! ./format-duration */ "./node_modules/ics/dist/utils/format-duration.js"));

var _foldLine = _interopRequireDefault(__webpack_require__(/*! ./fold-line */ "./node_modules/ics/dist/utils/fold-line.js"));

var _setLocation = _interopRequireDefault(__webpack_require__(/*! ./set-location */ "./node_modules/ics/dist/utils/set-location.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-alarm.js":
/*!**************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-alarm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setAlarm;

var _formatDate = _interopRequireDefault(__webpack_require__(/*! ./format-date */ "./node_modules/ics/dist/utils/format-date.js"));

var _foldLine = _interopRequireDefault(__webpack_require__(/*! ./fold-line */ "./node_modules/ics/dist/utils/fold-line.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setDuration(_ref) {
  var weeks = _ref.weeks,
      days = _ref.days,
      hours = _ref.hours,
      minutes = _ref.minutes,
      seconds = _ref.seconds;
  var formattedString = 'P';
  formattedString += weeks ? "".concat(weeks, "W") : '';
  formattedString += days ? "".concat(days, "D") : '';
  formattedString += 'T';
  formattedString += hours ? "".concat(hours, "H") : '';
  formattedString += minutes ? "".concat(minutes, "M") : '';
  formattedString += seconds ? "".concat(seconds, "S") : '';
  return formattedString;
}

function setTrigger(trigger) {
  var formattedString = '';

  if (Array.isArray(trigger)) {
    formattedString = "TRIGGER;VALUE=DATE-TIME:".concat((0, _formatDate["default"])(trigger), "\r\n");
  } else {
    var alert = trigger.before ? '-' : '';
    formattedString = "TRIGGER:".concat(alert + setDuration(trigger), "\r\n");
  }

  return formattedString;
}

function setAction(action) {
  return action.toUpperCase();
}

function setAlarm() {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = attributes.action,
      repeat = attributes.repeat,
      description = attributes.description,
      duration = attributes.duration,
      attach = attributes.attach,
      attachType = attributes.attachType,
      trigger = attributes.trigger,
      summary = attributes.summary;
  var formattedString = 'BEGIN:VALARM\r\n';
  formattedString += (0, _foldLine["default"])("ACTION:".concat(setAction(action))) + '\r\n';
  formattedString += repeat ? (0, _foldLine["default"])("REPEAT:".concat(repeat)) + '\r\n' : '';
  formattedString += description ? (0, _foldLine["default"])("DESCRIPTION:".concat(description)) + '\r\n' : '';
  formattedString += duration ? (0, _foldLine["default"])("DURATION:".concat(setDuration(duration))) + '\r\n' : '';
  var attachInfo = attachType ? attachType : 'FMTTYPE=audio/basic';
  formattedString += attach ? (0, _foldLine["default"])("ATTACH;".concat(attachInfo, ":").concat(attach)) + '\r\n' : '';
  formattedString += trigger ? setTrigger(trigger) : '';
  formattedString += summary ? (0, _foldLine["default"])("SUMMARY:".concat(summary)) + '\r\n' : '';
  formattedString += 'END:VALARM\r\n';
  return formattedString;
} // Example:  A duration of 15 days, 5 hours, and 20 seconds would be:
// P15DT5H0M20S
// A duration of 7 weeks would be:
// P7W

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-contact.js":
/*!****************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-contact.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setContact;

function setContact(_ref) {
  var name = _ref.name,
      email = _ref.email,
      rsvp = _ref.rsvp,
      dir = _ref.dir,
      partstat = _ref.partstat,
      role = _ref.role;
  var formattedAttendee = '';
  formattedAttendee += rsvp ? 'RSVP=TRUE;' : 'RSVP=FALSE;';
  formattedAttendee += role ? "ROLE=".concat(role, ";") : '';
  formattedAttendee += partstat ? "PARTSTAT=".concat(partstat, ";") : '';
  formattedAttendee += dir ? "DIR=".concat(dir, ";") : '';
  formattedAttendee += 'CN=';
  formattedAttendee += name || 'Unnamed attendee';
  formattedAttendee += email ? ":mailto:".concat(email) : '';
  return formattedAttendee;
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-description.js":
/*!********************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-description.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setDescription;

var _formatText = _interopRequireDefault(__webpack_require__(/*! ./format-text */ "./node_modules/ics/dist/utils/format-text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setDescription(description) {
  return (0, _formatText["default"])(description);
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-geolocation.js":
/*!********************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-geolocation.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setGeolocation;

function setGeolocation(_ref) {
  var lat = _ref.lat,
      lon = _ref.lon;
  return "".concat(lat, ";").concat(lon);
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-location.js":
/*!*****************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-location.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setLocation;

var _formatText = _interopRequireDefault(__webpack_require__(/*! ./format-text */ "./node_modules/ics/dist/utils/format-text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setLocation(location) {
  return (0, _formatText["default"])(location);
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-organizer.js":
/*!******************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-organizer.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setOrganizer;

function setOrganizer(_ref) {
  var name = _ref.name,
      email = _ref.email,
      dir = _ref.dir;
  var formattedOrganizer = '';
  formattedOrganizer += dir ? "DIR=\"".concat(dir, "\";") : '';
  formattedOrganizer += 'CN=';
  formattedOrganizer += name || 'Organizer';
  formattedOrganizer += email ? ":mailto:".concat(email) : '';
  return formattedOrganizer;
}

/***/ }),

/***/ "./node_modules/ics/dist/utils/set-summary.js":
/*!****************************************************!*\
  !*** ./node_modules/ics/dist/utils/set-summary.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = setSummary;

var _formatText = _interopRequireDefault(__webpack_require__(/*! ./format-text */ "./node_modules/ics/dist/utils/format-text.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setSummary(summary) {
  return (0, _formatText["default"])(summary);
}

/***/ }),

/***/ "./node_modules/lodash/_DataView.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Promise.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_SetCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js"),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "./node_modules/lodash/_setCacheAdd.js"),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "./node_modules/lodash/_setCacheHas.js");

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ "./node_modules/lodash/_Stack.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_Uint8Array.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./node_modules/lodash/_WeakMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "./node_modules/lodash/_arrayMap.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_arrayMap.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_arrayReduce.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayReduce.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),

/***/ "./node_modules/lodash/_arraySome.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arraySome.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ "./node_modules/lodash/_asciiToArray.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_asciiToArray.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),

/***/ "./node_modules/lodash/_asciiWords.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_asciiWords.js ***!
  \********************************************/
/***/ ((module) => {

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

module.exports = asciiWords;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseFor.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseFor.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createBaseFor = __webpack_require__(/*! ./_createBaseFor */ "./node_modules/lodash/_createBaseFor.js");

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),

/***/ "./node_modules/lodash/_baseForOwn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseForOwn.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFor = __webpack_require__(/*! ./_baseFor */ "./node_modules/lodash/_baseFor.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),

/***/ "./node_modules/lodash/_baseGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ "./node_modules/lodash/_baseGetAllKeys.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseHas.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;


/***/ }),

/***/ "./node_modules/lodash/_baseHasIn.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseHasIn.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsEqual.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsEqual.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ "./node_modules/lodash/_baseIsEqualDeep.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ "./node_modules/lodash/_baseIsEqualDeep.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsEqualDeep.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "./node_modules/lodash/_equalArrays.js"),
    equalByTag = __webpack_require__(/*! ./_equalByTag */ "./node_modules/lodash/_equalByTag.js"),
    equalObjects = __webpack_require__(/*! ./_equalObjects */ "./node_modules/lodash/_equalObjects.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMatch.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsMatch.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "./node_modules/lodash/_baseIsEqual.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_baseIteratee.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIteratee.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseMatches = __webpack_require__(/*! ./_baseMatches */ "./node_modules/lodash/_baseMatches.js"),
    baseMatchesProperty = __webpack_require__(/*! ./_baseMatchesProperty */ "./node_modules/lodash/_baseMatchesProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    property = __webpack_require__(/*! ./property */ "./node_modules/lodash/property.js");

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),

/***/ "./node_modules/lodash/_baseKeys.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseMatches.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseMatches.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMatch = __webpack_require__(/*! ./_baseIsMatch */ "./node_modules/lodash/_baseIsMatch.js"),
    getMatchData = __webpack_require__(/*! ./_getMatchData */ "./node_modules/lodash/_getMatchData.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "./node_modules/lodash/_matchesStrictComparable.js");

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),

/***/ "./node_modules/lodash/_baseMatchesProperty.js":
/*!*****************************************************!*\
  !*** ./node_modules/lodash/_baseMatchesProperty.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "./node_modules/lodash/_baseIsEqual.js"),
    get = __webpack_require__(/*! ./get */ "./node_modules/lodash/get.js"),
    hasIn = __webpack_require__(/*! ./hasIn */ "./node_modules/lodash/hasIn.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "./node_modules/lodash/_isStrictComparable.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "./node_modules/lodash/_matchesStrictComparable.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),

/***/ "./node_modules/lodash/_baseProperty.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseProperty.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),

/***/ "./node_modules/lodash/_basePropertyDeep.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_basePropertyDeep.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js");

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),

/***/ "./node_modules/lodash/_basePropertyOf.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_basePropertyOf.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;


/***/ }),

/***/ "./node_modules/lodash/_baseSlice.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseSlice.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "./node_modules/lodash/_baseToString.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseToString.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "./node_modules/lodash/_arrayMap.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_cacheHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ "./node_modules/lodash/_castPath.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_castPath.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    stringToPath = __webpack_require__(/*! ./_stringToPath */ "./node_modules/lodash/_stringToPath.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ "./node_modules/lodash/_castSlice.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_castSlice.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "./node_modules/lodash/_baseSlice.js");

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_createBaseFor.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_createBaseFor.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),

/***/ "./node_modules/lodash/_createCaseFirst.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_createCaseFirst.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castSlice = __webpack_require__(/*! ./_castSlice */ "./node_modules/lodash/_castSlice.js"),
    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ "./node_modules/lodash/_hasUnicode.js"),
    stringToArray = __webpack_require__(/*! ./_stringToArray */ "./node_modules/lodash/_stringToArray.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;


/***/ }),

/***/ "./node_modules/lodash/_createCompounder.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_createCompounder.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayReduce = __webpack_require__(/*! ./_arrayReduce */ "./node_modules/lodash/_arrayReduce.js"),
    deburr = __webpack_require__(/*! ./deburr */ "./node_modules/lodash/deburr.js"),
    words = __webpack_require__(/*! ./words */ "./node_modules/lodash/words.js");

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

module.exports = createCompounder;


/***/ }),

/***/ "./node_modules/lodash/_deburrLetter.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_deburrLetter.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePropertyOf = __webpack_require__(/*! ./_basePropertyOf */ "./node_modules/lodash/_basePropertyOf.js");

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

module.exports = deburrLetter;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_equalArrays.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_equalArrays.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arraySome = __webpack_require__(/*! ./_arraySome */ "./node_modules/lodash/_arraySome.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ "./node_modules/lodash/_equalByTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_equalByTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "./node_modules/lodash/_equalArrays.js"),
    mapToArray = __webpack_require__(/*! ./_mapToArray */ "./node_modules/lodash/_mapToArray.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ "./node_modules/lodash/_equalObjects.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_equalObjects.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getMatchData.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getMatchData.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "./node_modules/lodash/_isStrictComparable.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getSymbols.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "./node_modules/lodash/_getTag.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ "./node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hasPath.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hasPath.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(/*! ./_castPath */ "./node_modules/lodash/_castPath.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),

/***/ "./node_modules/lodash/_hasUnicode.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hasUnicode.js ***!
  \********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),

/***/ "./node_modules/lodash/_hasUnicodeWord.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_hasUnicodeWord.js ***!
  \************************************************/
/***/ ((module) => {

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

module.exports = hasUnicodeWord;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_isKey.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "./node_modules/lodash/_isStrictComparable.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash/_isStrictComparable.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_mapToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ "./node_modules/lodash/_matchesStrictComparable.js":
/*!*********************************************************!*\
  !*** ./node_modules/lodash/_matchesStrictComparable.js ***!
  \*********************************************************/
/***/ ((module) => {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),

/***/ "./node_modules/lodash/_memoizeCapped.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_memoizeCapped.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(/*! ./memoize */ "./node_modules/lodash/memoize.js");

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_setCacheAdd.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ "./node_modules/lodash/_setCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_setToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ "./node_modules/lodash/_stackClear.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "./node_modules/lodash/_stackDelete.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "./node_modules/lodash/_stackGet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "./node_modules/lodash/_stackHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "./node_modules/lodash/_stackSet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "./node_modules/lodash/_stringToArray.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_stringToArray.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var asciiToArray = __webpack_require__(/*! ./_asciiToArray */ "./node_modules/lodash/_asciiToArray.js"),
    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ "./node_modules/lodash/_hasUnicode.js"),
    unicodeToArray = __webpack_require__(/*! ./_unicodeToArray */ "./node_modules/lodash/_unicodeToArray.js");

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;


/***/ }),

/***/ "./node_modules/lodash/_stringToPath.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_stringToPath.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ "./node_modules/lodash/_memoizeCapped.js");

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ "./node_modules/lodash/_toKey.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_toKey.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/_unicodeToArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_unicodeToArray.js ***!
  \************************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;


/***/ }),

/***/ "./node_modules/lodash/_unicodeWords.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_unicodeWords.js ***!
  \**********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

module.exports = unicodeWords;


/***/ }),

/***/ "./node_modules/lodash/camelCase.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/camelCase.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var capitalize = __webpack_require__(/*! ./capitalize */ "./node_modules/lodash/capitalize.js"),
    createCompounder = __webpack_require__(/*! ./_createCompounder */ "./node_modules/lodash/_createCompounder.js");

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

module.exports = camelCase;


/***/ }),

/***/ "./node_modules/lodash/capitalize.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/capitalize.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js"),
    upperFirst = __webpack_require__(/*! ./upperFirst */ "./node_modules/lodash/upperFirst.js");

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

module.exports = capitalize;


/***/ }),

/***/ "./node_modules/lodash/deburr.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/deburr.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var deburrLetter = __webpack_require__(/*! ./_deburrLetter */ "./node_modules/lodash/_deburrLetter.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js");

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/get.js":
/*!************************************!*\
  !*** ./node_modules/lodash/get.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(/*! ./_baseGet */ "./node_modules/lodash/_baseGet.js");

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ "./node_modules/lodash/has.js":
/*!************************************!*\
  !*** ./node_modules/lodash/has.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseHas = __webpack_require__(/*! ./_baseHas */ "./node_modules/lodash/_baseHas.js"),
    hasPath = __webpack_require__(/*! ./_hasPath */ "./node_modules/lodash/_hasPath.js");

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;


/***/ }),

/***/ "./node_modules/lodash/hasIn.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/hasIn.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseHasIn = __webpack_require__(/*! ./_baseHasIn */ "./node_modules/lodash/_baseHasIn.js"),
    hasPath = __webpack_require__(/*! ./_hasPath */ "./node_modules/lodash/_hasPath.js");

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),

/***/ "./node_modules/lodash/identity.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "./node_modules/lodash/keys.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash/mapKeys.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/mapKeys.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    baseForOwn = __webpack_require__(/*! ./_baseForOwn */ "./node_modules/lodash/_baseForOwn.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js");

/**
 * The opposite of `_.mapValues`; this method creates an object with the
 * same values as `object` and keys generated by running each own enumerable
 * string keyed property of `object` thru `iteratee`. The iteratee is invoked
 * with three arguments: (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapValues
 * @example
 *
 * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
 *   return key + value;
 * });
 * // => { 'a1': 1, 'b2': 2 }
 */
function mapKeys(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, iteratee(value, key, object), value);
  });
  return result;
}

module.exports = mapKeys;


/***/ }),

/***/ "./node_modules/lodash/mapValues.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/mapValues.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    baseForOwn = __webpack_require__(/*! ./_baseForOwn */ "./node_modules/lodash/_baseForOwn.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "./node_modules/lodash/_baseIteratee.js");

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, key, object).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 * @see _.mapKeys
 * @example
 *
 * var users = {
 *   'fred':    { 'user': 'fred',    'age': 40 },
 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
 * };
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age');
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee(iteratee, 3);

  baseForOwn(object, function(value, key, object) {
    baseAssignValue(result, key, iteratee(value, key, object));
  });
  return result;
}

module.exports = mapValues;


/***/ }),

/***/ "./node_modules/lodash/memoize.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/memoize.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ "./node_modules/lodash/property.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/property.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseProperty = __webpack_require__(/*! ./_baseProperty */ "./node_modules/lodash/_baseProperty.js"),
    basePropertyDeep = __webpack_require__(/*! ./_basePropertyDeep */ "./node_modules/lodash/_basePropertyDeep.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "./node_modules/lodash/_isKey.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "./node_modules/lodash/_toKey.js");

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),

/***/ "./node_modules/lodash/snakeCase.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/snakeCase.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCompounder = __webpack_require__(/*! ./_createCompounder */ "./node_modules/lodash/_createCompounder.js");

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

module.exports = snakeCase;


/***/ }),

/***/ "./node_modules/lodash/stubArray.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "./node_modules/lodash/toString.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toString.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(/*! ./_baseToString */ "./node_modules/lodash/_baseToString.js");

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ "./node_modules/lodash/upperFirst.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/upperFirst.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCaseFirst = __webpack_require__(/*! ./_createCaseFirst */ "./node_modules/lodash/_createCaseFirst.js");

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;


/***/ }),

/***/ "./node_modules/lodash/words.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/words.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var asciiWords = __webpack_require__(/*! ./_asciiWords */ "./node_modules/lodash/_asciiWords.js"),
    hasUnicodeWord = __webpack_require__(/*! ./_hasUnicodeWord */ "./node_modules/lodash/_hasUnicodeWord.js"),
    toString = __webpack_require__(/*! ./toString */ "./node_modules/lodash/toString.js"),
    unicodeWords = __webpack_require__(/*! ./_unicodeWords */ "./node_modules/lodash/_unicodeWords.js");

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = words;


/***/ }),

/***/ "./node_modules/nanoclone/src/index.js":
/*!*********************************************!*\
  !*** ./node_modules/nanoclone/src/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ clone)
/* harmony export */ });
// ES6 Map
var map
try {
  map = Map
} catch (_) { }
var set

// ES6 Set
try {
  set = Set
} catch (_) { }

function baseClone (src, circulars, clones) {
  // Null/undefined/functions/etc
  if (!src || typeof src !== 'object' || typeof src === 'function') {
    return src
  }

  // DOM Node
  if (src.nodeType && 'cloneNode' in src) {
    return src.cloneNode(true)
  }

  // Date
  if (src instanceof Date) {
    return new Date(src.getTime())
  }

  // RegExp
  if (src instanceof RegExp) {
    return new RegExp(src)
  }

  // Arrays
  if (Array.isArray(src)) {
    return src.map(clone)
  }

  // ES6 Maps
  if (map && src instanceof map) {
    return new Map(Array.from(src.entries()))
  }

  // ES6 Sets
  if (set && src instanceof set) {
    return new Set(Array.from(src.values()))
  }

  // Object
  if (src instanceof Object) {
    circulars.push(src)
    var obj = Object.create(src)
    clones.push(obj)
    for (var key in src) {
      var idx = circulars.findIndex(function (i) {
        return i === src[key]
      })
      obj[key] = idx > -1 ? clones[idx] : baseClone(src[key], circulars, clones)
    }
    return obj
  }

  // ???
  return src
}

function clone (src) {
  return baseClone(src, [], [])
}


/***/ }),

/***/ "./node_modules/property-expr/index.js":
/*!*********************************************!*\
  !*** ./node_modules/property-expr/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";
/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */


function Cache(maxSize) {
  this._maxSize = maxSize
  this.clear()
}
Cache.prototype.clear = function () {
  this._size = 0
  this._values = Object.create(null)
}
Cache.prototype.get = function (key) {
  return this._values[key]
}
Cache.prototype.set = function (key, value) {
  this._size >= this._maxSize && this.clear()
  if (!(key in this._values)) this._size++

  return (this._values[key] = value)
}

var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
  DIGIT_REGEX = /^\d+$/,
  LEAD_DIGIT_REGEX = /^\d/,
  SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
  CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
  MAX_CACHE_SIZE = 512

var pathCache = new Cache(MAX_CACHE_SIZE),
  setCache = new Cache(MAX_CACHE_SIZE),
  getCache = new Cache(MAX_CACHE_SIZE)

var config

module.exports = {
  Cache: Cache,

  split: split,

  normalizePath: normalizePath,

  setter: function (path) {
    var parts = normalizePath(path)

    return (
      setCache.get(path) ||
      setCache.set(path, function setter(obj, value) {
        var index = 0
        var len = parts.length
        var data = obj

        while (index < len - 1) {
          var part = parts[index]
          if (
            part === '__proto__' ||
            part === 'constructor' ||
            part === 'prototype'
          ) {
            return obj
          }

          data = data[parts[index++]]
        }
        data[parts[index]] = value
      })
    )
  },

  getter: function (path, safe) {
    var parts = normalizePath(path)
    return (
      getCache.get(path) ||
      getCache.set(path, function getter(data) {
        var index = 0,
          len = parts.length
        while (index < len) {
          if (data != null || !safe) data = data[parts[index++]]
          else return
        }
        return data
      })
    )
  },

  join: function (segments) {
    return segments.reduce(function (path, part) {
      return (
        path +
        (isQuoted(part) || DIGIT_REGEX.test(part)
          ? '[' + part + ']'
          : (path ? '.' : '') + part)
      )
    }, '')
  },

  forEach: function (path, cb, thisArg) {
    forEach(Array.isArray(path) ? path : split(path), cb, thisArg)
  },
}

function normalizePath(path) {
  return (
    pathCache.get(path) ||
    pathCache.set(
      path,
      split(path).map(function (part) {
        return part.replace(CLEAN_QUOTES_REGEX, '$2')
      })
    )
  )
}

function split(path) {
  return path.match(SPLIT_REGEX) || ['']
}

function forEach(parts, iter, thisArg) {
  var len = parts.length,
    part,
    idx,
    isArray,
    isBracket

  for (idx = 0; idx < len; idx++) {
    part = parts[idx]

    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"'
      }

      isBracket = isQuoted(part)
      isArray = !isBracket && /^\d+$/.test(part)

      iter.call(thisArg, part, isBracket, isArray, idx, parts)
    }
  }
}

function isQuoted(str) {
  return (
    typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
  )
}

function hasLeadingNumber(part) {
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
}

function hasSpecialChars(part) {
  return SPEC_CHAR_REGEX.test(part)
}

function shouldBeQuoted(part) {
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
}


/***/ }),

/***/ "./node_modules/toposort/index.js":
/*!****************************************!*\
  !*** ./node_modules/toposort/index.js ***!
  \****************************************/
/***/ ((module) => {


/**
 * Topological sorting function
 *
 * @param {Array} edges
 * @returns {Array}
 */

module.exports = function(edges) {
  return toposort(uniqueNodes(edges), edges)
}

module.exports.array = toposort

function toposort(nodes, edges) {
  var cursor = nodes.length
    , sorted = new Array(cursor)
    , visited = {}
    , i = cursor
    // Better data structures make algorithm much faster.
    , outgoingEdges = makeOutgoingEdges(edges)
    , nodesHash = makeNodesHash(nodes)

  // check for unknown nodes
  edges.forEach(function(edge) {
    if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
      throw new Error('Unknown node. There is an unknown node in the supplied edges.')
    }
  })

  while (i--) {
    if (!visited[i]) visit(nodes[i], i, new Set())
  }

  return sorted

  function visit(node, i, predecessors) {
    if(predecessors.has(node)) {
      var nodeRep
      try {
        nodeRep = ", node was:" + JSON.stringify(node)
      } catch(e) {
        nodeRep = ""
      }
      throw new Error('Cyclic dependency' + nodeRep)
    }

    if (!nodesHash.has(node)) {
      throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+JSON.stringify(node))
    }

    if (visited[i]) return;
    visited[i] = true

    var outgoing = outgoingEdges.get(node) || new Set()
    outgoing = Array.from(outgoing)

    if (i = outgoing.length) {
      predecessors.add(node)
      do {
        var child = outgoing[--i]
        visit(child, nodesHash.get(child), predecessors)
      } while (i)
      predecessors.delete(node)
    }

    sorted[--cursor] = node
  }
}

function uniqueNodes(arr){
  var res = new Set()
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i]
    res.add(edge[0])
    res.add(edge[1])
  }
  return Array.from(res)
}

function makeOutgoingEdges(arr){
  var edges = new Map()
  for (var i = 0, len = arr.length; i < len; i++) {
    var edge = arr[i]
    if (!edges.has(edge[0])) edges.set(edge[0], new Set())
    if (!edges.has(edge[1])) edges.set(edge[1], new Set())
    edges.get(edge[0]).add(edge[1])
  }
  return edges
}

function makeNodesHash(arr){
  var res = new Map()
  for (var i = 0, len = arr.length; i < len; i++) {
    res.set(arr[i], i)
  }
  return res
}


/***/ }),

/***/ "./node_modules/yup/es/Condition.js":
/*!******************************************!*\
  !*** ./node_modules/yup/es/Condition.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js");
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_has__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_isSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isSchema */ "./node_modules/yup/es/util/isSchema.js");



class Condition {
  constructor(refs, options) {
    this.fn = void 0;
    this.refs = refs;
    this.refs = refs;

    if (typeof options === 'function') {
      this.fn = options;
      return;
    }

    if (!lodash_has__WEBPACK_IMPORTED_MODULE_0___default()(options, 'is')) throw new TypeError('`is:` is required for `when()` conditions');
    if (!options.then && !options.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions');
    let {
      is,
      then,
      otherwise
    } = options;
    let check = typeof is === 'function' ? is : (...values) => values.every(value => value === is);

    this.fn = function (...args) {
      let options = args.pop();
      let schema = args.pop();
      let branch = check(...args) ? then : otherwise;
      if (!branch) return undefined;
      if (typeof branch === 'function') return branch(schema);
      return schema.concat(branch.resolve(options));
    };
  }

  resolve(base, options) {
    let values = this.refs.map(ref => ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context));
    let schema = this.fn.apply(base, values.concat(base, options));
    if (schema === undefined || schema === base) return base;
    if (!(0,_util_isSchema__WEBPACK_IMPORTED_MODULE_1__["default"])(schema)) throw new TypeError('conditions must return a schema object');
    return schema.resolve(options);
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Condition);

/***/ }),

/***/ "./node_modules/yup/es/Lazy.js":
/*!*************************************!*\
  !*** ./node_modules/yup/es/Lazy.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_isSchema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/isSchema */ "./node_modules/yup/es/util/isSchema.js");

function create(builder) {
  return new Lazy(builder);
}

class Lazy {
  constructor(builder) {
    this.type = 'lazy';
    this.__isYupSchema__ = true;
    this.__inputType = void 0;
    this.__outputType = void 0;

    this._resolve = (value, options = {}) => {
      let schema = this.builder(value, options);
      if (!(0,_util_isSchema__WEBPACK_IMPORTED_MODULE_0__["default"])(schema)) throw new TypeError('lazy() functions must return a valid schema');
      return schema.resolve(options);
    };

    this.builder = builder;
  }

  resolve(options) {
    return this._resolve(options.value, options);
  }

  cast(value, options) {
    return this._resolve(value, options).cast(value, options);
  }

  validate(value, options, maybeCb) {
    // @ts-expect-error missing public callback on type
    return this._resolve(value, options).validate(value, options, maybeCb);
  }

  validateSync(value, options) {
    return this._resolve(value, options).validateSync(value, options);
  }

  validateAt(path, value, options) {
    return this._resolve(value, options).validateAt(path, value, options);
  }

  validateSyncAt(path, value, options) {
    return this._resolve(value, options).validateSyncAt(path, value, options);
  }

  describe() {
    return null;
  }

  isValid(value, options) {
    return this._resolve(value, options).isValid(value, options);
  }

  isValidSync(value, options) {
    return this._resolve(value, options).isValidSync(value, options);
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lazy);

/***/ }),

/***/ "./node_modules/yup/es/Reference.js":
/*!******************************************!*\
  !*** ./node_modules/yup/es/Reference.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ Reference)
/* harmony export */ });
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! property-expr */ "./node_modules/property-expr/index.js");
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(property_expr__WEBPACK_IMPORTED_MODULE_0__);

const prefixes = {
  context: '$',
  value: '.'
};
function create(key, options) {
  return new Reference(key, options);
}
class Reference {
  constructor(key, options = {}) {
    this.key = void 0;
    this.isContext = void 0;
    this.isValue = void 0;
    this.isSibling = void 0;
    this.path = void 0;
    this.getter = void 0;
    this.map = void 0;
    if (typeof key !== 'string') throw new TypeError('ref must be a string, got: ' + key);
    this.key = key.trim();
    if (key === '') throw new TypeError('ref must be a non-empty string');
    this.isContext = this.key[0] === prefixes.context;
    this.isValue = this.key[0] === prefixes.value;
    this.isSibling = !this.isContext && !this.isValue;
    let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : '';
    this.path = this.key.slice(prefix.length);
    this.getter = this.path && (0,property_expr__WEBPACK_IMPORTED_MODULE_0__.getter)(this.path, true);
    this.map = options.map;
  }

  getValue(value, parent, context) {
    let result = this.isContext ? context : this.isValue ? value : parent;
    if (this.getter) result = this.getter(result || {});
    if (this.map) result = this.map(result);
    return result;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */


  cast(value, options) {
    return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
  }

  resolve() {
    return this;
  }

  describe() {
    return {
      type: 'ref',
      key: this.key
    };
  }

  toString() {
    return `Ref(${this.key})`;
  }

  static isRef(value) {
    return value && value.__isYupRef;
  }

} // @ts-ignore

Reference.prototype.__isYupRef = true;

/***/ }),

/***/ "./node_modules/yup/es/ValidationError.js":
/*!************************************************!*\
  !*** ./node_modules/yup/es/ValidationError.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ValidationError)
/* harmony export */ });
/* harmony import */ var _util_printValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/printValue */ "./node_modules/yup/es/util/printValue.js");
/* harmony import */ var _util_toArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/toArray */ "./node_modules/yup/es/util/toArray.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



let strReg = /\$\{\s*(\w+)\s*\}/g;
class ValidationError extends Error {
  static formatError(message, params) {
    const path = params.label || params.path || 'this';
    if (path !== params.path) params = _extends({}, params, {
      path
    });
    if (typeof message === 'string') return message.replace(strReg, (_, key) => (0,_util_printValue__WEBPACK_IMPORTED_MODULE_0__["default"])(params[key]));
    if (typeof message === 'function') return message(params);
    return message;
  }

  static isError(err) {
    return err && err.name === 'ValidationError';
  }

  constructor(errorOrErrors, value, field, type) {
    super();
    this.value = void 0;
    this.path = void 0;
    this.type = void 0;
    this.errors = void 0;
    this.params = void 0;
    this.inner = void 0;
    this.name = 'ValidationError';
    this.value = value;
    this.path = field;
    this.type = type;
    this.errors = [];
    this.inner = [];
    (0,_util_toArray__WEBPACK_IMPORTED_MODULE_1__["default"])(errorOrErrors).forEach(err => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors);
        this.inner = this.inner.concat(err.inner.length ? err.inner : err);
      } else {
        this.errors.push(err);
      }
    });
    this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
    if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
  }

}

/***/ }),

/***/ "./node_modules/yup/es/array.js":
/*!**************************************!*\
  !*** ./node_modules/yup/es/array.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ ArraySchema)
/* harmony export */ });
/* harmony import */ var _util_isAbsent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/isAbsent */ "./node_modules/yup/es/util/isAbsent.js");
/* harmony import */ var _util_isSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isSchema */ "./node_modules/yup/es/util/isSchema.js");
/* harmony import */ var _util_printValue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/printValue */ "./node_modules/yup/es/util/printValue.js");
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_runTests__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/runTests */ "./node_modules/yup/es/util/runTests.js");
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ValidationError */ "./node_modules/yup/es/ValidationError.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }








function create(type) {
  return new ArraySchema(type);
}
class ArraySchema extends _schema__WEBPACK_IMPORTED_MODULE_6__["default"] {
  constructor(type) {
    super({
      type: 'array'
    }); // `undefined` specifically means uninitialized, as opposed to
    // "no subtype"

    this.innerType = void 0;
    this.innerType = type;
    this.withMutation(() => {
      this.transform(function (values) {
        if (typeof values === 'string') try {
          values = JSON.parse(values);
        } catch (err) {
          values = null;
        }
        return this.isType(values) ? values : null;
      });
    });
  }

  _typeCheck(v) {
    return Array.isArray(v);
  }

  get _subType() {
    return this.innerType;
  }

  _cast(_value, _opts) {
    const value = super._cast(_value, _opts); //should ignore nulls here


    if (!this._typeCheck(value) || !this.innerType) return value;
    let isChanged = false;
    const castArray = value.map((v, idx) => {
      const castElement = this.innerType.cast(v, _extends({}, _opts, {
        path: `${_opts.path || ''}[${idx}]`
      }));

      if (castElement !== v) {
        isChanged = true;
      }

      return castElement;
    });
    return isChanged ? castArray : value;
  }

  _validate(_value, options = {}, callback) {
    var _options$abortEarly, _options$recursive;

    let errors = [];
    let sync = options.sync;
    let path = options.path;
    let innerType = this.innerType;
    let endEarly = (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly;
    let recursive = (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive;
    let originalValue = options.originalValue != null ? options.originalValue : _value;

    super._validate(_value, options, (err, value) => {
      if (err) {
        if (!_ValidationError__WEBPACK_IMPORTED_MODULE_5__["default"].isError(err) || endEarly) {
          return void callback(err, value);
        }

        errors.push(err);
      }

      if (!recursive || !innerType || !this._typeCheck(value)) {
        callback(errors[0] || null, value);
        return;
      }

      originalValue = originalValue || value; // #950 Ensure that sparse array empty slots are validated

      let tests = new Array(value.length);

      for (let idx = 0; idx < value.length; idx++) {
        let item = value[idx];
        let path = `${options.path || ''}[${idx}]`; // object._validate note for isStrict explanation

        let innerOptions = _extends({}, options, {
          path,
          strict: true,
          parent: value,
          index: idx,
          originalValue: originalValue[idx]
        });

        tests[idx] = (_, cb) => innerType.validate(item, innerOptions, cb);
      }

      (0,_util_runTests__WEBPACK_IMPORTED_MODULE_4__["default"])({
        sync,
        path,
        value,
        errors,
        endEarly,
        tests
      }, callback);
    });
  }

  clone(spec) {
    const next = super.clone(spec);
    next.innerType = this.innerType;
    return next;
  }

  concat(schema) {
    let next = super.concat(schema);
    next.innerType = this.innerType;
    if (schema.innerType) next.innerType = next.innerType ? // @ts-expect-error Lazy doesn't have concat()
    next.innerType.concat(schema.innerType) : schema.innerType;
    return next;
  }

  of(schema) {
    // FIXME: this should return a new instance of array without the default to be
    let next = this.clone();
    if (!(0,_util_isSchema__WEBPACK_IMPORTED_MODULE_1__["default"])(schema)) throw new TypeError('`array.of()` sub-schema must be a valid yup schema not: ' + (0,_util_printValue__WEBPACK_IMPORTED_MODULE_2__["default"])(schema)); // FIXME(ts):

    next.innerType = schema;
    return next;
  }

  length(length, message = _locale__WEBPACK_IMPORTED_MODULE_3__.array.length) {
    return this.test({
      message,
      name: 'length',
      exclusive: true,
      params: {
        length
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || value.length === this.resolve(length);
      }

    });
  }

  min(min, message) {
    message = message || _locale__WEBPACK_IMPORTED_MODULE_3__.array.min;
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      // FIXME(ts): Array<typeof T>
      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || value.length >= this.resolve(min);
      }

    });
  }

  max(max, message) {
    message = message || _locale__WEBPACK_IMPORTED_MODULE_3__.array.max;
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        max
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || value.length <= this.resolve(max);
      }

    });
  }

  ensure() {
    return this.default(() => []).transform((val, original) => {
      // We don't want to return `null` for nullable schema
      if (this._typeCheck(val)) return val;
      return original == null ? [] : [].concat(original);
    });
  }

  compact(rejector) {
    let reject = !rejector ? v => !!v : (v, i, a) => !rejector(v, i, a);
    return this.transform(values => values != null ? values.filter(reject) : values);
  }

  describe() {
    let base = super.describe();
    if (this.innerType) base.innerType = this.innerType.describe();
    return base;
  }

  nullable(isNullable = true) {
    return super.nullable(isNullable);
  }

  defined() {
    return super.defined();
  }

  required(msg) {
    return super.required(msg);
  }

}
create.prototype = ArraySchema.prototype; //
// Interfaces
//

/***/ }),

/***/ "./node_modules/yup/es/boolean.js":
/*!****************************************!*\
  !*** ./node_modules/yup/es/boolean.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ BooleanSchema)
/* harmony export */ });
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_isAbsent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/isAbsent */ "./node_modules/yup/es/util/isAbsent.js");



function create() {
  return new BooleanSchema();
}
class BooleanSchema extends _schema__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super({
      type: 'boolean'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        if (!this.isType(value)) {
          if (/^(true|1)$/i.test(String(value))) return true;
          if (/^(false|0)$/i.test(String(value))) return false;
        }

        return value;
      });
    });
  }

  _typeCheck(v) {
    if (v instanceof Boolean) v = v.valueOf();
    return typeof v === 'boolean';
  }

  isTrue(message = _locale__WEBPACK_IMPORTED_MODULE_1__.boolean.isValue) {
    return this.test({
      message,
      name: 'is-value',
      exclusive: true,
      params: {
        value: 'true'
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || value === true;
      }

    });
  }

  isFalse(message = _locale__WEBPACK_IMPORTED_MODULE_1__.boolean.isValue) {
    return this.test({
      message,
      name: 'is-value',
      exclusive: true,
      params: {
        value: 'false'
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || value === false;
      }

    });
  }

}
create.prototype = BooleanSchema.prototype;

/***/ }),

/***/ "./node_modules/yup/es/date.js":
/*!*************************************!*\
  !*** ./node_modules/yup/es/date.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ DateSchema)
/* harmony export */ });
/* harmony import */ var _util_isodate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/isodate */ "./node_modules/yup/es/util/isodate.js");
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_isAbsent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/isAbsent */ "./node_modules/yup/es/util/isAbsent.js");
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Reference */ "./node_modules/yup/es/Reference.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");
// @ts-ignore





let invalidDate = new Date('');

let isDate = obj => Object.prototype.toString.call(obj) === '[object Date]';

function create() {
  return new DateSchema();
}
class DateSchema extends _schema__WEBPACK_IMPORTED_MODULE_4__["default"] {
  constructor() {
    super({
      type: 'date'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        if (this.isType(value)) return value;
        value = (0,_util_isodate__WEBPACK_IMPORTED_MODULE_0__["default"])(value); // 0 is a valid timestamp equivalent to 1970-01-01T00:00:00Z(unix epoch) or before.

        return !isNaN(value) ? new Date(value) : invalidDate;
      });
    });
  }

  _typeCheck(v) {
    return isDate(v) && !isNaN(v.getTime());
  }

  prepareParam(ref, name) {
    let param;

    if (!_Reference__WEBPACK_IMPORTED_MODULE_3__["default"].isRef(ref)) {
      let cast = this.cast(ref);
      if (!this._typeCheck(cast)) throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
      param = cast;
    } else {
      param = ref;
    }

    return param;
  }

  min(min, message = _locale__WEBPACK_IMPORTED_MODULE_1__.date.min) {
    let limit = this.prepareParam(min, 'min');
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || value >= this.resolve(limit);
      }

    });
  }

  max(max, message = _locale__WEBPACK_IMPORTED_MODULE_1__.date.max) {
    let limit = this.prepareParam(max, 'max');
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        max
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || value <= this.resolve(limit);
      }

    });
  }

}
DateSchema.INVALID_DATE = invalidDate;
create.prototype = DateSchema.prototype;
create.INVALID_DATE = invalidDate;

/***/ }),

/***/ "./node_modules/yup/es/index.js":
/*!**************************************!*\
  !*** ./node_modules/yup/es/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArraySchema: () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   BaseSchema: () => (/* reexport safe */ _schema__WEBPACK_IMPORTED_MODULE_13__["default"]),
/* harmony export */   BooleanSchema: () => (/* reexport safe */ _boolean__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   DateSchema: () => (/* reexport safe */ _date__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   MixedSchema: () => (/* reexport safe */ _mixed__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   NumberSchema: () => (/* reexport safe */ _number__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   ObjectSchema: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   StringSchema: () => (/* reexport safe */ _string__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ValidationError: () => (/* reexport safe */ _ValidationError__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   addMethod: () => (/* binding */ addMethod),
/* harmony export */   array: () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_6__.create),
/* harmony export */   bool: () => (/* reexport safe */ _boolean__WEBPACK_IMPORTED_MODULE_1__.create),
/* harmony export */   boolean: () => (/* reexport safe */ _boolean__WEBPACK_IMPORTED_MODULE_1__.create),
/* harmony export */   date: () => (/* reexport safe */ _date__WEBPACK_IMPORTED_MODULE_4__.create),
/* harmony export */   isSchema: () => (/* reexport safe */ _util_isSchema__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   lazy: () => (/* reexport safe */ _Lazy__WEBPACK_IMPORTED_MODULE_8__.create),
/* harmony export */   mixed: () => (/* reexport safe */ _mixed__WEBPACK_IMPORTED_MODULE_0__.create),
/* harmony export */   number: () => (/* reexport safe */ _number__WEBPACK_IMPORTED_MODULE_3__.create),
/* harmony export */   object: () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_5__.create),
/* harmony export */   reach: () => (/* reexport safe */ _util_reach__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   ref: () => (/* reexport safe */ _Reference__WEBPACK_IMPORTED_MODULE_7__.create),
/* harmony export */   setLocale: () => (/* reexport safe */ _setLocale__WEBPACK_IMPORTED_MODULE_12__["default"]),
/* harmony export */   string: () => (/* reexport safe */ _string__WEBPACK_IMPORTED_MODULE_2__.create)
/* harmony export */ });
/* harmony import */ var _mixed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixed */ "./node_modules/yup/es/mixed.js");
/* harmony import */ var _boolean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boolean */ "./node_modules/yup/es/boolean.js");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./string */ "./node_modules/yup/es/string.js");
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./number */ "./node_modules/yup/es/number.js");
/* harmony import */ var _date__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./date */ "./node_modules/yup/es/date.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./object */ "./node_modules/yup/es/object.js");
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./array */ "./node_modules/yup/es/array.js");
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Reference */ "./node_modules/yup/es/Reference.js");
/* harmony import */ var _Lazy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Lazy */ "./node_modules/yup/es/Lazy.js");
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ValidationError */ "./node_modules/yup/es/ValidationError.js");
/* harmony import */ var _util_reach__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util/reach */ "./node_modules/yup/es/util/reach.js");
/* harmony import */ var _util_isSchema__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util/isSchema */ "./node_modules/yup/es/util/isSchema.js");
/* harmony import */ var _setLocale__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./setLocale */ "./node_modules/yup/es/setLocale.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");















function addMethod(schemaType, name, fn) {
  if (!schemaType || !(0,_util_isSchema__WEBPACK_IMPORTED_MODULE_11__["default"])(schemaType.prototype)) throw new TypeError('You must provide a yup schema constructor function');
  if (typeof name !== 'string') throw new TypeError('A Method name must be provided');
  if (typeof fn !== 'function') throw new TypeError('Method function must be provided');
  schemaType.prototype[name] = fn;
}




/***/ }),

/***/ "./node_modules/yup/es/locale.js":
/*!***************************************!*\
  !*** ./node_modules/yup/es/locale.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   array: () => (/* binding */ array),
/* harmony export */   boolean: () => (/* binding */ boolean),
/* harmony export */   date: () => (/* binding */ date),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mixed: () => (/* binding */ mixed),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   object: () => (/* binding */ object),
/* harmony export */   string: () => (/* binding */ string)
/* harmony export */ });
/* harmony import */ var _util_printValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/printValue */ "./node_modules/yup/es/util/printValue.js");

let mixed = {
  default: '${path} is invalid',
  required: '${path} is a required field',
  oneOf: '${path} must be one of the following values: ${values}',
  notOneOf: '${path} must not be one of the following values: ${values}',
  notType: ({
    path,
    type,
    value,
    originalValue
  }) => {
    let isCast = originalValue != null && originalValue !== value;
    let msg = `${path} must be a \`${type}\` type, ` + `but the final value was: \`${(0,_util_printValue__WEBPACK_IMPORTED_MODULE_0__["default"])(value, true)}\`` + (isCast ? ` (cast from the value \`${(0,_util_printValue__WEBPACK_IMPORTED_MODULE_0__["default"])(originalValue, true)}\`).` : '.');

    if (value === null) {
      msg += `\n If "null" is intended as an empty value be sure to mark the schema as \`.nullable()\``;
    }

    return msg;
  },
  defined: '${path} must be defined'
};
let string = {
  length: '${path} must be exactly ${length} characters',
  min: '${path} must be at least ${min} characters',
  max: '${path} must be at most ${max} characters',
  matches: '${path} must match the following: "${regex}"',
  email: '${path} must be a valid email',
  url: '${path} must be a valid URL',
  uuid: '${path} must be a valid UUID',
  trim: '${path} must be a trimmed string',
  lowercase: '${path} must be a lowercase string',
  uppercase: '${path} must be a upper case string'
};
let number = {
  min: '${path} must be greater than or equal to ${min}',
  max: '${path} must be less than or equal to ${max}',
  lessThan: '${path} must be less than ${less}',
  moreThan: '${path} must be greater than ${more}',
  positive: '${path} must be a positive number',
  negative: '${path} must be a negative number',
  integer: '${path} must be an integer'
};
let date = {
  min: '${path} field must be later than ${min}',
  max: '${path} field must be at earlier than ${max}'
};
let boolean = {
  isValue: '${path} field must be ${value}'
};
let object = {
  noUnknown: '${path} field has unspecified keys: ${unknown}'
};
let array = {
  min: '${path} field must have at least ${min} items',
  max: '${path} field must have less than or equal to ${max} items',
  length: '${path} must have ${length} items'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign(Object.create(null), {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean
}));

/***/ }),

/***/ "./node_modules/yup/es/mixed.js":
/*!**************************************!*\
  !*** ./node_modules/yup/es/mixed.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");

const Mixed = _schema__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mixed);
function create() {
  return new Mixed();
} // XXX: this is using the Base schema so that `addMethod(mixed)` works as a base class

create.prototype = Mixed.prototype;

/***/ }),

/***/ "./node_modules/yup/es/number.js":
/*!***************************************!*\
  !*** ./node_modules/yup/es/number.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ NumberSchema)
/* harmony export */ });
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_isAbsent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isAbsent */ "./node_modules/yup/es/util/isAbsent.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");




let isNaN = value => value != +value;

function create() {
  return new NumberSchema();
}
class NumberSchema extends _schema__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super({
      type: 'number'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        let parsed = value;

        if (typeof parsed === 'string') {
          parsed = parsed.replace(/\s/g, '');
          if (parsed === '') return NaN; // don't use parseFloat to avoid positives on alpha-numeric strings

          parsed = +parsed;
        }

        if (this.isType(parsed)) return parsed;
        return parseFloat(parsed);
      });
    });
  }

  _typeCheck(value) {
    if (value instanceof Number) value = value.valueOf();
    return typeof value === 'number' && !isNaN(value);
  }

  min(min, message = _locale__WEBPACK_IMPORTED_MODULE_0__.number.min) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value >= this.resolve(min);
      }

    });
  }

  max(max, message = _locale__WEBPACK_IMPORTED_MODULE_0__.number.max) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        max
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value <= this.resolve(max);
      }

    });
  }

  lessThan(less, message = _locale__WEBPACK_IMPORTED_MODULE_0__.number.lessThan) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: {
        less
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value < this.resolve(less);
      }

    });
  }

  moreThan(more, message = _locale__WEBPACK_IMPORTED_MODULE_0__.number.moreThan) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        more
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value > this.resolve(more);
      }

    });
  }

  positive(msg = _locale__WEBPACK_IMPORTED_MODULE_0__.number.positive) {
    return this.moreThan(0, msg);
  }

  negative(msg = _locale__WEBPACK_IMPORTED_MODULE_0__.number.negative) {
    return this.lessThan(0, msg);
  }

  integer(message = _locale__WEBPACK_IMPORTED_MODULE_0__.number.integer) {
    return this.test({
      name: 'integer',
      message,
      test: val => (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(val) || Number.isInteger(val)
    });
  }

  truncate() {
    return this.transform(value => !(0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? value | 0 : value);
  }

  round(method) {
    var _method;

    let avail = ['ceil', 'floor', 'round', 'trunc'];
    method = ((_method = method) == null ? void 0 : _method.toLowerCase()) || 'round'; // this exists for symemtry with the new Math.trunc

    if (method === 'trunc') return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
    return this.transform(value => !(0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? Math[method](value) : value);
  }

}
create.prototype = NumberSchema.prototype; //
// Number Interfaces
//

/***/ }),

/***/ "./node_modules/yup/es/object.js":
/*!***************************************!*\
  !*** ./node_modules/yup/es/object.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ ObjectSchema)
/* harmony export */ });
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js");
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_has__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_snakeCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/snakeCase */ "./node_modules/lodash/snakeCase.js");
/* harmony import */ var lodash_snakeCase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_snakeCase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/camelCase */ "./node_modules/lodash/camelCase.js");
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_camelCase__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_mapKeys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/mapKeys */ "./node_modules/lodash/mapKeys.js");
/* harmony import */ var lodash_mapKeys__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_mapKeys__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/mapValues */ "./node_modules/lodash/mapValues.js");
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_mapValues__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! property-expr */ "./node_modules/property-expr/index.js");
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(property_expr__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_sortFields__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/sortFields */ "./node_modules/yup/es/util/sortFields.js");
/* harmony import */ var _util_sortByKeyOrder__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util/sortByKeyOrder */ "./node_modules/yup/es/util/sortByKeyOrder.js");
/* harmony import */ var _util_runTests__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./util/runTests */ "./node_modules/yup/es/util/runTests.js");
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ValidationError */ "./node_modules/yup/es/ValidationError.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }














let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

function unknown(ctx, value) {
  let known = Object.keys(ctx.fields);
  return Object.keys(value).filter(key => known.indexOf(key) === -1);
}

const defaultSort = (0,_util_sortByKeyOrder__WEBPACK_IMPORTED_MODULE_8__["default"])([]);
class ObjectSchema extends _schema__WEBPACK_IMPORTED_MODULE_11__["default"] {
  constructor(spec) {
    super({
      type: 'object'
    });
    this.fields = Object.create(null);
    this._sortErrors = defaultSort;
    this._nodes = [];
    this._excludedEdges = [];
    this.withMutation(() => {
      this.transform(function coerce(value) {
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (err) {
            value = null;
          }
        }

        if (this.isType(value)) return value;
        return null;
      });

      if (spec) {
        this.shape(spec);
      }
    });
  }

  _typeCheck(value) {
    return isObject(value) || typeof value === 'function';
  }

  _cast(_value, options = {}) {
    var _options$stripUnknown;

    let value = super._cast(_value, options); //should ignore nulls here


    if (value === undefined) return this.getDefault();
    if (!this._typeCheck(value)) return value;
    let fields = this.fields;
    let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;

    let props = this._nodes.concat(Object.keys(value).filter(v => this._nodes.indexOf(v) === -1));

    let intermediateValue = {}; // is filled during the transform below

    let innerOptions = _extends({}, options, {
      parent: intermediateValue,
      __validating: options.__validating || false
    });

    let isChanged = false;

    for (const prop of props) {
      let field = fields[prop];
      let exists = lodash_has__WEBPACK_IMPORTED_MODULE_0___default()(value, prop);

      if (field) {
        let fieldValue;
        let inputValue = value[prop]; // safe to mutate since this is fired in sequence

        innerOptions.path = (options.path ? `${options.path}.` : '') + prop; // innerOptions.value = value[prop];

        field = field.resolve({
          value: inputValue,
          context: options.context,
          parent: intermediateValue
        });
        let fieldSpec = 'spec' in field ? field.spec : undefined;
        let strict = fieldSpec == null ? void 0 : fieldSpec.strict;

        if (fieldSpec == null ? void 0 : fieldSpec.strip) {
          isChanged = isChanged || prop in value;
          continue;
        }

        fieldValue = !options.__validating || !strict ? // TODO: use _cast, this is double resolving
        field.cast(value[prop], innerOptions) : value[prop];

        if (fieldValue !== undefined) {
          intermediateValue[prop] = fieldValue;
        }
      } else if (exists && !strip) {
        intermediateValue[prop] = value[prop];
      }

      if (intermediateValue[prop] !== value[prop]) {
        isChanged = true;
      }
    }

    return isChanged ? intermediateValue : value;
  }

  _validate(_value, opts = {}, callback) {
    let errors = [];
    let {
      sync,
      from = [],
      originalValue = _value,
      abortEarly = this.spec.abortEarly,
      recursive = this.spec.recursive
    } = opts;
    from = [{
      schema: this,
      value: originalValue
    }, ...from]; // this flag is needed for handling `strict` correctly in the context of
    // validation vs just casting. e.g strict() on a field is only used when validating

    opts.__validating = true;
    opts.originalValue = originalValue;
    opts.from = from;

    super._validate(_value, opts, (err, value) => {
      if (err) {
        if (!_ValidationError__WEBPACK_IMPORTED_MODULE_10__["default"].isError(err) || abortEarly) {
          return void callback(err, value);
        }

        errors.push(err);
      }

      if (!recursive || !isObject(value)) {
        callback(errors[0] || null, value);
        return;
      }

      originalValue = originalValue || value;

      let tests = this._nodes.map(key => (_, cb) => {
        let path = key.indexOf('.') === -1 ? (opts.path ? `${opts.path}.` : '') + key : `${opts.path || ''}["${key}"]`;
        let field = this.fields[key];

        if (field && 'validate' in field) {
          field.validate(value[key], _extends({}, opts, {
            // @ts-ignore
            path,
            from,
            // inner fields are always strict:
            // 1. this isn't strict so the casting will also have cast inner values
            // 2. this is strict in which case the nested values weren't cast either
            strict: true,
            parent: value,
            originalValue: originalValue[key]
          }), cb);
          return;
        }

        cb(null);
      });

      (0,_util_runTests__WEBPACK_IMPORTED_MODULE_9__["default"])({
        sync,
        tests,
        value,
        errors,
        endEarly: abortEarly,
        sort: this._sortErrors,
        path: opts.path
      }, callback);
    });
  }

  clone(spec) {
    const next = super.clone(spec);
    next.fields = _extends({}, this.fields);
    next._nodes = this._nodes;
    next._excludedEdges = this._excludedEdges;
    next._sortErrors = this._sortErrors;
    return next;
  }

  concat(schema) {
    let next = super.concat(schema);
    let nextFields = next.fields;

    for (let [field, schemaOrRef] of Object.entries(this.fields)) {
      const target = nextFields[field];

      if (target === undefined) {
        nextFields[field] = schemaOrRef;
      } else if (target instanceof _schema__WEBPACK_IMPORTED_MODULE_11__["default"] && schemaOrRef instanceof _schema__WEBPACK_IMPORTED_MODULE_11__["default"]) {
        nextFields[field] = schemaOrRef.concat(target);
      }
    }

    return next.withMutation(() => next.shape(nextFields, this._excludedEdges));
  }

  getDefaultFromShape() {
    let dft = {};

    this._nodes.forEach(key => {
      const field = this.fields[key];
      dft[key] = 'default' in field ? field.getDefault() : undefined;
    });

    return dft;
  }

  _getDefault() {
    if ('default' in this.spec) {
      return super._getDefault();
    } // if there is no default set invent one


    if (!this._nodes.length) {
      return undefined;
    }

    return this.getDefaultFromShape();
  }

  shape(additions, excludes = []) {
    let next = this.clone();
    let fields = Object.assign(next.fields, additions);
    next.fields = fields;
    next._sortErrors = (0,_util_sortByKeyOrder__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.keys(fields));

    if (excludes.length) {
      // this is a convenience for when users only supply a single pair
      if (!Array.isArray(excludes[0])) excludes = [excludes];
      next._excludedEdges = [...next._excludedEdges, ...excludes];
    }

    next._nodes = (0,_util_sortFields__WEBPACK_IMPORTED_MODULE_7__["default"])(fields, next._excludedEdges);
    return next;
  }

  pick(keys) {
    const picked = {};

    for (const key of keys) {
      if (this.fields[key]) picked[key] = this.fields[key];
    }

    return this.clone().withMutation(next => {
      next.fields = {};
      return next.shape(picked);
    });
  }

  omit(keys) {
    const next = this.clone();
    const fields = next.fields;
    next.fields = {};

    for (const key of keys) {
      delete fields[key];
    }

    return next.withMutation(() => next.shape(fields));
  }

  from(from, to, alias) {
    let fromGetter = (0,property_expr__WEBPACK_IMPORTED_MODULE_5__.getter)(from, true);
    return this.transform(obj => {
      if (obj == null) return obj;
      let newObj = obj;

      if (lodash_has__WEBPACK_IMPORTED_MODULE_0___default()(obj, from)) {
        newObj = _extends({}, obj);
        if (!alias) delete newObj[from];
        newObj[to] = fromGetter(obj);
      }

      return newObj;
    });
  }

  noUnknown(noAllow = true, message = _locale__WEBPACK_IMPORTED_MODULE_6__.object.noUnknown) {
    if (typeof noAllow === 'string') {
      message = noAllow;
      noAllow = true;
    }

    let next = this.test({
      name: 'noUnknown',
      exclusive: true,
      message: message,

      test(value) {
        if (value == null) return true;
        const unknownKeys = unknown(this.schema, value);
        return !noAllow || unknownKeys.length === 0 || this.createError({
          params: {
            unknown: unknownKeys.join(', ')
          }
        });
      }

    });
    next.spec.noUnknown = noAllow;
    return next;
  }

  unknown(allow = true, message = _locale__WEBPACK_IMPORTED_MODULE_6__.object.noUnknown) {
    return this.noUnknown(!allow, message);
  }

  transformKeys(fn) {
    return this.transform(obj => obj && lodash_mapKeys__WEBPACK_IMPORTED_MODULE_3___default()(obj, (_, key) => fn(key)));
  }

  camelCase() {
    return this.transformKeys((lodash_camelCase__WEBPACK_IMPORTED_MODULE_2___default()));
  }

  snakeCase() {
    return this.transformKeys((lodash_snakeCase__WEBPACK_IMPORTED_MODULE_1___default()));
  }

  constantCase() {
    return this.transformKeys(key => lodash_snakeCase__WEBPACK_IMPORTED_MODULE_1___default()(key).toUpperCase());
  }

  describe() {
    let base = super.describe();
    base.fields = lodash_mapValues__WEBPACK_IMPORTED_MODULE_4___default()(this.fields, value => value.describe());
    return base;
  }

}
function create(spec) {
  return new ObjectSchema(spec);
}
create.prototype = ObjectSchema.prototype;

/***/ }),

/***/ "./node_modules/yup/es/schema.js":
/*!***************************************!*\
  !*** ./node_modules/yup/es/schema.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseSchema)
/* harmony export */ });
/* harmony import */ var nanoclone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanoclone */ "./node_modules/nanoclone/src/index.js");
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _Condition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Condition */ "./node_modules/yup/es/Condition.js");
/* harmony import */ var _util_runTests__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/runTests */ "./node_modules/yup/es/util/runTests.js");
/* harmony import */ var _util_createValidation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/createValidation */ "./node_modules/yup/es/util/createValidation.js");
/* harmony import */ var _util_printValue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/printValue */ "./node_modules/yup/es/util/printValue.js");
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Reference */ "./node_modules/yup/es/Reference.js");
/* harmony import */ var _util_reach__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/reach */ "./node_modules/yup/es/util/reach.js");
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ValidationError */ "./node_modules/yup/es/ValidationError.js");
/* harmony import */ var _util_ReferenceSet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./util/ReferenceSet */ "./node_modules/yup/es/util/ReferenceSet.js");
/* harmony import */ var _util_toArray__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util/toArray */ "./node_modules/yup/es/util/toArray.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// @ts-ignore










 // const UNSET = 'unset' as const;

class BaseSchema {
  constructor(options) {
    this.deps = [];
    this.tests = void 0;
    this.transforms = void 0;
    this.conditions = [];
    this._mutate = void 0;
    this._typeError = void 0;
    this._whitelist = new _util_ReferenceSet__WEBPACK_IMPORTED_MODULE_9__["default"]();
    this._blacklist = new _util_ReferenceSet__WEBPACK_IMPORTED_MODULE_9__["default"]();
    this.exclusiveTests = Object.create(null);
    this.spec = void 0;
    this.tests = [];
    this.transforms = [];
    this.withMutation(() => {
      this.typeError(_locale__WEBPACK_IMPORTED_MODULE_1__.mixed.notType);
    });
    this.type = (options == null ? void 0 : options.type) || 'mixed';
    this.spec = _extends({
      strip: false,
      strict: false,
      abortEarly: true,
      recursive: true,
      nullable: false,
      presence: 'optional'
    }, options == null ? void 0 : options.spec);
  } // TODO: remove


  get _type() {
    return this.type;
  }

  _typeCheck(_value) {
    return true;
  }

  clone(spec) {
    if (this._mutate) {
      if (spec) Object.assign(this.spec, spec);
      return this;
    } // if the nested value is a schema we can skip cloning, since
    // they are already immutable


    const next = Object.create(Object.getPrototypeOf(this)); // @ts-expect-error this is readonly

    next.type = this.type;
    next._typeError = this._typeError;
    next._whitelistError = this._whitelistError;
    next._blacklistError = this._blacklistError;
    next._whitelist = this._whitelist.clone();
    next._blacklist = this._blacklist.clone();
    next.exclusiveTests = _extends({}, this.exclusiveTests); // @ts-expect-error this is readonly

    next.deps = [...this.deps];
    next.conditions = [...this.conditions];
    next.tests = [...this.tests];
    next.transforms = [...this.transforms];
    next.spec = (0,nanoclone__WEBPACK_IMPORTED_MODULE_0__["default"])(_extends({}, this.spec, spec));
    return next;
  }

  label(label) {
    let next = this.clone();
    next.spec.label = label;
    return next;
  }

  meta(...args) {
    if (args.length === 0) return this.spec.meta;
    let next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  } // withContext<TContext extends AnyObject>(): BaseSchema<
  //   TCast,
  //   TContext,
  //   TOutput
  // > {
  //   return this as any;
  // }


  withMutation(fn) {
    let before = this._mutate;
    this._mutate = true;
    let result = fn(this);
    this._mutate = before;
    return result;
  }

  concat(schema) {
    if (!schema || schema === this) return this;
    if (schema.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
    let base = this;
    let combined = schema.clone();

    const mergedSpec = _extends({}, base.spec, combined.spec); // if (combined.spec.nullable === UNSET)
    //   mergedSpec.nullable = base.spec.nullable;
    // if (combined.spec.presence === UNSET)
    //   mergedSpec.presence = base.spec.presence;


    combined.spec = mergedSpec;
    combined._typeError || (combined._typeError = base._typeError);
    combined._whitelistError || (combined._whitelistError = base._whitelistError);
    combined._blacklistError || (combined._blacklistError = base._blacklistError); // manually merge the blacklist/whitelist (the other `schema` takes
    // precedence in case of conflicts)

    combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
    combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist); // start with the current tests

    combined.tests = base.tests;
    combined.exclusiveTests = base.exclusiveTests; // manually add the new tests to ensure
    // the deduping logic is consistent

    combined.withMutation(next => {
      schema.tests.forEach(fn => {
        next.test(fn.OPTIONS);
      });
    });
    combined.transforms = [...base.transforms, ...combined.transforms];
    return combined;
  }

  isType(v) {
    if (this.spec.nullable && v === null) return true;
    return this._typeCheck(v);
  }

  resolve(options) {
    let schema = this;

    if (schema.conditions.length) {
      let conditions = schema.conditions;
      schema = schema.clone();
      schema.conditions = [];
      schema = conditions.reduce((schema, condition) => condition.resolve(schema, options), schema);
      schema = schema.resolve(options);
    }

    return schema;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {*=} options.parent
   * @param {*=} options.context
   */


  cast(value, options = {}) {
    let resolvedSchema = this.resolve(_extends({
      value
    }, options));

    let result = resolvedSchema._cast(value, options);

    if (value !== undefined && options.assert !== false && resolvedSchema.isType(result) !== true) {
      let formattedValue = (0,_util_printValue__WEBPACK_IMPORTED_MODULE_5__["default"])(value);
      let formattedResult = (0,_util_printValue__WEBPACK_IMPORTED_MODULE_5__["default"])(result);
      throw new TypeError(`The value of ${options.path || 'field'} could not be cast to a value ` + `that satisfies the schema type: "${resolvedSchema._type}". \n\n` + `attempted value: ${formattedValue} \n` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ''));
    }

    return result;
  }

  _cast(rawValue, _options) {
    let value = rawValue === undefined ? rawValue : this.transforms.reduce((value, fn) => fn.call(this, value, rawValue, this), rawValue);

    if (value === undefined) {
      value = this.getDefault();
    }

    return value;
  }

  _validate(_value, options = {}, cb) {
    let {
      sync,
      path,
      from = [],
      originalValue = _value,
      strict = this.spec.strict,
      abortEarly = this.spec.abortEarly
    } = options;
    let value = _value;

    if (!strict) {
      // this._validating = true;
      value = this._cast(value, _extends({
        assert: false
      }, options)); // this._validating = false;
    } // value is cast, we can check if it meets type requirements


    let args = {
      value,
      path,
      options,
      originalValue,
      schema: this,
      label: this.spec.label,
      sync,
      from
    };
    let initialTests = [];
    if (this._typeError) initialTests.push(this._typeError);
    let finalTests = [];
    if (this._whitelistError) finalTests.push(this._whitelistError);
    if (this._blacklistError) finalTests.push(this._blacklistError);
    (0,_util_runTests__WEBPACK_IMPORTED_MODULE_3__["default"])({
      args,
      value,
      path,
      sync,
      tests: initialTests,
      endEarly: abortEarly
    }, err => {
      if (err) return void cb(err, value);
      (0,_util_runTests__WEBPACK_IMPORTED_MODULE_3__["default"])({
        tests: this.tests.concat(finalTests),
        args,
        path,
        sync,
        value,
        endEarly: abortEarly
      }, cb);
    });
  }

  validate(value, options, maybeCb) {
    let schema = this.resolve(_extends({}, options, {
      value
    })); // callback case is for nested validations

    return typeof maybeCb === 'function' ? schema._validate(value, options, maybeCb) : new Promise((resolve, reject) => schema._validate(value, options, (err, value) => {
      if (err) reject(err);else resolve(value);
    }));
  }

  validateSync(value, options) {
    let schema = this.resolve(_extends({}, options, {
      value
    }));
    let result;

    schema._validate(value, _extends({}, options, {
      sync: true
    }), (err, value) => {
      if (err) throw err;
      result = value;
    });

    return result;
  }

  isValid(value, options) {
    return this.validate(value, options).then(() => true, err => {
      if (_ValidationError__WEBPACK_IMPORTED_MODULE_8__["default"].isError(err)) return false;
      throw err;
    });
  }

  isValidSync(value, options) {
    try {
      this.validateSync(value, options);
      return true;
    } catch (err) {
      if (_ValidationError__WEBPACK_IMPORTED_MODULE_8__["default"].isError(err)) return false;
      throw err;
    }
  }

  _getDefault() {
    let defaultValue = this.spec.default;

    if (defaultValue == null) {
      return defaultValue;
    }

    return typeof defaultValue === 'function' ? defaultValue.call(this) : (0,nanoclone__WEBPACK_IMPORTED_MODULE_0__["default"])(defaultValue);
  }

  getDefault(options) {
    let schema = this.resolve(options || {});
    return schema._getDefault();
  }

  default(def) {
    if (arguments.length === 0) {
      return this._getDefault();
    }

    let next = this.clone({
      default: def
    });
    return next;
  }

  strict(isStrict = true) {
    let next = this.clone();
    next.spec.strict = isStrict;
    return next;
  }

  _isPresent(value) {
    return value != null;
  }

  defined(message = _locale__WEBPACK_IMPORTED_MODULE_1__.mixed.defined) {
    return this.test({
      message,
      name: 'defined',
      exclusive: true,

      test(value) {
        return value !== undefined;
      }

    });
  }

  required(message = _locale__WEBPACK_IMPORTED_MODULE_1__.mixed.required) {
    return this.clone({
      presence: 'required'
    }).withMutation(s => s.test({
      message,
      name: 'required',
      exclusive: true,

      test(value) {
        return this.schema._isPresent(value);
      }

    }));
  }

  notRequired() {
    let next = this.clone({
      presence: 'optional'
    });
    next.tests = next.tests.filter(test => test.OPTIONS.name !== 'required');
    return next;
  }

  nullable(isNullable = true) {
    let next = this.clone({
      nullable: isNullable !== false
    });
    return next;
  }

  transform(fn) {
    let next = this.clone();
    next.transforms.push(fn);
    return next;
  }
  /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */


  test(...args) {
    let opts;

    if (args.length === 1) {
      if (typeof args[0] === 'function') {
        opts = {
          test: args[0]
        };
      } else {
        opts = args[0];
      }
    } else if (args.length === 2) {
      opts = {
        name: args[0],
        test: args[1]
      };
    } else {
      opts = {
        name: args[0],
        message: args[1],
        test: args[2]
      };
    }

    if (opts.message === undefined) opts.message = _locale__WEBPACK_IMPORTED_MODULE_1__.mixed.default;
    if (typeof opts.test !== 'function') throw new TypeError('`test` is a required parameters');
    let next = this.clone();
    let validate = (0,_util_createValidation__WEBPACK_IMPORTED_MODULE_4__["default"])(opts);
    let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;

    if (opts.exclusive) {
      if (!opts.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test');
    }

    if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
    next.tests = next.tests.filter(fn => {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }

      return true;
    });
    next.tests.push(validate);
    return next;
  }

  when(keys, options) {
    if (!Array.isArray(keys) && typeof keys !== 'string') {
      options = keys;
      keys = '.';
    }

    let next = this.clone();
    let deps = (0,_util_toArray__WEBPACK_IMPORTED_MODULE_10__["default"])(keys).map(key => new _Reference__WEBPACK_IMPORTED_MODULE_6__["default"](key));
    deps.forEach(dep => {
      // @ts-ignore
      if (dep.isSibling) next.deps.push(dep.key);
    });
    next.conditions.push(new _Condition__WEBPACK_IMPORTED_MODULE_2__["default"](deps, options));
    return next;
  }

  typeError(message) {
    let next = this.clone();
    next._typeError = (0,_util_createValidation__WEBPACK_IMPORTED_MODULE_4__["default"])({
      message,
      name: 'typeError',

      test(value) {
        if (value !== undefined && !this.schema.isType(value)) return this.createError({
          params: {
            type: this.schema._type
          }
        });
        return true;
      }

    });
    return next;
  }

  oneOf(enums, message = _locale__WEBPACK_IMPORTED_MODULE_1__.mixed.oneOf) {
    let next = this.clone();
    enums.forEach(val => {
      next._whitelist.add(val);

      next._blacklist.delete(val);
    });
    next._whitelistError = (0,_util_createValidation__WEBPACK_IMPORTED_MODULE_4__["default"])({
      message,
      name: 'oneOf',

      test(value) {
        if (value === undefined) return true;
        let valids = this.schema._whitelist;
        let resolved = valids.resolveAll(this.resolve);
        return resolved.includes(value) ? true : this.createError({
          params: {
            values: valids.toArray().join(', '),
            resolved
          }
        });
      }

    });
    return next;
  }

  notOneOf(enums, message = _locale__WEBPACK_IMPORTED_MODULE_1__.mixed.notOneOf) {
    let next = this.clone();
    enums.forEach(val => {
      next._blacklist.add(val);

      next._whitelist.delete(val);
    });
    next._blacklistError = (0,_util_createValidation__WEBPACK_IMPORTED_MODULE_4__["default"])({
      message,
      name: 'notOneOf',

      test(value) {
        let invalids = this.schema._blacklist;
        let resolved = invalids.resolveAll(this.resolve);
        if (resolved.includes(value)) return this.createError({
          params: {
            values: invalids.toArray().join(', '),
            resolved
          }
        });
        return true;
      }

    });
    return next;
  }

  strip(strip = true) {
    let next = this.clone();
    next.spec.strip = strip;
    return next;
  }

  describe() {
    const next = this.clone();
    const {
      label,
      meta
    } = next.spec;
    const description = {
      meta,
      label,
      type: next.type,
      oneOf: next._whitelist.describe(),
      notOneOf: next._blacklist.describe(),
      tests: next.tests.map(fn => ({
        name: fn.OPTIONS.name,
        params: fn.OPTIONS.params
      })).filter((n, idx, list) => list.findIndex(c => c.name === n.name) === idx)
    };
    return description;
  }

} // eslint-disable-next-line @typescript-eslint/no-unused-vars

// @ts-expect-error
BaseSchema.prototype.__isYupSchema__ = true;

for (const method of ['validate', 'validateSync']) BaseSchema.prototype[`${method}At`] = function (path, value, options = {}) {
  const {
    parent,
    parentPath,
    schema
  } = (0,_util_reach__WEBPACK_IMPORTED_MODULE_7__.getIn)(this, path, value, options.context);
  return schema[method](parent && parent[parentPath], _extends({}, options, {
    parent,
    path
  }));
};

for (const alias of ['equals', 'is']) BaseSchema.prototype[alias] = BaseSchema.prototype.oneOf;

for (const alias of ['not', 'nope']) BaseSchema.prototype[alias] = BaseSchema.prototype.notOneOf;

BaseSchema.prototype.optional = BaseSchema.prototype.notRequired;

/***/ }),

/***/ "./node_modules/yup/es/setLocale.js":
/*!******************************************!*\
  !*** ./node_modules/yup/es/setLocale.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setLocale)
/* harmony export */ });
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");

function setLocale(custom) {
  Object.keys(custom).forEach(type => {
    // @ts-ignore
    Object.keys(custom[type]).forEach(method => {
      // @ts-ignore
      _locale__WEBPACK_IMPORTED_MODULE_0__["default"][type][method] = custom[type][method];
    });
  });
}

/***/ }),

/***/ "./node_modules/yup/es/string.js":
/*!***************************************!*\
  !*** ./node_modules/yup/es/string.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (/* binding */ StringSchema)
/* harmony export */ });
/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locale */ "./node_modules/yup/es/locale.js");
/* harmony import */ var _util_isAbsent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isAbsent */ "./node_modules/yup/es/util/isAbsent.js");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schema */ "./node_modules/yup/es/schema.js");


 // eslint-disable-next-line

let rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-next-line

let rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; // eslint-disable-next-line

let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

let isTrimmed = value => (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value === value.trim();

let objStringTag = {}.toString();
function create() {
  return new StringSchema();
}
class StringSchema extends _schema__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super({
      type: 'string'
    });
    this.withMutation(() => {
      this.transform(function (value) {
        if (this.isType(value)) return value;
        if (Array.isArray(value)) return value;
        const strValue = value != null && value.toString ? value.toString() : value;
        if (strValue === objStringTag) return value;
        return strValue;
      });
    });
  }

  _typeCheck(value) {
    if (value instanceof String) value = value.valueOf();
    return typeof value === 'string';
  }

  _isPresent(value) {
    return super._isPresent(value) && !!value.length;
  }

  length(length, message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.length) {
    return this.test({
      message,
      name: 'length',
      exclusive: true,
      params: {
        length
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value.length === this.resolve(length);
      }

    });
  }

  min(min, message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.min) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: {
        min
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value.length >= this.resolve(min);
      }

    });
  }

  max(max, message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.max) {
    return this.test({
      name: 'max',
      exclusive: true,
      message,
      params: {
        max
      },

      test(value) {
        return (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value.length <= this.resolve(max);
      }

    });
  }

  matches(regex, options) {
    let excludeEmptyString = false;
    let message;
    let name;

    if (options) {
      if (typeof options === 'object') {
        ({
          excludeEmptyString = false,
          message,
          name
        } = options);
      } else {
        message = options;
      }
    }

    return this.test({
      name: name || 'matches',
      message: message || _locale__WEBPACK_IMPORTED_MODULE_0__.string.matches,
      params: {
        regex
      },
      test: value => (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value === '' && excludeEmptyString || value.search(regex) !== -1
    });
  }

  email(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.email) {
    return this.matches(rEmail, {
      name: 'email',
      message,
      excludeEmptyString: true
    });
  }

  url(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.url) {
    return this.matches(rUrl, {
      name: 'url',
      message,
      excludeEmptyString: true
    });
  }

  uuid(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.uuid) {
    return this.matches(rUUID, {
      name: 'uuid',
      message,
      excludeEmptyString: false
    });
  } //-- transforms --


  ensure() {
    return this.default('').transform(val => val === null ? '' : val);
  }

  trim(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.trim) {
    return this.transform(val => val != null ? val.trim() : val).test({
      message,
      name: 'trim',
      test: isTrimmed
    });
  }

  lowercase(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.lowercase) {
    return this.transform(value => !(0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? value.toLowerCase() : value).test({
      message,
      name: 'string_case',
      exclusive: true,
      test: value => (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value === value.toLowerCase()
    });
  }

  uppercase(message = _locale__WEBPACK_IMPORTED_MODULE_0__.string.uppercase) {
    return this.transform(value => !(0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? value.toUpperCase() : value).test({
      message,
      name: 'string_case',
      exclusive: true,
      test: value => (0,_util_isAbsent__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || value === value.toUpperCase()
    });
  }

}
create.prototype = StringSchema.prototype; //
// String Interfaces
//

/***/ }),

/***/ "./node_modules/yup/es/util/ReferenceSet.js":
/*!**************************************************!*\
  !*** ./node_modules/yup/es/util/ReferenceSet.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ReferenceSet)
/* harmony export */ });
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Reference */ "./node_modules/yup/es/Reference.js");

class ReferenceSet {
  constructor() {
    this.list = void 0;
    this.refs = void 0;
    this.list = new Set();
    this.refs = new Map();
  }

  get size() {
    return this.list.size + this.refs.size;
  }

  describe() {
    const description = [];

    for (const item of this.list) description.push(item);

    for (const [, ref] of this.refs) description.push(ref.describe());

    return description;
  }

  toArray() {
    return Array.from(this.list).concat(Array.from(this.refs.values()));
  }

  resolveAll(resolve) {
    return this.toArray().reduce((acc, e) => acc.concat(_Reference__WEBPACK_IMPORTED_MODULE_0__["default"].isRef(e) ? resolve(e) : e), []);
  }

  add(value) {
    _Reference__WEBPACK_IMPORTED_MODULE_0__["default"].isRef(value) ? this.refs.set(value.key, value) : this.list.add(value);
  }

  delete(value) {
    _Reference__WEBPACK_IMPORTED_MODULE_0__["default"].isRef(value) ? this.refs.delete(value.key) : this.list.delete(value);
  }

  clone() {
    const next = new ReferenceSet();
    next.list = new Set(this.list);
    next.refs = new Map(this.refs);
    return next;
  }

  merge(newItems, removeItems) {
    const next = this.clone();
    newItems.list.forEach(value => next.add(value));
    newItems.refs.forEach(value => next.add(value));
    removeItems.list.forEach(value => next.delete(value));
    removeItems.refs.forEach(value => next.delete(value));
    return next;
  }

}

/***/ }),

/***/ "./node_modules/yup/es/util/createValidation.js":
/*!******************************************************!*\
  !*** ./node_modules/yup/es/util/createValidation.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createValidation)
/* harmony export */ });
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/mapValues */ "./node_modules/lodash/mapValues.js");
/* harmony import */ var lodash_mapValues__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_mapValues__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ValidationError */ "./node_modules/yup/es/ValidationError.js");
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Reference */ "./node_modules/yup/es/Reference.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




function createValidation(config) {
  function validate(_ref, cb) {
    let {
      value,
      path = '',
      label,
      options,
      originalValue,
      sync
    } = _ref,
        rest = _objectWithoutPropertiesLoose(_ref, ["value", "path", "label", "options", "originalValue", "sync"]);

    const {
      name,
      test,
      params,
      message
    } = config;
    let {
      parent,
      context
    } = options;

    function resolve(item) {
      return _Reference__WEBPACK_IMPORTED_MODULE_2__["default"].isRef(item) ? item.getValue(value, parent, context) : item;
    }

    function createError(overrides = {}) {
      const nextParams = lodash_mapValues__WEBPACK_IMPORTED_MODULE_0___default()(_extends({
        value,
        originalValue,
        label,
        path: overrides.path || path
      }, params, overrides.params), resolve);
      const error = new _ValidationError__WEBPACK_IMPORTED_MODULE_1__["default"](_ValidationError__WEBPACK_IMPORTED_MODULE_1__["default"].formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name);
      error.params = nextParams;
      return error;
    }

    let ctx = _extends({
      path,
      parent,
      type: name,
      createError,
      resolve,
      options,
      originalValue
    }, rest);

    if (!sync) {
      try {
        Promise.resolve(test.call(ctx, value, ctx)).then(validOrError => {
          if (_ValidationError__WEBPACK_IMPORTED_MODULE_1__["default"].isError(validOrError)) cb(validOrError);else if (!validOrError) cb(createError());else cb(null, validOrError);
        }).catch(cb);
      } catch (err) {
        cb(err);
      }

      return;
    }

    let result;

    try {
      var _ref2;

      result = test.call(ctx, value, ctx);

      if (typeof ((_ref2 = result) == null ? void 0 : _ref2.then) === 'function') {
        throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. ` + `This test will finish after the validate call has returned`);
      }
    } catch (err) {
      cb(err);
      return;
    }

    if (_ValidationError__WEBPACK_IMPORTED_MODULE_1__["default"].isError(result)) cb(result);else if (!result) cb(createError());else cb(null, result);
  }

  validate.OPTIONS = config;
  return validate;
}

/***/ }),

/***/ "./node_modules/yup/es/util/isAbsent.js":
/*!**********************************************!*\
  !*** ./node_modules/yup/es/util/isAbsent.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const isAbsent = value => value == null;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isAbsent);

/***/ }),

/***/ "./node_modules/yup/es/util/isSchema.js":
/*!**********************************************!*\
  !*** ./node_modules/yup/es/util/isSchema.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const isSchema = obj => obj && obj.__isYupSchema__;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSchema);

/***/ }),

/***/ "./node_modules/yup/es/util/isodate.js":
/*!*********************************************!*\
  !*** ./node_modules/yup/es/util/isodate.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseIsoDate)
/* harmony export */ });
/* eslint-disable */

/**
 *
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * NON-CONFORMANT EDITION.
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
//              1 YYYY                 2 MM        3 DD              4 HH     5 mm        6 ss            7 msec         8 Z 9 ±    10 tzHH    11 tzmm
var isoReg = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
function parseIsoDate(date) {
  var numericKeys = [1, 4, 5, 6, 7, 10, 11],
      minutesOffset = 0,
      timestamp,
      struct;

  if (struct = isoReg.exec(date)) {
    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
    for (var i = 0, k; k = numericKeys[i]; ++i) struct[k] = +struct[k] || 0; // allow undefined days and months


    struct[2] = (+struct[2] || 1) - 1;
    struct[3] = +struct[3] || 1; // allow arbitrary sub-second precision beyond milliseconds

    struct[7] = struct[7] ? String(struct[7]).substr(0, 3) : 0; // timestamps without timezone identifiers should be considered local time

    if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '')) timestamp = +new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);else {
      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];
        if (struct[9] === '+') minutesOffset = 0 - minutesOffset;
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    }
  } else timestamp = Date.parse ? Date.parse(date) : NaN;

  return timestamp;
}

/***/ }),

/***/ "./node_modules/yup/es/util/printValue.js":
/*!************************************************!*\
  !*** ./node_modules/yup/es/util/printValue.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ printValue)
/* harmony export */ });
const toString = Object.prototype.toString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => '';
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val) {
  if (val != +val) return 'NaN';
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : '' + val;
}

function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return '' + val;
  const typeOf = typeof val;
  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
  if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
  if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  const tag = toString.call(val).slice(8, -1);
  if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val);
  if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']';
  if (tag === 'RegExp') return regExpToString.call(val);
  return null;
}

function printValue(value, quoteStrings) {
  let result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(value, function (key, value) {
    let result = printSimpleValue(this[key], quoteStrings);
    if (result !== null) return result;
    return value;
  }, 2);
}

/***/ }),

/***/ "./node_modules/yup/es/util/reach.js":
/*!*******************************************!*\
  !*** ./node_modules/yup/es/util/reach.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getIn: () => (/* binding */ getIn)
/* harmony export */ });
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! property-expr */ "./node_modules/property-expr/index.js");
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(property_expr__WEBPACK_IMPORTED_MODULE_0__);


let trim = part => part.substr(0, part.length - 1).substr(1);

function getIn(schema, path, value, context = value) {
  let parent, lastPart, lastPartDebug; // root path: ''

  if (!path) return {
    parent,
    parentPath: path,
    schema
  };
  (0,property_expr__WEBPACK_IMPORTED_MODULE_0__.forEach)(path, (_part, isBracket, isArray) => {
    let part = isBracket ? trim(_part) : _part;
    schema = schema.resolve({
      context,
      parent,
      value
    });

    if (schema.innerType) {
      let idx = isArray ? parseInt(part, 10) : 0;

      if (value && idx >= value.length) {
        throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. ` + `because there is no value at that index. `);
      }

      parent = value;
      value = value && value[idx];
      schema = schema.innerType;
    } // sometimes the array index part of a path doesn't exist: "nested.arr.child"
    // in these cases the current part is the next schema and should be processed
    // in this iteration. For cases where the index signature is included this
    // check will fail and we'll handle the `child` part on the next iteration like normal


    if (!isArray) {
      if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. ` + `(failed at: ${lastPartDebug} which is a type: "${schema._type}")`);
      parent = value;
      value = value && value[part];
      schema = schema.fields[part];
    }

    lastPart = part;
    lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
  });
  return {
    schema,
    parent,
    parentPath: lastPart
  };
}

const reach = (obj, path, value, context) => getIn(obj, path, value, context).schema;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reach);

/***/ }),

/***/ "./node_modules/yup/es/util/runTests.js":
/*!**********************************************!*\
  !*** ./node_modules/yup/es/util/runTests.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runTests)
/* harmony export */ });
/* harmony import */ var _ValidationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ValidationError */ "./node_modules/yup/es/ValidationError.js");


const once = cb => {
  let fired = false;
  return (...args) => {
    if (fired) return;
    fired = true;
    cb(...args);
  };
};

function runTests(options, cb) {
  let {
    endEarly,
    tests,
    args,
    value,
    errors,
    sort,
    path
  } = options;
  let callback = once(cb);
  let count = tests.length;
  const nestedErrors = [];
  errors = errors ? errors : [];
  if (!count) return errors.length ? callback(new _ValidationError__WEBPACK_IMPORTED_MODULE_0__["default"](errors, value, path)) : callback(null, value);

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    test(args, function finishTestRun(err) {
      if (err) {
        // always return early for non validation errors
        if (!_ValidationError__WEBPACK_IMPORTED_MODULE_0__["default"].isError(err)) {
          return callback(err, value);
        }

        if (endEarly) {
          err.value = value;
          return callback(err, value);
        }

        nestedErrors.push(err);
      }

      if (--count <= 0) {
        if (nestedErrors.length) {
          if (sort) nestedErrors.sort(sort); //show parent errors after the nested ones: name.first, name

          if (errors.length) nestedErrors.push(...errors);
          errors = nestedErrors;
        }

        if (errors.length) {
          callback(new _ValidationError__WEBPACK_IMPORTED_MODULE_0__["default"](errors, value, path), value);
          return;
        }

        callback(null, value);
      }
    });
  }
}

/***/ }),

/***/ "./node_modules/yup/es/util/sortByKeyOrder.js":
/*!****************************************************!*\
  !*** ./node_modules/yup/es/util/sortByKeyOrder.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortByKeyOrder)
/* harmony export */ });
function findIndex(arr, err) {
  let idx = Infinity;
  arr.some((key, ii) => {
    var _err$path;

    if (((_err$path = err.path) == null ? void 0 : _err$path.indexOf(key)) !== -1) {
      idx = ii;
      return true;
    }
  });
  return idx;
}

function sortByKeyOrder(keys) {
  return (a, b) => {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}

/***/ }),

/***/ "./node_modules/yup/es/util/sortFields.js":
/*!************************************************!*\
  !*** ./node_modules/yup/es/util/sortFields.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortFields)
/* harmony export */ });
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js");
/* harmony import */ var lodash_has__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_has__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var toposort__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! toposort */ "./node_modules/toposort/index.js");
/* harmony import */ var toposort__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(toposort__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! property-expr */ "./node_modules/property-expr/index.js");
/* harmony import */ var property_expr__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(property_expr__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Reference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Reference */ "./node_modules/yup/es/Reference.js");
/* harmony import */ var _isSchema__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isSchema */ "./node_modules/yup/es/util/isSchema.js");
 // @ts-expect-error





function sortFields(fields, excludedEdges = []) {
  let edges = [];
  let nodes = new Set();
  let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));

  function addNode(depPath, key) {
    let node = (0,property_expr__WEBPACK_IMPORTED_MODULE_2__.split)(depPath)[0];
    nodes.add(node);
    if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
  }

  for (const key in fields) if (lodash_has__WEBPACK_IMPORTED_MODULE_0___default()(fields, key)) {
    let value = fields[key];
    nodes.add(key);
    if (_Reference__WEBPACK_IMPORTED_MODULE_3__["default"].isRef(value) && value.isSibling) addNode(value.path, key);else if ((0,_isSchema__WEBPACK_IMPORTED_MODULE_4__["default"])(value) && 'deps' in value) value.deps.forEach(path => addNode(path, key));
  }

  return toposort__WEBPACK_IMPORTED_MODULE_1___default().array(Array.from(nodes), edges).reverse();
}

/***/ }),

/***/ "./node_modules/yup/es/util/toArray.js":
/*!*********************************************!*\
  !*** ./node_modules/yup/es/util/toArray.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toArray)
/* harmony export */ });
function toArray(value) {
  return value == null ? [] : [].concat(value);
}

/***/ }),

/***/ "./src/agents/agent.js":
/*!*****************************!*\
  !*** ./src/agents/agent.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Agent: () => (/* binding */ Agent)
/* harmony export */ });
/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../observer */ "./src/observer.js");


/**
 *
 *  Abstract agent class with default functions.
 * 
 */
class Agent {
  // the name of the agent
  name = "";

  // debug field to turn on
  // or off logging functionality
  debug = false;

  /**
   *
   * Sets the name and the debug
   * state of the agent.
   *
   */
  constructor(name, debug) {
    this.name = name;
    this.debug = debug;
  }

  /**
   *
   * Returns the name of the agent.
   *
   */
  get name() {
    return this.name;
  }

  /**
   *
   * Returns the current debug 
   * state of the agent.
   * 
   */
  get debug() {
    return this.debug;
  }

  /**
   *
   * This function is a wrapper around 
   * the log function of the observer class.
   *
   */
  log(messages) {
    if (this.debug) {
      (0,_observer__WEBPACK_IMPORTED_MODULE_0__.log)(messages, this.name);
    }
    return () => {};
  }

  /**
   *
   *
   */
  sendMessage(message) {
    if (!message.hasOwnProperty("sender")) {
      message["sender"] = this.name;
    }
    return (0,_observer__WEBPACK_IMPORTED_MODULE_0__.observeMessages)(message);
  }
}


/***/ }),

/***/ "./src/agents/eventAgent/index.js":
/*!****************************************!*\
  !*** ./src/agents/eventAgent/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventAgent: () => (/* binding */ EventAgent)
/* harmony export */ });
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../agent */ "./src/agents/agent.js");
/* harmony import */ var _observer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../observer.js */ "./src/observer.js");



class EventAgent extends _agent__WEBPACK_IMPORTED_MODULE_0__.Agent {
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
  init = async () => {};

  /**
   * The interface to communicate with this agent.
   * @param {String} command the name of the function the agent should execute
   * @param {Object} data the data that gets passed along to the function
   */
  recieve(command, data, tabId) {
    switch (command) {
      case "hasEvent":
        return this.hasEvent(tabId);
      default:
        this.log(["Unknown command."]);
        break;
    }
  }

  /**
   * Send a message to a browser tab with given tabId.
   * Not working as of now.
   * @param {Number} tabId
   * @param {Object} message
   */
  async send(tabId, message) {
    await browser.tabs.sendMessage(tabId, message);
  }

  /**
   * Searches for an event in the email body of a tab.
   * @param {Number} tabId The tab id to query the displayed message.
   */
  async hasEvent(tabId) {
    // get the current message from the given tab
    const messageHeader = await browser.messageDisplay.getDisplayedMessage(
      tabId
    );

    if (messageHeader) {
      const emailBody = await this.getEmailBody(messageHeader.id, "plain");
      const events = await this.searchForEvents(
        emailBody,
        messageHeader.id,
        messageHeader.subject
      );
      console.log(events);
      return events || [];
    }
  }

  /**
   *
   * Searches for an event inside a given text.
   *
   * @param {String} emailbody The email text.
   * @param {Number} mailId The id of the email.
   * @param {String} subject The subject of the email.
   * @returns {Array} events
   */
  async searchForEvents(emailbody, mailId, subject) {
    const rules = await _observer_js__WEBPACK_IMPORTED_MODULE_1__.observeMessages({
      command: "getAllRules",
      reciever: "OptionsAgent",
      sender: "EventAgent",
    });

    let events = [];
    rules.every((pattern) => {
      if (pattern.enabled) {
        events = this.testPattern(emailbody, pattern);
        if (events && events.length > 0) {
          //exit loop
          return false;
        }
      }
      //continue
      return true;
    });

    events.forEach((evt) => {
      (evt["mailID"] = mailId), (evt["subject"] = subject);
    });
    return events;
  }

  /**
   * Tests given regular expression and returns a result.
   * @param {String} emailbody
   * @param {Object} regex
   */
  testPattern(emailbody, regex) {
    const re = new RegExp(regex.pattern, "gm");
    let match;
    let allMatches = [];
    while ((match = re.exec(emailbody)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === re.lastIndex) {
        re.lastIndex++;
      }
      match["pattern"] = regex.pattern;
      if (!this.findDuplicateEvents(allMatches, match)) {
        allMatches.push(Object.assign({}, match));
      }
    }
    let debugstr = [];
    allMatches.every((arr) => debugstr.push(arr[0]));
    this.log([
      allMatches.length +
        " match" +
        (allMatches.length > 1 ? "es" : "") +
        ". [" +
        debugstr.join("|") +
        "]",
    ]);
    return allMatches;
  }

  /**
   * Returns true if the event is already in
   * the events array. Returns false otherwise.
   * @param {Array} events Array of event objects.
   * @param {Object} event The event to find a duplicate of.
   * @returns {Boolean}
   */
  findDuplicateEvents(events, event) {
    return events.find((evt) => {
      // console.log(evt[0] + "==" + event[0] + ":" + (evt[0] == event[0]));
      return evt[0] == event[0];
    });
  }

  /**
   * Validates and extracts message body.
   * @param {MessagePart} messagepart The part of the message to find
   * @param {Object} body
   */
  extractMessage(messagepart, body) {
    if (!body) {
      body = {};
    }
    if ("parts" in messagepart) {
      for (let index = 0; index < messagepart.parts.length; index++) {
        this.extractMessage(messagepart.parts[index], body);
      }
    }
    if (messagepart.hasOwnProperty("body")) {
      if (
        messagepart.hasOwnProperty("contentType") &&
        messagepart.contentType === "text/plain"
      ) {
        body.plain = messagepart.body;
      } else if (
        messagepart.hasOwnProperty("contentType") &&
        messagepart.contentType === "text/html"
      ) {
        body.html = messagepart.body;
      }
    }
    return body;
  }

  /**
   * Gets the corresponding email to the message id,
   * extracts the actual message and returns data
   * based on the value of the format variable.
   * 'plain' and 'html' are possible format options.
   * @param {Number} messageId
   * @param {String} format
   */
  async getEmailBody(messageId, format) {
    let body = await browser.messages
      .getFull(messageId)
      .then((messagepart) => this.extractMessage(messagepart));
    return format === "plain" ? body.plain : format === "html" ? body.html : "";
  }
}


/***/ }),

/***/ "./src/agents/optionsAgent/index.js":
/*!******************************************!*\
  !*** ./src/agents/optionsAgent/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OptionsAgent: () => (/* binding */ OptionsAgent)
/* harmony export */ });
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../agent */ "./src/agents/agent.js");
/* harmony import */ var _knowledgebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../knowledgebase */ "./src/knowledgebase.js");



class OptionsAgent extends _agent__WEBPACK_IMPORTED_MODULE_0__.Agent {
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
    await this.set("db", _knowledgebase__WEBPACK_IMPORTED_MODULE_1__.defaultKnowledgebase);
    browser.myapi.writeJson(_knowledgebase__WEBPACK_IMPORTED_MODULE_1__.defaultKnowledgebase, "db");
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
    await this.set("db", _knowledgebase__WEBPACK_IMPORTED_MODULE_1__.defaultKnowledgebase);
    await browser.myapi.writeJson(_knowledgebase__WEBPACK_IMPORTED_MODULE_1__.defaultKnowledgebase, "db");
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

/***/ }),

/***/ "./src/agents/outputAgent/index.js":
/*!*****************************************!*\
  !*** ./src/agents/outputAgent/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OutputAgent: () => (/* binding */ OutputAgent)
/* harmony export */ });
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../agent */ "./src/agents/agent.js");
/* harmony import */ var ics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ics */ "./node_modules/ics/dist/index.js");
/* harmony import */ var any_date_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! any-date-parser */ "./node_modules/any-date-parser/index.js");
/* harmony import */ var any_date_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(any_date_parser__WEBPACK_IMPORTED_MODULE_2__);

 // https://github.com/adamgibbons/ics
 //https://github.com/kensnyder/any-date-parser

class OutputAgent extends _agent__WEBPACK_IMPORTED_MODULE_0__.Agent {
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
      const parsedDate = any_date_parser__WEBPACK_IMPORTED_MODULE_2__.fromString(event[0]);
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
      const parsedDate = any_date_parser__WEBPACK_IMPORTED_MODULE_2__.fromString(event[0]);
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

    const arr = ics__WEBPACK_IMPORTED_MODULE_1__.convertTimestampToArray(date);
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
    const { error, value } = ics__WEBPACK_IMPORTED_MODULE_1__.createEvent(eventproperties);
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


/***/ }),

/***/ "./src/environment.js":
/*!****************************!*\
  !*** ./src/environment.js ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _observer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./observer.js */ "./src/observer.js");
/* harmony import */ var _agents_eventAgent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./agents/eventAgent */ "./src/agents/eventAgent/index.js");
/* harmony import */ var _agents_optionsAgent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./agents/optionsAgent */ "./src/agents/optionsAgent/index.js");
/* harmony import */ var _agents_outputAgent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./agents/outputAgent */ "./src/agents/outputAgent/index.js");





/**
 * Main function that gets called whenever Thunderbird has finished
 * loading the DOM.
 *
 * In Thunderbird, all WebExtension API can be accessed through the
 * browser.* namespace, as with Firefox, but also through the
 * messenger.* namespace, which is a better fit for Thunderbird.
 */
const init = async () => {
  
  /**
   * Use the startup phase to tell Thunderbird that it should load
   * the Display Agent whenever a message is displayed
   * Required permissions: [messagesModify]
   *
   */
  messenger.messageDisplayScripts.register({
    js: [{ file: "./output/index.js" }],
    css: [{ file: "./output/index.css" }],
  });

  // Registers all needed agents

  // OptionsAgent
  const optionsAgent = new _agents_optionsAgent__WEBPACK_IMPORTED_MODULE_2__.OptionsAgent("OptionsAgent", true);
  _observer_js__WEBPACK_IMPORTED_MODULE_0__.registerAgent("OptionsAgent", optionsAgent);

  // EventAgent
  const eventAgent = new _agents_eventAgent__WEBPACK_IMPORTED_MODULE_1__.EventAgent("EventAgent", true);
  _observer_js__WEBPACK_IMPORTED_MODULE_0__.registerAgent("EventAgent", eventAgent);

  // OutputAgent
  const outputAgent = new _agents_outputAgent__WEBPACK_IMPORTED_MODULE_3__.OutputAgent("OutputAgent", true);
  _observer_js__WEBPACK_IMPORTED_MODULE_0__.registerAgent("OutputAgent", outputAgent);

  /**
   * Add a handler for communication with other parts of the extension,
   * like the messageDisplayScript.
   *
   * There should be only one handler in the background script
   * for all incoming messages.
   */
  messenger.runtime.onMessage.addListener(_observer_js__WEBPACK_IMPORTED_MODULE_0__.observeMessages);

  await optionsAgent.init();
  await outputAgent.init();
  await eventAgent.init();
};

/**
 * Execute the startup handler whenever Thunderbird has finished
 * loading the DOM
 */
await document.addEventListener("DOMContentLoaded", init);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./src/knowledgebase.js":
/*!******************************!*\
  !*** ./src/knowledgebase.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultKnowledgebase: () => (/* binding */ defaultKnowledgebase)
/* harmony export */ });
/**
 * The fallback rules for the webextension.
 */
const defaultKnowledgebase = {
  de: {
    1: {
      enabled: true,
      pattern:
        "(?<day>[0-3]?[0-9])[.](?<month>[0-3]?[0-9])[.](?<year>(?:[0-9]{2})?[0-9]{2})",
      example: "7.1.2018",
    },
    2: {
      enabled: true,
      pattern:
        "(?<day>[0-3]?[0-9])[.](?<month>[0-3]?[0-9])[.](?<year>(?:[0-9][0-9])?[0-9][0-9])",
      example: ["07.01.2018"],
    },
    3: {
      enabled: true,
      pattern:
        "(?<year>(?:[0-9][0-9])?[0-9][0-9])[-]{1}(?<month>[0-3][0-9])[-]{1}(?<day>[0-3][0-9])",
      example: ["2018-01-07"],
    },
    4: {
      enabled: true,
      pattern:
        "(?<day>[0-3]?[0-9])[.]\\s?(?<month>Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\\s?(?<year>(?:[0-9][0-9])?[0-9][0-9])",
      matches: [],
      example: ["7. Januar 2018"],
    },
  },
  en: {
    1: {
      enabled: true,
      pattern:
        "(?<month>[0-1][0-9])[/](?<day>[0-3][0-9])[/](?<year>(?:[0-9][0-9])?[0-9][0-9])\\s?[0-2][0-9][:]{1}[0-5][0-9]\\s?[A|P][M]",
      example: "04/25/2001 11:48 AM",
    },
  },
};


/***/ }),

/***/ "./src/observer.js":
/*!*************************!*\
  !*** ./src/observer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   observeMessages: () => (/* binding */ observeMessages),
/* harmony export */   registerAgent: () => (/* binding */ registerAgent)
/* harmony export */ });
/**
 *
 * The observer class provides the log function
 * that gets injected into every agent and is used
 * for logging purpose when agents communicate between
 * eachother.
 * 
 */

// the agents that were registered
let agents = {};


/**
 * 
 * @param {Array[]} messages Messages that getting logged to console.
 * @param {String} source Name of the source that is logging the messages.
 * 
 */
const log = async (messages, source) => {
  messages.forEach((message) =>
    console.log(
      "[" +
        new Date().toLocaleTimeString() +
        "]" +
        (source ? "[" + source + "]" : "") +
        ": ",
      message
    )
  );
};

/**
 * 
 * Register an agent so the observer has access
 * to its communication.
 * @param {String} name Name of the agent.
 * @param {Object} agent The agent object.
 */
const registerAgent = (name, agent) => {
  agents[name] = agent;
};


/**
 * 
 * Handles the commands received from an observed message
 * of one of the agents.
 * @param {Object} message The message object for communication with agents.
 * @param {Number} tabId Optional tab id of initiating agent.
 */
const doHandleCommand = async (message, tabId) => {
  let { command, reciever, sender, data } = message;

  switch (command) {
    case "log":
      log([message.text], "Observer");
      return;
    default:
      log([sender + " -> " + command + " -> " + reciever], "Observer");
      if (data) {
        log([data], "Observer");
      }
      break;
  }

  if (reciever) {
    return agents[reciever].recieve(command, data, tabId);
  } else {
    log(["No reciever specified."], "Observer");
  }
};

/**
 * 
 * Handle the received message by filtering for all messages
 * whose "type" property is set to "command".
 * @param {Object} message The message object for communication with agents.
 * @param {Object} sender The sender object.
 * @see https://developer.thunderbird.net/add-ons/hello-world-add-on/using-content-scripts#receiving-a-runtime-message
 */
const observeMessages = (message, sender) => {
  if (message && message.hasOwnProperty("command")) {
    // The parameter tabId is necessary for the event agent
    // for querying the email content of the active and shown tab
    const tabId = sender?.tab?.id;
    return doHandleCommand(message, tabId);
  }
};




/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customAlphabet: () => (/* binding */ customAlphabet),
/* harmony export */   customRandom: () => (/* binding */ customRandom),
/* harmony export */   nanoid: () => (/* binding */ nanoid),
/* harmony export */   random: () => (/* binding */ random),
/* harmony export */   urlAlphabet: () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./node_modules/nanoid/url-alphabet/index.js");

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')



/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   urlAlphabet: () => (/* binding */ urlAlphabet)
/* harmony export */ });
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/environment.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaE1BO0FBQ0E7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ1ZBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7QUFDL0Msc0JBQXNCLG1CQUFPLENBQUMsNkZBQTZCOztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNsREEsZUFBZSxtQkFBTyxDQUFDLG1GQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNsQkEsZUFBZSxtQkFBTyxDQUFDLG1GQUF3QjtBQUMvQyxxQkFBcUIsbUJBQU8sQ0FBQywyR0FBb0M7QUFDakUsUUFBUSxrQkFBa0IsRUFBRSxtQkFBTyxDQUFDLG1HQUFnQzs7QUFFcEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxhQUFhLEdBQUcsSUFBSSxhQUFhLEdBQUcsSUFBSTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxrQkFBa0I7QUFDbEQsRUFBRTtBQUNGLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDckJBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ1RBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ1RBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ1RBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ1RBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0EsaUNBQWlDLEVBQUU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNwQkEsZUFBZSxtQkFBTyxDQUFDLG1GQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzdCQSxlQUFlLG1CQUFPLENBQUMsbUZBQXdCOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNUQSxlQUFlLG1CQUFPLENBQUMsbUZBQXdCOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNUQSxlQUFlLG1CQUFPLENBQUMsbUZBQXdCOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNUQSxxQkFBcUIsbUJBQU8sQ0FBQywyR0FBb0M7QUFDakUsZUFBZSxtQkFBTyxDQUFDLG1GQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUN6Q0EscUJBQXFCLG1CQUFPLENBQUMsMkdBQW9DO0FBQ2pFLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7QUFDL0Msc0JBQXNCLG1CQUFPLENBQUMsNkZBQTZCOztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUN0Q0EsZUFBZSxtQkFBTyxDQUFDLG1GQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDaENBLGVBQWUsbUJBQU8sQ0FBQyxtRkFBd0I7O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDVkEsZUFBZSxtQkFBTyxDQUFDLG1GQUF3Qjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQy9CYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCLGNBQWMsbUJBQU8sQ0FBQyxzREFBUTs7QUFFOUIsYUFBYSxtQkFBTyxDQUFDLHVEQUFTOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7Ozs7Ozs7Ozs7O0FDcEJMOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQztBQUNGLCtCQUErQjtBQUMvQixtQkFBbUI7QUFDbkIsb0JBQW9COztBQUVwQixjQUFjLG1CQUFPLENBQUMsc0RBQVE7O0FBRTlCLGdCQUFnQixtQkFBTyxDQUFDLDZEQUFZOztBQUVwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7OztBQUdKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7OztBQzFLYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCLHVDQUF1QyxtQkFBTyxDQUFDLHdEQUFhOztBQUU1RCx1Q0FBdUMsdUNBQXVDOztBQUU5RSw0Q0FBNEMsa0JBQWtCLGtDQUFrQyxvRUFBb0UsS0FBSyxPQUFPLG9CQUFvQjs7QUFFcE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QywrQkFBK0IscUNBQXFDOztBQUVwRTtBQUNBLDZEQUE2RDtBQUM3RCxHQUFHLElBQUk7QUFDUDs7Ozs7Ozs7Ozs7QUM1Q2E7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQixhQUFhLG1CQUFPLENBQUMsd0RBQVU7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEOztBQUVyRCwrREFBK0Qsb0hBQW9IOztBQUVuTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7O0FBRTlEO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2hHYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRiw4Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7QUFDRiwrQ0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7QUFDRixpREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7O0FBRUYsb0NBQW9DLG1CQUFPLENBQUMsMERBQVM7O0FBRXJELHFDQUFxQyxtQkFBTyxDQUFDLDREQUFVOztBQUV2RCx1Q0FBdUMsbUJBQU8sQ0FBQyxnRUFBWTs7QUFFM0QsdUNBQXVDLHVDQUF1Qzs7Ozs7Ozs7Ozs7QUM5QmpFOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQztBQUNGLGtCQUFrQjs7QUFFbEIscUNBQXFDLG1CQUFPLENBQUMsMERBQVc7O0FBRXhELHVDQUF1Qyx1Q0FBdUM7O0FBRTlFO0FBQ0Esa0JBQWtCOzs7Ozs7Ozs7OztBQ1pMOztBQUViLHdCQUF3QiwyQkFBMkIsMkVBQTJFLGtDQUFrQyx3QkFBd0IsT0FBTyxrQ0FBa0MsbUlBQW1JOztBQUVwVyw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCLGtDQUFrQyxtQkFBTyxDQUFDLDJDQUFLOztBQUUvQyxzQ0FBc0MsZ0RBQWdELDJCQUEyQixpRUFBaUUsaUJBQWlCOztBQUVuTSx3Q0FBd0MsNkJBQTZCLGNBQWMsOEVBQThFLFNBQVMsb0JBQW9CLHdDQUF3QywrQkFBK0IseUJBQXlCLGlCQUFpQixzRkFBc0YsdUJBQXVCLHNEQUFzRCxxRkFBcUYsc0NBQXNDLDRDQUE0QyxPQUFPLDhCQUE4Qix5QkFBeUIsYUFBYSwwQkFBMEI7O0FBRTl0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRHQUE0RyxJQUFJLG9CQUFvQixFQUFFLG9LQUFvSyxJQUFJO0FBQzlTO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3BIYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNuQmE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQixrQ0FBa0M7O0FBRWxDLDhCQUE4Qjs7QUFFOUIsa0RBQWtELGdCQUFnQixnRUFBZ0Usd0RBQXdELDZEQUE2RCxzREFBc0Q7O0FBRTdTLHVDQUF1Qyx1REFBdUQsdUNBQXVDLFNBQVMsT0FBTyxvQkFBb0I7O0FBRXpLLHlDQUF5QyxnRkFBZ0YsZUFBZSxlQUFlLGdCQUFnQixvQkFBb0IsTUFBTSwwQ0FBMEMsK0JBQStCLGFBQWEscUJBQXFCLHVDQUF1QyxjQUFjLFdBQVcsWUFBWSxVQUFVLE1BQU0sbURBQW1ELFVBQVUsc0JBQXNCOztBQUUzZCxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUMvRGE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN0QmE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQjtBQUNBLDBFQUEwRSxTQUFTO0FBQ25GOzs7Ozs7Ozs7OztBQ1RhOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQztBQUNGLDhDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLGtEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLDhDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLGdEQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLDRDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLGtEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLDhDQUE2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLGtEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLDRDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGLCtDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQzs7QUFFRix5Q0FBeUMsbUJBQU8sQ0FBQyxtRUFBZTs7QUFFaEUsNkNBQTZDLG1CQUFPLENBQUMsMkVBQW1COztBQUV4RSx5Q0FBeUMsbUJBQU8sQ0FBQyxtRUFBZTs7QUFFaEUsMkNBQTJDLG1CQUFPLENBQUMsdUVBQWlCOztBQUVwRSx1Q0FBdUMsbUJBQU8sQ0FBQywrREFBYTs7QUFFNUQsNkNBQTZDLG1CQUFPLENBQUMsMkVBQW1COztBQUV4RSx5Q0FBeUMsbUJBQU8sQ0FBQyxtRUFBZTs7QUFFaEUsNkNBQTZDLG1CQUFPLENBQUMsMkVBQW1COztBQUV4RSx1Q0FBdUMsbUJBQU8sQ0FBQywrREFBYTs7QUFFNUQsMENBQTBDLG1CQUFPLENBQUMscUVBQWdCOztBQUVsRSx1Q0FBdUMsdUNBQXVDOzs7Ozs7Ozs7OztBQ3RGakU7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQix5Q0FBeUMsbUJBQU8sQ0FBQyxtRUFBZTs7QUFFaEUsdUNBQXVDLG1CQUFPLENBQUMsK0RBQWE7O0FBRTVELHVDQUF1Qyx1Q0FBdUM7O0FBRTlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsK0JBQStCO0FBQy9CLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3RFYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsZ0JBQWdCO0FBQ3pELHFEQUFxRDtBQUNyRCxpRUFBaUU7QUFDakUsa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdkJhOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQztBQUNGLGtCQUFrQjs7QUFFbEIseUNBQXlDLG1CQUFPLENBQUMsbUVBQWU7O0FBRWhFLHVDQUF1Qyx1Q0FBdUM7O0FBRTlFO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNiYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjs7Ozs7Ozs7Ozs7QUNYYTs7QUFFYiw4Q0FBNkM7QUFDN0M7QUFDQSxDQUFDLEVBQUM7QUFDRixrQkFBa0I7O0FBRWxCLHlDQUF5QyxtQkFBTyxDQUFDLG1FQUFlOztBQUVoRSx1Q0FBdUMsdUNBQXVDOztBQUU5RTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDYmE7O0FBRWIsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Ysa0JBQWtCOztBQUVsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDakJhOztBQUViLDhDQUE2QztBQUM3QztBQUNBLENBQUMsRUFBQztBQUNGLGtCQUFrQjs7QUFFbEIseUNBQXlDLG1CQUFPLENBQUMsbUVBQWU7O0FBRWhFLHVDQUF1Qyx1Q0FBdUM7O0FBRTlFO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNOQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxjQUFjLG1CQUFPLENBQUMscURBQVk7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQy9CQSxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsc0JBQXNCLG1CQUFPLENBQUMscUVBQW9CO0FBQ2xELG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDL0JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNOQSxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDOUMscUJBQXFCLG1CQUFPLENBQUMsbUVBQW1CO0FBQ2hELGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDL0JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNOQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTkEsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMxQkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzFCQSxXQUFXLG1CQUFPLENBQUMsK0NBQVM7O0FBRTVCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDTEEsV0FBVyxtQkFBTyxDQUFDLCtDQUFTOztBQUU1QjtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ0xBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDeEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLGtCQUFrQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3pDLGNBQWMsbUJBQU8sQ0FBQyxtREFBVztBQUNqQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsR0FBRztBQUNkLFdBQVcsU0FBUztBQUNwQjtBQUNBLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ1hBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2RBLFNBQVMsbUJBQU8sQ0FBQyx5Q0FBTTs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQSxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN4QkEsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNmQSxjQUFjLG1CQUFPLENBQUMscURBQVk7QUFDbEMsV0FBVyxtQkFBTyxDQUFDLDZDQUFROztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxZQUFZLG1CQUFPLENBQUMsaURBQVU7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN2QkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkEsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjs7QUFFaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzNCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNaQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLEdBQUc7QUFDZCxXQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzNCQSxZQUFZLG1CQUFPLENBQUMsaURBQVU7QUFDOUIsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxhQUFhLG1CQUFPLENBQUMsbURBQVc7QUFDaEMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTtBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQyw2REFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixXQUFXLFVBQVU7QUFDckIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2xGQSxZQUFZLG1CQUFPLENBQUMsaURBQVU7QUFDOUIsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCOztBQUUxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQixXQUFXLFVBQVU7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDN0RBLGlCQUFpQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3ZDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzlDQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDM0RBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQywwQkFBMEIsbUJBQU8sQ0FBQyw2RUFBd0I7QUFDMUQsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGNBQWMsbUJBQU8sQ0FBQyxtREFBVztBQUNqQyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDOUJBLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM3QkEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1Qyw4QkFBOEIsbUJBQU8sQ0FBQyxxRkFBNEI7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyQkEsa0JBQWtCLG1CQUFPLENBQUMsNkRBQWdCO0FBQzFDLFVBQVUsbUJBQU8sQ0FBQywyQ0FBTztBQUN6QixZQUFZLG1CQUFPLENBQUMsK0NBQVM7QUFDN0IsWUFBWSxtQkFBTyxDQUFDLGlEQUFVO0FBQzlCLHlCQUF5QixtQkFBTyxDQUFDLDJFQUF1QjtBQUN4RCw4QkFBOEIsbUJBQU8sQ0FBQyxxRkFBNEI7QUFDbEUsWUFBWSxtQkFBTyxDQUFDLGlEQUFVOztBQUU5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQSxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkEsYUFBYSxtQkFBTyxDQUFDLG1EQUFXO0FBQ2hDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTtBQUNwQyxjQUFjLG1CQUFPLENBQUMsbURBQVc7QUFDakMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDWkEsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcEJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLFdBQVcsbUJBQU8sQ0FBQywrQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3hCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDOUMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFVBQVU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hDQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsYUFBYSxtQkFBTyxDQUFDLGlEQUFVO0FBQy9CLFlBQVksbUJBQU8sQ0FBQywrQ0FBUzs7QUFFN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdkJBLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEVBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQSxJQUFJO0FBQ0osQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNWQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7QUFDdEMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsVUFBVTtBQUNyQixXQUFXLFVBQVU7QUFDckIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25GQSxhQUFhLG1CQUFPLENBQUMsbURBQVc7QUFDaEMsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsU0FBUyxtQkFBTyxDQUFDLHlDQUFNO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLDZEQUFnQjtBQUMxQyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDL0dBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6RkE7QUFDQSx3QkFBd0IscUJBQU0sZ0JBQWdCLHFCQUFNLElBQUkscUJBQU0sc0JBQXNCLHFCQUFNOztBQUUxRjs7Ozs7Ozs7Ozs7QUNIQSxxQkFBcUIsbUJBQU8sQ0FBQyxtRUFBbUI7QUFDaEQsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsV0FBVyxtQkFBTyxDQUFDLDZDQUFROztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkEsZ0JBQWdCLG1CQUFPLENBQUMseURBQWM7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLHlCQUF5QixtQkFBTyxDQUFDLDJFQUF1QjtBQUN4RCxXQUFXLG1CQUFPLENBQUMsNkNBQVE7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdkJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjtBQUM1QyxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNoQkEsYUFBYSxtQkFBTyxDQUFDLG1EQUFXOztBQUVoQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdDQSxrQkFBa0IsbUJBQU8sQ0FBQyw2REFBZ0I7QUFDMUMsZ0JBQWdCLG1CQUFPLENBQUMsdURBQWE7O0FBRXJDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7Ozs7OztBQzdCQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsVUFBVSxtQkFBTyxDQUFDLDZDQUFRO0FBQzFCLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxVQUFVLG1CQUFPLENBQUMsNkNBQVE7QUFDMUIsY0FBYyxtQkFBTyxDQUFDLHFEQUFZO0FBQ2xDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLGVBQWUsbUJBQU8sQ0FBQyx1REFBYTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNaQSxlQUFlLG1CQUFPLENBQUMsdURBQWE7QUFDcEMsa0JBQWtCLG1CQUFPLENBQUMsMkRBQWU7QUFDekMsY0FBYyxtQkFBTyxDQUFDLG1EQUFXO0FBQ2pDLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsWUFBWSxtQkFBTyxDQUFDLGlEQUFVOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGNBQWM7QUFDekIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekJBO0FBQ0EseUNBQXlDLEVBQUU7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNkQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLEdBQUc7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzdCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3RCQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDeEJBLGNBQWMsbUJBQU8sQ0FBQyxtREFBVztBQUNqQyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2RBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25CQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLGVBQWUsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ1pBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbENBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2xCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZkEsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN6QkEsV0FBVyxtQkFBTyxDQUFDLCtDQUFTO0FBQzVCLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFVBQVUsbUJBQU8sQ0FBQyw2Q0FBUTs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQkEsY0FBYyxtQkFBTyxDQUFDLG1EQUFXOztBQUVqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsYUFBYSxVQUFVO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDekJBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjOztBQUV0QztBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ0xBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTs7QUFFbEM7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDTEEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXhDO0FBQ0Esa0JBQWtCLEtBQTBCOztBQUU1QztBQUNBLGdDQUFnQyxRQUFhOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSixDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzdCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDZEEsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNSQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pCQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2JBLGdCQUFnQixtQkFBTyxDQUFDLHlEQUFjO0FBQ3RDLFVBQVUsbUJBQU8sQ0FBQyw2Q0FBUTtBQUMxQixlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQ0EsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCO0FBQzVDLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNqQkEsb0JBQW9CLG1CQUFPLENBQUMsaUVBQWtCOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzFCQSxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsRUFBRTtBQUNqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsRUFBRTtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BFQSxpQkFBaUIsbUJBQU8sQ0FBQyx5REFBYztBQUN2Qyx1QkFBdUIsbUJBQU8sQ0FBQyx1RUFBcUI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUM1QkEsZUFBZSxtQkFBTyxDQUFDLHFEQUFZO0FBQ25DLGlCQUFpQixtQkFBTyxDQUFDLHlEQUFjOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3RCQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsZUFBZSxtQkFBTyxDQUFDLHFEQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxHQUFHO0FBQ2QsV0FBVyxHQUFHO0FBQ2QsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BDQSxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxjQUFjO0FBQ3pCLFdBQVcsR0FBRztBQUNkLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0Esa0JBQWtCLFFBQVEsT0FBTyxVQUFVO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDaENBLGNBQWMsbUJBQU8sQ0FBQyxxREFBWTtBQUNsQyxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBLGtCQUFrQixPQUFPO0FBQ3pCLDBCQUEwQixnQkFBZ0IsUUFBUSxHQUFHO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2xDQSxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxjQUFjLG1CQUFPLENBQUMscURBQVk7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsY0FBYztBQUN6QixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0IsUUFBUSxHQUFHO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsR0FBRztBQUNoQjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3BCQSxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7QUFDbEQsbUJBQW1CLG1CQUFPLENBQUMsNkRBQWdCOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsbUJBQW1CO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3pCQSxpQkFBaUIsbUJBQU8sQ0FBQyx5REFBYztBQUN2QyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUNoQ0EsV0FBVyxtQkFBTyxDQUFDLCtDQUFTO0FBQzVCLGdCQUFnQixtQkFBTyxDQUFDLHVEQUFhOztBQUVyQztBQUNBLGtCQUFrQixLQUEwQjs7QUFFNUM7QUFDQSxnQ0FBZ0MsUUFBYTs7QUFFN0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JDQSxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxlQUFlLG1CQUFPLENBQUMscURBQVk7O0FBRW5DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLG1CQUFtQixtQkFBTyxDQUFDLDZEQUFnQjs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDNUJBLHVCQUF1QixtQkFBTyxDQUFDLHVFQUFxQjtBQUNwRCxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYztBQUN0QyxlQUFlLG1CQUFPLENBQUMsdURBQWE7O0FBRXBDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7QUFDZCxhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzFCQSxvQkFBb0IsbUJBQU8sQ0FBQyxpRUFBa0I7QUFDOUMsZUFBZSxtQkFBTyxDQUFDLHVEQUFhO0FBQ3BDLGtCQUFrQixtQkFBTyxDQUFDLDJEQUFlOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDcENBLHNCQUFzQixtQkFBTyxDQUFDLHFFQUFvQjtBQUNsRCxpQkFBaUIsbUJBQU8sQ0FBQywyREFBZTtBQUN4QyxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7O0FBRTVDO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdCQUFnQjtBQUMvQjtBQUNBLElBQUk7QUFDSixXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ25DQSxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7QUFDbEQsaUJBQWlCLG1CQUFPLENBQUMsMkRBQWU7QUFDeEMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDhCQUE4QjtBQUNoRCxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLG9DQUFvQyxlQUFlO0FBQ25ELFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMkJBQTJCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUMxQ0EsZUFBZSxtQkFBTyxDQUFDLHVEQUFhOztBQUVwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFVBQVU7QUFDckIsV0FBVyxVQUFVO0FBQ3JCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3hFQSxtQkFBbUIsbUJBQU8sQ0FBQywrREFBaUI7QUFDNUMsdUJBQXVCLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3BELFlBQVksbUJBQU8sQ0FBQyxpREFBVTtBQUM5QixZQUFZLG1CQUFPLENBQUMsaURBQVU7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxPQUFPLE9BQU8sVUFBVTtBQUN4QixPQUFPLE9BQU87QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQy9CQSx1QkFBdUIsbUJBQU8sQ0FBQyx1RUFBcUI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDakJBLG1CQUFtQixtQkFBTyxDQUFDLCtEQUFpQjs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsR0FBRztBQUNkLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQzNCQSxzQkFBc0IsbUJBQU8sQ0FBQyxxRUFBb0I7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckJBLGlCQUFpQixtQkFBTyxDQUFDLDJEQUFlO0FBQ3hDLHFCQUFxQixtQkFBTyxDQUFDLG1FQUFtQjtBQUNoRCxlQUFlLG1CQUFPLENBQUMscURBQVk7QUFDbkMsbUJBQW1CLG1CQUFPLENBQUMsK0RBQWlCOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLGVBQWU7QUFDMUIsWUFBWSxRQUFRO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVlO0FBQ2Y7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQ0E7QUFDQTtBQUNZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsSUFBSTtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLFdBQVc7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM1SkE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9COztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0MsU0FBUztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRzZCO0FBQ1U7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBUyxpREFBRztBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUywwREFBUTtBQUNqQjtBQUNBOztBQUVBOztBQUVBLGlFQUFlLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0NlO0FBQ2hDO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0NBQXdDO0FBQ3hDO0FBQ0EsV0FBVywwREFBUTtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpRUFBZSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1RG9CO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ2U7QUFDZiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHFEQUFNO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxHQUFHO0FBQ2hCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFNBQVM7QUFDdEIsYUFBYSxTQUFTO0FBQ3RCOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFFOztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JFQSxzQkFBc0IsZ0RBQWdELGdCQUFnQixzQkFBc0IsT0FBTywyQkFBMkIsMEJBQTBCLHlEQUF5RCxpQ0FBaUMsa0JBQWtCOztBQUV6TztBQUNOO0FBQ3JDLGtCQUFrQixhQUFhO0FBQ2hCO0FBQ2Y7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBLEtBQUs7QUFDTCxnRkFBZ0YsNERBQVU7QUFDMUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx5REFBTztBQUNYO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMLCtDQUErQyxvQkFBb0I7QUFDbkU7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q0Esc0JBQXNCLGdEQUFnRCxnQkFBZ0Isc0JBQXNCLE9BQU8sMkJBQTJCLDBCQUEwQix5REFBeUQsaUNBQWlDLGtCQUFrQjs7QUFFN087QUFDQTtBQUNJO0FBQ0E7QUFDSjtBQUNTO0FBQ2Q7QUFDM0I7QUFDUDtBQUNBO0FBQ2UsMEJBQTBCLCtDQUFVO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLEtBQUssR0FBRztBQUNSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEM7OztBQUc5QztBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQsaUJBQWlCLGlCQUFpQixHQUFHLElBQUk7QUFDekMsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxnQ0FBZ0M7QUFDaEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsd0RBQWU7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUE4Qzs7QUFFOUM7O0FBRUEsd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBLHNCQUFzQixtQkFBbUIsR0FBRyxJQUFJLElBQUk7O0FBRXBELHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBLE1BQU0sMERBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUywwREFBUSwyRkFBMkYsNERBQVUsV0FBVzs7QUFFakk7QUFDQTtBQUNBOztBQUVBLDJCQUEyQiwwQ0FBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSx5QkFBeUIsMENBQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSx5QkFBeUIsMENBQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLGVBQWUsMERBQVE7QUFDdkI7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaE9rQztBQUNXO0FBQ047QUFDaEM7QUFDUDtBQUNBO0FBQ2UsNEJBQTRCLCtDQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQiw0Q0FBTTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUEsb0JBQW9CLDRDQUFNO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxlQUFlLDBEQUFRO0FBQ3ZCOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDc0M7QUFDSTtBQUNIO0FBQ1Q7QUFDSTtBQUNsQzs7QUFFQTs7QUFFTztBQUNQO0FBQ0E7QUFDZSx5QkFBeUIsK0NBQVU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix5REFBUSxTQUFTOztBQUVqQztBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsU0FBUyxrREFBRztBQUNaO0FBQ0EsMkRBQTJELEtBQUs7QUFDaEU7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFCQUFxQix5Q0FBTTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxlQUFlLDBEQUFRO0FBQ3ZCOztBQUVBLEtBQUs7QUFDTDs7QUFFQSxxQkFBcUIseUNBQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25GNkQ7QUFDRztBQUNBO0FBQ0E7QUFDTjtBQUNNO0FBQ0g7QUFDWDtBQUNKO0FBQ0U7QUFDZjtBQUNNO0FBQ0g7QUFDRjs7QUFFbEM7QUFDQSxzQkFBc0IsMkRBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRTJSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QmhQO0FBQ3BDO0FBQ1AsY0FBYyxNQUFNO0FBQ3BCLGVBQWUsTUFBTTtBQUNyQixZQUFZLE1BQU0sdUNBQXVDLE9BQU87QUFDaEUsZUFBZSxNQUFNLDJDQUEyQyxPQUFPO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxpQkFBaUIsTUFBTSxjQUFjLEtBQUssMkNBQTJDLDREQUFVLGNBQWMsMkNBQTJDLDREQUFVLHNCQUFzQjs7QUFFeEw7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILGNBQWMsTUFBTTtBQUNwQjtBQUNPO0FBQ1AsYUFBYSxNQUFNLGtCQUFrQixRQUFRO0FBQzdDLFVBQVUsTUFBTSxtQkFBbUIsS0FBSztBQUN4QyxVQUFVLE1BQU0sa0JBQWtCLEtBQUs7QUFDdkMsY0FBYyxNQUFNLDZCQUE2QixNQUFNO0FBQ3ZELFlBQVksTUFBTTtBQUNsQixVQUFVLE1BQU07QUFDaEIsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsTUFBTTtBQUNqQixnQkFBZ0IsTUFBTTtBQUN0QixnQkFBZ0IsTUFBTTtBQUN0QjtBQUNPO0FBQ1AsVUFBVSxNQUFNLG1DQUFtQyxJQUFJO0FBQ3ZELFVBQVUsTUFBTSxnQ0FBZ0MsSUFBSTtBQUNwRCxlQUFlLE1BQU0sb0JBQW9CLEtBQUs7QUFDOUMsZUFBZSxNQUFNLHVCQUF1QixLQUFLO0FBQ2pELGVBQWUsTUFBTTtBQUNyQixlQUFlLE1BQU07QUFDckIsY0FBYyxNQUFNO0FBQ3BCO0FBQ087QUFDUCxVQUFVLE1BQU0sMkJBQTJCLElBQUk7QUFDL0MsVUFBVSxNQUFNLGdDQUFnQyxJQUFJO0FBQ3BEO0FBQ087QUFDUCxjQUFjLE1BQU0sZ0JBQWdCLE1BQU07QUFDMUM7QUFDTztBQUNQLGdCQUFnQixNQUFNLDhCQUE4QixRQUFRO0FBQzVEO0FBQ087QUFDUCxVQUFVLE1BQU0sMkJBQTJCLEtBQUs7QUFDaEQsVUFBVSxNQUFNLHdDQUF3QyxLQUFLO0FBQzdELGFBQWEsTUFBTSxZQUFZLFFBQVE7QUFDdkM7QUFDQSxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25FZ0M7QUFDbEMsY0FBYywrQ0FBVTtBQUN4QixpRUFBZSxLQUFLLEVBQUM7QUFDZDtBQUNQO0FBQ0EsRUFBRTs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1A0QztBQUNMO0FBQ0w7O0FBRWxDOztBQUVPO0FBQ1A7QUFDQTtBQUNlLDJCQUEyQiwrQ0FBVTtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUM7O0FBRXpDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLDJDQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxlQUFlLDBEQUFRO0FBQ3ZCOztBQUVBLEtBQUs7QUFDTDs7QUFFQSxxQkFBcUIsMkNBQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLGVBQWUsMERBQVE7QUFDdkI7O0FBRUEsS0FBSztBQUNMOztBQUVBLDJCQUEyQiwyQ0FBTTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUEsMkJBQTJCLDJDQUFNO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxlQUFlLDBEQUFRO0FBQ3ZCOztBQUVBLEtBQUs7QUFDTDs7QUFFQSxpQkFBaUIsMkNBQU07QUFDdkI7QUFDQTs7QUFFQSxpQkFBaUIsMkNBQU07QUFDdkI7QUFDQTs7QUFFQSxvQkFBb0IsMkNBQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDBEQUFRO0FBQzNCLEtBQUs7QUFDTDs7QUFFQTtBQUNBLG9DQUFvQywwREFBUTtBQUM1Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsdUZBQXVGOztBQUV2RjtBQUNBO0FBQ0Esb0NBQW9DLDBEQUFRO0FBQzVDOztBQUVBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SUEsc0JBQXNCLGdEQUFnRCxnQkFBZ0Isc0JBQXNCLE9BQU8sMkJBQTJCLDBCQUEwQix5REFBeUQsaUNBQWlDLGtCQUFrQjs7QUFFdlA7QUFDWTtBQUNBO0FBQ0o7QUFDSTtBQUNGO0FBQ0s7QUFDRDtBQUNRO0FBQ1o7QUFDUztBQUNkOztBQUVsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsZ0VBQWM7QUFDbkIsMkJBQTJCLGdEQUFVO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCO0FBQzVCOztBQUVBLDhDQUE4Qzs7O0FBRzlDO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGdDQUFnQzs7QUFFaEMsa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsaURBQUc7O0FBRXRCO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDLCtDQUErQyxhQUFhLGlCQUFpQjs7QUFFN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEtBQUssWUFBWTtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEseURBQWU7QUFDNUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNkRBQTZELFVBQVUsb0JBQW9CLGdCQUFnQixJQUFJLElBQUk7QUFDbkg7O0FBRUE7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7O0FBRUE7QUFDQSxPQUFPOztBQUVQLE1BQU0sMERBQVE7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRLDJCQUEyQixnREFBVSwyQkFBMkIsZ0RBQVU7QUFDbEY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZ0VBQWM7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLDREQUFVO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLHFEQUFNO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQSxVQUFVLGlEQUFHO0FBQ2IsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxzQ0FBc0MsMkNBQU07QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxrQ0FBa0MsMkNBQU07QUFDeEM7QUFDQTs7QUFFQTtBQUNBLHdDQUF3QyxxREFBTztBQUMvQzs7QUFFQTtBQUNBLDhCQUE4Qix5REFBUztBQUN2Qzs7QUFFQTtBQUNBLDhCQUE4Qix5REFBUztBQUN2Qzs7QUFFQTtBQUNBLHFDQUFxQyx1REFBUztBQUM5Qzs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLHVEQUFTO0FBQzNCO0FBQ0E7O0FBRUE7QUFDTztBQUNQO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvVkEsc0JBQXNCLGdEQUFnRCxnQkFBZ0Isc0JBQXNCLE9BQU8sMkJBQTJCLDBCQUEwQix5REFBeUQsaUNBQWlDLGtCQUFrQjs7QUFFcFI7QUFDa0M7QUFDUztBQUNQO0FBQ0c7QUFDZ0I7QUFDWjtBQUNiO0FBQ087QUFDVztBQUNEO0FBQ1YsQ0FBQzs7QUFFdkI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwREFBWTtBQUN0QywwQkFBMEIsMERBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQ0FBTTtBQUMzQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJOzs7QUFHSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOzs7QUFHQSw2REFBNkQ7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx3QkFBd0I7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHFEQUFTLFlBQVk7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3SUFBd0ksV0FBVyxNQUFNLFlBQVk7QUFDcks7QUFDQTs7QUFFQSxrQ0FBa0MsNkJBQTZCO0FBQy9EO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsbUZBQW1GO0FBQ25GOztBQUVBO0FBQ0EsdUZBQXVGOztBQUV2RjtBQUNBLG1EQUFtRDtBQUNuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxHQUFHO0FBQ2hCLGFBQWEsUUFBUTtBQUNyQixhQUFhLElBQUk7QUFDakIsYUFBYSxJQUFJO0FBQ2pCOzs7QUFHQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQSwyQkFBMkIsNERBQVU7QUFDckMsNEJBQTRCLDREQUFVO0FBQ3RDLDBDQUEwQyx5QkFBeUIscUVBQXFFLHFCQUFxQiwrQkFBK0IsZ0JBQWdCLCtEQUErRCxnQkFBZ0I7QUFDM1I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sYUFBYTtBQUNwQixNQUFNOzs7QUFHTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDBEQUFRO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSwwREFBUTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQSxLQUFLLElBQUk7O0FBRVQ7QUFDQSwyQkFBMkI7QUFDM0IsS0FBSztBQUNMOztBQUVBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsS0FBSztBQUNMOztBQUVBLHVDQUF1QztBQUN2QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLHdEQUFlO0FBQ3pCO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLFVBQVUsd0RBQWU7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDBFQUEwRSxxREFBUztBQUNuRjs7QUFFQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsMENBQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQSxxQkFBcUIsMENBQU07QUFDM0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1EQUFtRCwwQ0FBTTtBQUN6RDtBQUNBO0FBQ0EsbUJBQW1CLGtFQUFnQjtBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSwwREFBTyxzQkFBc0Isa0RBQUc7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDZCQUE2QixrREFBUztBQUN0QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0Isa0VBQWdCO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHlCQUF5QiwwQ0FBTTtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsMkJBQTJCLGtFQUFnQjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSw0QkFBNEIsMENBQU07QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLDJCQUEyQixrRUFBZ0I7QUFDM0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUEsRUFBRTs7QUFFRjtBQUNBOztBQUVBLDJFQUEyRSxPQUFPLDBDQUEwQztBQUM1SDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksRUFBRSxrREFBSztBQUNYLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNWpCOEI7QUFDZjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSwrQ0FBTTtBQUNaLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUNEM7QUFDTDtBQUNMLENBQUM7O0FBRW5DLG1EQUFtRCxHQUFHLG1GQUFtRixHQUFHLDR3QkFBNHdCOztBQUV4NUIsNEdBQTRHLEVBQUUsa0JBQWtCLGtyQkFBa3JCLEVBQUUsa0JBQWtCLG9GQUFvRixFQUFFLGtCQUFrQiwyRkFBMkYsRUFBRSxrQkFBa0IsOEdBQThHLEVBQUUsa0JBQWtCLHNCQUFzQjs7QUFFcnJDLDBCQUEwQixFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxHQUFHOztBQUV4Rix5QkFBeUIsMERBQVE7O0FBRWpDLHFCQUFxQjtBQUNkO0FBQ1A7QUFDQTtBQUNlLDJCQUEyQiwrQ0FBVTtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsMkNBQU07QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLGVBQWUsMERBQVE7QUFDdkI7O0FBRUEsS0FBSztBQUNMOztBQUVBLHFCQUFxQiwyQ0FBTTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsZUFBZSwwREFBUTtBQUN2Qjs7QUFFQSxLQUFLO0FBQ0w7O0FBRUEscUJBQXFCLDJDQUFNO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxlQUFlLDBEQUFRO0FBQ3ZCOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLDJDQUFNO0FBQ2hDO0FBQ0E7QUFDQSxPQUFPO0FBQ1AscUJBQXFCLDBEQUFRO0FBQzdCLEtBQUs7QUFDTDs7QUFFQSxrQkFBa0IsMkNBQU07QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsZ0JBQWdCLDJDQUFNO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlCQUFpQiwyQ0FBTTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJOzs7QUFHSjtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLDJDQUFNO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLHNCQUFzQiwyQ0FBTTtBQUM1QixvQ0FBb0MsMERBQVE7QUFDNUM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBEQUFRO0FBQzdCLEtBQUs7QUFDTDs7QUFFQSxzQkFBc0IsMkNBQU07QUFDNUIsb0NBQW9DLDBEQUFRO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwREFBUTtBQUM3QixLQUFLO0FBQ0w7O0FBRUE7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzlLcUM7QUFDdEI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3REFBd0Qsa0RBQVM7QUFDakU7O0FBRUE7QUFDQSxJQUFJLGtEQUFTO0FBQ2I7O0FBRUE7QUFDQSxJQUFJLGtEQUFTO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2REEsc0JBQXNCLGdEQUFnRCxnQkFBZ0Isc0JBQXNCLE9BQU8sMkJBQTJCLDBCQUEwQix5REFBeUQsaUNBQWlDLGtCQUFrQjs7QUFFcFIsMkRBQTJELCtCQUErQixpQkFBaUIsc0NBQXNDLFlBQVksWUFBWSx1QkFBdUIsT0FBTyxxQkFBcUIsMENBQTBDLDZCQUE2Qjs7QUFFMVA7QUFDUTtBQUNsQjtBQUNoQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0EsYUFBYSxrREFBRztBQUNoQjs7QUFFQSx1Q0FBdUM7QUFDdkMseUJBQXlCLHVEQUFTO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLHdCQUF3Qix3REFBZSxDQUFDLHdEQUFlO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxjQUFjLHdEQUFlLHlDQUF5QywwQ0FBMEM7QUFDaEgsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHFEQUFxRCxTQUFTO0FBQzlEO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLHdEQUFlLDZCQUE2QixvQ0FBb0M7QUFDeEY7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN4RkE7O0FBRUEsaUVBQWUsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0FDRnZCOztBQUVBLGlFQUFlLFFBQVE7Ozs7Ozs7Ozs7Ozs7OztBQ0Z2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEdBQUcsdUJBQXVCLEVBQUUsVUFBVSxFQUFFO0FBQ3RJO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0Isa0NBQWtDOzs7QUFHN0U7QUFDQSxpQ0FBaUM7O0FBRWpDLGdFQUFnRTs7QUFFaEUsMk1BQTJNO0FBQzNNO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsSUFBSTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ3dDOztBQUV4Qzs7QUFFTztBQUNQLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsc0RBQU87QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0EsNEVBQTRFLE1BQU0saUJBQWlCLEtBQUs7QUFDeEc7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSwyR0FBMkcsS0FBSyxxQkFBcUIsZUFBZSxvQkFBb0IsYUFBYTtBQUNyTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpRUFBZSxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkQ2Qjs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Qsd0RBQWU7O0FBRWpFLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHdEQUFlO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDOztBQUU3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsd0RBQWU7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakI2QixDQUFDOztBQUVFO0FBQ007QUFDUDtBQUNHO0FBQ25CO0FBQ2Y7QUFDQTtBQUNBLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTs7QUFFakU7QUFDQSxlQUFlLG9EQUFLO0FBQ3BCO0FBQ0EseUJBQXlCLElBQUksR0FBRyxLQUFLO0FBQ3JDOztBQUVBLGdDQUFnQyxpREFBRztBQUNuQztBQUNBO0FBQ0EsUUFBUSxrREFBRywyREFBMkQsU0FBUyxxREFBUTtBQUN2Rjs7QUFFQSxTQUFTLHFEQUFjO0FBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7QUN4QmU7QUFDZjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDRm1EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSw4Q0FBRztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsMERBQWU7QUFDMUI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEVpQztBQUNhO0FBQzlDO0FBQ08seUJBQXlCLHlDQUFLO0FBQ3JDO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0Esd0JBQXdCLHlEQUF3QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGtDQUFrQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDak1pQztBQUMwQjtBQUMzRDtBQUNPLDJCQUEyQix5Q0FBSztBQUN2QztBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEdBQUc7QUFDaEIsYUFBYSxHQUFHO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEdBQUc7QUFDaEIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsZ0VBQW9CO0FBQzdDLDRCQUE0QixnRUFBb0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixNQUFNLFVBQVU7QUFDM0Msb0NBQW9DLE1BQU0sVUFBVTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdFQUFvQjtBQUM3QyxrQ0FBa0MsZ0VBQW9CO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCO0FBQ0EsS0FBSztBQUNMLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLFlBQVksNkJBQTZCO0FBQ3pDO0FBQ0EsVUFBVSxLQUFLO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxnQkFBZ0I7QUFDNUI7QUFDQSxVQUFVLEtBQUs7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5T2lDO0FBQ0gsQ0FBQztBQUNlLENBQUM7QUFDL0M7QUFDTywwQkFBMEIseUNBQUs7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZUFBZTtBQUMzQjtBQUNBO0FBQ0EsY0FBYyxxQkFBcUI7QUFDbkMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixzREFBc0Q7QUFDdEUsT0FBTztBQUNQO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUCxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUUsTUFBTTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsdURBQXFCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHVEQUFxQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IscUJBQXFCLGdCQUFnQjtBQUNwRTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix3REFBOEI7QUFDOUM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVCQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxlQUFlLEVBQUUsNENBQWtCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RQMEM7QUFDTztBQUNJO0FBQ0Y7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVywyQkFBMkI7QUFDdEMsWUFBWSw0QkFBNEI7QUFDeEMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDhEQUFZO0FBQ3ZDLEVBQUUsdURBQXNCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIsMERBQVU7QUFDbkMsRUFBRSx1REFBc0I7QUFDeEI7QUFDQTtBQUNBLDBCQUEwQiw0REFBVztBQUNyQyxFQUFFLHVEQUFzQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLHlEQUF3QjtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RSxFQUFFLFFBQVEsRUFBRTtBQUNwRjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxFQUFFLHdCQUF3QixFQUFFO0FBQzNFO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5R0FBeUcsRUFBRTtBQUMzRztBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBLFFBQVEsa0NBQWtDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQytDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRk07QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ2lFOzs7Ozs7Ozs7Ozs7Ozs7O0FDakNwRTtBQUNBO0FBQ3NCOzs7Ozs7O1VDRnRCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxDQUFDO1dBQ0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBLHNHQUFzRztXQUN0RztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7Ozs7O1dDaEVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1VFSkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL2luZGV4LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL0Zvcm1hdC9Gb3JtYXQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvTG9jYWxlSGVscGVyL0xvY2FsZUhlbHBlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9QYXJzZXIvUGFyc2VyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2RhdGEvYmFzZUxvb2t1cHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZGF0YS9kZWZhdWx0TG9jYWxlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2RhdGEvbm9ybWFsaXplTG9jYWxlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2RhdGEvbnVtYmVyaW5nU3lzdGVtcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9kYXRhL3RlbXBsYXRlcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9kYXRhL3RpbWV6b25lTmFtZXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZGF0YS90d29EaWdpdFllYXJzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2RhdGEvdW5pdFNob3J0Y3V0cy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9kYXRhL3VuaXRzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvYWdvL2Fnby5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9mb3JtYXRzL2F0U2Vjb25kcy9hdFNlY29uZHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZm9ybWF0cy9jaGluZXNlL2NoaW5lc2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZm9ybWF0cy9kYXlNb250aFllYXIvZGF5TW9udGhZZWFyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvZGF5TW9udGgvZGF5TW9udGguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZm9ybWF0cy9kYXlNb250aG5hbWVZZWFyL2RheU1vbnRobmFtZVllYXIuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZm9ybWF0cy9kYXlNb250aG5hbWUvZGF5TW9udGhuYW1lLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvbWljcm9zb2Z0SnNvbi9taWNyb3NvZnRKc29uLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvbW9udGhEYXlZZWFyL21vbnRoRGF5WWVhci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9mb3JtYXRzL21vbnRoRGF5L21vbnRoRGF5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvbW9udGhuYW1lRGF5WWVhci9tb250aG5hbWVEYXlZZWFyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvbW9udGhuYW1lRGF5L21vbnRobmFtZURheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9mb3JtYXRzL3RpbWUxMkhvdXJzL3RpbWUxMkhvdXJzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zvcm1hdHMvdGltZTI0SG91cnMvdGltZTI0SG91cnMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZm9ybWF0cy90b2RheS90b2RheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9mb3JtYXRzL3R3aXR0ZXIvdHdpdHRlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvYW55LWRhdGUtcGFyc2VyL3NyYy9mb3JtYXRzL3llYXJNb250aERheS95ZWFyTW9udGhEYXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2FueS1kYXRlLXBhcnNlci9zcmMvZnJvbUFueS9mcm9tQW55LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9hbnktZGF0ZS1wYXJzZXIvc3JjL2Zyb21TdHJpbmcvZnJvbVN0cmluZy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9pY3MvZGlzdC9waXBlbGluZS9idWlsZC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvcGlwZWxpbmUvZm9ybWF0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9pY3MvZGlzdC9waXBlbGluZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvcGlwZWxpbmUvdmFsaWRhdGUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L3NjaGVtYS9pbmRleC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvdXRpbHMvZm9sZC1saW5lLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9pY3MvZGlzdC91dGlscy9mb3JtYXQtZGF0ZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvdXRpbHMvZm9ybWF0LWR1cmF0aW9uLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9pY3MvZGlzdC91dGlscy9mb3JtYXQtdGV4dC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvdXRpbHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L3V0aWxzL3NldC1hbGFybS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvdXRpbHMvc2V0LWNvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L3V0aWxzL3NldC1kZXNjcmlwdGlvbi5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvaWNzL2Rpc3QvdXRpbHMvc2V0LWdlb2xvY2F0aW9uLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9pY3MvZGlzdC91dGlscy9zZXQtbG9jYXRpb24uanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L3V0aWxzL3NldC1vcmdhbml6ZXIuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2ljcy9kaXN0L3V0aWxzL3NldC1zdW1tYXJ5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX0hhc2guanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TZXRDYWNoZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RmlsdGVyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlQdXNoLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UmVkdWNlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc2NpaVRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNjaWlXb3Jkcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3IuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRBbGxLZXlzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzQXJndW1lbnRzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNNYXRjaC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXRlcmF0ZWUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUHJvcGVydHlPZi5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2xpY2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FjaGVIYXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFBhdGguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFNsaWNlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUZvci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVDYXNlRmlyc3QuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQ29tcG91bmRlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19kZWJ1cnJMZXR0ZXIuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxBcnJheXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxCeVRhZy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWF0Y2hEYXRhLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9scy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzUGF0aC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNVbmljb2RlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc1VuaWNvZGVXb3JkLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21lbW9pemVDYXBwZWQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlQWRkLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpbmdUb0FycmF5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL190b0tleS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL191bmljb2RlVG9BcnJheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL191bmljb2RlV29yZHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jYW1lbENhc2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9jYXBpdGFsaXplLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVidXJyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvZXEuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9oYXNJbi5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lkZW50aXR5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTeW1ib2wuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbWFwS2V5cy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL21hcFZhbHVlcy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3NuYWtlQ2FzZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJBcnJheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdXBwZXJGaXJzdC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3dvcmRzLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9uYW5vY2xvbmUvc3JjL2luZGV4LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9wcm9wZXJ0eS1leHByL2luZGV4LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy90b3Bvc29ydC9pbmRleC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL0NvbmRpdGlvbi5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL0xhenkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9SZWZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9WYWxpZGF0aW9uRXJyb3IuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9hcnJheS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL2Jvb2xlYW4uanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9kYXRlLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy95dXAvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9sb2NhbGUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy9taXhlZC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL251bWJlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL29iamVjdC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3NjaGVtYS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3NldExvY2FsZS5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3N0cmluZy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3V0aWwvUmVmZXJlbmNlU2V0LmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy95dXAvZXMvdXRpbC9jcmVhdGVWYWxpZGF0aW9uLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy95dXAvZXMvdXRpbC9pc0Fic2VudC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3V0aWwvaXNTY2hlbWEuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy91dGlsL2lzb2RhdGUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy91dGlsL3ByaW50VmFsdWUuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy91dGlsL3JlYWNoLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy95dXAvZXMvdXRpbC9ydW5UZXN0cy5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMveXVwL2VzL3V0aWwvc29ydEJ5S2V5T3JkZXIuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy91dGlsL3NvcnRGaWVsZHMuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vbm9kZV9tb2R1bGVzL3l1cC9lcy91dGlsL3RvQXJyYXkuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL2FnZW50cy9hZ2VudC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9zcmMvYWdlbnRzL2V2ZW50QWdlbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL2FnZW50cy9vcHRpb25zQWdlbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL2FnZW50cy9vdXRwdXRBZ2VudC9pbmRleC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9zcmMvZW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL2tub3dsZWRnZWJhc2UuanMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtLy4vc3JjL29ic2VydmVyLmpzIiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS8uL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vLi9ub2RlX21vZHVsZXMvbmFub2lkL3VybC1hbHBoYWJldC9pbmRleC5qcyIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9hc3luYyBtb2R1bGUiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2VtYWlsLWFzc2lzdGVuenN5c3RlbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZW1haWwtYXNzaXN0ZW56c3lzdGVtL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9lbWFpbC1hc3Npc3RlbnpzeXN0ZW0vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBvdXIgbWFpbiBtb2R1bGVzXG5jb25zdCBQYXJzZXIgPSByZXF1aXJlKCcuL3NyYy9QYXJzZXIvUGFyc2VyLmpzJyk7XG5jb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuL3NyYy9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5jb25zdCBMb2NhbGVIZWxwZXIgPSByZXF1aXJlKCcuL3NyYy9Mb2NhbGVIZWxwZXIvTG9jYWxlSGVscGVyLmpzJyk7XG4vLyBpbXBvcnQgb3VyIGZvcm1hdHNcbmNvbnN0IGF0U2Vjb25kcyA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdHMvYXRTZWNvbmRzL2F0U2Vjb25kcy5qcycpO1xuY29uc3QgbWljcm9zb2Z0SnNvbiA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdHMvbWljcm9zb2Z0SnNvbi9taWNyb3NvZnRKc29uLmpzJyk7XG5jb25zdCBhZ28gPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL2Fnby9hZ28uanMnKTtcbmNvbnN0IGNoaW5lc2UgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL2NoaW5lc2UvY2hpbmVzZS5qcycpO1xuY29uc3QgZGF5TW9udGggPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL2RheU1vbnRoL2RheU1vbnRoLmpzJyk7XG5jb25zdCBkYXlNb250aG5hbWUgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL2RheU1vbnRobmFtZS9kYXlNb250aG5hbWUuanMnKTtcbmNvbnN0IGRheU1vbnRobmFtZVllYXIgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL2RheU1vbnRobmFtZVllYXIvZGF5TW9udGhuYW1lWWVhci5qcycpO1xuY29uc3QgZGF5TW9udGhZZWFyID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0cy9kYXlNb250aFllYXIvZGF5TW9udGhZZWFyLmpzJyk7XG5jb25zdCBkZWZhdWx0TG9jYWxlID0gcmVxdWlyZSgnLi9zcmMvZGF0YS9kZWZhdWx0TG9jYWxlLmpzJyk7XG5jb25zdCBtb250aERheSA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdHMvbW9udGhEYXkvbW9udGhEYXkuanMnKTtcbmNvbnN0IG1vbnRoRGF5WWVhciA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdHMvbW9udGhEYXlZZWFyL21vbnRoRGF5WWVhci5qcycpO1xuY29uc3QgbW9udGhuYW1lRGF5ID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0cy9tb250aG5hbWVEYXkvbW9udGhuYW1lRGF5LmpzJyk7XG5jb25zdCBtb250aG5hbWVEYXlZZWFyID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0cy9tb250aG5hbWVEYXlZZWFyL21vbnRobmFtZURheVllYXIuanMnKTtcbmNvbnN0IHRpbWUxMkhvdXJzID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0cy90aW1lMTJIb3Vycy90aW1lMTJIb3Vycy5qcycpO1xuY29uc3QgdGltZTI0SG91cnMgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL3RpbWUyNEhvdXJzL3RpbWUyNEhvdXJzLmpzJyk7XG5jb25zdCB0b2RheSA9IHJlcXVpcmUoJy4vc3JjL2Zvcm1hdHMvdG9kYXkvdG9kYXkuanMnKTtcbmNvbnN0IHR3aXR0ZXIgPSByZXF1aXJlKCcuL3NyYy9mb3JtYXRzL3R3aXR0ZXIvdHdpdHRlci5qcycpO1xuY29uc3QgeWVhck1vbnRoRGF5ID0gcmVxdWlyZSgnLi9zcmMvZm9ybWF0cy95ZWFyTW9udGhEYXkveWVhck1vbnRoRGF5LmpzJyk7XG5cbi8vIGNyZWF0ZSBhIGRlZmF1bHQgcGFyc2VyIGluc3RhbmNlIGFuZCByZWdpc3RlciBhbGwgdGhlIGRlZmF1bHQgZm9ybWF0c1xuY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xucGFyc2VyXG5cdC8vIGFsbCBmb3JtYXRzIGNhbiBoYXZlIHRpbWUgc3RyaW5ncyBhdCB0aGUgZW5kXG5cdC5hZGRGb3JtYXRzKFtcblx0XHR0aW1lMjRIb3Vycyxcblx0XHR0aW1lMTJIb3Vycyxcblx0XHQvLyBmcm9tIG1vc3QgdW5hbWJpZ3VvdXMgYW5kIHBvcHVsYXIgdG8gbGVhc3Rcblx0XHR5ZWFyTW9udGhEYXksXG5cdFx0ZGF5TW9udGhuYW1lWWVhcixcblx0XHRtb250aG5hbWVEYXlZZWFyLFxuXHRcdG1vbnRoRGF5WWVhcixcblx0XHRkYXlNb250aFllYXIsXG5cdFx0Y2hpbmVzZSxcblx0XHR0d2l0dGVyLFxuXHRcdHRvZGF5LFxuXHRcdGFnbyxcblx0XHRtb250aG5hbWVEYXksXG5cdFx0ZGF5TW9udGhuYW1lLFxuXHRcdG1vbnRoRGF5LFxuXHRcdGRheU1vbnRoLFxuXHRcdGF0U2Vjb25kcyxcblx0XHRtaWNyb3NvZnRKc29uLFxuXHRdKTtcblxuLy8gbWFrZSBpdCBlYXN5IHRvIGNvbnN1bWUgb3VyIG90aGVyIG1haW4gbW9kdWxlcyBhbmQgZnVuY3Rpb25zXG5wYXJzZXIuUGFyc2VyID0gUGFyc2VyO1xucGFyc2VyLkZvcm1hdCA9IEZvcm1hdDtcbnBhcnNlci5Mb2NhbGVIZWxwZXIgPSBMb2NhbGVIZWxwZXI7XG5wYXJzZXIuZGVmYXVsdExvY2FsZSA9IGRlZmF1bHRMb2NhbGU7XG5cbi8vIGNyZWF0ZSBmdW5jdGlvbnMgb24gRGF0ZVxucGFyc2VyLmZyb21TdHJpbmcgPSBEYXRlLmZyb21TdHJpbmcgPSBwYXJzZXIuZXhwb3J0QXNGdW5jdGlvbigpO1xucGFyc2VyLmZyb21BbnkgPSBEYXRlLmZyb21BbnkgPSBwYXJzZXIuZXhwb3J0QXNGdW5jdGlvbkFueSgpO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0d2luZG93LmFueURhdGVQYXJzZXIgPSBwYXJzZXI7XG59XG5cbi8vIGV4cG9ydCBvdXIgZGVmYXVsdCBwYXJzZXJcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VyO1xuIiwiY29uc3QgTG9jYWxlSGVscGVyID0gcmVxdWlyZSgnLi4vTG9jYWxlSGVscGVyL0xvY2FsZUhlbHBlci5qcycpO1xuY29uc3QgZGVmYXVsdExvY2FsZSA9IHJlcXVpcmUoJy4uL2RhdGEvZGVmYXVsdExvY2FsZS5qcycpO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwYXJzYWJsZSBkYXRlIGZvcm1hdFxuICovXG5jbGFzcyBGb3JtYXQge1xuXHQvKipcblx0ICogR2l2ZW4gYSBkZWZpbml0aW9uLCBjcmVhdGUgYSBwYXJzYWJsZSBmb3JtYXRcblx0ICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gIFRoZSBmb3JtYXQgZGVmaW5pdGlvblxuXHQgKiBAcHJvcGVydHkge1N0cmluZ30gdGVtcGxhdGUgIEEgdGVtcGxhdGUgZm9yIFJlZ0V4cCB0aGF0IGNhbiBoYW5kbGUgbXVsdGlwbGUgbGFuZ3VhZ2VzXG5cdCAqIEBwcm9wZXJ0eSB7UmVnRXhwfSBtYXRjaGVyICBBbiBhY3R1YWwgUmVnRXhwIHRvIG1hdGNoIGFnYWluc3Rcblx0ICogQHByb3BlcnR5IHtBcnJheX0gdW5pdHMgIElmIHRoZSB0ZW1wbGF0ZSBvciBSZWdFeHAgbWF0Y2ggZXhhY3QgdW5pdHMsIHlvdSBjYW4gZGVmaW5lIHRoZSB1bml0c1xuXHQgKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBoYW5kbGVyICBBIGZsZXhpYmxlIGFsdGVybmF0aXZlIHRvIHVuaXRzOyBtdXN0IHJldHVybiBhbiBvYmplY3Rcblx0ICogQHByb3BlcnR5IHtBcnJheX0gbG9jYWxlcyAgQSBsaXN0IG9mIGxvY2FsZXMgdGhhdCB0aGlzIGZvcm1hdCBzaG91bGQgYmUgcmVzdHJpY3RlZCB0b1xuXHQgKi9cblx0Y29uc3RydWN0b3Ioe1xuXHRcdHRlbXBsYXRlID0gbnVsbCxcblx0XHRtYXRjaGVyID0gbnVsbCxcblx0XHR1bml0cyA9IG51bGwsXG5cdFx0aGFuZGxlciA9IG51bGwsXG5cdFx0bG9jYWxlcyA9IG51bGwsXG5cdH0pIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodW5pdHMpICYmIHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCduZXcgRm9ybWF0IG11c3QgcmVjZWl2ZSBhIFwidW5pdHNcIiBhcnJheSBvciBcImhhbmRsZXJcIiBmdW5jdGlvbidcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdGVtcGxhdGUgIT09ICdzdHJpbmcnICYmICEobWF0Y2hlciBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0J25ldyBGb3JtYXQgbXVzdCByZWNlaXZlIGEgXCJ0ZW1wbGF0ZVwiIHN0cmluZyBvciBcIm1hdGNoZXJcIiBSZWdFeHAnXG5cdFx0XHQpO1xuXHRcdH1cblx0XHQvKipcblx0XHQgKiBAdHlwZSB7U3RyaW5nfSB0ZW1wbGF0ZSAgQSB0ZW1wbGF0ZSBmb3IgUmVnRXhwIHRoYXQgY2FuIGhhbmRsZSBtdWx0aXBsZSBsYW5ndWFnZXNcblx0XHQgKi9cblx0XHR0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cblx0XHQvKipcblx0XHQgKiBAdHlwZSB7QXJyYXl9IHVuaXRzICBJZiB0aGUgdGVtcGxhdGUgb3IgUmVnRXhwIG1hdGNoIGV4YWN0IHVuaXRzLCB5b3UgY2FuIGRlZmluZSB0aGUgdW5pdHNcblx0XHQgKi9cblx0XHR0aGlzLnVuaXRzID0gdW5pdHM7XG5cblx0XHQvKipcblx0XHQgKiBAdHlwZSB7UmVnRXhwfSBtYXRjaGVyICBBbiBhY3R1YWwgUmVnRXhwIHRvIG1hdGNoIGFnYWluc3Rcblx0XHQgKi9cblx0XHR0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge0Z1bmN0aW9ufSBoYW5kbGVyICBBIGZsZXhpYmxlIGFsdGVybmF0aXZlIHRvIHVuaXRzOyBtdXN0IHJldHVybiBhbiBvYmplY3Rcblx0XHQgKi9cblx0XHR0aGlzLmhhbmRsZXIgPSBoYW5kbGVyO1xuXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1N0cmluZ1tdfSBsb2NhbGVzICBBIGxpc3Qgb2YgbG9jYWxlcyB0aGF0IHRoaXMgZm9ybWF0IHNob3VsZCBiZSByZXN0cmljdGVkIHRvXG5cdFx0ICovXG5cdFx0dGhpcy5sb2NhbGVzID0gbG9jYWxlcztcblxuXHRcdC8qKlxuXHRcdCAqIEEgY2FjaGUgb2YgUmVnRXhwIGluZGV4ZWQgYnkgbG9jYWxlIG5hbWVcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRoaXMucmVnZXhCeUxvY2FsZSA9IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEJ1aWxkIHRoZSBSZWdFeHAgZnJvbSB0aGUgdGVtcGxhdGUgZm9yIGEgZ2l2ZW4gbG9jYWxlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgIFRoZSBsYW5ndWFnZSBsb2NhbGUgc3VjaCBhcyBlbi1VUywgcHQtQlIsIHpoLCBlcywgZXRjLlxuXHQgKiBAcmV0dXJucyB7UmVnRXhwfSAgQSBSZWdFeHAgdGhhdCBtYXRjaGVzIHdoZW4gdGhpcyBmb3JtYXQgaXMgcmVjb2duaXplZFxuXHQgKi9cblx0Z2V0UmVnRXhwKGxvY2FsZSA9IGRlZmF1bHRMb2NhbGUpIHtcblx0XHRpZiAodGhpcy50ZW1wbGF0ZSkge1xuXHRcdFx0aWYgKCF0aGlzLnJlZ2V4QnlMb2NhbGVbbG9jYWxlXSkge1xuXHRcdFx0XHR0aGlzLnJlZ2V4QnlMb2NhbGVbbG9jYWxlXSA9IExvY2FsZUhlbHBlci5mYWN0b3J5KGxvY2FsZSkuY29tcGlsZShcblx0XHRcdFx0XHR0aGlzLnRlbXBsYXRlXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWdleEJ5TG9jYWxlW2xvY2FsZV07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1hdGNoZXI7XG5cdH1cblxuXHQvKipcblx0ICogUnVuIHRoaXMgZm9ybWF0J3MgUmVnRXhwIGFnYWluc3QgdGhlIGdpdmVuIHN0cmluZ1xuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nICBUaGUgZGF0ZSBzdHJpbmdcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSAgVGhlIGxhbmd1YWdlIGxvY2FsZSBzdWNoIGFzIGVuLVVTLCBwdC1CUiwgemgsIGVzLCBldGMuXG5cdCAqIEByZXR1cm5zIHtBcnJheXxudWxsfSAgQXJyYXkgb2YgbWF0Y2hlcyBvciBudWxsIG9uIG5vbi1tYXRjaFxuXHQgKi9cblx0Z2V0TWF0Y2hlcyhzdHJpbmcsIGxvY2FsZSA9IGRlZmF1bHRMb2NhbGUpIHtcblx0XHRyZXR1cm4gc3RyaW5nLm1hdGNoKHRoaXMuZ2V0UmVnRXhwKGxvY2FsZSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdpdmVuIG1hdGNoZXMgYWdhaW5zdCB0aGlzIFJlZ0V4cCwgY29udmVydCB0byBvYmplY3Rcblx0ICogQHBhcmFtIHtTdHJpbmdbXX0gbWF0Y2hlcyAgQW4gYXJyYXkgb2YgbWF0Y2hlZCBwYXJ0c1xuXHQgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlICBUaGUgbGFuZ3VhZ2UgbG9jYWxlIHN1Y2ggYXMgZW4tVVMsIHB0LUJSLCB6aCwgZXMsIGV0Yy5cblx0ICogQHJldHVybnMge09iamVjdH0gIE9iamVjdCB3aGljaCBtYXkgY29udGFpbiB5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmQsIG9mZnNldCwgaW52YWxpZFxuXHQgKi9cblx0dG9EYXRlVGltZShtYXRjaGVzLCBsb2NhbGUgPSBkZWZhdWx0TG9jYWxlKSB7XG5cdFx0Y29uc3QgbG9jSGVscGVyID0gTG9jYWxlSGVscGVyLmZhY3RvcnkobG9jYWxlKTtcblx0XHRpZiAodGhpcy51bml0cykge1xuXHRcdFx0cmV0dXJuIGxvY0hlbHBlci5nZXRPYmplY3QodGhpcy51bml0cywgbWF0Y2hlcyk7XG5cdFx0fVxuXHRcdGNvbnN0IGR0ID0gdGhpcy5oYW5kbGVyKG1hdGNoZXMsIGxvY2FsZSk7XG5cdFx0aWYgKCFkdCB8fCBkdC5pbnZhbGlkKSB7XG5cdFx0XHRyZXR1cm4gZHQ7XG5cdFx0fVxuXHRcdHJldHVybiBsb2NIZWxwZXIuY2FzdE9iamVjdChkdCk7XG5cdH1cblxuXHQvKipcblx0ICogQXR0ZW1wdCB0byBwYXJzZSBhIHN0cmluZyBpbiB0aGlzIGZvcm1hdFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nICBUaGUgZGF0ZSBzdHJpbmdcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSAgVGhlIGxhbmd1YWdlIGxvY2FsZSBzdWNoIGFzIGVuLVVTLCBwdC1CUiwgemgsIGVzLCBldGMuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R8bnVsbH0gIE51bGwgaWYgZm9ybWF0IGNhbid0IGhhbmRsZSB0aGlzIHN0cmluZywgT2JqZWN0IGZvciByZXN1bHQgb3IgZXJyb3Jcblx0ICovXG5cdGF0dGVtcHQoc3RyaW5nLCBsb2NhbGUgPSBkZWZhdWx0TG9jYWxlKSB7XG5cdFx0c3RyaW5nID0gU3RyaW5nKHN0cmluZykudHJpbSgpO1xuXHRcdGNvbnN0IG1hdGNoZXMgPSB0aGlzLmdldE1hdGNoZXMoc3RyaW5nLCBsb2NhbGUpO1xuXHRcdGlmIChtYXRjaGVzKSB7XG5cdFx0XHRjb25zdCBkdCA9IHRoaXMudG9EYXRlVGltZShtYXRjaGVzLCBsb2NhbGUpO1xuXHRcdFx0aWYgKGR0ICYmICFkdC5pbnZhbGlkKSB7XG5cdFx0XHRcdHJldHVybiBkdDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIHRoZSBjdXJyZW50IGRhdGUgKHVzZWQgdG8gc3VwcG9ydCB1bml0IHRlc3RpbmcpXG5cdCAqIEByZXR1cm5zIHtEYXRlfVxuXHQgKi9cblx0bm93KCkge1xuXHRcdHJldHVybiBuZXcgRGF0ZSgpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybWF0O1xuIiwiY29uc3QgYmFzZUxvb2t1cHMgPSByZXF1aXJlKCcuLi9kYXRhL2Jhc2VMb29rdXBzLmpzJyk7XG5jb25zdCB7IGxhdG4sIG90aGVyIH0gPSByZXF1aXJlKCcuLi9kYXRhL3RlbXBsYXRlcy5qcycpO1xuY29uc3QgeyBidWlsZERpZ2l0cyB9ID0gcmVxdWlyZSgnLi4vZGF0YS9udW1iZXJpbmdTeXN0ZW1zLmpzJyk7XG5jb25zdCBkZWZhdWx0TG9jYWxlID0gcmVxdWlyZSgnLi4vZGF0YS9kZWZhdWx0TG9jYWxlLmpzJyk7XG5jb25zdCB1bml0cyA9IHJlcXVpcmUoJy4uL2RhdGEvdW5pdHMuanMnKTtcblxuLy8ga2VlcCB0cmFjayBvZiBzaW5nbGV0b25zIGJ5IGxvY2FsZSBuYW1lXG5jb25zdCBjYWNoZSA9IHt9O1xuXG5jbGFzcyBMb2NhbGVIZWxwZXIge1xuXHQvKipcblx0ICogR2V0IGEgc2luZ2xldG9uIGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIGxvY2FsZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIHN1Y2ggYXMgZW4sIGVuLVVTLCBlcywgZnItRlIsIGV0Yy5cblx0ICogQHJldHVybnMge0xvY2FsZUhlbHBlcn1cblx0ICovXG5cdHN0YXRpYyBmYWN0b3J5KGxvY2FsZSA9IGRlZmF1bHRMb2NhbGUpIHtcblx0XHRpZiAoIWNhY2hlW2xvY2FsZS50b0xvd2VyQ2FzZSgpXSkge1xuXHRcdFx0Y2FjaGVbbG9jYWxlLnRvTG93ZXJDYXNlKCldID0gbmV3IExvY2FsZUhlbHBlcihsb2NhbGUpO1xuXHRcdH1cblx0XHRyZXR1cm4gY2FjaGVbbG9jYWxlLnRvTG93ZXJDYXNlKCldO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSB3aXRoIHRoZSBnaXZlbiBsb2NhbGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBzdWNoIGFzIGVuLCBlbi1VUywgZXMsIGZyLUZSLCBldGMuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcihsb2NhbGUgPSBkZWZhdWx0TG9jYWxlKSB7XG5cdFx0LyoqXG5cdFx0ICogVGhlIGxvY2FsZSBzdHJpbmdcblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuXHRcdHRoaXMubG9jYWxlID0gbG9jYWxlO1xuXHRcdC8qKlxuXHRcdCAqIExvb2t1cHMgZm9yIHpvbmUsIHllYXIsIG1lcmlkaWVtLCBtb250aCwgZGF5bmFtZSwgZGlnaXRcblx0XHQgKiBAdHlwZSB7T2JqZWN0fSBsb29rdXBzXG5cdFx0ICovXG5cdFx0dGhpcy5sb29rdXBzID0geyAuLi5iYXNlTG9va3VwcyB9O1xuXHRcdC8qKlxuXHRcdCAqIFRlbXBsYXRlIHZhcmlhYmxlcyBpbmNsdWRpbmcgTU9OVEhOQU1FLCBNT05USCwgWk9ORSwgZXRjLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9IHZhcnNcblx0XHQgKi9cblx0XHR0aGlzLnZhcnMgPSB7IC4uLmxhdG4gfTtcblx0XHRjb25zdCBmbXQgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUpO1xuXHRcdC8qKlxuXHRcdCAqIFRoZSBudW1iZXJpbmcgc3lzdGVtIHRvIHVzZSAobGF0bj1zdGFuZGFyZCBhcmFiaWMgZGlnaXRzKVxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9IG51bWJlcmluZ1N5c3RlbVxuXHRcdCAqL1xuXHRcdHRoaXMubnVtYmVyaW5nU3lzdGVtID0gZm10LnJlc29sdmVkT3B0aW9ucygpLm51bWJlcmluZ1N5c3RlbTtcblx0XHR0aGlzLmJ1aWxkKCk7XG5cdFx0Ly8gY29uc29sZS5sb2coe1xuXHRcdC8vIFx0bnVtYmVyaW5nU3lzdGVtOiB0aGlzLm51bWJlcmluZ1N5c3RlbSxcblx0XHQvLyBcdG1vbnRoOiB0aGlzLmxvb2t1cHMubW9udGgsXG5cdFx0Ly8gXHRkYXluYW1lOiB0aGlzLmxvb2t1cHMuZGF5bmFtZSxcblx0XHQvLyBcdE1PTlRITkFNRTogdGhpcy52YXJzLk1PTlRITkFNRSxcblx0XHQvLyBcdERBWU5BTUU6IHRoaXMudmFycy5EQVlOQU1FLFxuXHRcdC8vIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhc3QgYSBzdHJpbmcgdG8gYW4gaW50ZWdlciwgbWluZGluZyBudW1iZXJpbmcgc3lzdGVtXG5cdCAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gZGlnaXRTdHJpbmcgIFN1Y2ggYXMgXCIyMDIwXCIgb3IgXCLkuozjgIfkuozjgIdcIlxuXHQgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgKi9cblx0dG9JbnQoZGlnaXRTdHJpbmcpIHtcblx0XHRpZiAodHlwZW9mIGRpZ2l0U3RyaW5nID09PSAnbnVtYmVyJykge1xuXHRcdFx0cmV0dXJuIGRpZ2l0U3RyaW5nO1xuXHRcdH1cblx0XHRpZiAodGhpcy5udW1iZXJpbmdTeXN0ZW0gPT09ICdsYXRuJykge1xuXHRcdFx0cmV0dXJuIHBhcnNlSW50KGRpZ2l0U3RyaW5nLCAxMCk7XG5cdFx0fVxuXHRcdGxldCBsYXRuID0gJyc7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkaWdpdFN0cmluZy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGF0biArPSBTdHJpbmcodGhpcy5sb29rdXBzLmRpZ2l0W2RpZ2l0U3RyaW5nW2ldXSk7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJzZUludChsYXRuLCAxMCk7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGQgbG9va3VwcyBmb3IgZGlnaXRzLCBtb250aCBuYW1lcywgZGF5IG5hbWVzLCBhbmQgbWVyaWRpZW1zIGJhc2VkIG9uIHRoZSBsb2NhbGVcblx0ICovXG5cdGJ1aWxkKCkge1xuXHRcdGlmICh0aGlzLm51bWJlcmluZ1N5c3RlbSAhPT0gJ2xhdG4nKSB7XG5cdFx0XHR0aGlzLmJ1aWxkTnVtYmVycygpO1xuXHRcdH1cblx0XHRpZiAoIS9eZW4vaS50ZXN0KHRoaXMubG9jYWxlKSkge1xuXHRcdFx0dGhpcy5idWlsZE1vbnRoTmFtZXMoKTtcblx0XHRcdHRoaXMuYnVpbGREYXluYW1lcygpO1xuXHRcdFx0dGhpcy5idWlsZE1lcmlkaWVtcygpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCdWlsZCBsb29rdXBzIGZvciBkaWdpdHNcblx0ICovXG5cdGJ1aWxkTnVtYmVycygpIHtcblx0XHRjb25zdCBuc05hbWUgPSB0aGlzLm51bWJlcmluZ1N5c3RlbTtcblx0XHRjb25zdCB7IGdyb3VwLCBsb29rdXAgfSA9IGJ1aWxkRGlnaXRzKG5zTmFtZSk7XG5cdFx0dGhpcy5sb29rdXBzLmRpZ2l0ID0gbG9va3VwO1xuXHRcdGZvciAoY29uc3QgbmFtZSBpbiBvdGhlcikge1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGlmICghb3RoZXIuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnZhcnNbbmFtZV0gPSBvdGhlcltuYW1lXS5yZXBsYWNlKC9cXCovZywgZ3JvdXApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBCdWlsZCBsb29rdXAgZm9yIG1vbnRoIG5hbWVzXG5cdCAqL1xuXHRidWlsZE1vbnRoTmFtZXMoKSB7XG5cdFx0Y29uc3QgdmFycyA9IHt9O1xuXHRcdGNvbnN0IGxvb2t1cCA9IHt9O1xuXHRcdGlmICgvXmZpL2kudGVzdCh0aGlzLmxvY2FsZSkpIHtcblx0XHRcdGNvbnN0IG1vbnRocyA9XG5cdFx0XHRcdCd0YW1taXxoZWxtaXxtYWFsaXN8aHVodGl8dG91a298a2Vzw6R8aGVpbsOkfGVsb3xzeXlzfGxva2F8bWFycmFzfGpvdWx1Jztcblx0XHRcdG1vbnRocy5zcGxpdCgnfCcpLmZvckVhY2goKG1vbnRoLCBpZHgpID0+IHtcblx0XHRcdFx0WycnLCAnaycsICdrdXUnLCAna3V1dGEnXS5mb3JFYWNoKChzdWZmaXgsIGkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBtYXliZVBlcmlvZCA9IGkgPCAyID8gJ1xcXFwuPycgOiAnJztcblx0XHRcdFx0XHR2YXJzW21vbnRoICsgc3VmZml4ICsgbWF5YmVQZXJpb2RdID0gdHJ1ZTtcblx0XHRcdFx0XHRsb29rdXBbbW9udGggKyBzdWZmaXhdID0gaWR4ICsgMTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZGF0ZXMgPSBbXTtcblx0XHRcdGNvbnN0IGZpbmRNb250aCA9IGl0ZW0gPT4gaXRlbS50eXBlID09PSAnbW9udGgnO1xuXHRcdFx0Zm9yIChsZXQgbW9udGhJZHggPSAwOyBtb250aElkeCA8IDEyOyBtb250aElkeCsrKSB7XG5cdFx0XHRcdGRhdGVzLnB1c2gobmV3IERhdGUoMjAxNywgbW9udGhJZHgsIDEpKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGRhdGVTdHlsZXMgPSBbJ2Z1bGwnLCAnbG9uZycsICdtZWRpdW0nXTtcblx0XHRcdGZvciAoY29uc3QgZGF0ZVN0eWxlIG9mIGRhdGVTdHlsZXMpIHtcblx0XHRcdFx0Y29uc3QgZm9ybWF0ID0gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLmxvY2FsZSwgeyBkYXRlU3R5bGUgfSk7XG5cdFx0XHRcdGZvciAobGV0IG1vbnRoSWR4ID0gMDsgbW9udGhJZHggPCAxMjsgbW9udGhJZHgrKykge1xuXHRcdFx0XHRcdGNvbnN0IHBhcnRzID0gZm9ybWF0LmZvcm1hdFRvUGFydHMoZGF0ZXNbbW9udGhJZHhdKTtcblx0XHRcdFx0XHRsZXQgdGV4dCA9IHBhcnRzLmZpbmQoZmluZE1vbnRoKS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdGlmICgvXmtvL2kudGVzdCh0aGlzLmxvY2FsZSkpIHtcblx0XHRcdFx0XHRcdC8vIEtvcmVhbiB3b3JkIGZvciBtb250aCBpcyBzb21ldGltZXMgdXNlZFxuXHRcdFx0XHRcdFx0dGV4dCArPSAn7JuUJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGRhdGVTdHlsZSA9PT0gJ21lZGl1bScpIHtcblx0XHRcdFx0XHRcdC8vIHNvbWUgbGFuZ3VhZ2VzIChpbmNsdWRpbmcgYXJhYmljIGFuZCBjaGluZXNlKSBkb24ndCBoYXZlIGEgJ21lZGl1bScgc2l6ZVxuXHRcdFx0XHRcdFx0aWYgKC9eYXJ8emgvaS50ZXN0KHRoaXMubG9jYWxlKSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXC4kLywgJycpO1xuXHRcdFx0XHRcdFx0dmFyc1tgJHt0ZXh0fVxcXFwuP2BdID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFyc1t0ZXh0XSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxvb2t1cFt0ZXh0XSA9IG1vbnRoSWR4ICsgMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y29uc3QgZm9ybWF0ID0gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLmxvY2FsZSwgeyBtb250aDogJ3Nob3J0JyB9KTtcblx0XHRcdGZvciAobGV0IG1vbnRoSWR4ID0gMDsgbW9udGhJZHggPCAxMjsgbW9udGhJZHgrKykge1xuXHRcdFx0XHRjb25zdCBwYXJ0cyA9IGZvcm1hdC5mb3JtYXRUb1BhcnRzKGRhdGVzW21vbnRoSWR4XSk7XG5cdFx0XHRcdGxldCB0ZXh0ID0gcGFydHMuZmluZChmaW5kTW9udGgpLnZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcLiQvLCAnJyk7XG5cdFx0XHRcdHZhcnNbYCR7dGV4dH1cXFxcLj9gXSA9IHRydWU7XG5cdFx0XHRcdGxvb2t1cFt0ZXh0XSA9IG1vbnRoSWR4ICsgMTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy52YXJzLk1PTlRITkFNRSA9IE9iamVjdC5rZXlzKHZhcnMpLmpvaW4oJ3wnKTtcblx0XHR0aGlzLmxvb2t1cHMubW9udGggPSBsb29rdXA7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGQgbG9va3VwIGZvciBkYXkgbmFtZVxuXHQgKi9cblx0YnVpbGREYXluYW1lcygpIHtcblx0XHRjb25zdCBkYXRlcyA9IFtdO1xuXHRcdGNvbnN0IGZpbmREYXkgPSBpdGVtID0+IGl0ZW0udHlwZSA9PT0gJ3dlZWtkYXknO1xuXHRcdGZvciAobGV0IGRheUluZGV4ID0gMDsgZGF5SW5kZXggPCA3OyBkYXlJbmRleCsrKSB7XG5cdFx0XHRkYXRlcy5wdXNoKG5ldyBEYXRlKDIwMTcsIDAsIGRheUluZGV4ICsgMSkpO1xuXHRcdH1cblx0XHRjb25zdCB3ZWVrZGF5cyA9IFsnbG9uZycsICdzaG9ydCddO1xuXHRcdGNvbnN0IGxpc3QgPSBbXTtcblx0XHRjb25zdCBsb29rdXAgPSB7fTtcblx0XHRmb3IgKGNvbnN0IHdlZWtkYXkgb2Ygd2Vla2RheXMpIHtcblx0XHRcdGNvbnN0IGZvcm1hdCA9IEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5sb2NhbGUsIHsgd2Vla2RheSB9KTtcblx0XHRcdGZvciAobGV0IGRheUluZGV4ID0gMDsgZGF5SW5kZXggPCA3OyBkYXlJbmRleCsrKSB7XG5cdFx0XHRcdGNvbnN0IHBhcnRzID0gZm9ybWF0LmZvcm1hdFRvUGFydHMoZGF0ZXNbZGF5SW5kZXhdKTtcblx0XHRcdFx0bGV0IHRleHQgPSBwYXJ0cy5maW5kKGZpbmREYXkpLnZhbHVlLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdGlmICh3ZWVrZGF5ID09PSAnc2hvcnQnKSB7XG5cdFx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSgvXFwuJC8sICcnKTtcblx0XHRcdFx0XHRsaXN0LnB1c2goYCR7dGV4dH1cXFxcLj9gKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsaXN0LnB1c2godGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bG9va3VwW3RleHRdID0gZGF5SW5kZXg7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudmFycy5EQVlOQU1FID0gbGlzdC5qb2luKCd8Jyk7XG5cdFx0dGhpcy5sb29rdXBzLmRheW5hbWUgPSBsb29rdXA7XG5cdH1cblxuXHQvKipcblx0ICogQnVpbGQgbG9va3VwIGZvciBtZXJpZGllbXMgKGUuZy4gQU0vUE0pXG5cdCAqL1xuXHRidWlsZE1lcmlkaWVtcygpIHtcblx0XHRjb25zdCBkYXRlcyA9IFtuZXcgRGF0ZSgyMDE3LCAwLCAxKSwgbmV3IERhdGUoMjAxNywgMCwgMSwgMjMsIDAsIDApXTtcblx0XHRjb25zdCBmaW5kRGF5UGVyaW9kID0gaXRlbSA9PiBpdGVtLnR5cGUgPT09ICdkYXlQZXJpb2QnO1xuXHRcdGNvbnN0IGxpc3QgPSBbXTtcblx0XHRjb25zdCBsb29rdXAgPSB7fTtcblx0XHRjb25zdCBmb3JtYXQgPSBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMubG9jYWxlLCB7IHRpbWVTdHlsZTogJ2xvbmcnIH0pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XG5cdFx0XHRjb25zdCBwYXJ0cyA9IGZvcm1hdC5mb3JtYXRUb1BhcnRzKGRhdGVzW2ldKTtcblx0XHRcdGNvbnN0IGRheVBlcmlvZCA9IHBhcnRzLmZpbmQoZmluZERheVBlcmlvZCk7XG5cdFx0XHRpZiAoIWRheVBlcmlvZCkge1xuXHRcdFx0XHQvLyB0aGlzIGxvY2FsZSBkb2VzIG5vdCB1c2UgQU0vUE1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdGV4dCA9IGRheVBlcmlvZC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0bGlzdC5wdXNoKHRleHQpO1xuXHRcdFx0bG9va3VwW3RleHRdID0gaSAqIDEyO1xuXHRcdH1cblx0XHR0aGlzLnZhcnMuTUVSSURJRU0gPSBsaXN0LmpvaW4oJ3wnKTtcblx0XHR0aGlzLmxvb2t1cHMubWVyaWRpZW0gPSBsb29rdXA7XG5cdH1cblxuXHQvKipcblx0ICogR2l2ZW4gYSBsaXN0IG9mIHVuaXQgbmFtZXMgYW5kIG1hdGNoZXMsIGJ1aWxkIHJlc3VsdCBvYmplY3Rcblx0ICogQHBhcmFtIHtBcnJheX0gdW5pdHMgIFVuaXQgbmFtZXMgc3VjaCBhcyBcInllYXJcIiwgXCJtb250aFwiIGFuZCBcIm1pbGxpc2Vjb25kXCJcblx0ICogQHBhcmFtIHtBcnJheX0gbWF0Y2hlcyAgVGhlIHZhbHVlcyBtYXRjaGVkIGJ5IGEgRm9ybWF0J3MgUmVnRXhwXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAqL1xuXHRnZXRPYmplY3QodW5pdHMsIG1hdGNoZXMpIHtcblx0XHRjb25zdCBvYmplY3QgPSB7fTtcblx0XHR1bml0cy5mb3JFYWNoKCh1bml0LCBpKSA9PiB7XG5cdFx0XHRpZiAoIXVuaXQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bGV0IG1hdGNoID0gbWF0Y2hlc1tpICsgMV07XG5cdFx0XHRtYXRjaCA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL1xcLiQvLCAnJyk7XG5cdFx0XHRpZiAodW5pdCA9PT0gJ29mZnNldCcpIHtcblx0XHRcdFx0b2JqZWN0Lm9mZnNldCA9IHRoaXMub2Zmc2V0VG9NaW51dGVzKG1hdGNoKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5sb29rdXBzW3VuaXRdKSB7XG5cdFx0XHRcdG9iamVjdFt1bml0XSA9IHRoaXMubG9va3Vwc1t1bml0XVttYXRjaF0gfHwgdGhpcy50b0ludChtYXRjaCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvYmplY3RbdW5pdF0gPSB0aGlzLnRvSW50KG1hdGNoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRha2UgYSByZXNwb25zZSBvYmplY3QgYW5kIGNhc3QgZWFjaCB1bml0IHRvIE51bWJlclxuXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0ICBBbiBvYmplY3Qgd2l0aCBvbmUgb3IgbW9yZSB1bml0c1xuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSAgQW4gb2JqZWN0IHdpdGggc2FtZSB1bml0cyBidXQgTnVtZXJpY1xuXHQgKi9cblx0Y2FzdE9iamVjdChvYmplY3QpIHtcblx0XHRjb25zdCBjYXN0ZWQgPSB7fTtcblx0XHR1bml0cy5mb3JFYWNoKHVuaXQgPT4ge1xuXHRcdFx0aWYgKHVuaXQgaW4gb2JqZWN0KSB7XG5cdFx0XHRcdGNhc3RlZFt1bml0XSA9IHRoaXMudG9JbnQob2JqZWN0W3VuaXRdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAodHlwZW9mIG9iamVjdC5vZmZzZXQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRjYXN0ZWQub2Zmc2V0ID0gdGhpcy5vZmZzZXRUb01pbnV0ZXMob2JqZWN0Lm9mZnNldCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0Lm9mZnNldCA9PT0gJ251bWJlcicpIHtcblx0XHRcdGNhc3RlZC5vZmZzZXQgPSBvYmplY3Qub2Zmc2V0O1xuXHRcdH1cblx0XHRyZXR1cm4gY2FzdGVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgYW4gb2Zmc2V0IHN0cmluZyB0byBOdW1lcmljIG1pbnV0ZXMgKGUuZy4gXCItMDUwMFwiLCBcIis1XCIsIFwiKzAzOjMwXCIpXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBvZmZzZXRTdHJpbmdcblx0ICogQHJldHVybnMge051bWJlcn1cblx0ICovXG5cdG9mZnNldFRvTWludXRlcyhvZmZzZXRTdHJpbmcpIHtcblx0XHRjb25zdCBjYXB0dXJlZCA9IG9mZnNldFN0cmluZy5tYXRjaCgvXihbKy1dKSguLj8pOj8oLi4pPyQvKTtcblx0XHRpZiAoY2FwdHVyZWQpIHtcblx0XHRcdGNvbnN0IFssIHNpZ24sIGhvdXJzLCBtaW51dGVzXSA9IGNhcHR1cmVkO1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0KHNpZ24gPT09ICctJyA/IC0xIDogMSkgKlxuXHRcdFx0XHQodGhpcy50b0ludChob3VycykgKiA2MCArIHRoaXMudG9JbnQobWludXRlcyB8fCAwKSlcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbXBpbGUgdGVtcGxhdGUgaW50byBhIFJlZ0V4cCBhbmQgcmV0dXJuIGl0XG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAgVGhlIHRlbXBsYXRlIHN0cmluZ1xuXHQgKiBAcmV0dXJucyB7UmVnRXhwfVxuXHQgKi9cblx0Y29tcGlsZSh0ZW1wbGF0ZSkge1xuXHRcdGNvbnN0IHJlZ2V4U3RyaW5nID0gdGVtcGxhdGUucmVwbGFjZSgvXyhbQS1aMC05XSspXy9nLCAoJDAsICQxKSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMudmFyc1skMV0pIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUZW1wbGF0ZSBzdHJpbmcgY29udGFpbnMgaW52YWxpZCB2YXJpYWJsZSBfJHskMX1fYCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy52YXJzWyQxXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3IFJlZ0V4cChyZWdleFN0cmluZywgJ2knKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2FsZUhlbHBlcjtcbiIsImNvbnN0IGRlZmF1bHRMb2NhbGUgPSByZXF1aXJlKCcuLi9kYXRhL2RlZmF1bHRMb2NhbGUuanMnKTtcbmNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTsgLy8gcmVxdWlyZWQgdG8gZ2VuZXJhdGUgaW5kZXguZC50c1xuY29uc3QgZnJvbVN0cmluZyA9IHJlcXVpcmUoJy4uL2Zyb21TdHJpbmcvZnJvbVN0cmluZy5qcycpO1xuY29uc3QgZnJvbUFueSA9IHJlcXVpcmUoJy4uL2Zyb21BbnkvZnJvbUFueS5qcycpO1xuXG5jbGFzcyBQYXJzZXIge1xuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBhbiBvYmplY3Qgd2l0aCBhbiBlbXB0eSBhcnJheSBvZiByZWdpc3RlcmVkIGZvcm1hdHNcblx0ICovXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuZm9ybWF0cyA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGEgZm9ybWF0IG9iamVjdCByZXByZXNlbnRpbmcgYSBwYXJzZWFibGUgZGF0ZSBmb3JtYXRcblx0ICogQHBhcmFtIHtGb3JtYXR9IGZvcm1hdCAgVGhlIEZvcm1hdCB0byBhZGRcblx0ICogQHJldHVybnMge1BhcnNlcn1cblx0ICogQGNoYWluYWJsZVxuXHQgKi9cblx0YWRkRm9ybWF0KGZvcm1hdCkge1xuXHRcdHRoaXMuZm9ybWF0cy5wdXNoKGZvcm1hdCk7XG5cdFx0Zm9ybWF0LnBhcnNlciA9IHRoaXM7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXIgbXVsdGlwbGUgZm9ybWF0c1xuXHQgKiBAcGFyYW0ge0Zvcm1hdFtdfSBmb3JtYXRzICBUaGUgYXJyYXkgb2YgRm9ybWF0cyB0byBhZGRcblx0ICogQHJldHVybnMge1BhcnNlcn1cblx0ICogQGNoYWluYWJsZVxuXHQgKi9cblx0YWRkRm9ybWF0cyhmb3JtYXRzKSB7XG5cdFx0Zm9ybWF0cy5mb3JFYWNoKGZvcm1hdCA9PiB0aGlzLmFkZEZvcm1hdChmb3JtYXQpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBVbnJlZ2lzdGVyIGEgZm9ybWF0XG5cdCAqIEBwYXJhbSB7Rm9ybWF0fSBmb3JtYXQgIFRoZSBGb3JtYXQgdG8gcmVtb3ZlXG5cdCAqIEByZXR1cm5zIHtCb29sZWFufSAgdHJ1ZSBpZiBmb3JtYXQgd2FzIGZvdW5kIGFuZCByZW1vdmVkLCBmYWxzZSBpZiBpdCB3YXNuJ3QgcmVnaXN0ZXJlZFxuXHQgKi9cblx0cmVtb3ZlRm9ybWF0KGZvcm1hdCkge1xuXHRcdGNvbnN0IGlkeCA9IHRoaXMuZm9ybWF0cy5pbmRleE9mKGZvcm1hdCk7XG5cdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHRjb25zdCBvbGQgPSB0aGlzLmZvcm1hdHNbaWR4XTtcblx0XHRcdHRoaXMuZm9ybWF0cy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdG9sZC5wYXJzZXIgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBdHRlbXB0IHRvIHBhcnNlIGEgZGF0ZSBzdHJpbmdcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgIEEgcGFyc2VhYmxlIGRhdGUgc3RyaW5nXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgIFRoZSBuYW1lIG9mIHRoZSBsb2NhbGVcblx0ICogQHJldHVybnMge09iamVjdH1cblx0ICovXG5cdGF0dGVtcHQoZGF0ZSwgbG9jYWxlID0gZGVmYXVsdExvY2FsZSkge1xuXHRcdGZvciAoY29uc3QgZm9ybWF0IG9mIHRoaXMuZm9ybWF0cykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRBcnJheS5pc0FycmF5KGZvcm1hdC5sb2NhbGVzKSAmJlxuXHRcdFx0XHRmb3JtYXQubG9jYWxlcy5sZW5ndGggPiAwICYmXG5cdFx0XHRcdCFmb3JtYXQubG9jYWxlcy5pbmNsdWRlcyhuZXcgSW50bC5Mb2NhbGUobG9jYWxlKS5iYXNlTmFtZSlcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBzb21lIGZvcm1hdHMgb25seSBtYWtlIHNlbnNlIGZvciBjZXJ0YWluIGxvY2FsZXMsIGUuZy4gbW9udGgvZGF5L3llYXJcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBkdCA9IGZvcm1hdC5hdHRlbXB0KGRhdGUsIGxvY2FsZSk7XG5cdFx0XHRpZiAoZHQpIHtcblx0XHRcdFx0cmV0dXJuIGR0O1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBVaCBPaCEgV2UgZG9uJ3Qga25vdyB0aGF0IG9uZVxuXHRcdGxldCBzdHJpbmcgPSBTdHJpbmcoZGF0ZSkuc2xpY2UoMCwgMjAwKTtcblx0XHRpZiAoc3RyaW5nID09PSAnJykge1xuXHRcdFx0c3RyaW5nID0gJ2VtcHR5IHN0cmluZyc7XG5cdFx0fVxuXHRcdHJldHVybiB7IGludmFsaWQ6IGBVbmFibGUgdG8gcGFyc2UgJHtzdHJpbmd9YCB9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4cG9ydCB0aGlzIHBhcnNlciBhcyBhIHNpbmdsZSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgc3RyaW5nXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgIFRoZSBkZWZhdWx0IGxvY2FsZSBpdCBzaG91bGQgdXNlXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn1cblx0ICovXG5cdGV4cG9ydEFzRnVuY3Rpb24obG9jYWxlID0gZGVmYXVsdExvY2FsZSkge1xuXHRcdHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGxvY2FsZSk7XG5cdH1cblxuXHQvKipcblx0ICogRXhwb3J0IHRoaXMgcGFyc2VyIGFzIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBzdHJpbmcgb3IgRGF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlICBUaGUgZGVmYXVsdCBsb2NhbGUgaXQgc2hvdWxkIHVzZVxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAqL1xuXHRleHBvcnRBc0Z1bmN0aW9uQW55KGxvY2FsZSA9IGRlZmF1bHRMb2NhbGUpIHtcblx0XHRyZXR1cm4gZnJvbUFueShmcm9tU3RyaW5nKHRoaXMsIGxvY2FsZSkpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyO1xuIiwiY29uc3QgdHdvRGlnaXRZZWFycyA9IHJlcXVpcmUoJy4vdHdvRGlnaXRZZWFycy5qcycpO1xuY29uc3QgdGltZXpvbmVOYW1lcyA9IHJlcXVpcmUoJy4vdGltZXpvbmVOYW1lcy5qcycpO1xuXG5jb25zdCBiYXNlTG9va3VwcyA9IHtcblx0em9uZTogdGltZXpvbmVOYW1lcyxcblx0eWVhcjogdHdvRGlnaXRZZWFycyxcblx0bWVyaWRpZW06IHsgYW06IDAsIHBtOiAxMiwgJ2EubS4nOiAwLCAncC5tLic6IDEyIH0sXG5cdG1vbnRoOiB7XG5cdFx0amFudWFyeTogMSxcblx0XHRqYW46IDEsXG5cdFx0ZmVicnVhcnk6IDIsXG5cdFx0ZmViOiAyLFxuXHRcdG1hcmNoOiAzLFxuXHRcdG1hcjogMyxcblx0XHRhcHJpbDogNCxcblx0XHRhcHI6IDQsXG5cdFx0bWF5OiA1LFxuXHRcdGp1bmU6IDYsXG5cdFx0anVuOiA2LFxuXHRcdGp1bHk6IDcsXG5cdFx0anVsOiA3LFxuXHRcdGF1Z3VzdDogOCxcblx0XHRhdWc6IDgsXG5cdFx0c2VwdGVtYmVyOiA5LFxuXHRcdHNlcDogOSxcblx0XHRvY3RvYmVyOiAxMCxcblx0XHRvY3Q6IDEwLFxuXHRcdG5vdmVtYmVyOiAxMSxcblx0XHRub3Y6IDExLFxuXHRcdGRlY2VtYmVyOiAxMixcblx0XHRkZWM6IDEyLFxuXHR9LFxuXHRkYXluYW1lOiB7XG5cdFx0c3VuZGF5OiAwLFxuXHRcdHN1bjogMCxcblx0XHRtb25kYXk6IDEsXG5cdFx0bW9uOiAxLFxuXHRcdHR1ZXNkYXk6IDIsXG5cdFx0dHVlOiAyLFxuXHRcdHdlZG5lc2RheTogMyxcblx0XHR3ZWQ6IDMsXG5cdFx0dGh1cnNkYXk6IDQsXG5cdFx0dGh1OiA0LFxuXHRcdGZyaWRheTogNSxcblx0XHRmcmk6IDUsXG5cdFx0c2F0dXJkYXk6IDYsXG5cdFx0c2F0OiA2LFxuXHR9LFxuXHRkaWdpdDoge30sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VMb29rdXBzO1xuIiwiY29uc3Qgbm9ybWFsaXplTG9jYWxlID0gcmVxdWlyZSgnLi9ub3JtYWxpemVMb2NhbGUuanMnKTtcblxubGV0IGRlZmF1bHRMb2NhbGU7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG5cdC8vIGJyb3dzZXI6IGxvY2FsZSBpcyBvbiBuYXZpZ2F0b3Igb2JqZWN0XG5cdGNvbnN0IG5hdiA9IG5hdmlnYXRvcjtcblx0ZGVmYXVsdExvY2FsZSA9IEFycmF5LmlzQXJyYXkobmF2Lmxhbmd1YWdlcylcblx0XHQ/IG5hdi5sYW5ndWFnZXNbMF1cblx0XHQ6IG5hdi5sYW5ndWFnZTtcbn0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnKSB7XG5cdC8vIG5vZGU6IGxvY2FsZSBpcyBhbiBlbnYgdmFyXG5cdGNvbnN0IGVudiA9IHByb2Nlc3MuZW52O1xuXHRkZWZhdWx0TG9jYWxlID0gZW52LkxDX0FMTCB8fCBlbnYuTENfTUVTU0FHRVMgfHwgZW52LkxBTkcgfHwgZW52LkxBTkdVQUdFO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmICghZGVmYXVsdExvY2FsZSkge1xuXHRkZWZhdWx0TG9jYWxlID0gJ2VuLVVTJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBub3JtYWxpemVMb2NhbGUoZGVmYXVsdExvY2FsZSk7XG4iLCIvKipcbiAqIEdpdmVuIGEgbG9jYWxlIHN0cmluZyBmcm9tIGFuIG9wZXJhdGluZyBzeXN0ZW0gb3IgcHJvY2VzcyBlbnYsIG5vcm1hbGl6ZSB0aGUgbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgIEEgbmFtZSBzdWNoIGFzIGZyX0ZSLCBlbi1VUywgZW4tdXMudXRmLThcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvb3MtbG9jYWxlL2Jsb2IvbWFpbi9pbmRleC5qcyBmb3Igc2ltaWxhciBjb2RlXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShuYW1lKSB7XG5cdC8vIHNvbWUgc3lzdGVtcyB1c2UgdW5kZXJzY29yZXNcblx0bmFtZSA9IG5hbWUucmVwbGFjZSgvXy9nLCAnLScpO1xuXHQvLyBzb21lIHN5c3RlbXMgYXBwZW5kIHN0cmluZ3MgbGlrZSAuVVRGLThcblx0bmFtZSA9IG5hbWUucmVwbGFjZSgvWy46XVtcXHctXSokLywgJycpO1xuXHR0cnkge1xuXHRcdHJldHVybiBuZXcgSW50bC5Mb2NhbGUobmFtZSkuYmFzZU5hbWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gJ2VuLVVTJztcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5vcm1hbGl6ZUxvY2FsZTtcbiIsImNvbnN0IHN0YXJ0Q29kZXMgPSB7XG5cdGFyYWI6IDE2MzIsXG5cdGFyYWJleHQ6IDE3NzYsXG5cdGJhbGk6IDY5OTIsXG5cdGJlbmc6IDI1MzQsXG5cdGRldmE6IDI0MDYsXG5cdGZ1bGx3aWRlOiA2NTI5Nixcblx0Z3VqcjogMjc5MCxcblx0a2htcjogNjExMixcblx0a25kYTogMzMwMixcblx0bGFvbzogMzc5Mixcblx0bGltYjogNjQ3MCxcblx0bWx5bTogMzQzMCxcblx0bW9uZzogNjE2MCxcblx0bXltcjogNDE2MCxcblx0b3J5YTogMjkxOCxcblx0dGFtbGRlYzogMzA0Nixcblx0dGVsdTogMzE3NCxcblx0dGhhaTogMzY2NCxcblx0dGlidDogMzg3Mixcbn07XG5cbi8vIGZ1bGwtd2lkdGggbnVtYmVycywgaGFuaWRlYyBudW1iZXJzLCBsYXRpbiBudW1iZXJzIChcXGQpXG5jb25zdCBjaGluZXNlR3JvdXAgPSAnW++8kO+8ke+8ku+8k++8lO+8le+8lu+8l++8mO+8meOAh+S4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVxcXFxkXSc7XG5cbmNvbnN0IGRlZmF1bHRMb29rdXAgPSB7XG5cdDA6IDAsXG5cdDE6IDEsXG5cdDI6IDIsXG5cdDM6IDMsXG5cdDQ6IDQsXG5cdDU6IDUsXG5cdDY6IDYsXG5cdDc6IDcsXG5cdDg6IDgsXG5cdDk6IDksXG5cdCfvvJAnOiAwLFxuXHQn77yRJzogMSxcblx0J++8kic6IDIsXG5cdCfvvJMnOiAzLFxuXHQn77yUJzogNCxcblx0J++8lSc6IDUsXG5cdCfvvJYnOiA2LFxuXHQn77yXJzogNyxcblx0J++8mCc6IDgsXG5cdCfvvJknOiA5LFxuXHTjgIc6IDAsXG5cdOS4gDogMSxcblx05LqMOiAyLFxuXHTkuIk6IDMsXG5cdOWbmzogNCxcblx05LqUOiA1LFxuXHTlha06IDYsXG5cdOS4gzogNyxcblx05YWrOiA4LFxuXHTkuZ06IDksXG59O1xuXG5jb25zdCBjYWNoZSA9IHt9O1xuXG5mdW5jdGlvbiBidWlsZERpZ2l0cyhuc05hbWUpIHtcblx0aWYgKGNhY2hlW25zTmFtZV0pIHtcblx0XHRyZXR1cm4gY2FjaGVbbnNOYW1lXTtcblx0fVxuXHRpZiAobnNOYW1lID09PSAnZnVsbHdpZGUnIHx8IG5zTmFtZSA9PT0gJ2hhbmlkZWMnKSB7XG5cdFx0cmV0dXJuIHsgZ3JvdXA6IGNoaW5lc2VHcm91cCwgbG9va3VwOiB7IC4uLmRlZmF1bHRMb29rdXAgfSB9O1xuXHR9XG5cdGNvbnN0IHN0YXJ0Q29kZSA9IHN0YXJ0Q29kZXNbbnNOYW1lXTtcblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0aWYgKCFzdGFydENvZGUpIHtcblx0XHQvLyB1bmtub3duIG51bWJlcmluZyBzeXN0ZW07IHRyZWF0IGxpa2UgbGF0blxuXHRcdHJldHVybiB7IGdyb3VwOiAnXFxcXGQnLCBsb29rdXA6IHsgLi4uZGVmYXVsdExvb2t1cCB9IH07XG5cdH1cblx0Y29uc3Qgc3RhcnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHN0YXJ0Q29kZSk7XG5cdGNvbnN0IGVuZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoc3RhcnRDb2RlICsgOSk7XG5cdGNvbnN0IGxvb2t1cCA9IHt9O1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRsb29rdXBbU3RyaW5nLmZyb21DaGFyQ29kZShzdGFydENvZGUgKyBpKV0gPSBpO1xuXHR9XG5cdC8vIGNvbnNvbGUubG9nKHsgbnNOYW1lLCBzdGFydCwgZW5kLCBsb29rdXAgfSk7XG5cdGNhY2hlW25zTmFtZV0gPSB7XG5cdFx0Z3JvdXA6IGBbJHtzdGFydH0tJHtlbmR9XWAsXG5cdFx0bG9va3VwLFxuXHR9O1xuXHRyZXR1cm4gY2FjaGVbbnNOYW1lXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IGNoaW5lc2VHcm91cCwgZGVmYXVsdExvb2t1cCwgc3RhcnRDb2RlcywgYnVpbGREaWdpdHMgfTtcbiIsImNvbnN0IHRpbWV6b25lTmFtZXMgPSByZXF1aXJlKCcuL3RpbWV6b25lTmFtZXMuanMnKTtcblxuY29uc3QgbGF0biA9IHtcblx0TU9OVEhOQU1FOlxuXHRcdCdqYW51YXJ5fGZlYnJ1YXJ5fG1hcmNofGFwcmlsfG1heXxqdW5lfGp1bHl8YXVndXN0fHNlcHRlbWJlcnxvY3RvYmVyfG5vdmVtYmVyfGRlY2VtYmVyfGphblxcXFwuP3xmZWJcXFxcLj98bWFyXFxcXC4/fGFwclxcXFwuP3xtYXlcXFxcLj98anVuXFxcXC4/fGp1bFxcXFwuP3xhdWdcXFxcLj98c2VwXFxcXC4/fG9jdFxcXFwuP3xub3ZcXFxcLj98ZGVjXFxcXC4/Jyxcblx0REFZTkFNRTpcblx0XHQnc3VuZGF5fG1vbmRheXx0dWVzZGF5fHdlZG5lc2RheXx0aHVyc2RheXxmcmlkYXl8c2F0dXJkYXl8c3VuXFxcXC4/fG1vblxcXFwuP3x0dWVcXFxcLj98d2VkXFxcXC4/fHRodVxcXFwuP3xmcmlcXFxcLj98c2F0XFxcXC4/Jyxcblx0Wk9ORTogJ1xcXFwoPygnICsgT2JqZWN0LmtleXModGltZXpvbmVOYW1lcykuam9pbignfCcpICsgJylcXFxcKT8nLFxuXHRNRVJJRElFTTogJ1thcF1cXFxcLj9tP1xcXFwuPycsXG5cdE9SRElOQUw6ICdzdHxuZHxyZHx0aHxcXFxcLicsXG5cdFlFQVI6ICdbMS05XVxcXFxkezN9fFxcXFxkezJ9Jyxcblx0TU9OVEg6ICcxWzAtMl18MD9bMS05XScsXG5cdE1PTlRIMjogJzFbMC0yXXwwWzEtOV0nLFxuXHREQVk6ICczWzAxXXxbMTJdXFxcXGR8MD9bMS05XScsXG5cdERBWTI6ICczWzAxXXxbMTJdXFxcXGR8MFsxLTldJyxcblx0T0ZGU0VUOiAnWystXVswMV0/XFxcXGQ/XFxcXDo/KD86WzAtNV1cXFxcZCk/Jyxcblx0SDI0OiAnWzAxXVxcXFxkfDJbMC0zXScsXG5cdEgxMjogJzA/WzEtOV18MVswMTJdJyxcblx0TUlOOiAnWzAtNV1cXFxcZCcsXG5cdFNFQzogJ1swLTVdXFxcXGR8NjAnLFxuXHRNUzogJ1xcXFxkezl9fFxcXFxkezZ9fFxcXFxkezEsM30nLFxuXHRTUEFDRTogJ1tcXFxccywtXScsXG59O1xuXG5jb25zdCBvdGhlciA9IHtcblx0Li4ubGF0bixcblx0WUVBUjogJyp7NH18KnsyfScsXG5cdE1PTlRIOiAnKnsxLDJ9Jyxcblx0TU9OVEgyOiAnKnsyfScsXG5cdERBWTogJyp7MSwyfScsXG5cdERBWTI6ICcqezJ9Jyxcblx0T0ZGU0VUOiAnWystXSp7MSwyfVxcXFw6Pyp7MCwyfScsXG5cdEgyNDogJyp7Mn0nLFxuXHRIMTI6ICcqezEsMn0nLFxuXHRNSU46ICcqezJ9Jyxcblx0U0VDOiAnKnsyfScsXG5cdE1TOiAnKns5fXwqezZ9fCp7M30nLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGxhdG4sIG90aGVyIH07XG4iLCIvLyBzb21lIGhhbmQtcGlja2VkIGNvbW1vbiB0aW1lem9uZSBuYW1lc1xuY29uc3QgdGltZXpvbmVOYW1lcyA9IHtcblx0J0Vhc3Rlcm4gRGF5bGlnaHQgVGltZSc6IC0yNDAsXG5cdCdFYXN0ZXJuIFN0YW5kYXJkIFRpbWUnOiAtMzAwLFxuXHQnQ2VudHJhbCBEYXlsaWdodCBUaW1lJzogLTMwMCxcblx0J0NlbnRyYWwgU3RhbmRhcmQgVGltZSc6IC0zNjAsXG5cdCdNb3VudGFpbiBEYXlsaWdodCBUaW1lJzogLTM2MCxcblx0J01vdW50YWluIFN0YW5kYXJkIFRpbWUnOiAtNDIwLFxuXHQnUGFjaWZpYyBEYXlsaWdodCBUaW1lJzogLTQyMCxcblx0J1BhY2lmaWMgU3RhbmRhcmQgVGltZSc6IC00ODAsXG5cdEFDRFQ6IDYzMCwgLy8gQXVzdHJhbGlhbiBDZW50cmFsIERheWxpZ2h0IFNhdmluZ3MgVGltZVxuXHRBQ1NUOiA1NzAsIC8vIEF1c3RyYWxpYW4gQ2VudHJhbCBTdGFuZGFyZCBUaW1lXG5cdEFDVDogNDgwLCAvLyBBU0VBTiBDb21tb24gVGltZVxuXHRBRFQ6IC0xODAsIC8vIEF0bGFudGljIERheWxpZ2h0IFRpbWVcblx0QUVEVDogNjYwLCAvLyBBdXN0cmFsaWFuIEVhc3Rlcm4gRGF5bGlnaHQgU2F2aW5ncyBUaW1lXG5cdEFFU1Q6IDYwMCwgLy8gQXVzdHJhbGlhbiBFYXN0ZXJuIFN0YW5kYXJkIFRpbWVcblx0QUZUOiAyNzAsIC8vIEFmZ2hhbmlzdGFuIFRpbWVcblx0QUtEVDogLTQ4MCwgLy8gQWxhc2thIERheWxpZ2h0IFRpbWVcblx0QUtTVDogLTU0MCwgLy8gQWxhc2thIFN0YW5kYXJkIFRpbWVcblx0QU1TVDogLTE4MCwgLy8gQW1hem9uIFN1bW1lciBUaW1lIChCcmF6aWwpXG5cdEFNVDogLTI0MCwgLy8gQW1hem9uIFRpbWUgKEJyYXppbClcblx0QVJUOiAtMTgwLCAvLyBBcmdlbnRpbmEgVGltZVxuXHRBU1Q6IDE4MCwgLy8gQXJhYmlhIFN0YW5kYXJkIFRpbWVcblx0QVdEVDogNTQwLCAvLyBBdXN0cmFsaWFuIFdlc3Rlcm4gRGF5bGlnaHQgVGltZVxuXHRBV1NUOiA0ODAsIC8vIEF1c3RyYWxpYW4gV2VzdGVybiBTdGFuZGFyZCBUaW1lXG5cdEFaT1NUOiAtNjAsIC8vIEF6b3JlcyBTdGFuZGFyZCBUaW1lXG5cdEFaVDogMjQwLCAvLyBBemVyYmFpamFuIFRpbWVcblx0QkRUOiAzNjAsIC8vIEJhbmdsYWRlc2ggRGF5bGlnaHQgVGltZSAoQmFuZ2xhZGVzaCBEYXlsaWdodCBzYXZpbmcgdGltZSBrZWVwcyBVVEMrMDYgb2Zmc2V0KVxuXHRCSU9UOiAzNjAsIC8vIEJyaXRpc2ggSW5kaWFuIE9jZWFuIFRpbWVcblx0QklUOiAtNzIwLCAvLyBCYWtlciBJc2xhbmQgVGltZVxuXHRCT1Q6IC0yNDAsIC8vIEJvbGl2aWEgVGltZVxuXHRCUlNUOiAtMTIwLCAvLyBCcmFzaWxpYSBTdW1tZXIgVGltZVxuXHRCUlQ6IC0xODAsIC8vIEJyYXNpbGlhIFRpbWVcblx0QlRUOiAzNjAsIC8vIEJodXRhbiBUaW1lXG5cdENBVDogMTIwLCAvLyBDZW50cmFsIEFmcmljYSBUaW1lXG5cdENDVDogMzkwLCAvLyBDb2NvcyBJc2xhbmRzIFRpbWVcblx0Q0RUOiAtMzAwLCAvLyBDZW50cmFsIERheWxpZ2h0IFRpbWUgKE5vcnRoIEFtZXJpY2EpXG5cdENFRFQ6IDEyMCwgLy8gQ2VudHJhbCBFdXJvcGVhbiBEYXlsaWdodCBUaW1lXG5cdENFU1Q6IDEyMCwgLy8gQ2VudHJhbCBFdXJvcGVhbiBTdW1tZXIgVGltZSAoQ2YuIEhBRUMpXG5cdENFVDogNjAsIC8vIENlbnRyYWwgRXVyb3BlYW4gVGltZVxuXHRDSEFEVDogODI1LCAvLyBDaGF0aGFtIERheWxpZ2h0IFRpbWVcblx0Q0hBU1Q6IDc2NSwgLy8gQ2hhdGhhbSBTdGFuZGFyZCBUaW1lXG5cdENIT1Q6IDQ4MCwgLy8gQ2hvaWJhbHNhblxuXHRDaFNUOiA2MDAsIC8vIENoYW1vcnJvIFN0YW5kYXJkIFRpbWVcblx0Q0hVVDogNjAwLCAvLyBDaHV1ayBUaW1lXG5cdENJU1Q6IC00ODAsIC8vIENsaXBwZXJ0b24gSXNsYW5kIFN0YW5kYXJkIFRpbWVcblx0Q0lUOiA0ODAsIC8vIENlbnRyYWwgSW5kb25lc2lhIFRpbWVcblx0Q0tUOiAtNjAwLCAvLyBDb29rIElzbGFuZCBUaW1lXG5cdENMU1Q6IC0xODAsIC8vIENoaWxlIFN1bW1lciBUaW1lXG5cdENMVDogLTI0MCwgLy8gQ2hpbGUgU3RhbmRhcmQgVGltZVxuXHRDT1NUOiAtMjQwLCAvLyBDb2xvbWJpYSBTdW1tZXIgVGltZVxuXHRDT1Q6IC0zMDAsIC8vIENvbG9tYmlhIFRpbWVcblx0Q1NUOiAtMzYwLCAvLyBDZW50cmFsIFN0YW5kYXJkIFRpbWUgKE5vcnRoIEFtZXJpY2EpXG5cdENUOiA0ODAsIC8vIENoaW5hIHRpbWVcblx0Q1ZUOiAtNjAsIC8vIENhcGUgVmVyZGUgVGltZVxuXHRDWFQ6IDQyMCwgLy8gQ2hyaXN0bWFzIElzbGFuZCBUaW1lXG5cdERBVlQ6IDQyMCwgLy8gRGF2aXMgVGltZVxuXHRERFVUOiA2MDAsIC8vIER1bW9udCBkJ1VydmlsbGUgVGltZVxuXHRERlQ6IDYwLCAvLyBBSVggc3BlY2lmaWMgZXF1aXZhbGVudCBvZiBDZW50cmFsIEV1cm9wZWFuIFRpbWVcblx0RUFTU1Q6IC0zMDAsIC8vIEVhc3RlciBJc2xhbmQgU3RhbmRhcmQgU3VtbWVyIFRpbWVcblx0RUFTVDogLTM2MCwgLy8gRWFzdGVyIElzbGFuZCBTdGFuZGFyZCBUaW1lXG5cdEVBVDogMTgwLCAvLyBFYXN0IEFmcmljYSBUaW1lXG5cdEVDVDogLTMwMCwgLy8gRWN1YWRvciBUaW1lXG5cdEVEVDogLTI0MCwgLy8gRWFzdGVybiBEYXlsaWdodCBUaW1lIChOb3J0aCBBbWVyaWNhKVxuXHRFRURUOiAxODAsIC8vIEVhc3Rlcm4gRXVyb3BlYW4gRGF5bGlnaHQgVGltZVxuXHRFRVNUOiAxODAsIC8vIEVhc3Rlcm4gRXVyb3BlYW4gU3VtbWVyIFRpbWVcblx0RUVUOiAxMjAsIC8vIEVhc3Rlcm4gRXVyb3BlYW4gVGltZVxuXHRFR1NUOiAwLCAvLyBFYXN0ZXJuIEdyZWVubGFuZCBTdW1tZXIgVGltZVxuXHRFR1Q6IC02MCwgLy8gRWFzdGVybiBHcmVlbmxhbmQgVGltZVxuXHRFSVQ6IDU0MCwgLy8gRWFzdGVybiBJbmRvbmVzaWFuIFRpbWVcblx0RVNUOiAtMzAwLCAvLyBFYXN0ZXJuIFN0YW5kYXJkIFRpbWUgKE5vcnRoIEFtZXJpY2EpXG5cdEZFVDogMTgwLCAvLyBGdXJ0aGVyLWVhc3Rlcm4gRXVyb3BlYW4gVGltZVxuXHRGSlQ6IDcyMCwgLy8gRmlqaSBUaW1lXG5cdEZLU1Q6IC0xODAsIC8vIEZhbGtsYW5kIElzbGFuZHMgU3RhbmRhcmQgVGltZVxuXHRGS1Q6IC0yNDAsIC8vIEZhbGtsYW5kIElzbGFuZHMgVGltZVxuXHRGTlQ6IC0xMjAsIC8vIEZlcm5hbmRvIGRlIE5vcm9uaGEgVGltZVxuXHRHQUxUOiAtMzYwLCAvLyBHYWxhcGFnb3MgVGltZVxuXHRHQU1UOiAtNTQwLCAvLyBHYW1iaWVyIElzbGFuZHNcblx0R0VUOiAyNDAsIC8vIEdlb3JnaWEgU3RhbmRhcmQgVGltZVxuXHRHRlQ6IC0xODAsIC8vIEZyZW5jaCBHdWlhbmEgVGltZVxuXHRHSUxUOiA3MjAsIC8vIEdpbGJlcnQgSXNsYW5kIFRpbWVcblx0R0lUOiAtNTQwLCAvLyBHYW1iaWVyIElzbGFuZCBUaW1lXG5cdEdNVDogMCwgLy8gR3JlZW53aWNoIE1lYW4gVGltZVxuXHRHU1Q6IC0xMjAsIC8vIFNvdXRoIEdlb3JnaWEgYW5kIHRoZSBTb3V0aCBTYW5kd2ljaCBJc2xhbmRzXG5cdEdZVDogLTI0MCwgLy8gR3V5YW5hIFRpbWVcblx0SEFEVDogLTU0MCwgLy8gSGF3YWlpLUFsZXV0aWFuIERheWxpZ2h0IFRpbWVcblx0SEFFQzogMTIwLCAvLyBIZXVyZSBBdmFuY8OpZSBkJ0V1cm9wZSBDZW50cmFsZSBmcmFuY2lzZWQgbmFtZSBmb3IgQ0VTVFxuXHRIQVNUOiAtNjAwLCAvLyBIYXdhaWktQWxldXRpYW4gU3RhbmRhcmQgVGltZVxuXHRIS1Q6IDQ4MCwgLy8gSG9uZyBLb25nIFRpbWVcblx0SE1UOiAzMDAsIC8vIEhlYXJkIGFuZCBNY0RvbmFsZCBJc2xhbmRzIFRpbWVcblx0SE9WVDogNDIwLCAvLyBLaG92ZCBUaW1lXG5cdEhTVDogLTYwMCwgLy8gSGF3YWlpIFN0YW5kYXJkIFRpbWVcblx0SUJTVDogMCwgLy8gSW50ZXJuYXRpb25hbCBCdXNpbmVzcyBTdGFuZGFyZCBUaW1lXG5cdElDVDogNDIwLCAvLyBJbmRvY2hpbmEgVGltZVxuXHRJRFQ6IDE4MCwgLy8gSXNyYWVsIERheWxpZ2h0IFRpbWVcblx0SU9UOiAxODAsIC8vIEluZGlhbiBPY2VhbiBUaW1lXG5cdElSRFQ6IDI3MCwgLy8gSXJhbiBEYXlsaWdodCBUaW1lXG5cdElSS1Q6IDQ4MCwgLy8gSXJrdXRzayBUaW1lXG5cdElSU1Q6IDIxMCwgLy8gSXJhbiBTdGFuZGFyZCBUaW1lXG5cdElTVDogMTIwLCAvLyBJc3JhZWwgU3RhbmRhcmQgVGltZVxuXHRKU1Q6IDU0MCwgLy8gSmFwYW4gU3RhbmRhcmQgVGltZVxuXHRLR1Q6IDM2MCwgLy8gS3lyZ3l6c3RhbiB0aW1lXG5cdEtPU1Q6IDY2MCwgLy8gS29zcmFlIFRpbWVcblx0S1JBVDogNDIwLCAvLyBLcmFzbm95YXJzayBUaW1lXG5cdEtTVDogNTQwLCAvLyBLb3JlYSBTdGFuZGFyZCBUaW1lXG5cdExIU1Q6IDYzMCwgLy8gTG9yZCBIb3dlIFN0YW5kYXJkIFRpbWVcblx0TElOVDogODQwLCAvLyBMaW5lIElzbGFuZHMgVGltZVxuXHRNQUdUOiA3MjAsIC8vIE1hZ2FkYW4gVGltZVxuXHRNQVJUOiAtNTEwLCAvLyBNYXJxdWVzYXMgSXNsYW5kcyBUaW1lXG5cdE1BV1Q6IDMwMCwgLy8gTWF3c29uIFN0YXRpb24gVGltZVxuXHRNRFQ6IC0zNjAsIC8vIE1vdW50YWluIERheWxpZ2h0IFRpbWUgKE5vcnRoIEFtZXJpY2EpXG5cdE1FVDogNjAsIC8vIE1pZGRsZSBFdXJvcGVhbiBUaW1lIFNhbWUgem9uZSBhcyBDRVRcblx0TUVTVDogMTIwLCAvLyBNaWRkbGUgRXVyb3BlYW4gU3VtbWVyIFRpbWUgU2FtZSB6b25lIGFzIENFU1Rcblx0TUhUOiA3MjAsIC8vIE1hcnNoYWxsIElzbGFuZHNcblx0TUlTVDogNjYwLCAvLyBNYWNxdWFyaWUgSXNsYW5kIFN0YXRpb24gVGltZVxuXHRNSVQ6IC01MTAsIC8vIE1hcnF1ZXNhcyBJc2xhbmRzIFRpbWVcblx0TU1UOiAzOTAsIC8vIE15YW5tYXIgVGltZVxuXHRNU0s6IDE4MCwgLy8gTW9zY293IFRpbWVcblx0TVNUOiAtNDIwLCAvLyBNb3VudGFpbiBTdGFuZGFyZCBUaW1lIChOb3J0aCBBbWVyaWNhKVxuXHRNVVQ6IDI0MCwgLy8gTWF1cml0aXVzIFRpbWVcblx0TVZUOiAzMDAsIC8vIE1hbGRpdmVzIFRpbWVcblx0TVlUOiA0ODAsIC8vIE1hbGF5c2lhIFRpbWVcblx0TkNUOiA2NjAsIC8vIE5ldyBDYWxlZG9uaWEgVGltZVxuXHRORFQ6IC05MCwgLy8gTmV3Zm91bmRsYW5kIERheWxpZ2h0IFRpbWVcblx0TkZUOiA2NjAsIC8vIE5vcmZvbGsgVGltZVxuXHROUFQ6IDM0NSwgLy8gTmVwYWwgVGltZVxuXHROU1Q6IC0xNTAsIC8vIE5ld2ZvdW5kbGFuZCBTdGFuZGFyZCBUaW1lXG5cdE5UOiAtMTUwLCAvLyBOZXdmb3VuZGxhbmQgVGltZVxuXHROVVQ6IC02NjAsIC8vIE5pdWUgVGltZVxuXHROWkRUOiA3ODAsIC8vIE5ldyBaZWFsYW5kIERheWxpZ2h0IFRpbWVcblx0TlpTVDogNzIwLCAvLyBOZXcgWmVhbGFuZCBTdGFuZGFyZCBUaW1lXG5cdE9NU1Q6IDM2MCwgLy8gT21zayBUaW1lXG5cdE9SQVQ6IDMwMCwgLy8gT3JhbCBUaW1lXG5cdFBEVDogLTQyMCwgLy8gUGFjaWZpYyBEYXlsaWdodCBUaW1lIChOb3J0aCBBbWVyaWNhKVxuXHRQRVQ6IC0zMDAsIC8vIFBlcnUgVGltZVxuXHRQRVRUOiA3MjAsIC8vIEthbWNoYXRrYSBUaW1lXG5cdFBHVDogNjAwLCAvLyBQYXB1YSBOZXcgR3VpbmVhIFRpbWVcblx0UEhPVDogNzgwLCAvLyBQaG9lbml4IElzbGFuZCBUaW1lXG5cdFBLVDogMzAwLCAvLyBQYWtpc3RhbiBTdGFuZGFyZCBUaW1lXG5cdFBNRFQ6IC0xMjAsIC8vIFNhaW50IFBpZXJyZSBhbmQgTWlxdWVsb24gRGF5bGlnaHQgdGltZVxuXHRQTVNUOiAtMTgwLCAvLyBTYWludCBQaWVycmUgYW5kIE1pcXVlbG9uIFN0YW5kYXJkIFRpbWVcblx0UE9OVDogNjYwLCAvLyBQb2hucGVpIFN0YW5kYXJkIFRpbWVcblx0UFNUOiAtNDgwLCAvLyBQYWNpZmljIFN0YW5kYXJkIFRpbWUgKE5vcnRoIEFtZXJpY2EpXG5cdFBZU1Q6IC0xODAsIC8vIFBhcmFndWF5IFN1bW1lciBUaW1lIChTb3V0aCBBbWVyaWNhKVxuXHRQWVQ6IC0yNDAsIC8vIFBhcmFndWF5IFRpbWUgKFNvdXRoIEFtZXJpY2EpXG5cdFJFVDogMjQwLCAvLyBSw6l1bmlvbiBUaW1lXG5cdFJPVFQ6IC0xODAsIC8vIFJvdGhlcmEgUmVzZWFyY2ggU3RhdGlvbiBUaW1lXG5cdFNBS1Q6IDY2MCwgLy8gU2FraGFsaW4gSXNsYW5kIHRpbWVcblx0U0FNVDogMjQwLCAvLyBTYW1hcmEgVGltZVxuXHRTQVNUOiAxMjAsIC8vIFNvdXRoIEFmcmljYW4gU3RhbmRhcmQgVGltZVxuXHRTQlQ6IDY2MCwgLy8gU29sb21vbiBJc2xhbmRzIFRpbWVcblx0U0NUOiAyNDAsIC8vIFNleWNoZWxsZXMgVGltZVxuXHRTR1Q6IDQ4MCwgLy8gU2luZ2Fwb3JlIFRpbWVcblx0U0xTVDogMzMwLCAvLyBTcmkgTGFua2EgU3RhbmRhcmQgVGltZVxuXHRTUkVUOiA2NjAsIC8vIFNyZWRuZWtvbHltc2sgVGltZVxuXHRTUlQ6IC0xODAsIC8vIFN1cmluYW1lIFRpbWVcblx0U1NUOiA0ODAsIC8vIFNpbmdhcG9yZSBTdGFuZGFyZCBUaW1lXG5cdFNZT1Q6IDE4MCwgLy8gU2hvd2EgU3RhdGlvbiBUaW1lXG5cdFRBSFQ6IC02MDAsIC8vIFRhaGl0aSBUaW1lXG5cdFRIQTogNDIwLCAvLyBUaGFpbGFuZCBTdGFuZGFyZCBUaW1lXG5cdFRGVDogMzAwLCAvLyBJbmRpYW4vS2VyZ3VlbGVuXG5cdFRKVDogMzAwLCAvLyBUYWppa2lzdGFuIFRpbWVcblx0VEtUOiA3ODAsIC8vIFRva2VsYXUgVGltZVxuXHRUTFQ6IDU0MCwgLy8gVGltb3IgTGVzdGUgVGltZVxuXHRUTVQ6IDMwMCwgLy8gVHVya21lbmlzdGFuIFRpbWVcblx0VE9UOiA3ODAsIC8vIFRvbmdhIFRpbWVcblx0VFZUOiA3MjAsIC8vIFR1dmFsdSBUaW1lXG5cdFVDVDogMCwgLy8gQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWVcblx0VUxBVDogNDgwLCAvLyBVbGFhbmJhYXRhciBUaW1lXG5cdFVTWjE6IDEyMCwgLy8gS2FsaW5pbmdyYWQgVGltZVxuXHRVVEM6IDAsIC8vIENvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lXG5cdFVZU1Q6IC0xMjAsIC8vIFVydWd1YXkgU3VtbWVyIFRpbWVcblx0VVlUOiAtMTgwLCAvLyBVcnVndWF5IFN0YW5kYXJkIFRpbWVcblx0VVpUOiAzMDAsIC8vIFV6YmVraXN0YW4gVGltZVxuXHRWRVQ6IC0yNDAsIC8vIFZlbmV6dWVsYW4gU3RhbmRhcmQgVGltZVxuXHRWTEFUOiA2MDAsIC8vIFZsYWRpdm9zdG9rIFRpbWVcblx0Vk9MVDogMjQwLCAvLyBWb2xnb2dyYWQgVGltZVxuXHRWT1NUOiAzNjAsIC8vIFZvc3RvayBTdGF0aW9uIFRpbWVcblx0VlVUOiA2NjAsIC8vIFZhbnVhdHUgVGltZVxuXHRXQUtUOiA3MjAsIC8vIFdha2UgSXNsYW5kIFRpbWVcblx0V0FTVDogMTIwLCAvLyBXZXN0IEFmcmljYSBTdW1tZXIgVGltZVxuXHRXQVQ6IDYwLCAvLyBXZXN0IEFmcmljYSBUaW1lXG5cdFdFRFQ6IDYwLCAvLyBXZXN0ZXJuIEV1cm9wZWFuIERheWxpZ2h0IFRpbWVcblx0V0VTVDogNjAsIC8vIFdlc3Rlcm4gRXVyb3BlYW4gU3VtbWVyIFRpbWVcblx0V0VUOiAwLCAvLyBXZXN0ZXJuIEV1cm9wZWFuIFRpbWVcblx0V0lUOiA0MjAsIC8vIFdlc3Rlcm4gSW5kb25lc2lhbiBUaW1lXG5cdFdTVDogNDgwLCAvLyBXZXN0ZXJuIFN0YW5kYXJkIFRpbWVcblx0WUFLVDogNTQwLCAvLyBZYWt1dHNrIFRpbWVcblx0WUVLVDogMzAwLCAvLyBZZWthdGVyaW5idXJnIFRpbWVcblx0WjogMCwgLy8gWnVsdSBUaW1lIChDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZXpvbmVOYW1lcztcbiIsIi8vIDItZGlnaXQgeWVhcnM6IDE5NTEgdGhyb3VnaCAyMDUwXG5jb25zdCB0d29EaWdpdFllYXJzID0ge307XG5mb3IgKGxldCBpID0gMTsgaSA8IDEwMDsgaSsrKSB7XG5cdGNvbnN0IGtleSA9IChpIDwgOSA/ICcwJyA6ICcnKSArIGk7XG5cdHR3b0RpZ2l0WWVhcnNba2V5XSA9IGkgKyAoaSA+IDUxID8gMTkwMCA6IDIwMDApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR3b0RpZ2l0WWVhcnM7XG4iLCJjb25zdCB1bml0U2hvcnRjdXRzID0ge1xuXHR5OiAneWVhcicsXG5cdE06ICdtb250aCcsXG5cdGQ6ICdkYXknLFxuXHR3OiAnd2VlaycsXG5cdGg6ICdob3VyJyxcblx0bTogJ21pbnV0ZScsXG5cdHM6ICdzZWNvbmQnLFxuXHRtczogJ21pbGxpc2Vjb25kJyxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pdFNob3J0Y3V0cztcbiIsImNvbnN0IHVuaXRzID0gW1xuXHQneWVhcicsXG5cdCdtb250aCcsXG5cdCdkYXknLFxuXHQnaG91cicsXG5cdCdtaW51dGUnLFxuXHQnc2Vjb25kJyxcblx0J21pbGxpc2Vjb25kJyxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pdHM7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5jb25zdCB1bml0U2hvcnRjdXRzID0gcmVxdWlyZSgnLi4vLi4vZGF0YS91bml0U2hvcnRjdXRzLmpzJyk7XG5cbmNvbnN0IGFnbyA9IG5ldyBGb3JtYXQoe1xuXHQvKiBwcmV0dGllci1pZ25vcmUgKi9cblx0Ly8gICAgICAgICAgJDEgICAgICAgICAgJDIgICAgICAgICQzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkNFxuXHRtYXRjaGVyOiAvXihcXCt8LXxpbnwpID8oW1xcZC5dKykgPyh5ZWFycz98bW9udGhzP3x3ZWVrcz98ZGF5cz98aG91cnM/fG1pbnV0ZXM/fHNlY29uZHM/fG1pbGxpc2Vjb25kcz98bXN8c3xtfGh8d3xkfE18eSkoIGFnbyk/JC9pLFxuXHRoYW5kbGVyOiBmdW5jdGlvbiAoWywgc2lnbiwgYW1vdW50LCB1bml0LCBpc0Fnb10pIHtcblx0XHRhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG5cdFx0aWYgKHVuaXQubGVuZ3RoIDw9IDIpIHtcblx0XHRcdHVuaXQgPSB1bml0U2hvcnRjdXRzW3VuaXRdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR1bml0ID0gdW5pdC5yZXBsYWNlKC9zJC8sICcnKTtcblx0XHRcdHVuaXQgPSB1bml0LnRvTG93ZXJDYXNlKCk7XG5cdFx0fVxuXHRcdGlmICh1bml0ID09PSAnd2VlaycpIHtcblx0XHRcdHVuaXQgPSAnZGF5Jztcblx0XHRcdGFtb3VudCAqPSA3O1xuXHRcdH1cblx0XHRpZiAoc2lnbiA9PT0gJy0nIHx8IGlzQWdvKSB7XG5cdFx0XHRhbW91bnQgKj0gLTE7XG5cdFx0fVxuXHRcdGNvbnN0IG5vdyA9IHRoaXMubm93KCk7XG5cdFx0aWYgKHVuaXQgPT09ICdtaWxsaXNlY29uZCcpIHtcblx0XHRcdG5vdy5zZXRVVENNaWxsaXNlY29uZHMobm93LmdldFVUQ01pbGxpc2Vjb25kcygpICsgYW1vdW50KTtcblx0XHR9IGVsc2UgaWYgKHVuaXQgPT09ICdzZWNvbmQnKSB7XG5cdFx0XHRub3cuc2V0VVRDU2Vjb25kcyhub3cuZ2V0VVRDU2Vjb25kcygpICsgYW1vdW50KTtcblx0XHR9IGVsc2UgaWYgKHVuaXQgPT09ICdtaW51dGUnKSB7XG5cdFx0XHRub3cuc2V0VVRDTWludXRlcyhub3cuZ2V0VVRDTWludXRlcygpICsgYW1vdW50KTtcblx0XHR9IGVsc2UgaWYgKHVuaXQgPT09ICdob3VyJykge1xuXHRcdFx0bm93LnNldFVUQ0hvdXJzKG5vdy5nZXRVVENIb3VycygpICsgYW1vdW50KTtcblx0XHR9IGVsc2UgaWYgKHVuaXQgPT09ICdkYXknKSB7XG5cdFx0XHRub3cuc2V0VVRDRGF0ZShub3cuZ2V0VVRDRGF0ZSgpICsgYW1vdW50KTtcblx0XHR9IGVsc2UgaWYgKHVuaXQgPT09ICdtb250aCcpIHtcblx0XHRcdG5vdy5zZXRVVENNb250aChub3cuZ2V0VVRDTW9udGgoKSArIGFtb3VudCk7XG5cdFx0fSBlbHNlIGlmICh1bml0ID09PSAneWVhcicpIHtcblx0XHRcdG5vdy5zZXRVVENGdWxsWWVhcihub3cuZ2V0VVRDRnVsbFllYXIoKSArIGFtb3VudCk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHR5ZWFyOiBub3cuZ2V0VVRDRnVsbFllYXIoKSxcblx0XHRcdG1vbnRoOiBub3cuZ2V0VVRDTW9udGgoKSArIDEsXG5cdFx0XHRkYXk6IG5vdy5nZXRVVENEYXRlKCksXG5cdFx0XHRob3VyOiBub3cuZ2V0VVRDSG91cnMoKSxcblx0XHRcdG1pbnV0ZTogbm93LmdldFVUQ01pbnV0ZXMoKSxcblx0XHRcdHNlY29uZDogbm93LmdldFVUQ1NlY29uZHMoKSxcblx0XHRcdG1pbGxpc2Vjb25kOiBub3cuZ2V0VVRDTWlsbGlzZWNvbmRzKCksXG5cdFx0fTtcblx0fSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFnbztcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcblxuY29uc3QgYXRTZWNvbmRzID0gbmV3IEZvcm1hdCh7XG5cdHRlbXBsYXRlOiAnXkAoXFxcXGQrKSQnLFxuXHRoYW5kbGVyOiBmdW5jdGlvbiAobWF0Y2hlcykge1xuXHRcdGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChtYXRjaGVzWzFdLCAxMCk7XG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKHNlY29uZHMgKiAxMDAwKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0eWVhcjogZGF0ZS5nZXRVVENGdWxsWWVhcigpLFxuXHRcdFx0bW9udGg6IGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsXG5cdFx0XHRkYXk6IGRhdGUuZ2V0VVRDRGF0ZSgpLFxuXHRcdFx0aG91cjogZGF0ZS5nZXRVVENIb3VycygpLFxuXHRcdFx0bWludXRlOiBkYXRlLmdldFVUQ01pbnV0ZXMoKSxcblx0XHRcdHNlY29uZDogZGF0ZS5nZXRVVENTZWNvbmRzKCksXG5cdFx0fTtcblx0fSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF0U2Vjb25kcztcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcbmNvbnN0IExvY2FsZUhlbHBlciA9IHJlcXVpcmUoJy4uLy4uL0xvY2FsZUhlbHBlci9Mb2NhbGVIZWxwZXIuanMnKTtcbmNvbnN0IHsgY2hpbmVzZUdyb3VwOiBkIH0gPSByZXF1aXJlKCcuLi8uLi9kYXRhL251bWJlcmluZ1N5c3RlbXMuanMnKTtcblxubGV0IGxvY0hlbHBlcjtcblxuY29uc3QgY2hpbmVzZSA9IG5ldyBGb3JtYXQoe1xuXHQvKiBwcmV0dGllci1pZ25vcmUgKi9cblx0Ly8gICAgICAgICAgICQxICAgICAgICAgICAgICAgICAgICAgICAgICQyICAgICAgICAgICAgICAgICAgJDNcblx0dGVtcGxhdGU6IGBeKCR7ZH17NH18JHtkfXsyfSlcXFxccyrlubRcXFxccyooJHtkfXsxLDJ9KVxcXFxzKuaciFxcXFxzKigke2R9ezEsMn0pXFxcXHMq5pelJGAsXG5cdGhhbmRsZXI6IGZ1bmN0aW9uIChbLCB5ZWFyLCBtb250aCwgZGF5XSkge1xuXHRcdGlmICghbG9jSGVscGVyKSB7XG5cdFx0XHQvLyBzb21ldGltZXMgemggaGFzIG51bWJlcmluZyBzeXN0ZW0gXCJsYXRuXCIgaW5zdGVhZCBvZiBmdWxsd2lkZSBvciBoYW5pZGVjXG5cdFx0XHRsb2NIZWxwZXIgPSBuZXcgTG9jYWxlSGVscGVyKCd6aCcpO1xuXHRcdFx0bG9jSGVscGVyLm51bWJlcmluZ1N5c3RlbSA9ICdoYW5pZGVjJztcblx0XHRcdGxvY0hlbHBlci5idWlsZE51bWJlcnMoKTtcblx0XHR9XG5cdFx0cmV0dXJuIGxvY0hlbHBlci5jYXN0T2JqZWN0KHsgeWVhciwgbW9udGgsIGRheSB9KTtcblx0fSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoaW5lc2U7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbmNvbnN0IGRheU1vbnRoWWVhciA9IG5ldyBGb3JtYXQoe1xuXHQvKiBwcmV0dGllci1pZ25vcmUgKi9cblx0Ly8gICAgICAgICAgICQxICAgICAkMiAgICAgICAgJDMgICAgICAgICAgJDRcblx0dGVtcGxhdGU6IFwiXihfREFZXykoW1xcXFwvLiAtXSkoX01PTlRIXylcXFxcMihfWUVBUl8pJFwiLFxuXHR1bml0czogWydkYXknLCBudWxsLCAnbW9udGgnLCAneWVhciddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF5TW9udGhZZWFyO1xuIiwiY29uc3QgRm9ybWF0ID0gcmVxdWlyZSgnLi4vLi4vRm9ybWF0L0Zvcm1hdC5qcycpO1xuXG5jb25zdCBkYXlNb250aCA9IG5ldyBGb3JtYXQoe1xuXHQvKiBwcmV0dGllci1pZ25vcmUgKi9cblx0Ly8gICAgICAgICAgICQxICAgICAgICAgICAgJDJcblx0dGVtcGxhdGU6IFwiXihfREFZXylbXFxcXC8uIF0oX01PTlRIXykkXCIsXG5cdHVuaXRzOiBbJ2RheScsICdtb250aCddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF5TW9udGg7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbmNvbnN0IGRheU1vbnRobmFtZVllYXIgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkMSAgICAgICAgICAgICAgICAgICAkMiAgICAkMyAgICAgICAgICAgICAgJDRcblx0dGVtcGxhdGU6IFwiXig/Oig/Ol9EQVlOQU1FXyksPyApPyhfREFZXykoPzpfT1JESU5BTF8pPyhbIC1dKShfTU9OVEhOQU1FXylcXFxcMihfWUVBUl8pJFwiLFxuXHR1bml0czogWydkYXknLCBudWxsLCAnbW9udGgnLCAneWVhciddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF5TW9udGhuYW1lWWVhcjtcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcblxuY29uc3QgZGF5TW9udGhuYW1lID0gbmV3IEZvcm1hdCh7XG5cdC8qIHByZXR0aWVyLWlnbm9yZSAqL1xuXHQvLyAgICAgICAgICAgJDEgICAgICAgICAgICAgICAgICAgICAgICQyXG5cdHRlbXBsYXRlOiBcIl4oX0RBWV8pKD86X09SRElOQUxfKT9bIC1dKF9NT05USE5BTUVfKSRcIixcblx0dW5pdHM6IFsnZGF5JywgJ21vbnRoJ10sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBkYXlNb250aG5hbWU7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbmNvbnN0IG1pY3Jvc29mdEpzb24gPSBuZXcgRm9ybWF0KHtcblx0bWF0Y2hlcjogL15cXC9EYXRlXFwoKFxcZCspKFsrLV1cXGR7NH0pP1xcKVxcLyQvLFxuXHRoYW5kbGVyOiBmdW5jdGlvbiAobWF0Y2hlcykge1xuXHRcdGNvbnN0IG1pbGxpc2Vjb25kcyA9IHBhcnNlSW50KG1hdGNoZXNbMV0sIDEwKTtcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUobWlsbGlzZWNvbmRzKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0eWVhcjogZGF0ZS5nZXRVVENGdWxsWWVhcigpLFxuXHRcdFx0bW9udGg6IGRhdGUuZ2V0VVRDTW9udGgoKSArIDEsXG5cdFx0XHRkYXk6IGRhdGUuZ2V0VVRDRGF0ZSgpLFxuXHRcdFx0aG91cjogZGF0ZS5nZXRVVENIb3VycygpLFxuXHRcdFx0bWludXRlOiBkYXRlLmdldFVUQ01pbnV0ZXMoKSxcblx0XHRcdHNlY29uZDogZGF0ZS5nZXRVVENTZWNvbmRzKCksXG5cdFx0XHRtaWxsaXNlY29uZDogZGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKSxcblx0XHRcdG9mZnNldDogbWF0Y2hlc1syXSB8fCAwLFxuXHRcdH07XG5cdH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtaWNyb3NvZnRKc29uO1xuIiwiY29uc3QgRm9ybWF0ID0gcmVxdWlyZSgnLi4vLi4vRm9ybWF0L0Zvcm1hdC5qcycpO1xuXG5jb25zdCBtb250aERheVllYXIgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAkMSAgICAgICAkMiAgICAgICQzICAgICAgICAkNFxuXHR0ZW1wbGF0ZTogXCJeKF9NT05USF8pKFtcXFxcLy1dKShfREFZXylcXFxcMihfWUVBUl8pJFwiLFxuXHR1bml0czogWydtb250aCcsIG51bGwsICdkYXknLCAneWVhciddLFxuXHQvLyBvbmx5IGNlcnRhaW4gbG9jYWxlcyB1c2UgdGhpcyBkYXRlXG5cdC8vIHNlZSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EYXRlX2Zvcm1hdF9ieV9jb3VudHJ5XG5cdC8vIHNlZSBodHRwczovL3d3dy5sb2NhbGVwbGFuZXQuY29tL2ljdS9cblx0bG9jYWxlczogW1xuXHRcdCdlZS1URycsIC8vIFRvZ28gKEV3ZSlcblx0XHQnZW4tQVMnLCAvLyBBbWVyaWNhbiBTYW1vYVxuXHRcdCdlbi1DQScsIC8vIENhbmFkYVxuXHRcdCdlbi1GTScsIC8vIEZlZGVyYXRlZCBTdGF0ZXMgb2YgTWljcm9uZXNpYVxuXHRcdCdlbi1HSCcsIC8vIEdoYW5hXG5cdFx0J2VuLUdVJywgLy8gR3VhbVxuXHRcdCdlbi1LRScsIC8vIEtlbnlhXG5cdFx0J2VuLUtZJywgLy8gQ2F5bWFuIElzbGFuZHNcblx0XHQnZW4tTUgnLCAvLyBNYXJzaGFsbCBJc2xhbmRzXG5cdFx0J2VuLU1QJywgLy8gTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzXG5cdFx0J2VuLVVTJywgLy8gVW5pdGVkIFN0YXRlc1xuXHRcdCdlbi1WSScsIC8vIFVTIFZpcmdpbiBJc2xhbmRzXG5cdFx0J2VuLVdTJywgLy8gV2VzdGVybiBTYW1vYVxuXHRcdCdzbS1BUycsIC8vIEFtZXJpY2FuIFNhbW9hIChTYW1vYW4pXG5cdFx0J3NtLVNNJywgLy8gU2Ftb2Fcblx0XSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vbnRoRGF5WWVhcjtcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcblxuY29uc3QgbW9udGhEYXkgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAkMSAgICAgICAgICAgICAgICAgJDJcblx0dGVtcGxhdGU6IFwiXihfTU9OVEhfKSg/OltcXFxcLy1dKShfREFZXykkXCIsXG5cdHVuaXRzOiBbJ21vbnRoJywgJ2RheSddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9udGhEYXk7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbmNvbnN0IG1vbnRobmFtZURheVllYXIgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkMSAgICAgICAgICAgICAkMiAgICAgICAgICAgICAgICAgICAgICAkM1xuXHR0ZW1wbGF0ZTogJ14oPzooPzpfREFZTkFNRV8pLD8gKT8oX01PTlRITkFNRV8pPyAoX0RBWV8pKD86X09SRElOQUxfKT8sPyAoX1lFQVJfKSQnLFxuXHR1bml0czogWydtb250aCcsICdkYXknLCAneWVhciddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9udGhuYW1lRGF5WWVhcjtcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcblxuY29uc3QgbW9udGhuYW1lRGF5ID0gbmV3IEZvcm1hdCh7XG5cdC8qIHByZXR0aWVyLWlnbm9yZSAqL1xuXHQvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJDEgICAgICAgICAgICAgJDJcblx0dGVtcGxhdGU6ICdeKD86KD86X0RBWU5BTUVfKSw/ICk/KF9NT05USE5BTUVfKT8gKF9EQVlfKSg/Ol9PUkRJTkFMXyk/JCcsXG5cdHVuaXRzOiBbJ21vbnRoJywgJ2RheSddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW9udGhuYW1lRGF5O1xuIiwiY29uc3QgTG9jYWxlSGVscGVyID0gcmVxdWlyZSgnLi4vLi4vTG9jYWxlSGVscGVyL0xvY2FsZUhlbHBlci5qcycpO1xuY29uc3QgRm9ybWF0ID0gcmVxdWlyZSgnLi4vLi4vRm9ybWF0L0Zvcm1hdC5qcycpO1xuXG4vLyBsb3RzIG9mIDEyaCB0aW1lIHN1Y2ggYXMgXCIxMTo1OVwiLCBcIjExOjU5cG1cIiwgXCIxMTo1OTozMyBwbVwiLCBcIjExOjU5OjMzIHAubS5cIlxuY29uc3QgdGltZTEySG91cnMgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAkMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkMiAgICAgICAgICAgICAgICAgJDMgICAgICAgICAgICQ0ICAgICAgICAgICAgICAgICAkNVxuXHR0ZW1wbGF0ZTogJ14oLio/KV9TUEFDRV8qKD86YXR8b258VHwpX1NQQUNFXyooX0gxMl98X0gyNF8pKD86XFxcXDooX01JTl8pKD86XFxcXDooX1NFQ18pKT8pP19TUEFDRV8qKF9NRVJJRElFTV8pJCcsXG5cdGhhbmRsZXI6IGZ1bmN0aW9uIChtYXRjaGVzLCBsb2NhbGUpIHtcblx0XHRsZXQgWywgZGF0ZUV4cHIsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBhbXBtXSA9IG1hdGNoZXM7XG5cdFx0bGV0IHJlc3VsdCA9IHt9O1xuXHRcdGlmIChkYXRlRXhwcikge1xuXHRcdFx0cmVzdWx0ID0gdGhpcy5wYXJzZXIuYXR0ZW1wdChkYXRlRXhwciwgbG9jYWxlKTtcblx0XHRcdGlmIChyZXN1bHQuaW52YWxpZCkge1xuXHRcdFx0XHQvLyBsZXQgb3RoZXIgbWF0Y2hlcnMgaGF2ZSBhIGNoYW5jZVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y29uc3QgdHBsID0gTG9jYWxlSGVscGVyLmZhY3RvcnkobG9jYWxlKTtcblx0XHRpZiAoYW1wbSkge1xuXHRcdFx0Y29uc3Qgb2Zmc2V0ID0gdHBsLmxvb2t1cHMubWVyaWRpZW1bYW1wbS50b0xvd2VyQ2FzZSgpXSB8fCAwO1xuXHRcdFx0aG91ciA9IHBhcnNlRmxvYXQoaG91cik7XG5cdFx0XHRpZiAoaG91ciA9PT0gMTIpIHtcblx0XHRcdFx0aG91ciA9IG9mZnNldDtcblx0XHRcdH0gZWxzZSBpZiAoaG91ciA+IDEyICYmIG9mZnNldCA9PT0gMTIpIHtcblx0XHRcdFx0aG91ciArPSAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aG91ciArPSBvZmZzZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJlc3VsdC5ob3VyID0gaG91cjtcblx0XHRpZiAobWludXRlKSB7XG5cdFx0XHRyZXN1bHQubWludXRlID0gbWludXRlO1xuXHRcdH1cblx0XHRpZiAoc2Vjb25kKSB7XG5cdFx0XHRyZXN1bHQuc2Vjb25kID0gc2Vjb25kO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTEySG91cnM7XG4iLCJjb25zdCBMb2NhbGVIZWxwZXIgPSByZXF1aXJlKCcuLi8uLi9Mb2NhbGVIZWxwZXIvTG9jYWxlSGVscGVyLmpzJyk7XG5jb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5jb25zdCB0aW1lem9uZU5hbWVzID0gcmVxdWlyZSgnLi4vLi4vZGF0YS90aW1lem9uZU5hbWVzLmpzJyk7XG5cbi8vIGxvdHMgb2YgMjRoIHRpbWUgc3VjaCBhcyBcIjIzOjU5XCIsIFwiVDIzOjU5OjU5KzA3MDBcIiwgXCIyMzo1OTo1OSBHTVQtMDU6MDBcIiwgXCIyMzo1OTo1OSBDU1RcIiwgXCJUMjM6NTk6NTlaXCJcbmNvbnN0IHRpbWUyNEhvdXJzID0gbmV3IEZvcm1hdCh7XG5cdC8qIHByZXR0aWVyLWlnbm9yZSAqL1xuXHQvLyAgICAgICAgICAgJDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJDIgICAgICAgICQzICAgICAgICAgICAkNCAgICAgICAgICAgICAgJDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQ2ICAgICAgICAgICAgICAgICAkN1xuXHR0ZW1wbGF0ZTogJ14oLio/KV9TUEFDRV8qKD86YXR8b258VHwpX1NQQUNFXyooX0gyNF8pXFxcXDooX01JTl8pKD86XFxcXDooX1NFQ18pKD86W1xcXFwuLF0oX01TXykpPyk/X1NQQUNFXyooPzpHTVQpP19TUEFDRV8qKF9PRkZTRVRfKT9fU1BBQ0VfKihfWk9ORV8pPyQnLFxuXHRoYW5kbGVyOiBmdW5jdGlvbiAobWF0Y2hlcywgbG9jYWxlKSB7XG5cdFx0bGV0IFssIGRhdGVFeHByLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmQsIG9mZnNldCwgem9uZV0gPSBtYXRjaGVzO1xuXHRcdGxldCByZXN1bHQgPSB7fTtcblx0XHRpZiAoZGF0ZUV4cHIpIHtcblx0XHRcdHJlc3VsdCA9IHRoaXMucGFyc2VyLmF0dGVtcHQoZGF0ZUV4cHIsIGxvY2FsZSk7XG5cdFx0XHRpZiAocmVzdWx0LmludmFsaWQpIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmVzdWx0LmhvdXIgPSBob3VyO1xuXHRcdHJlc3VsdC5taW51dGUgPSBtaW51dGU7XG5cdFx0aWYgKHNlY29uZCkge1xuXHRcdFx0cmVzdWx0LnNlY29uZCA9IHNlY29uZDtcblx0XHR9XG5cdFx0aWYgKG1pbGxpc2Vjb25kICYmIG1pbGxpc2Vjb25kLmxlbmd0aCA+IDMpIHtcblx0XHRcdHJlc3VsdC5taWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kLnNsaWNlKDAsIDMpO1xuXHRcdH0gZWxzZSBpZiAobWlsbGlzZWNvbmQpIHtcblx0XHRcdHJlc3VsdC5taWxsaXNlY29uZCA9IG1pbGxpc2Vjb25kO1xuXHRcdH1cblx0XHRpZiAoem9uZSAmJiAhb2Zmc2V0ICYmIHpvbmUgaW4gdGltZXpvbmVOYW1lcykge1xuXHRcdFx0cmVzdWx0Lm9mZnNldCA9IHRpbWV6b25lTmFtZXNbem9uZV07XG5cdFx0fSBlbHNlIGlmIChvZmZzZXQpIHtcblx0XHRcdGNvbnN0IGxvY0hlbHBlciA9IExvY2FsZUhlbHBlci5mYWN0b3J5KGxvY2FsZSk7XG5cdFx0XHRyZXN1bHQub2Zmc2V0ID0gbG9jSGVscGVyLm9mZnNldFRvTWludXRlcyhvZmZzZXQpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTI0SG91cnM7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbmNvbnN0IHRvZGF5ID0gbmV3IEZvcm1hdCh7XG5cdG1hdGNoZXI6IC9eKG5vd3x0b2RheXx0b21vcnJvd3x5ZXN0ZXJkYXkpL2ksXG5cdGhhbmRsZXI6IGZ1bmN0aW9uIChtYXRjaCkge1xuXHRcdGNvbnN0IG5vdyA9IHRoaXMubm93KCk7XG5cdFx0Y29uc3Qga2V5d29yZCA9IG1hdGNoWzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0c3dpdGNoIChrZXl3b3JkKSB7XG5cdFx0XHRjYXNlICd0b21vcnJvdyc6XG5cdFx0XHRcdC8vIEphdmFTY3JpcHQgYXV0b21hdGljYWxseSBoYW5kbGVzIGZsb3dpbmcgZnJvbSBvbmUgZGF5IHRvIHRoZSBuZXh0XG5cdFx0XHRcdC8vIEZvciBleGFtcGxlLCAzMSBqYW4gMjAyMCB3aWxsIGF1dG8gY29udmVydCB0byAxIGZlYiAyMDIwXG5cdFx0XHRcdG5vdy5zZXRVVENEYXRlKG5vdy5nZXRVVENEYXRlKCkgKyAxKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd5ZXN0ZXJkYXknOlxuXHRcdFx0XHRub3cuc2V0VVRDRGF0ZShub3cuZ2V0VVRDRGF0ZSgpIC0gMSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRjb25zdCByZXN1bHQgPSB7XG5cdFx0XHR5ZWFyOiBub3cuZ2V0VVRDRnVsbFllYXIoKSxcblx0XHRcdG1vbnRoOiBub3cuZ2V0VVRDTW9udGgoKSArIDEsXG5cdFx0XHRkYXk6IG5vdy5nZXRVVENEYXRlKCksXG5cdFx0fTtcblx0XHRpZiAoa2V5d29yZCA9PT0gJ25vdycpIHtcblx0XHRcdHJlc3VsdC5ob3VyID0gbm93LmdldFVUQ0hvdXJzKCk7XG5cdFx0XHRyZXN1bHQubWludXRlID0gbm93LmdldFVUQ01pbnV0ZXMoKTtcblx0XHRcdHJlc3VsdC5zZWNvbmQgPSBub3cuZ2V0VVRDU2Vjb25kcygpO1xuXHRcdFx0cmVzdWx0Lm1pbGxpc2Vjb25kID0gbm93LmdldFVUQ01pbGxpc2Vjb25kcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdG9kYXk7XG4iLCJjb25zdCBGb3JtYXQgPSByZXF1aXJlKCcuLi8uLi9Gb3JtYXQvRm9ybWF0LmpzJyk7XG5cbi8vIGV4YW1wbGU6IFwiRnJpIEFwciAwOSAxMjo1Mzo1NCArMDAwMCAyMDEwXCJcbmNvbnN0IHR3aXR0ZXIgPSBuZXcgRm9ybWF0KHtcblx0LyogcHJldHRpZXItaWdub3JlICovXG5cdC8vICAgICAgICAgICAgICAgICAgICAgICAgICQxICAgICAgICAgICAgJDIgICAgICAkMyAgICAgICQ0ICAgICAgJDUgICAgICAkNiAgICAgICAgICQ3XG5cdHRlbXBsYXRlOiAnXig/Ol9EQVlOQU1FXykgKF9NT05USE5BTUVfKSAoX0RBWV8pIChfSDI0Xyk6KF9NSU5fKTooX1NFQ18pIChfT0ZGU0VUXykgKF9ZRUFSXykkJyxcblx0dW5pdHM6IFsnbW9udGgnLCAnZGF5JywgJ2hvdXInLCAnbWludXRlJywgJ3NlY29uZCcsICdvZmZzZXQnLCAneWVhciddLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdHdpdHRlcjtcbiIsImNvbnN0IEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL0Zvcm1hdC9Gb3JtYXQuanMnKTtcblxuY29uc3QgeWVhck1vbnRoRGF5ID0gbmV3IEZvcm1hdCh7XG5cdC8qIHByZXR0aWVyLWlnbm9yZSAqL1xuXHQvLyAgICAgICAgICAgJDEgICAgICAkMiAgJDMgICAgICAgICAgJDRcblx0dGVtcGxhdGU6IFwiXihfWUVBUl8pKC0/KShfTU9OVEhfKVxcXFwyKF9EQVlfKSRcIixcblx0dW5pdHM6IFsneWVhcicsIG51bGwsICdtb250aCcsICdkYXknXSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHllYXJNb250aERheTtcbiIsImZ1bmN0aW9uIGZyb21BbnkoZnJvbVN0cmluZykge1xuXHRyZXR1cm4gZnVuY3Rpb24gZnJvbUFueShhbnksIGxvY2FsZSkge1xuXHRcdGlmIChhbnkgaW5zdGFuY2VvZiBEYXRlKSB7XG5cdFx0XHRyZXR1cm4gYW55O1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGFueSA9PT0gJ251bWJlcicpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZShhbnkpO1xuXHRcdH1cblx0XHRyZXR1cm4gZnJvbVN0cmluZyhhbnksIGxvY2FsZSk7XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbUFueTtcbiIsImZ1bmN0aW9uIGZyb21TdHJpbmcocGFyc2VyLCBkZWZhdWx0TG9jYWxlKSB7XG5cdHJldHVybiBmdW5jdGlvbiBmcm9tU3RyaW5nRnVuY3Rpb24oc3RyaW5nLCBsb2NhbGUgPSBkZWZhdWx0TG9jYWxlKSB7XG5cdFx0Y29uc3QgcGFyc2VkID0gcGFyc2VyLmF0dGVtcHQoc3RyaW5nLCBsb2NhbGUpO1xuXHRcdGlmIChwYXJzZWQuaW52YWxpZCkge1xuXHRcdFx0cmV0dXJuIHBhcnNlZDtcblx0XHR9XG5cdFx0Ly8gc2V0IHRvIEphbiAxIHRvIHByZXZlbnQgc2V0dGluZyBub24tZXhpc3RlbnQgZGF5c1xuXHRcdGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgyMDAwLCAwLCAxKTtcblx0XHQvLyBmaXJzdCBzZXR0aW5nIGRheSwgdGhlbiB5ZWFyLCB0aGVuIG1vbnRoXG5cdFx0Ly8gdG8gaGFuZGxlIG1vbnRocyB3aXRoIGZld2VyIGRheXMgYW5kIHllYXJzIHdpdGhvdXQgRmViIDI5XG5cdFx0aWYgKHR5cGVvZiBwYXJzZWQuZGF5ID09PSAnbnVtYmVyJykge1xuXHRcdFx0ZGF0ZS5zZXRVVENEYXRlKHBhcnNlZC5kYXkpO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHBhcnNlZC55ZWFyID09PSAnbnVtYmVyJykge1xuXHRcdFx0ZGF0ZS5zZXRVVENGdWxsWWVhcihwYXJzZWQueWVhcik7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgcGFyc2VkLm1vbnRoID09PSAnbnVtYmVyJykge1xuXHRcdFx0ZGF0ZS5zZXRVVENNb250aChwYXJzZWQubW9udGggLSAxKTtcblx0XHR9XG5cdFx0Ly8gZGVmYXVsdCB0byBmaXJzdCB1bml0IGZvciB0aW1lIGNvbXBvbmVudHNcblx0XHRkYXRlLnNldFVUQ0hvdXJzKHBhcnNlZC5ob3VyIHx8IDApO1xuXHRcdGRhdGUuc2V0VVRDTWludXRlcyhwYXJzZWQubWludXRlIHx8IDApO1xuXHRcdGRhdGUuc2V0VVRDU2Vjb25kcyhwYXJzZWQuc2Vjb25kIHx8IDApO1xuXHRcdGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKHBhcnNlZC5taWxsaXNlY29uZCB8fCAwKTtcblx0XHRpZiAodHlwZW9mIHBhcnNlZC5vZmZzZXQgPT09ICdudW1iZXInKSB7XG5cdFx0XHRyZXR1cm4gbmV3IERhdGUoZGF0ZSAtIHBhcnNlZC5vZmZzZXQgKiA2MCAqIDEwMDApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0ZTtcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmcm9tU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxudmFyIF9uYW5vaWQgPSByZXF1aXJlKFwibmFub2lkXCIpO1xuXG52YXIgX3V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgdGl0bGU6ICdVbnRpdGxlZCBldmVudCcsXG4gIHByb2R1Y3RJZDogJ2FkYW1naWJib25zL2ljcycsXG4gIG1ldGhvZDogJ1BVQkxJU0gnLFxuICB1aWQ6ICgwLCBfbmFub2lkLm5hbm9pZCkoKSxcbiAgdGltZXN0YW1wOiAoMCwgX3V0aWxzLmZvcm1hdERhdGUpKG51bGwsICd1dGMnKSxcbiAgc3RhcnQ6ICgwLCBfdXRpbHMuZm9ybWF0RGF0ZSkobnVsbCwgJ3V0YycpXG59O1xudmFyIF9kZWZhdWx0ID0gZGVmYXVsdHM7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jb252ZXJ0VGltZXN0YW1wVG9BcnJheSA9IGNvbnZlcnRUaW1lc3RhbXBUb0FycmF5O1xuZXhwb3J0cy5jcmVhdGVFdmVudCA9IGNyZWF0ZUV2ZW50O1xuZXhwb3J0cy5jcmVhdGVFdmVudHMgPSBjcmVhdGVFdmVudHM7XG5cbnZhciBfbmFub2lkID0gcmVxdWlyZShcIm5hbm9pZFwiKTtcblxudmFyIF9waXBlbGluZSA9IHJlcXVpcmUoXCIuL3BpcGVsaW5lXCIpO1xuXG5mdW5jdGlvbiBhc3NpZ25VbmlxdWVJZChldmVudCkge1xuICBldmVudC51aWQgPSBldmVudC51aWQgfHwgKDAsIF9uYW5vaWQubmFub2lkKSgpO1xuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQW5kQnVpbGRFdmVudChldmVudCkge1xuICByZXR1cm4gKDAsIF9waXBlbGluZS52YWxpZGF0ZUV2ZW50KSgoMCwgX3BpcGVsaW5lLmJ1aWxkRXZlbnQpKGV2ZW50KSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5SW5pdGlhbEZvcm1hdHRpbmcoX3JlZikge1xuICB2YXIgZXJyb3IgPSBfcmVmLmVycm9yLFxuICAgICAgdmFsdWUgPSBfcmVmLnZhbHVlO1xuXG4gIGlmIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgICB2YWx1ZTogbnVsbFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVycm9yOiBudWxsLFxuICAgIHZhbHVlOiAoMCwgX3BpcGVsaW5lLmZvcm1hdEV2ZW50KSh2YWx1ZSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gcmVmb3JtYXRFdmVudHNCeVBvc2l0aW9uKF9yZWYyLCBpZHgsIGxpc3QpIHtcbiAgdmFyIGVycm9yID0gX3JlZjIuZXJyb3IsXG4gICAgICB2YWx1ZSA9IF9yZWYyLnZhbHVlO1xuICBpZiAoZXJyb3IpIHJldHVybiB7XG4gICAgZXJyb3I6IGVycm9yLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xuXG4gIGlmIChpZHggPT09IDApIHtcbiAgICAvLyBiZWdpbm5pbmcgb2YgbGlzdFxuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUuc2xpY2UoMCwgdmFsdWUuaW5kZXhPZignRU5EOlZDQUxFTkRBUicpKSxcbiAgICAgIGVycm9yOiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChpZHggPT09IGxpc3QubGVuZ3RoIC0gMSkge1xuICAgIC8vIGVuZCBvZiBsaXN0XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZS5zbGljZSh2YWx1ZS5pbmRleE9mKCdCRUdJTjpWRVZFTlQnKSksXG4gICAgICBlcnJvcjogbnVsbFxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVycm9yOiBudWxsLFxuICAgIHZhbHVlOiB2YWx1ZS5zbGljZSh2YWx1ZS5pbmRleE9mKCdCRUdJTjpWRVZFTlQnKSwgdmFsdWUuaW5kZXhPZignRU5EOlZFVkVOVCcpICsgMTIpXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhdGVuYXRlRXZlbnRzKGFjY3VtdWxhdG9yLCBfcmVmMywgaWR4KSB7XG4gIHZhciBlcnJvciA9IF9yZWYzLmVycm9yLFxuICAgICAgdmFsdWUgPSBfcmVmMy52YWx1ZTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBhY2N1bXVsYXRvci5lcnJvciA9IGVycm9yO1xuICAgIGFjY3VtdWxhdG9yLnZhbHVlID0gbnVsbDtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICBpZiAoYWNjdW11bGF0b3IudmFsdWUpIHtcbiAgICBhY2N1bXVsYXRvci52YWx1ZSA9IGFjY3VtdWxhdG9yLnZhbHVlLmNvbmNhdCh2YWx1ZSk7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgYWNjdW11bGF0b3IudmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VGltZXN0YW1wVG9BcnJheSh0aW1lc3RhbXApIHtcbiAgdmFyIGlucHV0VHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ2xvY2FsJztcbiAgdmFyIGRhdGVBcnJheSA9IFtdO1xuICB2YXIgZCA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG4gIGRhdGVBcnJheS5wdXNoKGlucHV0VHlwZSA9PT0gJ2xvY2FsJyA/IGQuZ2V0RnVsbFllYXIoKSA6IGQuZ2V0VVRDRnVsbFllYXIoKSk7XG4gIGRhdGVBcnJheS5wdXNoKChpbnB1dFR5cGUgPT09ICdsb2NhbCcgPyBkLmdldE1vbnRoKCkgOiBkLmdldFVUQ01vbnRoKCkpICsgMSk7XG4gIGRhdGVBcnJheS5wdXNoKGlucHV0VHlwZSA9PT0gJ2xvY2FsJyA/IGQuZ2V0RGF0ZSgpIDogZC5nZXRVVENEYXRlKCkpO1xuICBkYXRlQXJyYXkucHVzaChpbnB1dFR5cGUgPT09ICdsb2NhbCcgPyBkLmdldEhvdXJzKCkgOiBkLmdldFVUQ0hvdXJzKCkpO1xuICBkYXRlQXJyYXkucHVzaChpbnB1dFR5cGUgPT09ICdsb2NhbCcgPyBkLmdldE1pbnV0ZXMoKSA6IGQuZ2V0VVRDTWludXRlcygpKTtcbiAgcmV0dXJuIGRhdGVBcnJheTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRXZlbnQoYXR0cmlidXRlcywgY2IpIHtcbiAgaWYgKCFhdHRyaWJ1dGVzKSB7XG4gICAgRXJyb3IoJ0F0dHJpYnV0ZXMgYXJndW1lbnQgaXMgcmVxdWlyZWQnKTtcbiAgfVxuXG4gIGFzc2lnblVuaXF1ZUlkKGF0dHJpYnV0ZXMpO1xuXG4gIGlmICghY2IpIHtcbiAgICAvLyBObyBjYWxsYmFjaywgc28gcmV0dXJuIGVycm9yIG9yIHZhbHVlIGluIGFuIG9iamVjdFxuICAgIHZhciBfdmFsaWRhdGVBbmRCdWlsZEV2ZW4gPSB2YWxpZGF0ZUFuZEJ1aWxkRXZlbnQoYXR0cmlidXRlcyksXG4gICAgICAgIF9lcnJvciA9IF92YWxpZGF0ZUFuZEJ1aWxkRXZlbi5lcnJvcixcbiAgICAgICAgX3ZhbHVlID0gX3ZhbGlkYXRlQW5kQnVpbGRFdmVuLnZhbHVlO1xuXG4gICAgaWYgKF9lcnJvcikgcmV0dXJuIHtcbiAgICAgIGVycm9yOiBfZXJyb3IsXG4gICAgICB2YWx1ZTogX3ZhbHVlXG4gICAgfTtcbiAgICB2YXIgZXZlbnQgPSAnJztcblxuICAgIHRyeSB7XG4gICAgICBldmVudCA9ICgwLCBfcGlwZWxpbmUuZm9ybWF0RXZlbnQpKF92YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgICAgdmFsdWU6IG51bGxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgdmFsdWU6IGV2ZW50XG4gICAgfTtcbiAgfSAvLyBSZXR1cm4gYSBub2RlLXN0eWxlIGNhbGxiYWNrXG5cblxuICB2YXIgX3ZhbGlkYXRlQW5kQnVpbGRFdmVuMiA9IHZhbGlkYXRlQW5kQnVpbGRFdmVudChhdHRyaWJ1dGVzKSxcbiAgICAgIGVycm9yID0gX3ZhbGlkYXRlQW5kQnVpbGRFdmVuMi5lcnJvcixcbiAgICAgIHZhbHVlID0gX3ZhbGlkYXRlQW5kQnVpbGRFdmVuMi52YWx1ZTtcblxuICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcik7XG4gIHJldHVybiBjYihudWxsLCAoMCwgX3BpcGVsaW5lLmZvcm1hdEV2ZW50KSh2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFdmVudHMoZXZlbnRzLCBjYikge1xuICBpZiAoIWV2ZW50cykge1xuICAgIHJldHVybiB7XG4gICAgICBlcnJvcjogRXJyb3IoJ29uZSBhcmd1bWVudCBpcyByZXF1aXJlZCcpLFxuICAgICAgdmFsdWU6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGV2ZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3JlYXRlRXZlbnQoZXZlbnRzWzBdLCBjYik7XG4gIH1cblxuICB2YXIgX2V2ZW50cyRtYXAkbWFwJG1hcCRtID0gZXZlbnRzLm1hcChhc3NpZ25VbmlxdWVJZCkubWFwKHZhbGlkYXRlQW5kQnVpbGRFdmVudCkubWFwKGFwcGx5SW5pdGlhbEZvcm1hdHRpbmcpLm1hcChyZWZvcm1hdEV2ZW50c0J5UG9zaXRpb24pLnJlZHVjZShjYXRlbmF0ZUV2ZW50cywge1xuICAgIGVycm9yOiBudWxsLFxuICAgIHZhbHVlOiBudWxsXG4gIH0pLFxuICAgICAgZXJyb3IgPSBfZXZlbnRzJG1hcCRtYXAkbWFwJG0uZXJyb3IsXG4gICAgICB2YWx1ZSA9IF9ldmVudHMkbWFwJG1hcCRtYXAkbS52YWx1ZTtcblxuICBpZiAoIWNiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiBlcnJvcixcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY2IoZXJyb3IsIHZhbHVlKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gYnVpbGRFdmVudDtcblxudmFyIF9kZWZhdWx0cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL2RlZmF1bHRzXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmZ1bmN0aW9uIGJ1aWxkRXZlbnQoKSB7XG4gIHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgdmFyIHRpdGxlID0gYXR0cmlidXRlcy50aXRsZSxcbiAgICAgIHByb2R1Y3RJZCA9IGF0dHJpYnV0ZXMucHJvZHVjdElkLFxuICAgICAgbWV0aG9kID0gYXR0cmlidXRlcy5tZXRob2QsXG4gICAgICB1aWQgPSBhdHRyaWJ1dGVzLnVpZCxcbiAgICAgIHNlcXVlbmNlID0gYXR0cmlidXRlcy5zZXF1ZW5jZSxcbiAgICAgIHN0YXJ0ID0gYXR0cmlidXRlcy5zdGFydCxcbiAgICAgIHN0YXJ0VHlwZSA9IGF0dHJpYnV0ZXMuc3RhcnRUeXBlLFxuICAgICAgZHVyYXRpb24gPSBhdHRyaWJ1dGVzLmR1cmF0aW9uLFxuICAgICAgZW5kID0gYXR0cmlidXRlcy5lbmQsXG4gICAgICBkZXNjcmlwdGlvbiA9IGF0dHJpYnV0ZXMuZGVzY3JpcHRpb24sXG4gICAgICB1cmwgPSBhdHRyaWJ1dGVzLnVybCxcbiAgICAgIGdlbyA9IGF0dHJpYnV0ZXMuZ2VvLFxuICAgICAgbG9jYXRpb24gPSBhdHRyaWJ1dGVzLmxvY2F0aW9uLFxuICAgICAgc3RhdHVzID0gYXR0cmlidXRlcy5zdGF0dXMsXG4gICAgICBjYXRlZ29yaWVzID0gYXR0cmlidXRlcy5jYXRlZ29yaWVzLFxuICAgICAgb3JnYW5pemVyID0gYXR0cmlidXRlcy5vcmdhbml6ZXIsXG4gICAgICBhdHRlbmRlZXMgPSBhdHRyaWJ1dGVzLmF0dGVuZGVlcyxcbiAgICAgIGFsYXJtcyA9IGF0dHJpYnV0ZXMuYWxhcm1zLFxuICAgICAgcmVjdXJyZW5jZVJ1bGUgPSBhdHRyaWJ1dGVzLnJlY3VycmVuY2VSdWxlLFxuICAgICAgY3JlYXRlZCA9IGF0dHJpYnV0ZXMuY3JlYXRlZCxcbiAgICAgIGxhc3RNb2RpZmllZCA9IGF0dHJpYnV0ZXMubGFzdE1vZGlmaWVkLFxuICAgICAgY2FsTmFtZSA9IGF0dHJpYnV0ZXMuY2FsTmFtZSxcbiAgICAgIGh0bWxDb250ZW50ID0gYXR0cmlidXRlcy5odG1sQ29udGVudDsgLy8gZmlsbCBpbiBkZWZhdWx0IHZhbHVlcyB3aGVyZSBuZWNlc3NhcnlcblxuICB2YXIgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbih7fSwgX2RlZmF1bHRzW1wiZGVmYXVsdFwiXSwgYXR0cmlidXRlcyk7IC8vIHJlbW92ZSBmYWxzZXkgdmFsdWVzXG5cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG91dHB1dCkucmVkdWNlKGZ1bmN0aW9uIChjbGVhbiwgZW50cnkpIHtcbiAgICByZXR1cm4gZW50cnlbMV0gPyBPYmplY3QuYXNzaWduKGNsZWFuLCBfZGVmaW5lUHJvcGVydHkoe30sIGVudHJ5WzBdLCBlbnRyeVsxXSkpIDogY2xlYW47XG4gIH0sIHt9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZm9ybWF0RXZlbnQ7XG5cbnZhciBfdXRpbHMgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG5cbmZ1bmN0aW9uIGZvcm1hdEV2ZW50KCkge1xuICB2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gIHZhciB0aXRsZSA9IGF0dHJpYnV0ZXMudGl0bGUsXG4gICAgICBwcm9kdWN0SWQgPSBhdHRyaWJ1dGVzLnByb2R1Y3RJZCxcbiAgICAgIG1ldGhvZCA9IGF0dHJpYnV0ZXMubWV0aG9kLFxuICAgICAgdWlkID0gYXR0cmlidXRlcy51aWQsXG4gICAgICBzZXF1ZW5jZSA9IGF0dHJpYnV0ZXMuc2VxdWVuY2UsXG4gICAgICB0aW1lc3RhbXAgPSBhdHRyaWJ1dGVzLnRpbWVzdGFtcCxcbiAgICAgIHN0YXJ0ID0gYXR0cmlidXRlcy5zdGFydCxcbiAgICAgIHN0YXJ0VHlwZSA9IGF0dHJpYnV0ZXMuc3RhcnRUeXBlLFxuICAgICAgc3RhcnRJbnB1dFR5cGUgPSBhdHRyaWJ1dGVzLnN0YXJ0SW5wdXRUeXBlLFxuICAgICAgc3RhcnRPdXRwdXRUeXBlID0gYXR0cmlidXRlcy5zdGFydE91dHB1dFR5cGUsXG4gICAgICBkdXJhdGlvbiA9IGF0dHJpYnV0ZXMuZHVyYXRpb24sXG4gICAgICBlbmQgPSBhdHRyaWJ1dGVzLmVuZCxcbiAgICAgIGVuZElucHV0VHlwZSA9IGF0dHJpYnV0ZXMuZW5kSW5wdXRUeXBlLFxuICAgICAgZW5kT3V0cHV0VHlwZSA9IGF0dHJpYnV0ZXMuZW5kT3V0cHV0VHlwZSxcbiAgICAgIGRlc2NyaXB0aW9uID0gYXR0cmlidXRlcy5kZXNjcmlwdGlvbixcbiAgICAgIHVybCA9IGF0dHJpYnV0ZXMudXJsLFxuICAgICAgZ2VvID0gYXR0cmlidXRlcy5nZW8sXG4gICAgICBsb2NhdGlvbiA9IGF0dHJpYnV0ZXMubG9jYXRpb24sXG4gICAgICBzdGF0dXMgPSBhdHRyaWJ1dGVzLnN0YXR1cyxcbiAgICAgIGNhdGVnb3JpZXMgPSBhdHRyaWJ1dGVzLmNhdGVnb3JpZXMsXG4gICAgICBvcmdhbml6ZXIgPSBhdHRyaWJ1dGVzLm9yZ2FuaXplcixcbiAgICAgIGF0dGVuZGVlcyA9IGF0dHJpYnV0ZXMuYXR0ZW5kZWVzLFxuICAgICAgYWxhcm1zID0gYXR0cmlidXRlcy5hbGFybXMsXG4gICAgICByZWN1cnJlbmNlUnVsZSA9IGF0dHJpYnV0ZXMucmVjdXJyZW5jZVJ1bGUsXG4gICAgICBidXN5U3RhdHVzID0gYXR0cmlidXRlcy5idXN5U3RhdHVzLFxuICAgICAgY2xhc3NpZmljYXRpb24gPSBhdHRyaWJ1dGVzLmNsYXNzaWZpY2F0aW9uLFxuICAgICAgY3JlYXRlZCA9IGF0dHJpYnV0ZXMuY3JlYXRlZCxcbiAgICAgIGxhc3RNb2RpZmllZCA9IGF0dHJpYnV0ZXMubGFzdE1vZGlmaWVkLFxuICAgICAgY2FsTmFtZSA9IGF0dHJpYnV0ZXMuY2FsTmFtZSxcbiAgICAgIGh0bWxDb250ZW50ID0gYXR0cmlidXRlcy5odG1sQ29udGVudDtcbiAgdmFyIGljc0Zvcm1hdCA9ICcnO1xuICBpY3NGb3JtYXQgKz0gJ0JFR0lOOlZDQUxFTkRBUlxcclxcbic7XG4gIGljc0Zvcm1hdCArPSAnVkVSU0lPTjoyLjBcXHJcXG4nO1xuICBpY3NGb3JtYXQgKz0gJ0NBTFNDQUxFOkdSRUdPUklBTlxcclxcbic7XG4gIGljc0Zvcm1hdCArPSAoMCwgX3V0aWxzLmZvbGRMaW5lKShcIlBST0RJRDpcIi5jb25jYXQocHJvZHVjdElkKSkgKyAnXFxyXFxuJztcbiAgaWNzRm9ybWF0ICs9ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiTUVUSE9EOlwiLmNvbmNhdChtZXRob2QpKSArICdcXHJcXG4nO1xuICBpY3NGb3JtYXQgKz0gY2FsTmFtZSA/ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiWC1XUi1DQUxOQU1FOlwiLmNvbmNhdChjYWxOYW1lKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gXCJYLVBVQkxJU0hFRC1UVEw6UFQxSFxcclxcblwiO1xuICBpY3NGb3JtYXQgKz0gJ0JFR0lOOlZFVkVOVFxcclxcbic7XG4gIGljc0Zvcm1hdCArPSBcIlVJRDpcIi5jb25jYXQodWlkLCBcIlxcclxcblwiKTtcbiAgaWNzRm9ybWF0ICs9ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiU1VNTUFSWTpcIi5jb25jYXQodGl0bGUgPyAoMCwgX3V0aWxzLnNldFN1bW1hcnkpKHRpdGxlKSA6IHRpdGxlKSkgKyAnXFxyXFxuJztcbiAgaWNzRm9ybWF0ICs9IFwiRFRTVEFNUDpcIi5jb25jYXQodGltZXN0YW1wLCBcIlxcclxcblwiKTsgLy8gQWxsIGRheSBldmVudHMgbGlrZSBhbm5pdmVyc2FyaWVzIG11c3QgYmUgc3BlY2lmaWVkIGFzIFZBTFVFIHR5cGUgREFURVxuXG4gIGljc0Zvcm1hdCArPSBcIkRUU1RBUlRcIi5jb25jYXQoc3RhcnQgJiYgc3RhcnQubGVuZ3RoID09IDMgPyBcIjtWQUxVRT1EQVRFXCIgOiBcIlwiLCBcIjpcIikuY29uY2F0KCgwLCBfdXRpbHMuZm9ybWF0RGF0ZSkoc3RhcnQsIHN0YXJ0T3V0cHV0VHlwZSB8fCBzdGFydFR5cGUsIHN0YXJ0SW5wdXRUeXBlKSwgXCJcXHJcXG5cIik7IC8vIEVuZCBpcyBub3QgcmVxdWlyZWQgZm9yIGFsbCBkYXkgZXZlbnRzIG9uIHNpbmdsZSBkYXlzIChsaWtlIGFubml2ZXJzYXJpZXMpXG5cbiAgaWYgKCFlbmQgfHwgZW5kLmxlbmd0aCAhPT0gMyB8fCBzdGFydC5sZW5ndGggIT09IGVuZC5sZW5ndGggfHwgc3RhcnQuc29tZShmdW5jdGlvbiAodmFsLCBpKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gZW5kW2ldO1xuICB9KSkge1xuICAgIGlmIChlbmQpIHtcbiAgICAgIGljc0Zvcm1hdCArPSBcIkRURU5EXCIuY29uY2F0KGVuZC5sZW5ndGggPT09IDMgPyBcIjtWQUxVRT1EQVRFXCIgOiBcIlwiLCBcIjpcIikuY29uY2F0KCgwLCBfdXRpbHMuZm9ybWF0RGF0ZSkoZW5kLCBlbmRPdXRwdXRUeXBlIHx8IHN0YXJ0T3V0cHV0VHlwZSB8fCBzdGFydFR5cGUsIGVuZElucHV0VHlwZSB8fCBzdGFydElucHV0VHlwZSksIFwiXFxyXFxuXCIpO1xuICAgIH1cbiAgfVxuXG4gIGljc0Zvcm1hdCArPSBzZXF1ZW5jZSA/IFwiU0VRVUVOQ0U6XCIuY29uY2F0KHNlcXVlbmNlLCBcIlxcclxcblwiKSA6ICcnO1xuICBpY3NGb3JtYXQgKz0gZGVzY3JpcHRpb24gPyAoMCwgX3V0aWxzLmZvbGRMaW5lKShcIkRFU0NSSVBUSU9OOlwiLmNvbmNhdCgoMCwgX3V0aWxzLnNldERlc2NyaXB0aW9uKShkZXNjcmlwdGlvbikpKSArICdcXHJcXG4nIDogJyc7XG4gIGljc0Zvcm1hdCArPSB1cmwgPyAoMCwgX3V0aWxzLmZvbGRMaW5lKShcIlVSTDpcIi5jb25jYXQodXJsKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gZ2VvID8gKDAsIF91dGlscy5mb2xkTGluZSkoXCJHRU86XCIuY29uY2F0KCgwLCBfdXRpbHMuc2V0R2VvbG9jYXRpb24pKGdlbykpKSArICdcXHJcXG4nIDogJyc7XG4gIGljc0Zvcm1hdCArPSBsb2NhdGlvbiA/ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiTE9DQVRJT046XCIuY29uY2F0KCgwLCBfdXRpbHMuc2V0TG9jYXRpb24pKGxvY2F0aW9uKSkpICsgJ1xcclxcbicgOiAnJztcbiAgaWNzRm9ybWF0ICs9IHN0YXR1cyA/ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiU1RBVFVTOlwiLmNvbmNhdChzdGF0dXMpKSArICdcXHJcXG4nIDogJyc7XG4gIGljc0Zvcm1hdCArPSBjYXRlZ29yaWVzID8gKDAsIF91dGlscy5mb2xkTGluZSkoXCJDQVRFR09SSUVTOlwiLmNvbmNhdChjYXRlZ29yaWVzKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gb3JnYW5pemVyID8gKDAsIF91dGlscy5mb2xkTGluZSkoXCJPUkdBTklaRVI7XCIuY29uY2F0KCgwLCBfdXRpbHMuc2V0T3JnYW5pemVyKShvcmdhbml6ZXIpKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gYnVzeVN0YXR1cyA/ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiWC1NSUNST1NPRlQtQ0RPLUJVU1lTVEFUVVM6XCIuY29uY2F0KGJ1c3lTdGF0dXMpKSArICdcXHJcXG4nIDogJyc7XG4gIGljc0Zvcm1hdCArPSBjbGFzc2lmaWNhdGlvbiA/ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiQ0xBU1M6XCIuY29uY2F0KGNsYXNzaWZpY2F0aW9uKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gY3JlYXRlZCA/ICdDUkVBVEVEOicgKyAoMCwgX3V0aWxzLmZvcm1hdERhdGUpKGNyZWF0ZWQpICsgJ1xcclxcbicgOiAnJztcbiAgaWNzRm9ybWF0ICs9IGxhc3RNb2RpZmllZCA/ICdMQVNULU1PRElGSUVEOicgKyAoMCwgX3V0aWxzLmZvcm1hdERhdGUpKGxhc3RNb2RpZmllZCkgKyAnXFxyXFxuJyA6ICcnO1xuICBpY3NGb3JtYXQgKz0gaHRtbENvbnRlbnQgPyAoMCwgX3V0aWxzLmZvbGRMaW5lKShcIlgtQUxULURFU0M7Rk1UVFlQRT10ZXh0L2h0bWw6XCIuY29uY2F0KGh0bWxDb250ZW50KSkgKyAnXFxyXFxuJyA6ICcnO1xuXG4gIGlmIChhdHRlbmRlZXMpIHtcbiAgICBhdHRlbmRlZXMubWFwKGZ1bmN0aW9uIChhdHRlbmRlZSkge1xuICAgICAgaWNzRm9ybWF0ICs9ICgwLCBfdXRpbHMuZm9sZExpbmUpKFwiQVRURU5ERUU7XCIuY29uY2F0KCgwLCBfdXRpbHMuc2V0Q29udGFjdCkoYXR0ZW5kZWUpKSkgKyAnXFxyXFxuJztcbiAgICB9KTtcbiAgfVxuXG4gIGljc0Zvcm1hdCArPSByZWN1cnJlbmNlUnVsZSA/IFwiUlJVTEU6XCIuY29uY2F0KHJlY3VycmVuY2VSdWxlLCBcIlxcclxcblwiKSA6ICcnO1xuICBpY3NGb3JtYXQgKz0gZHVyYXRpb24gPyBcIkRVUkFUSU9OOlwiLmNvbmNhdCgoMCwgX3V0aWxzLmZvcm1hdER1cmF0aW9uKShkdXJhdGlvbiksIFwiXFxyXFxuXCIpIDogJyc7XG5cbiAgaWYgKGFsYXJtcykge1xuICAgIGFsYXJtcy5tYXAoZnVuY3Rpb24gKGFsYXJtKSB7XG4gICAgICBpY3NGb3JtYXQgKz0gKDAsIF91dGlscy5zZXRBbGFybSkoYWxhcm0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWNzRm9ybWF0ICs9IFwiRU5EOlZFVkVOVFxcclxcblwiO1xuICBpY3NGb3JtYXQgKz0gXCJFTkQ6VkNBTEVOREFSXFxyXFxuXCI7XG4gIHJldHVybiBpY3NGb3JtYXQ7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJidWlsZEV2ZW50XCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9idWlsZFtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZm9ybWF0RXZlbnRcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2Zvcm1hdFtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidmFsaWRhdGVFdmVudFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfdmFsaWRhdGVbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcblxudmFyIF9idWlsZCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYnVpbGRcIikpO1xuXG52YXIgX2Zvcm1hdCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZm9ybWF0XCIpKTtcblxudmFyIF92YWxpZGF0ZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdmFsaWRhdGVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xuXG52YXIgX3NjaGVtYSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3NjaGVtYVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX2RlZmF1bHQgPSBfc2NoZW1hW1wiZGVmYXVsdFwiXTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdmFsaWRhdGVFdmVudDtcblxudmFyIHl1cCA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJ5dXBcIikpO1xuXG5mdW5jdGlvbiBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUoKSB7IGlmICh0eXBlb2YgV2Vha01hcCAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDsgdmFyIGNhY2hlID0gbmV3IFdlYWtNYXAoKTsgX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlID0gZnVuY3Rpb24gX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCkgeyByZXR1cm4gY2FjaGU7IH07IHJldHVybiBjYWNoZTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGlmIChvYmogPT09IG51bGwgfHwgX3R5cGVvZihvYmopICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmogIT09IFwiZnVuY3Rpb25cIikgeyByZXR1cm4geyBcImRlZmF1bHRcIjogb2JqIH07IH0gdmFyIGNhY2hlID0gX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCk7IGlmIChjYWNoZSAmJiBjYWNoZS5oYXMob2JqKSkgeyByZXR1cm4gY2FjaGUuZ2V0KG9iaik7IH0gdmFyIG5ld09iaiA9IHt9OyB2YXIgaGFzUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBoYXNQcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IG51bGw7IGlmIChkZXNjICYmIChkZXNjLmdldCB8fCBkZXNjLnNldCkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajsgaWYgKGNhY2hlKSB7IGNhY2hlLnNldChvYmosIG5ld09iaik7IH0gcmV0dXJuIG5ld09iajsgfVxuXG4vLyB5dXAgdXJsIHZhbGlkYXRpb24gYmxvY2tzIGxvY2FsaG9zdCwgc28gdXNlIGEgbW9yZSBmbGV4aWJsZSByZWdleCBpbnN0ZWFkXG4vLyB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlbnNlL3l1cC9pc3N1ZXMvMjI0I2lzc3VlY29tbWVudC00MTcxNzI2MDlcbi8vIFRoaXMgZG9lcyBtZWFuIHRoYXQgdGhlIHVybCB2YWxpZGF0aW9uIGVycm9yIGlzXG4vLyBcInVybCBtdXN0IG1hdGNoIHRoZSBmb2xsb3dpbmc6IC4uLi5cIiBhcyBvcHBvc2VkIHRvIFwidXJsIG11c3QgYmUgYSB2YWxpZCBVUkxcIlxudmFyIHVybFJlZ2V4ID0gL14oPzooW2EtejAtOSsuLV0rKTpcXC9cXC8pKD86XFxTKyg/OjpcXFMqKT9AKT8oPzooPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0tKikqW2EtelxcdTAwYTEtXFx1ZmZmZjAtOV0rKSg/OlxcLig/OlthLXpcXHUwMGExLVxcdWZmZmYwLTldLSopKlthLXpcXHUwMGExLVxcdWZmZmYwLTldKykqXFwuPykoPzo6XFxkezIsNX0pPyg/OlsvPyNdXFxTKik/JC87XG52YXIgZGF0ZVRpbWVTY2hlbWEgPSB5dXAuYXJyYXkoKS5taW4oMykubWF4KDcpLm9mKHl1cC5sYXp5KGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zKSB7XG4gIHZhciBpdGVtSW5kZXggPSBwYXJzZUludChvcHRpb25zLnBhdGgubWF0Y2goLy4qXFxbKFxcZCspXS8pWzFdKTtcbiAgcmV0dXJuIFt5dXAubnVtYmVyKCkuaW50ZWdlcigpLCB5dXAubnVtYmVyKCkuaW50ZWdlcigpLm1pbigxKS5tYXgoMTIpLCB5dXAubnVtYmVyKCkuaW50ZWdlcigpLm1pbigxKS5tYXgoMzEpLCB5dXAubnVtYmVyKCkuaW50ZWdlcigpLm1pbigwKS5tYXgoMjMpLCB5dXAubnVtYmVyKCkuaW50ZWdlcigpLm1pbigwKS5tYXgoNjApLCB5dXAubnVtYmVyKCkuaW50ZWdlcigpLm1pbigwKS5tYXgoNjApXVtpdGVtSW5kZXhdO1xufSkpO1xudmFyIGR1cmF0aW9uU2NoZW1hID0geXVwLm9iamVjdCgpLnNoYXBlKHtcbiAgYmVmb3JlOiB5dXBbXCJib29sZWFuXCJdKCksXG4gIC8vb3B0aW9uIHRvIHNldCBiZWZvcmUgYWxhcmFtXG4gIHdlZWtzOiB5dXAubnVtYmVyKCksXG4gIGRheXM6IHl1cC5udW1iZXIoKSxcbiAgaG91cnM6IHl1cC5udW1iZXIoKSxcbiAgbWludXRlczogeXVwLm51bWJlcigpLFxuICBzZWNvbmRzOiB5dXAubnVtYmVyKClcbn0pLm5vVW5rbm93bigpO1xudmFyIGNvbnRhY3RTY2hlbWEgPSB5dXAub2JqZWN0KCkuc2hhcGUoe1xuICBuYW1lOiB5dXAuc3RyaW5nKCksXG4gIGVtYWlsOiB5dXAuc3RyaW5nKCkuZW1haWwoKSxcbiAgcnN2cDogeXVwW1wiYm9vbGVhblwiXSgpLFxuICBkaXI6IHl1cC5zdHJpbmcoKS5tYXRjaGVzKHVybFJlZ2V4KSxcbiAgcGFydHN0YXQ6IHl1cC5zdHJpbmcoKSxcbiAgcm9sZTogeXVwLnN0cmluZygpXG59KS5ub1Vua25vd24oKTtcbnZhciBvcmdhbml6ZXJTY2hlbWEgPSB5dXAub2JqZWN0KCkuc2hhcGUoe1xuICBuYW1lOiB5dXAuc3RyaW5nKCksXG4gIGVtYWlsOiB5dXAuc3RyaW5nKCkuZW1haWwoKSxcbiAgZGlyOiB5dXAuc3RyaW5nKClcbn0pLm5vVW5rbm93bigpO1xudmFyIGFsYXJtU2NoZW1hID0geXVwLm9iamVjdCgpLnNoYXBlKHtcbiAgYWN0aW9uOiB5dXAuc3RyaW5nKCkubWF0Y2hlcygvYXVkaW98ZGlzcGxheXxlbWFpbC8pLnJlcXVpcmVkKCksXG4gIHRyaWdnZXI6IHl1cC5taXhlZCgpLnJlcXVpcmVkKCksXG4gIGRlc2NyaXB0aW9uOiB5dXAuc3RyaW5nKCksXG4gIGR1cmF0aW9uOiBkdXJhdGlvblNjaGVtYSxcbiAgcmVwZWF0OiB5dXAubnVtYmVyKCksXG4gIGF0dGFjaDogeXVwLnN0cmluZygpLFxuICBhdHRhY2hUeXBlOiB5dXAuc3RyaW5nKCksXG4gIHN1bW1hcnk6IHl1cC5zdHJpbmcoKSxcbiAgYXR0ZW5kZWU6IGNvbnRhY3RTY2hlbWEsXG4gICd4LXByb3AnOiB5dXAubWl4ZWQoKSxcbiAgJ2lhbmEtcHJvcCc6IHl1cC5taXhlZCgpXG59KS5ub1Vua25vd24oKTtcbnZhciBzY2hlbWEgPSB5dXAub2JqZWN0KCkuc2hhcGUoe1xuICBzdW1tYXJ5OiB5dXAuc3RyaW5nKCksXG4gIHRpbWVzdGFtcDogeXVwLm1peGVkKCksXG4gIHRpdGxlOiB5dXAuc3RyaW5nKCksXG4gIHByb2R1Y3RJZDogeXVwLnN0cmluZygpLFxuICBtZXRob2Q6IHl1cC5zdHJpbmcoKSxcbiAgdWlkOiB5dXAuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgc2VxdWVuY2U6IHl1cC5udW1iZXIoKSxcbiAgc3RhcnQ6IGRhdGVUaW1lU2NoZW1hLnJlcXVpcmVkKCksXG4gIGR1cmF0aW9uOiBkdXJhdGlvblNjaGVtYSxcbiAgc3RhcnRUeXBlOiB5dXAuc3RyaW5nKCkubWF0Y2hlcygvdXRjfGxvY2FsLyksXG4gIHN0YXJ0SW5wdXRUeXBlOiB5dXAuc3RyaW5nKCkubWF0Y2hlcygvdXRjfGxvY2FsLyksXG4gIHN0YXJ0T3V0cHV0VHlwZTogeXVwLnN0cmluZygpLm1hdGNoZXMoL3V0Y3xsb2NhbC8pLFxuICBlbmQ6IGRhdGVUaW1lU2NoZW1hLFxuICBlbmRJbnB1dFR5cGU6IHl1cC5zdHJpbmcoKS5tYXRjaGVzKC91dGN8bG9jYWwvKSxcbiAgZW5kT3V0cHV0VHlwZTogeXVwLnN0cmluZygpLm1hdGNoZXMoL3V0Y3xsb2NhbC8pLFxuICBkZXNjcmlwdGlvbjogeXVwLnN0cmluZygpLFxuICB1cmw6IHl1cC5zdHJpbmcoKS5tYXRjaGVzKHVybFJlZ2V4KSxcbiAgZ2VvOiB5dXAub2JqZWN0KCkuc2hhcGUoe1xuICAgIGxhdDogeXVwLm51bWJlcigpLFxuICAgIGxvbjogeXVwLm51bWJlcigpXG4gIH0pLFxuICBsb2NhdGlvbjogeXVwLnN0cmluZygpLFxuICBzdGF0dXM6IHl1cC5zdHJpbmcoKS5tYXRjaGVzKC9URU5UQVRJVkV8Q0FOQ0VMTEVEfENPTkZJUk1FRC9pKSxcbiAgY2F0ZWdvcmllczogeXVwLmFycmF5KCkub2YoeXVwLnN0cmluZygpKSxcbiAgb3JnYW5pemVyOiBvcmdhbml6ZXJTY2hlbWEsXG4gIGF0dGVuZGVlczogeXVwLmFycmF5KCkub2YoY29udGFjdFNjaGVtYSksXG4gIGFsYXJtczogeXVwLmFycmF5KCkub2YoYWxhcm1TY2hlbWEpLFxuICByZWN1cnJlbmNlUnVsZTogeXVwLnN0cmluZygpLFxuICBidXN5U3RhdHVzOiB5dXAuc3RyaW5nKCkubWF0Y2hlcygvVEVOVEFUSVZFfEZSRUV8QlVTWXxPT0YvaSksXG4gIGNsYXNzaWZpY2F0aW9uOiB5dXAuc3RyaW5nKCksXG4gIGNyZWF0ZWQ6IGRhdGVUaW1lU2NoZW1hLFxuICBsYXN0TW9kaWZpZWQ6IGRhdGVUaW1lU2NoZW1hLFxuICBjYWxOYW1lOiB5dXAuc3RyaW5nKCksXG4gIGh0bWxDb250ZW50OiB5dXAuc3RyaW5nKClcbn0pLnRlc3QoJ3hvcicsIFwib2JqZWN0IHNob3VsZCBoYXZlIGVuZCBvciBkdXJhdGlvblwiLCBmdW5jdGlvbiAodmFsKSB7XG4gIHZhciBoYXNFbmQgPSAhIXZhbC5lbmQ7XG4gIHZhciBoYXNEdXJhdGlvbiA9ICEhdmFsLmR1cmF0aW9uO1xuICByZXR1cm4gaGFzRW5kICYmICFoYXNEdXJhdGlvbiB8fCAhaGFzRW5kICYmIGhhc0R1cmF0aW9uIHx8ICFoYXNFbmQgJiYgIWhhc0R1cmF0aW9uO1xufSkubm9Vbmtub3duKCk7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRXZlbnQoY2FuZGlkYXRlKSB7XG4gIHRyeSB7XG4gICAgdmFyIHZhbHVlID0gc2NoZW1hLnZhbGlkYXRlU3luYyhjYW5kaWRhdGUsIHtcbiAgICAgIGFib3J0RWFybHk6IGZhbHNlLFxuICAgICAgc3RyaWN0OiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IE9iamVjdC5hc3NpZ24oe30sIGVycm9yKSxcbiAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZvbGRMaW5lO1xuXG5mdW5jdGlvbiBmb2xkTGluZShsaW5lKSB7XG4gIHZhciBwYXJ0cyA9IFtdO1xuICB2YXIgbGVuZ3RoID0gNzU7XG5cbiAgd2hpbGUgKGxpbmUubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChsaW5lLnNsaWNlKDAsIGxlbmd0aCkpO1xuICAgIGxpbmUgPSBsaW5lLnNsaWNlKGxlbmd0aCk7XG4gICAgbGVuZ3RoID0gNzQ7XG4gIH1cblxuICBwYXJ0cy5wdXNoKGxpbmUpO1xuICByZXR1cm4gcGFydHMuam9pbignXFxyXFxuXFx0Jyk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZvcm1hdERhdGU7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbnZhciBwYWQgPSBmdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gXCIwXCIuY29uY2F0KG4pIDogXCJcIi5jb25jYXQobik7XG59O1xuXG5mdW5jdGlvbiBmb3JtYXREYXRlKCkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gIHZhciBvdXRwdXRUeXBlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAndXRjJztcbiAgdmFyIGlucHV0VHlwZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogJ2xvY2FsJztcblxuICBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSAmJiBhcmdzLmxlbmd0aCA9PT0gMykge1xuICAgIHZhciBfYXJncyA9IF9zbGljZWRUb0FycmF5KGFyZ3MsIDMpLFxuICAgICAgICB5ZWFyID0gX2FyZ3NbMF0sXG4gICAgICAgIG1vbnRoID0gX2FyZ3NbMV0sXG4gICAgICAgIGRhdGUgPSBfYXJnc1syXTtcblxuICAgIHJldHVybiBcIlwiLmNvbmNhdCh5ZWFyKS5jb25jYXQocGFkKG1vbnRoKSkuY29uY2F0KHBhZChkYXRlKSk7XG4gIH1cblxuICB2YXIgb3V0RGF0ZSA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuc2V0VVRDU2Vjb25kcygwLCAwKSk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJncykgJiYgYXJncy5sZW5ndGggPiAwICYmIGFyZ3NbMF0pIHtcbiAgICB2YXIgX2FyZ3MyID0gX3NsaWNlZFRvQXJyYXkoYXJncywgNiksXG4gICAgICAgIF95ZWFyID0gX2FyZ3MyWzBdLFxuICAgICAgICBfbW9udGggPSBfYXJnczJbMV0sXG4gICAgICAgIF9kYXRlID0gX2FyZ3MyWzJdLFxuICAgICAgICBfYXJnczIkID0gX2FyZ3MyWzNdLFxuICAgICAgICBob3VycyA9IF9hcmdzMiQgPT09IHZvaWQgMCA/IDAgOiBfYXJnczIkLFxuICAgICAgICBfYXJnczIkMiA9IF9hcmdzMls0XSxcbiAgICAgICAgbWludXRlcyA9IF9hcmdzMiQyID09PSB2b2lkIDAgPyAwIDogX2FyZ3MyJDIsXG4gICAgICAgIF9hcmdzMiQzID0gX2FyZ3MyWzVdLFxuICAgICAgICBzZWNvbmRzID0gX2FyZ3MyJDMgPT09IHZvaWQgMCA/IDAgOiBfYXJnczIkMztcblxuICAgIGlmIChpbnB1dFR5cGUgPT09ICdsb2NhbCcpIHtcbiAgICAgIG91dERhdGUgPSBuZXcgRGF0ZShfeWVhciwgX21vbnRoIC0gMSwgX2RhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0RGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKF95ZWFyLCBfbW9udGggLSAxLCBfZGF0ZSwgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMpKTtcbiAgICB9XG4gIH1cblxuICBpZiAob3V0cHV0VHlwZSA9PT0gJ2xvY2FsJykge1xuICAgIHJldHVybiBbb3V0RGF0ZS5nZXRGdWxsWWVhcigpLCBwYWQob3V0RGF0ZS5nZXRNb250aCgpICsgMSksIHBhZChvdXREYXRlLmdldERhdGUoKSksICdUJywgcGFkKG91dERhdGUuZ2V0SG91cnMoKSksIHBhZChvdXREYXRlLmdldE1pbnV0ZXMoKSksIHBhZChvdXREYXRlLmdldFNlY29uZHMoKSldLmpvaW4oJycpO1xuICB9XG5cbiAgcmV0dXJuIFtvdXREYXRlLmdldFVUQ0Z1bGxZZWFyKCksIHBhZChvdXREYXRlLmdldFVUQ01vbnRoKCkgKyAxKSwgcGFkKG91dERhdGUuZ2V0VVRDRGF0ZSgpKSwgJ1QnLCBwYWQob3V0RGF0ZS5nZXRVVENIb3VycygpKSwgcGFkKG91dERhdGUuZ2V0VVRDTWludXRlcygpKSwgcGFkKG91dERhdGUuZ2V0VVRDU2Vjb25kcygpKSwgJ1onXS5qb2luKCcnKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZm9ybWF0RHVyYXRpb247XG5cbmZ1bmN0aW9uIGZvcm1hdER1cmF0aW9uKCkge1xuICB2YXIgYXR0cmlidXRlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gIHZhciB3ZWVrcyA9IGF0dHJpYnV0ZXMud2Vla3MsXG4gICAgICBkYXlzID0gYXR0cmlidXRlcy5kYXlzLFxuICAgICAgaG91cnMgPSBhdHRyaWJ1dGVzLmhvdXJzLFxuICAgICAgbWludXRlcyA9IGF0dHJpYnV0ZXMubWludXRlcyxcbiAgICAgIHNlY29uZHMgPSBhdHRyaWJ1dGVzLnNlY29uZHM7XG4gIHZhciBmb3JtYXR0ZWREdXJhdGlvbiA9ICdQJztcbiAgZm9ybWF0dGVkRHVyYXRpb24gKz0gd2Vla3MgPyBcIlwiLmNvbmNhdCh3ZWVrcywgXCJXXCIpIDogJyc7XG4gIGZvcm1hdHRlZER1cmF0aW9uICs9IGRheXMgPyBcIlwiLmNvbmNhdChkYXlzLCBcIkRcIikgOiAnJztcbiAgZm9ybWF0dGVkRHVyYXRpb24gKz0gJ1QnO1xuICBmb3JtYXR0ZWREdXJhdGlvbiArPSBob3VycyA/IFwiXCIuY29uY2F0KGhvdXJzLCBcIkhcIikgOiAnJztcbiAgZm9ybWF0dGVkRHVyYXRpb24gKz0gbWludXRlcyA/IFwiXCIuY29uY2F0KG1pbnV0ZXMsIFwiTVwiKSA6ICcnO1xuICBmb3JtYXR0ZWREdXJhdGlvbiArPSBzZWNvbmRzID8gXCJcIi5jb25jYXQoc2Vjb25kcywgXCJTXCIpIDogJyc7XG4gIHJldHVybiBmb3JtYXR0ZWREdXJhdGlvbjtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZm9ybWF0VGV4dDtcblxuZnVuY3Rpb24gZm9ybWF0VGV4dCh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwvZ20sIFwiXFxcXFxcXFxcIikucmVwbGFjZSgvXFxyP1xcbi9nbSwgXCJcXFxcblwiKS5yZXBsYWNlKC87L2dtLCBcIlxcXFw7XCIpLnJlcGxhY2UoLywvZ20sIFwiXFxcXCxcIik7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJmb3JtYXREYXRlXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9mb3JtYXREYXRlW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJzZXRHZW9sb2NhdGlvblwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2V0R2VvbG9jYXRpb25bXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInNldENvbnRhY3RcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NldENvbnRhY3RbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInNldE9yZ2FuaXplclwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2V0T3JnYW5pemVyW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJzZXRBbGFybVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2V0QWxhcm1bXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInNldERlc2NyaXB0aW9uXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zZXREZXNjcmlwdGlvbltcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwic2V0U3VtbWFyeVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfc2V0U3VtbWFyeVtcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZm9ybWF0RHVyYXRpb25cIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2Zvcm1hdER1cmF0aW9uW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJmb2xkTGluZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfZm9sZExpbmVbXCJkZWZhdWx0XCJdO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInNldExvY2F0aW9uXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9zZXRMb2NhdGlvbltcImRlZmF1bHRcIl07XG4gIH1cbn0pO1xuXG52YXIgX2Zvcm1hdERhdGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Zvcm1hdC1kYXRlXCIpKTtcblxudmFyIF9zZXRHZW9sb2NhdGlvbiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vc2V0LWdlb2xvY2F0aW9uXCIpKTtcblxudmFyIF9zZXRDb250YWN0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zZXQtY29udGFjdFwiKSk7XG5cbnZhciBfc2V0T3JnYW5pemVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zZXQtb3JnYW5pemVyXCIpKTtcblxudmFyIF9zZXRBbGFybSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vc2V0LWFsYXJtXCIpKTtcblxudmFyIF9zZXREZXNjcmlwdGlvbiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vc2V0LWRlc2NyaXB0aW9uXCIpKTtcblxudmFyIF9zZXRTdW1tYXJ5ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9zZXQtc3VtbWFyeVwiKSk7XG5cbnZhciBfZm9ybWF0RHVyYXRpb24gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Zvcm1hdC1kdXJhdGlvblwiKSk7XG5cbnZhciBfZm9sZExpbmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2ZvbGQtbGluZVwiKSk7XG5cbnZhciBfc2V0TG9jYXRpb24gPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL3NldC1sb2NhdGlvblwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzZXRBbGFybTtcblxudmFyIF9mb3JtYXREYXRlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9mb3JtYXQtZGF0ZVwiKSk7XG5cbnZhciBfZm9sZExpbmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2ZvbGQtbGluZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBzZXREdXJhdGlvbihfcmVmKSB7XG4gIHZhciB3ZWVrcyA9IF9yZWYud2Vla3MsXG4gICAgICBkYXlzID0gX3JlZi5kYXlzLFxuICAgICAgaG91cnMgPSBfcmVmLmhvdXJzLFxuICAgICAgbWludXRlcyA9IF9yZWYubWludXRlcyxcbiAgICAgIHNlY29uZHMgPSBfcmVmLnNlY29uZHM7XG4gIHZhciBmb3JtYXR0ZWRTdHJpbmcgPSAnUCc7XG4gIGZvcm1hdHRlZFN0cmluZyArPSB3ZWVrcyA/IFwiXCIuY29uY2F0KHdlZWtzLCBcIldcIikgOiAnJztcbiAgZm9ybWF0dGVkU3RyaW5nICs9IGRheXMgPyBcIlwiLmNvbmNhdChkYXlzLCBcIkRcIikgOiAnJztcbiAgZm9ybWF0dGVkU3RyaW5nICs9ICdUJztcbiAgZm9ybWF0dGVkU3RyaW5nICs9IGhvdXJzID8gXCJcIi5jb25jYXQoaG91cnMsIFwiSFwiKSA6ICcnO1xuICBmb3JtYXR0ZWRTdHJpbmcgKz0gbWludXRlcyA/IFwiXCIuY29uY2F0KG1pbnV0ZXMsIFwiTVwiKSA6ICcnO1xuICBmb3JtYXR0ZWRTdHJpbmcgKz0gc2Vjb25kcyA/IFwiXCIuY29uY2F0KHNlY29uZHMsIFwiU1wiKSA6ICcnO1xuICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBzZXRUcmlnZ2VyKHRyaWdnZXIpIHtcbiAgdmFyIGZvcm1hdHRlZFN0cmluZyA9ICcnO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHRyaWdnZXIpKSB7XG4gICAgZm9ybWF0dGVkU3RyaW5nID0gXCJUUklHR0VSO1ZBTFVFPURBVEUtVElNRTpcIi5jb25jYXQoKDAsIF9mb3JtYXREYXRlW1wiZGVmYXVsdFwiXSkodHJpZ2dlciksIFwiXFxyXFxuXCIpO1xuICB9IGVsc2Uge1xuICAgIHZhciBhbGVydCA9IHRyaWdnZXIuYmVmb3JlID8gJy0nIDogJyc7XG4gICAgZm9ybWF0dGVkU3RyaW5nID0gXCJUUklHR0VSOlwiLmNvbmNhdChhbGVydCArIHNldER1cmF0aW9uKHRyaWdnZXIpLCBcIlxcclxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBmb3JtYXR0ZWRTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHNldEFjdGlvbihhY3Rpb24pIHtcbiAgcmV0dXJuIGFjdGlvbi50b1VwcGVyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBzZXRBbGFybSgpIHtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICB2YXIgYWN0aW9uID0gYXR0cmlidXRlcy5hY3Rpb24sXG4gICAgICByZXBlYXQgPSBhdHRyaWJ1dGVzLnJlcGVhdCxcbiAgICAgIGRlc2NyaXB0aW9uID0gYXR0cmlidXRlcy5kZXNjcmlwdGlvbixcbiAgICAgIGR1cmF0aW9uID0gYXR0cmlidXRlcy5kdXJhdGlvbixcbiAgICAgIGF0dGFjaCA9IGF0dHJpYnV0ZXMuYXR0YWNoLFxuICAgICAgYXR0YWNoVHlwZSA9IGF0dHJpYnV0ZXMuYXR0YWNoVHlwZSxcbiAgICAgIHRyaWdnZXIgPSBhdHRyaWJ1dGVzLnRyaWdnZXIsXG4gICAgICBzdW1tYXJ5ID0gYXR0cmlidXRlcy5zdW1tYXJ5O1xuICB2YXIgZm9ybWF0dGVkU3RyaW5nID0gJ0JFR0lOOlZBTEFSTVxcclxcbic7XG4gIGZvcm1hdHRlZFN0cmluZyArPSAoMCwgX2ZvbGRMaW5lW1wiZGVmYXVsdFwiXSkoXCJBQ1RJT046XCIuY29uY2F0KHNldEFjdGlvbihhY3Rpb24pKSkgKyAnXFxyXFxuJztcbiAgZm9ybWF0dGVkU3RyaW5nICs9IHJlcGVhdCA/ICgwLCBfZm9sZExpbmVbXCJkZWZhdWx0XCJdKShcIlJFUEVBVDpcIi5jb25jYXQocmVwZWF0KSkgKyAnXFxyXFxuJyA6ICcnO1xuICBmb3JtYXR0ZWRTdHJpbmcgKz0gZGVzY3JpcHRpb24gPyAoMCwgX2ZvbGRMaW5lW1wiZGVmYXVsdFwiXSkoXCJERVNDUklQVElPTjpcIi5jb25jYXQoZGVzY3JpcHRpb24pKSArICdcXHJcXG4nIDogJyc7XG4gIGZvcm1hdHRlZFN0cmluZyArPSBkdXJhdGlvbiA/ICgwLCBfZm9sZExpbmVbXCJkZWZhdWx0XCJdKShcIkRVUkFUSU9OOlwiLmNvbmNhdChzZXREdXJhdGlvbihkdXJhdGlvbikpKSArICdcXHJcXG4nIDogJyc7XG4gIHZhciBhdHRhY2hJbmZvID0gYXR0YWNoVHlwZSA/IGF0dGFjaFR5cGUgOiAnRk1UVFlQRT1hdWRpby9iYXNpYyc7XG4gIGZvcm1hdHRlZFN0cmluZyArPSBhdHRhY2ggPyAoMCwgX2ZvbGRMaW5lW1wiZGVmYXVsdFwiXSkoXCJBVFRBQ0g7XCIuY29uY2F0KGF0dGFjaEluZm8sIFwiOlwiKS5jb25jYXQoYXR0YWNoKSkgKyAnXFxyXFxuJyA6ICcnO1xuICBmb3JtYXR0ZWRTdHJpbmcgKz0gdHJpZ2dlciA/IHNldFRyaWdnZXIodHJpZ2dlcikgOiAnJztcbiAgZm9ybWF0dGVkU3RyaW5nICs9IHN1bW1hcnkgPyAoMCwgX2ZvbGRMaW5lW1wiZGVmYXVsdFwiXSkoXCJTVU1NQVJZOlwiLmNvbmNhdChzdW1tYXJ5KSkgKyAnXFxyXFxuJyA6ICcnO1xuICBmb3JtYXR0ZWRTdHJpbmcgKz0gJ0VORDpWQUxBUk1cXHJcXG4nO1xuICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nO1xufSAvLyBFeGFtcGxlOiAgQSBkdXJhdGlvbiBvZiAxNSBkYXlzLCA1IGhvdXJzLCBhbmQgMjAgc2Vjb25kcyB3b3VsZCBiZTpcbi8vIFAxNURUNUgwTTIwU1xuLy8gQSBkdXJhdGlvbiBvZiA3IHdlZWtzIHdvdWxkIGJlOlxuLy8gUDdXIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHNldENvbnRhY3Q7XG5cbmZ1bmN0aW9uIHNldENvbnRhY3QoX3JlZikge1xuICB2YXIgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIGVtYWlsID0gX3JlZi5lbWFpbCxcbiAgICAgIHJzdnAgPSBfcmVmLnJzdnAsXG4gICAgICBkaXIgPSBfcmVmLmRpcixcbiAgICAgIHBhcnRzdGF0ID0gX3JlZi5wYXJ0c3RhdCxcbiAgICAgIHJvbGUgPSBfcmVmLnJvbGU7XG4gIHZhciBmb3JtYXR0ZWRBdHRlbmRlZSA9ICcnO1xuICBmb3JtYXR0ZWRBdHRlbmRlZSArPSByc3ZwID8gJ1JTVlA9VFJVRTsnIDogJ1JTVlA9RkFMU0U7JztcbiAgZm9ybWF0dGVkQXR0ZW5kZWUgKz0gcm9sZSA/IFwiUk9MRT1cIi5jb25jYXQocm9sZSwgXCI7XCIpIDogJyc7XG4gIGZvcm1hdHRlZEF0dGVuZGVlICs9IHBhcnRzdGF0ID8gXCJQQVJUU1RBVD1cIi5jb25jYXQocGFydHN0YXQsIFwiO1wiKSA6ICcnO1xuICBmb3JtYXR0ZWRBdHRlbmRlZSArPSBkaXIgPyBcIkRJUj1cIi5jb25jYXQoZGlyLCBcIjtcIikgOiAnJztcbiAgZm9ybWF0dGVkQXR0ZW5kZWUgKz0gJ0NOPSc7XG4gIGZvcm1hdHRlZEF0dGVuZGVlICs9IG5hbWUgfHwgJ1VubmFtZWQgYXR0ZW5kZWUnO1xuICBmb3JtYXR0ZWRBdHRlbmRlZSArPSBlbWFpbCA/IFwiOm1haWx0bzpcIi5jb25jYXQoZW1haWwpIDogJyc7XG4gIHJldHVybiBmb3JtYXR0ZWRBdHRlbmRlZTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc2V0RGVzY3JpcHRpb247XG5cbnZhciBfZm9ybWF0VGV4dCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZm9ybWF0LXRleHRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gc2V0RGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgcmV0dXJuICgwLCBfZm9ybWF0VGV4dFtcImRlZmF1bHRcIl0pKGRlc2NyaXB0aW9uKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc2V0R2VvbG9jYXRpb247XG5cbmZ1bmN0aW9uIHNldEdlb2xvY2F0aW9uKF9yZWYpIHtcbiAgdmFyIGxhdCA9IF9yZWYubGF0LFxuICAgICAgbG9uID0gX3JlZi5sb247XG4gIHJldHVybiBcIlwiLmNvbmNhdChsYXQsIFwiO1wiKS5jb25jYXQobG9uKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc2V0TG9jYXRpb247XG5cbnZhciBfZm9ybWF0VGV4dCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZm9ybWF0LXRleHRcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gc2V0TG9jYXRpb24obG9jYXRpb24pIHtcbiAgcmV0dXJuICgwLCBfZm9ybWF0VGV4dFtcImRlZmF1bHRcIl0pKGxvY2F0aW9uKTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gc2V0T3JnYW5pemVyO1xuXG5mdW5jdGlvbiBzZXRPcmdhbml6ZXIoX3JlZikge1xuICB2YXIgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIGVtYWlsID0gX3JlZi5lbWFpbCxcbiAgICAgIGRpciA9IF9yZWYuZGlyO1xuICB2YXIgZm9ybWF0dGVkT3JnYW5pemVyID0gJyc7XG4gIGZvcm1hdHRlZE9yZ2FuaXplciArPSBkaXIgPyBcIkRJUj1cXFwiXCIuY29uY2F0KGRpciwgXCJcXFwiO1wiKSA6ICcnO1xuICBmb3JtYXR0ZWRPcmdhbml6ZXIgKz0gJ0NOPSc7XG4gIGZvcm1hdHRlZE9yZ2FuaXplciArPSBuYW1lIHx8ICdPcmdhbml6ZXInO1xuICBmb3JtYXR0ZWRPcmdhbml6ZXIgKz0gZW1haWwgPyBcIjptYWlsdG86XCIuY29uY2F0KGVtYWlsKSA6ICcnO1xuICByZXR1cm4gZm9ybWF0dGVkT3JnYW5pemVyO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBzZXRTdW1tYXJ5O1xuXG52YXIgX2Zvcm1hdFRleHQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Zvcm1hdC10ZXh0XCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHNldFN1bW1hcnkoc3VtbWFyeSkge1xuICByZXR1cm4gKDAsIF9mb3JtYXRUZXh0W1wiZGVmYXVsdFwiXSkoc3VtbWFyeSk7XG59IiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpLFxuICAgIHNldENhY2hlQWRkID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVBZGQnKSxcbiAgICBzZXRDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX3NldENhY2hlSGFzJyk7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxubW9kdWxlLmV4cG9ydHMgPSBTZXRDYWNoZTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RmlsdGVyO1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5yZWR1Y2VgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgaW5pdGlhbCB2YWx1ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luaXRBY2N1bV0gU3BlY2lmeSB1c2luZyB0aGUgZmlyc3QgZWxlbWVudCBvZiBgYXJyYXlgIGFzXG4gKiAgdGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UmVkdWNlKGFycmF5LCBpdGVyYXRlZSwgYWNjdW11bGF0b3IsIGluaXRBY2N1bSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChpbml0QWNjdW0gJiYgbGVuZ3RoKSB7XG4gICAgYWNjdW11bGF0b3IgPSBhcnJheVsrK2luZGV4XTtcbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gaXRlcmF0ZWUoYWNjdW11bGF0b3IsIGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gYWNjdW11bGF0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlSZWR1Y2U7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsIi8qKlxuICogQ29udmVydHMgYW4gQVNDSUkgYHN0cmluZ2AgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFzY2lpVG9BcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNjaWlUb0FycmF5O1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggd29yZHMgY29tcG9zZWQgb2YgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuICovXG52YXIgcmVBc2NpaVdvcmQgPSAvW15cXHgwMC1cXHgyZlxceDNhLVxceDQwXFx4NWItXFx4NjBcXHg3Yi1cXHg3Zl0rL2c7XG5cbi8qKlxuICogU3BsaXRzIGFuIEFTQ0lJIGBzdHJpbmdgIGludG8gYW4gYXJyYXkgb2YgaXRzIHdvcmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB3b3JkcyBvZiBgc3RyaW5nYC5cbiAqL1xuZnVuY3Rpb24gYXNjaWlXb3JkcyhzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5tYXRjaChyZUFzY2lpV29yZCkgfHwgW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNjaWlXb3JkcztcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5nZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IDAsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbdG9LZXkocGF0aFtpbmRleCsrXSldO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhc0luKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhc0luO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbERlZXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcsIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwidmFyIGJhc2VJc01hdGNoID0gcmVxdWlyZSgnLi9fYmFzZUlzTWF0Y2gnKSxcbiAgICBnZXRNYXRjaERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXRjaERhdGEnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc2Agd2hpY2ggZG9lc24ndCBjbG9uZSBgc291cmNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgbWF0Y2hEYXRhID0gZ2V0TWF0Y2hEYXRhKHNvdXJjZSk7XG4gIGlmIChtYXRjaERhdGEubGVuZ3RoID09IDEgJiYgbWF0Y2hEYXRhWzBdWzJdKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKG1hdGNoRGF0YVswXVswXSwgbWF0Y2hEYXRhWzBdWzFdKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gc291cmNlIHx8IGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzO1xuIiwidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIENPTVBBUkVfUEFSVElBTF9GTEFHIHwgQ09NUEFSRV9VTk9SREVSRURfRkxBRyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXNQcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUHJvcGVydHlgIHdoaWNoIHN1cHBvcnRzIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5RGVlcChwYXRoKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eURlZXA7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5T2Y7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FjaGVIYXM7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKTtcblxuLyoqXG4gKiBDYXN0cyBgYXJyYXlgIHRvIGEgc2xpY2UgaWYgaXQncyBuZWVkZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBzbGljZS5cbiAqL1xuZnVuY3Rpb24gY2FzdFNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogZW5kO1xuICByZXR1cm4gKCFzdGFydCAmJiBlbmQgPj0gbGVuZ3RoKSA/IGFycmF5IDogYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0U2xpY2U7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBjYXN0U2xpY2UgPSByZXF1aXJlKCcuL19jYXN0U2xpY2UnKSxcbiAgICBoYXNVbmljb2RlID0gcmVxdWlyZSgnLi9faGFzVW5pY29kZScpLFxuICAgIHN0cmluZ1RvQXJyYXkgPSByZXF1aXJlKCcuL19zdHJpbmdUb0FycmF5JyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGxpa2UgYF8ubG93ZXJGaXJzdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIFRoZSBuYW1lIG9mIHRoZSBgU3RyaW5nYCBjYXNlIG1ldGhvZCB0byB1c2UuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDYXNlRmlyc3QobWV0aG9kTmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcblxuICAgIHZhciBzdHJTeW1ib2xzID0gaGFzVW5pY29kZShzdHJpbmcpXG4gICAgICA/IHN0cmluZ1RvQXJyYXkoc3RyaW5nKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICB2YXIgY2hyID0gc3RyU3ltYm9sc1xuICAgICAgPyBzdHJTeW1ib2xzWzBdXG4gICAgICA6IHN0cmluZy5jaGFyQXQoMCk7XG5cbiAgICB2YXIgdHJhaWxpbmcgPSBzdHJTeW1ib2xzXG4gICAgICA/IGNhc3RTbGljZShzdHJTeW1ib2xzLCAxKS5qb2luKCcnKVxuICAgICAgOiBzdHJpbmcuc2xpY2UoMSk7XG5cbiAgICByZXR1cm4gY2hyW21ldGhvZE5hbWVdKCkgKyB0cmFpbGluZztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVDYXNlRmlyc3Q7XG4iLCJ2YXIgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIGRlYnVyciA9IHJlcXVpcmUoJy4vZGVidXJyJyksXG4gICAgd29yZHMgPSByZXF1aXJlKCcuL3dvcmRzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0Fwb3MgPSBcIlsnXFx1MjAxOV1cIjtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYXBvc3Ryb3BoZXMuICovXG52YXIgcmVBcG9zID0gUmVnRXhwKHJzQXBvcywgJ2cnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gbGlrZSBgXy5jYW1lbENhc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gY29tYmluZSBlYWNoIHdvcmQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb21wb3VuZGVyIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVDb21wb3VuZGVyKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICByZXR1cm4gYXJyYXlSZWR1Y2Uod29yZHMoZGVidXJyKHN0cmluZykucmVwbGFjZShyZUFwb3MsICcnKSksIGNhbGxiYWNrLCAnJyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQ29tcG91bmRlcjtcbiIsInZhciBiYXNlUHJvcGVydHlPZiA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eU9mJyk7XG5cbi8qKiBVc2VkIHRvIG1hcCBMYXRpbiBVbmljb2RlIGxldHRlcnMgdG8gYmFzaWMgTGF0aW4gbGV0dGVycy4gKi9cbnZhciBkZWJ1cnJlZExldHRlcnMgPSB7XG4gIC8vIExhdGluLTEgU3VwcGxlbWVudCBibG9jay5cbiAgJ1xceGMwJzogJ0EnLCAgJ1xceGMxJzogJ0EnLCAnXFx4YzInOiAnQScsICdcXHhjMyc6ICdBJywgJ1xceGM0JzogJ0EnLCAnXFx4YzUnOiAnQScsXG4gICdcXHhlMCc6ICdhJywgICdcXHhlMSc6ICdhJywgJ1xceGUyJzogJ2EnLCAnXFx4ZTMnOiAnYScsICdcXHhlNCc6ICdhJywgJ1xceGU1JzogJ2EnLFxuICAnXFx4YzcnOiAnQycsICAnXFx4ZTcnOiAnYycsXG4gICdcXHhkMCc6ICdEJywgICdcXHhmMCc6ICdkJyxcbiAgJ1xceGM4JzogJ0UnLCAgJ1xceGM5JzogJ0UnLCAnXFx4Y2EnOiAnRScsICdcXHhjYic6ICdFJyxcbiAgJ1xceGU4JzogJ2UnLCAgJ1xceGU5JzogJ2UnLCAnXFx4ZWEnOiAnZScsICdcXHhlYic6ICdlJyxcbiAgJ1xceGNjJzogJ0knLCAgJ1xceGNkJzogJ0knLCAnXFx4Y2UnOiAnSScsICdcXHhjZic6ICdJJyxcbiAgJ1xceGVjJzogJ2knLCAgJ1xceGVkJzogJ2knLCAnXFx4ZWUnOiAnaScsICdcXHhlZic6ICdpJyxcbiAgJ1xceGQxJzogJ04nLCAgJ1xceGYxJzogJ24nLFxuICAnXFx4ZDInOiAnTycsICAnXFx4ZDMnOiAnTycsICdcXHhkNCc6ICdPJywgJ1xceGQ1JzogJ08nLCAnXFx4ZDYnOiAnTycsICdcXHhkOCc6ICdPJyxcbiAgJ1xceGYyJzogJ28nLCAgJ1xceGYzJzogJ28nLCAnXFx4ZjQnOiAnbycsICdcXHhmNSc6ICdvJywgJ1xceGY2JzogJ28nLCAnXFx4ZjgnOiAnbycsXG4gICdcXHhkOSc6ICdVJywgICdcXHhkYSc6ICdVJywgJ1xceGRiJzogJ1UnLCAnXFx4ZGMnOiAnVScsXG4gICdcXHhmOSc6ICd1JywgICdcXHhmYSc6ICd1JywgJ1xceGZiJzogJ3UnLCAnXFx4ZmMnOiAndScsXG4gICdcXHhkZCc6ICdZJywgICdcXHhmZCc6ICd5JywgJ1xceGZmJzogJ3knLFxuICAnXFx4YzYnOiAnQWUnLCAnXFx4ZTYnOiAnYWUnLFxuICAnXFx4ZGUnOiAnVGgnLCAnXFx4ZmUnOiAndGgnLFxuICAnXFx4ZGYnOiAnc3MnLFxuICAvLyBMYXRpbiBFeHRlbmRlZC1BIGJsb2NrLlxuICAnXFx1MDEwMCc6ICdBJywgICdcXHUwMTAyJzogJ0EnLCAnXFx1MDEwNCc6ICdBJyxcbiAgJ1xcdTAxMDEnOiAnYScsICAnXFx1MDEwMyc6ICdhJywgJ1xcdTAxMDUnOiAnYScsXG4gICdcXHUwMTA2JzogJ0MnLCAgJ1xcdTAxMDgnOiAnQycsICdcXHUwMTBhJzogJ0MnLCAnXFx1MDEwYyc6ICdDJyxcbiAgJ1xcdTAxMDcnOiAnYycsICAnXFx1MDEwOSc6ICdjJywgJ1xcdTAxMGInOiAnYycsICdcXHUwMTBkJzogJ2MnLFxuICAnXFx1MDEwZSc6ICdEJywgICdcXHUwMTEwJzogJ0QnLCAnXFx1MDEwZic6ICdkJywgJ1xcdTAxMTEnOiAnZCcsXG4gICdcXHUwMTEyJzogJ0UnLCAgJ1xcdTAxMTQnOiAnRScsICdcXHUwMTE2JzogJ0UnLCAnXFx1MDExOCc6ICdFJywgJ1xcdTAxMWEnOiAnRScsXG4gICdcXHUwMTEzJzogJ2UnLCAgJ1xcdTAxMTUnOiAnZScsICdcXHUwMTE3JzogJ2UnLCAnXFx1MDExOSc6ICdlJywgJ1xcdTAxMWInOiAnZScsXG4gICdcXHUwMTFjJzogJ0cnLCAgJ1xcdTAxMWUnOiAnRycsICdcXHUwMTIwJzogJ0cnLCAnXFx1MDEyMic6ICdHJyxcbiAgJ1xcdTAxMWQnOiAnZycsICAnXFx1MDExZic6ICdnJywgJ1xcdTAxMjEnOiAnZycsICdcXHUwMTIzJzogJ2cnLFxuICAnXFx1MDEyNCc6ICdIJywgICdcXHUwMTI2JzogJ0gnLCAnXFx1MDEyNSc6ICdoJywgJ1xcdTAxMjcnOiAnaCcsXG4gICdcXHUwMTI4JzogJ0knLCAgJ1xcdTAxMmEnOiAnSScsICdcXHUwMTJjJzogJ0knLCAnXFx1MDEyZSc6ICdJJywgJ1xcdTAxMzAnOiAnSScsXG4gICdcXHUwMTI5JzogJ2knLCAgJ1xcdTAxMmInOiAnaScsICdcXHUwMTJkJzogJ2knLCAnXFx1MDEyZic6ICdpJywgJ1xcdTAxMzEnOiAnaScsXG4gICdcXHUwMTM0JzogJ0onLCAgJ1xcdTAxMzUnOiAnaicsXG4gICdcXHUwMTM2JzogJ0snLCAgJ1xcdTAxMzcnOiAnaycsICdcXHUwMTM4JzogJ2snLFxuICAnXFx1MDEzOSc6ICdMJywgICdcXHUwMTNiJzogJ0wnLCAnXFx1MDEzZCc6ICdMJywgJ1xcdTAxM2YnOiAnTCcsICdcXHUwMTQxJzogJ0wnLFxuICAnXFx1MDEzYSc6ICdsJywgICdcXHUwMTNjJzogJ2wnLCAnXFx1MDEzZSc6ICdsJywgJ1xcdTAxNDAnOiAnbCcsICdcXHUwMTQyJzogJ2wnLFxuICAnXFx1MDE0Myc6ICdOJywgICdcXHUwMTQ1JzogJ04nLCAnXFx1MDE0Nyc6ICdOJywgJ1xcdTAxNGEnOiAnTicsXG4gICdcXHUwMTQ0JzogJ24nLCAgJ1xcdTAxNDYnOiAnbicsICdcXHUwMTQ4JzogJ24nLCAnXFx1MDE0Yic6ICduJyxcbiAgJ1xcdTAxNGMnOiAnTycsICAnXFx1MDE0ZSc6ICdPJywgJ1xcdTAxNTAnOiAnTycsXG4gICdcXHUwMTRkJzogJ28nLCAgJ1xcdTAxNGYnOiAnbycsICdcXHUwMTUxJzogJ28nLFxuICAnXFx1MDE1NCc6ICdSJywgICdcXHUwMTU2JzogJ1InLCAnXFx1MDE1OCc6ICdSJyxcbiAgJ1xcdTAxNTUnOiAncicsICAnXFx1MDE1Nyc6ICdyJywgJ1xcdTAxNTknOiAncicsXG4gICdcXHUwMTVhJzogJ1MnLCAgJ1xcdTAxNWMnOiAnUycsICdcXHUwMTVlJzogJ1MnLCAnXFx1MDE2MCc6ICdTJyxcbiAgJ1xcdTAxNWInOiAncycsICAnXFx1MDE1ZCc6ICdzJywgJ1xcdTAxNWYnOiAncycsICdcXHUwMTYxJzogJ3MnLFxuICAnXFx1MDE2Mic6ICdUJywgICdcXHUwMTY0JzogJ1QnLCAnXFx1MDE2Nic6ICdUJyxcbiAgJ1xcdTAxNjMnOiAndCcsICAnXFx1MDE2NSc6ICd0JywgJ1xcdTAxNjcnOiAndCcsXG4gICdcXHUwMTY4JzogJ1UnLCAgJ1xcdTAxNmEnOiAnVScsICdcXHUwMTZjJzogJ1UnLCAnXFx1MDE2ZSc6ICdVJywgJ1xcdTAxNzAnOiAnVScsICdcXHUwMTcyJzogJ1UnLFxuICAnXFx1MDE2OSc6ICd1JywgICdcXHUwMTZiJzogJ3UnLCAnXFx1MDE2ZCc6ICd1JywgJ1xcdTAxNmYnOiAndScsICdcXHUwMTcxJzogJ3UnLCAnXFx1MDE3Myc6ICd1JyxcbiAgJ1xcdTAxNzQnOiAnVycsICAnXFx1MDE3NSc6ICd3JyxcbiAgJ1xcdTAxNzYnOiAnWScsICAnXFx1MDE3Nyc6ICd5JywgJ1xcdTAxNzgnOiAnWScsXG4gICdcXHUwMTc5JzogJ1onLCAgJ1xcdTAxN2InOiAnWicsICdcXHUwMTdkJzogJ1onLFxuICAnXFx1MDE3YSc6ICd6JywgICdcXHUwMTdjJzogJ3onLCAnXFx1MDE3ZSc6ICd6JyxcbiAgJ1xcdTAxMzInOiAnSUonLCAnXFx1MDEzMyc6ICdpaicsXG4gICdcXHUwMTUyJzogJ09lJywgJ1xcdTAxNTMnOiAnb2UnLFxuICAnXFx1MDE0OSc6IFwiJ25cIiwgJ1xcdTAxN2YnOiAncydcbn07XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWJ1cnJgIHRvIGNvbnZlcnQgTGF0aW4tMSBTdXBwbGVtZW50IGFuZCBMYXRpbiBFeHRlbmRlZC1BXG4gKiBsZXR0ZXJzIHRvIGJhc2ljIExhdGluIGxldHRlcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBsZXR0ZXIgVGhlIG1hdGNoZWQgbGV0dGVyIHRvIGRlYnVyci5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGRlYnVycmVkIGxldHRlci5cbiAqL1xudmFyIGRlYnVyckxldHRlciA9IGJhc2VQcm9wZXJ0eU9mKGRlYnVycmVkTGV0dGVycyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVidXJyTGV0dGVyO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlTb21lID0gcmVxdWlyZSgnLi9fYXJyYXlTb21lJyksXG4gICAgY2FjaGVIYXMgPSByZXF1aXJlKCcuL19jYWNoZUhhcycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIENoZWNrIHRoYXQgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBhcnJTdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgdmFyIG90aFN0YWNrZWQgPSBzdGFjay5nZXQob3RoZXIpO1xuICBpZiAoYXJyU3RhY2tlZCAmJiBvdGhTdGFja2VkKSB7XG4gICAgcmV0dXJuIGFyclN0YWNrZWQgPT0gb3RoZXIgJiYgb3RoU3RhY2tlZCA9PSBhcnJheTtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxBcnJheXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIgZ2V0QWxsS2V5cyA9IHJlcXVpcmUoJy4vX2dldEFsbEtleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgdGhhdCBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIG9ialN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgdmFyIG90aFN0YWNrZWQgPSBzdGFjay5nZXQob3RoZXIpO1xuICBpZiAob2JqU3RhY2tlZCAmJiBvdGhTdGFja2VkKSB7XG4gICAgcmV0dXJuIG9ialN0YWNrZWQgPT0gb3RoZXIgJiYgb3RoU3RhY2tlZCA9PSBvYmplY3Q7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0ga2V5cyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIga2V5ID0gcmVzdWx0W2xlbmd0aF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICByZXN1bHRbbGVuZ3RoXSA9IFtrZXksIHZhbHVlLCBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hdGNoRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCIvKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNBc3RyYWxSYW5nZSA9ICdcXFxcdWQ4MDAtXFxcXHVkZmZmJyxcbiAgICByc0NvbWJvTWFya3NSYW5nZSA9ICdcXFxcdTAzMDAtXFxcXHUwMzZmJyxcbiAgICByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgPSAnXFxcXHVmZTIwLVxcXFx1ZmUyZicsXG4gICAgcnNDb21ib1N5bWJvbHNSYW5nZSA9ICdcXFxcdTIwZDAtXFxcXHUyMGZmJyxcbiAgICByc0NvbWJvUmFuZ2UgPSByc0NvbWJvTWFya3NSYW5nZSArIHJlQ29tYm9IYWxmTWFya3NSYW5nZSArIHJzQ29tYm9TeW1ib2xzUmFuZ2UsXG4gICAgcnNWYXJSYW5nZSA9ICdcXFxcdWZlMGVcXFxcdWZlMGYnO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2FwdHVyZSBncm91cHMuICovXG52YXIgcnNaV0ogPSAnXFxcXHUyMDBkJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHN0cmluZ3Mgd2l0aCBbemVyby13aWR0aCBqb2luZXJzIG9yIGNvZGUgcG9pbnRzIGZyb20gdGhlIGFzdHJhbCBwbGFuZXNdKGh0dHA6Ly9lZXYuZWUvYmxvZy8yMDE1LzA5LzEyL2RhcmstY29ybmVycy1vZi11bmljb2RlLykuICovXG52YXIgcmVIYXNVbmljb2RlID0gUmVnRXhwKCdbJyArIHJzWldKICsgcnNBc3RyYWxSYW5nZSAgKyByc0NvbWJvUmFuZ2UgKyByc1ZhclJhbmdlICsgJ10nKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHN0cmluZ2AgY29udGFpbnMgVW5pY29kZSBzeW1ib2xzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhIHN5bWJvbCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNVbmljb2RlKHN0cmluZykge1xuICByZXR1cm4gcmVIYXNVbmljb2RlLnRlc3Qoc3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNVbmljb2RlO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IHN0cmluZ3MgdGhhdCBuZWVkIGEgbW9yZSByb2J1c3QgcmVnZXhwIHRvIG1hdGNoIHdvcmRzLiAqL1xudmFyIHJlSGFzVW5pY29kZVdvcmQgPSAvW2Etel1bQS1aXXxbQS1aXXsyfVthLXpdfFswLTldW2EtekEtWl18W2EtekEtWl1bMC05XXxbXmEtekEtWjAtOSBdLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHN0cmluZ2AgY29udGFpbnMgYSB3b3JkIGNvbXBvc2VkIG9mIFVuaWNvZGUgc3ltYm9scy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYSB3b3JkIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1VuaWNvZGVXb3JkKHN0cmluZykge1xuICByZXR1cm4gcmVIYXNVbmljb2RlV29yZC50ZXN0KHN0cmluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzVW5pY29kZVdvcmQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG5cbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGUgPT0gJ251bWJlcicgfHxcbiAgICAgICh0eXBlICE9ICdzeW1ib2wnICYmIHJlSXNVaW50LnRlc3QodmFsdWUpKSkgJiZcbiAgICAgICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYG1hdGNoZXNQcm9wZXJ0eWAgZm9yIHNvdXJjZSB2YWx1ZXMgc3VpdGFibGVcbiAqIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShrZXksIHNyY1ZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdFtrZXldID09PSBzcmNWYWx1ZSAmJlxuICAgICAgKHNyY1ZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgLy8gVXNlIGB1dGlsLnR5cGVzYCBmb3IgTm9kZS5qcyAxMCsuXG4gICAgdmFyIHR5cGVzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLnJlcXVpcmUgJiYgZnJlZU1vZHVsZS5yZXF1aXJlKCd1dGlsJykudHlwZXM7XG5cbiAgICBpZiAodHlwZXMpIHtcbiAgICAgIHJldHVybiB0eXBlcztcbiAgICB9XG5cbiAgICAvLyBMZWdhY3kgYHByb2Nlc3MuYmluZGluZygndXRpbCcpYCBmb3IgTm9kZS5qcyA8IDEwLlxuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwidmFyIGFzY2lpVG9BcnJheSA9IHJlcXVpcmUoJy4vX2FzY2lpVG9BcnJheScpLFxuICAgIGhhc1VuaWNvZGUgPSByZXF1aXJlKCcuL19oYXNVbmljb2RlJyksXG4gICAgdW5pY29kZVRvQXJyYXkgPSByZXF1aXJlKCcuL191bmljb2RlVG9BcnJheScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBzdHJpbmdUb0FycmF5KHN0cmluZykge1xuICByZXR1cm4gaGFzVW5pY29kZShzdHJpbmcpXG4gICAgPyB1bmljb2RlVG9BcnJheShzdHJpbmcpXG4gICAgOiBhc2NpaVRvQXJyYXkoc3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb0FycmF5O1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAoc3RyaW5nLmNoYXJDb2RlQXQoMCkgPT09IDQ2IC8qIC4gKi8pIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN1YlN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3ViU3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwiLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNoYXJhY3RlciBjbGFzc2VzLiAqL1xudmFyIHJzQXN0cmFsUmFuZ2UgPSAnXFxcXHVkODAwLVxcXFx1ZGZmZicsXG4gICAgcnNDb21ib01hcmtzUmFuZ2UgPSAnXFxcXHUwMzAwLVxcXFx1MDM2ZicsXG4gICAgcmVDb21ib0hhbGZNYXJrc1JhbmdlID0gJ1xcXFx1ZmUyMC1cXFxcdWZlMmYnLFxuICAgIHJzQ29tYm9TeW1ib2xzUmFuZ2UgPSAnXFxcXHUyMGQwLVxcXFx1MjBmZicsXG4gICAgcnNDb21ib1JhbmdlID0gcnNDb21ib01hcmtzUmFuZ2UgKyByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgKyByc0NvbWJvU3ltYm9sc1JhbmdlLFxuICAgIHJzVmFyUmFuZ2UgPSAnXFxcXHVmZTBlXFxcXHVmZTBmJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNhcHR1cmUgZ3JvdXBzLiAqL1xudmFyIHJzQXN0cmFsID0gJ1snICsgcnNBc3RyYWxSYW5nZSArICddJyxcbiAgICByc0NvbWJvID0gJ1snICsgcnNDb21ib1JhbmdlICsgJ10nLFxuICAgIHJzRml0eiA9ICdcXFxcdWQ4M2NbXFxcXHVkZmZiLVxcXFx1ZGZmZl0nLFxuICAgIHJzTW9kaWZpZXIgPSAnKD86JyArIHJzQ29tYm8gKyAnfCcgKyByc0ZpdHogKyAnKScsXG4gICAgcnNOb25Bc3RyYWwgPSAnW14nICsgcnNBc3RyYWxSYW5nZSArICddJyxcbiAgICByc1JlZ2lvbmFsID0gJyg/OlxcXFx1ZDgzY1tcXFxcdWRkZTYtXFxcXHVkZGZmXSl7Mn0nLFxuICAgIHJzU3VyclBhaXIgPSAnW1xcXFx1ZDgwMC1cXFxcdWRiZmZdW1xcXFx1ZGMwMC1cXFxcdWRmZmZdJyxcbiAgICByc1pXSiA9ICdcXFxcdTIwMGQnO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgcmVnZXhlcy4gKi9cbnZhciByZU9wdE1vZCA9IHJzTW9kaWZpZXIgKyAnPycsXG4gICAgcnNPcHRWYXIgPSAnWycgKyByc1ZhclJhbmdlICsgJ10/JyxcbiAgICByc09wdEpvaW4gPSAnKD86JyArIHJzWldKICsgJyg/OicgKyBbcnNOb25Bc3RyYWwsIHJzUmVnaW9uYWwsIHJzU3VyclBhaXJdLmpvaW4oJ3wnKSArICcpJyArIHJzT3B0VmFyICsgcmVPcHRNb2QgKyAnKSonLFxuICAgIHJzU2VxID0gcnNPcHRWYXIgKyByZU9wdE1vZCArIHJzT3B0Sm9pbixcbiAgICByc1N5bWJvbCA9ICcoPzonICsgW3JzTm9uQXN0cmFsICsgcnNDb21ibyArICc/JywgcnNDb21ibywgcnNSZWdpb25hbCwgcnNTdXJyUGFpciwgcnNBc3RyYWxdLmpvaW4oJ3wnKSArICcpJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggW3N0cmluZyBzeW1ib2xzXShodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC11bmljb2RlKS4gKi9cbnZhciByZVVuaWNvZGUgPSBSZWdFeHAocnNGaXR6ICsgJyg/PScgKyByc0ZpdHogKyAnKXwnICsgcnNTeW1ib2wgKyByc1NlcSwgJ2cnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIFVuaWNvZGUgYHN0cmluZ2AgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHVuaWNvZGVUb0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLm1hdGNoKHJlVW5pY29kZSkgfHwgW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pY29kZVRvQXJyYXk7XG4iLCIvKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNBc3RyYWxSYW5nZSA9ICdcXFxcdWQ4MDAtXFxcXHVkZmZmJyxcbiAgICByc0NvbWJvTWFya3NSYW5nZSA9ICdcXFxcdTAzMDAtXFxcXHUwMzZmJyxcbiAgICByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgPSAnXFxcXHVmZTIwLVxcXFx1ZmUyZicsXG4gICAgcnNDb21ib1N5bWJvbHNSYW5nZSA9ICdcXFxcdTIwZDAtXFxcXHUyMGZmJyxcbiAgICByc0NvbWJvUmFuZ2UgPSByc0NvbWJvTWFya3NSYW5nZSArIHJlQ29tYm9IYWxmTWFya3NSYW5nZSArIHJzQ29tYm9TeW1ib2xzUmFuZ2UsXG4gICAgcnNEaW5nYmF0UmFuZ2UgPSAnXFxcXHUyNzAwLVxcXFx1MjdiZicsXG4gICAgcnNMb3dlclJhbmdlID0gJ2EtelxcXFx4ZGYtXFxcXHhmNlxcXFx4ZjgtXFxcXHhmZicsXG4gICAgcnNNYXRoT3BSYW5nZSA9ICdcXFxceGFjXFxcXHhiMVxcXFx4ZDdcXFxceGY3JyxcbiAgICByc05vbkNoYXJSYW5nZSA9ICdcXFxceDAwLVxcXFx4MmZcXFxceDNhLVxcXFx4NDBcXFxceDViLVxcXFx4NjBcXFxceDdiLVxcXFx4YmYnLFxuICAgIHJzUHVuY3R1YXRpb25SYW5nZSA9ICdcXFxcdTIwMDAtXFxcXHUyMDZmJyxcbiAgICByc1NwYWNlUmFuZ2UgPSAnIFxcXFx0XFxcXHgwYlxcXFxmXFxcXHhhMFxcXFx1ZmVmZlxcXFxuXFxcXHJcXFxcdTIwMjhcXFxcdTIwMjlcXFxcdTE2ODBcXFxcdTE4MGVcXFxcdTIwMDBcXFxcdTIwMDFcXFxcdTIwMDJcXFxcdTIwMDNcXFxcdTIwMDRcXFxcdTIwMDVcXFxcdTIwMDZcXFxcdTIwMDdcXFxcdTIwMDhcXFxcdTIwMDlcXFxcdTIwMGFcXFxcdTIwMmZcXFxcdTIwNWZcXFxcdTMwMDAnLFxuICAgIHJzVXBwZXJSYW5nZSA9ICdBLVpcXFxceGMwLVxcXFx4ZDZcXFxceGQ4LVxcXFx4ZGUnLFxuICAgIHJzVmFyUmFuZ2UgPSAnXFxcXHVmZTBlXFxcXHVmZTBmJyxcbiAgICByc0JyZWFrUmFuZ2UgPSByc01hdGhPcFJhbmdlICsgcnNOb25DaGFyUmFuZ2UgKyByc1B1bmN0dWF0aW9uUmFuZ2UgKyByc1NwYWNlUmFuZ2U7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjYXB0dXJlIGdyb3Vwcy4gKi9cbnZhciByc0Fwb3MgPSBcIlsnXFx1MjAxOV1cIixcbiAgICByc0JyZWFrID0gJ1snICsgcnNCcmVha1JhbmdlICsgJ10nLFxuICAgIHJzQ29tYm8gPSAnWycgKyByc0NvbWJvUmFuZ2UgKyAnXScsXG4gICAgcnNEaWdpdHMgPSAnXFxcXGQrJyxcbiAgICByc0RpbmdiYXQgPSAnWycgKyByc0RpbmdiYXRSYW5nZSArICddJyxcbiAgICByc0xvd2VyID0gJ1snICsgcnNMb3dlclJhbmdlICsgJ10nLFxuICAgIHJzTWlzYyA9ICdbXicgKyByc0FzdHJhbFJhbmdlICsgcnNCcmVha1JhbmdlICsgcnNEaWdpdHMgKyByc0RpbmdiYXRSYW5nZSArIHJzTG93ZXJSYW5nZSArIHJzVXBwZXJSYW5nZSArICddJyxcbiAgICByc0ZpdHogPSAnXFxcXHVkODNjW1xcXFx1ZGZmYi1cXFxcdWRmZmZdJyxcbiAgICByc01vZGlmaWVyID0gJyg/OicgKyByc0NvbWJvICsgJ3wnICsgcnNGaXR6ICsgJyknLFxuICAgIHJzTm9uQXN0cmFsID0gJ1teJyArIHJzQXN0cmFsUmFuZ2UgKyAnXScsXG4gICAgcnNSZWdpb25hbCA9ICcoPzpcXFxcdWQ4M2NbXFxcXHVkZGU2LVxcXFx1ZGRmZl0pezJ9JyxcbiAgICByc1N1cnJQYWlyID0gJ1tcXFxcdWQ4MDAtXFxcXHVkYmZmXVtcXFxcdWRjMDAtXFxcXHVkZmZmXScsXG4gICAgcnNVcHBlciA9ICdbJyArIHJzVXBwZXJSYW5nZSArICddJyxcbiAgICByc1pXSiA9ICdcXFxcdTIwMGQnO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgcmVnZXhlcy4gKi9cbnZhciByc01pc2NMb3dlciA9ICcoPzonICsgcnNMb3dlciArICd8JyArIHJzTWlzYyArICcpJyxcbiAgICByc01pc2NVcHBlciA9ICcoPzonICsgcnNVcHBlciArICd8JyArIHJzTWlzYyArICcpJyxcbiAgICByc09wdENvbnRyTG93ZXIgPSAnKD86JyArIHJzQXBvcyArICcoPzpkfGxsfG18cmV8c3x0fHZlKSk/JyxcbiAgICByc09wdENvbnRyVXBwZXIgPSAnKD86JyArIHJzQXBvcyArICcoPzpEfExMfE18UkV8U3xUfFZFKSk/JyxcbiAgICByZU9wdE1vZCA9IHJzTW9kaWZpZXIgKyAnPycsXG4gICAgcnNPcHRWYXIgPSAnWycgKyByc1ZhclJhbmdlICsgJ10/JyxcbiAgICByc09wdEpvaW4gPSAnKD86JyArIHJzWldKICsgJyg/OicgKyBbcnNOb25Bc3RyYWwsIHJzUmVnaW9uYWwsIHJzU3VyclBhaXJdLmpvaW4oJ3wnKSArICcpJyArIHJzT3B0VmFyICsgcmVPcHRNb2QgKyAnKSonLFxuICAgIHJzT3JkTG93ZXIgPSAnXFxcXGQqKD86MXN0fDJuZHwzcmR8KD8hWzEyM10pXFxcXGR0aCkoPz1cXFxcYnxbQS1aX10pJyxcbiAgICByc09yZFVwcGVyID0gJ1xcXFxkKig/OjFTVHwyTkR8M1JEfCg/IVsxMjNdKVxcXFxkVEgpKD89XFxcXGJ8W2Etel9dKScsXG4gICAgcnNTZXEgPSByc09wdFZhciArIHJlT3B0TW9kICsgcnNPcHRKb2luLFxuICAgIHJzRW1vamkgPSAnKD86JyArIFtyc0RpbmdiYXQsIHJzUmVnaW9uYWwsIHJzU3VyclBhaXJdLmpvaW4oJ3wnKSArICcpJyArIHJzU2VxO1xuXG4vKiogVXNlZCB0byBtYXRjaCBjb21wbGV4IG9yIGNvbXBvdW5kIHdvcmRzLiAqL1xudmFyIHJlVW5pY29kZVdvcmQgPSBSZWdFeHAoW1xuICByc1VwcGVyICsgJz8nICsgcnNMb3dlciArICcrJyArIHJzT3B0Q29udHJMb3dlciArICcoPz0nICsgW3JzQnJlYWssIHJzVXBwZXIsICckJ10uam9pbignfCcpICsgJyknLFxuICByc01pc2NVcHBlciArICcrJyArIHJzT3B0Q29udHJVcHBlciArICcoPz0nICsgW3JzQnJlYWssIHJzVXBwZXIgKyByc01pc2NMb3dlciwgJyQnXS5qb2luKCd8JykgKyAnKScsXG4gIHJzVXBwZXIgKyAnPycgKyByc01pc2NMb3dlciArICcrJyArIHJzT3B0Q29udHJMb3dlcixcbiAgcnNVcHBlciArICcrJyArIHJzT3B0Q29udHJVcHBlcixcbiAgcnNPcmRVcHBlcixcbiAgcnNPcmRMb3dlcixcbiAgcnNEaWdpdHMsXG4gIHJzRW1vamlcbl0uam9pbignfCcpLCAnZycpO1xuXG4vKipcbiAqIFNwbGl0cyBhIFVuaWNvZGUgYHN0cmluZ2AgaW50byBhbiBhcnJheSBvZiBpdHMgd29yZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBUaGUgc3RyaW5nIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHdvcmRzIG9mIGBzdHJpbmdgLlxuICovXG5mdW5jdGlvbiB1bmljb2RlV29yZHMoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcubWF0Y2gocmVVbmljb2RlV29yZCkgfHwgW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5pY29kZVdvcmRzO1xuIiwidmFyIGNhcGl0YWxpemUgPSByZXF1aXJlKCcuL2NhcGl0YWxpemUnKSxcbiAgICBjcmVhdGVDb21wb3VuZGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ29tcG91bmRlcicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIFtjYW1lbCBjYXNlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DYW1lbENhc2UpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjYW1lbCBjYXNlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2FtZWxDYXNlKCdGb28gQmFyJyk7XG4gKiAvLyA9PiAnZm9vQmFyJ1xuICpcbiAqIF8uY2FtZWxDYXNlKCctLWZvby1iYXItLScpO1xuICogLy8gPT4gJ2Zvb0JhcidcbiAqXG4gKiBfLmNhbWVsQ2FzZSgnX19GT09fQkFSX18nKTtcbiAqIC8vID0+ICdmb29CYXInXG4gKi9cbnZhciBjYW1lbENhc2UgPSBjcmVhdGVDb21wb3VuZGVyKGZ1bmN0aW9uKHJlc3VsdCwgd29yZCwgaW5kZXgpIHtcbiAgd29yZCA9IHdvcmQudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIHJlc3VsdCArIChpbmRleCA/IGNhcGl0YWxpemUod29yZCkgOiB3b3JkKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbWVsQ2FzZTtcbiIsInZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKSxcbiAgICB1cHBlckZpcnN0ID0gcmVxdWlyZSgnLi91cHBlckZpcnN0Jyk7XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGZpcnN0IGNoYXJhY3RlciBvZiBgc3RyaW5nYCB0byB1cHBlciBjYXNlIGFuZCB0aGUgcmVtYWluaW5nXG4gKiB0byBsb3dlciBjYXNlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIGNhcGl0YWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjYXBpdGFsaXplZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uY2FwaXRhbGl6ZSgnRlJFRCcpO1xuICogLy8gPT4gJ0ZyZWQnXG4gKi9cbmZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiB1cHBlckZpcnN0KHRvU3RyaW5nKHN0cmluZykudG9Mb3dlckNhc2UoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FwaXRhbGl6ZTtcbiIsInZhciBkZWJ1cnJMZXR0ZXIgPSByZXF1aXJlKCcuL19kZWJ1cnJMZXR0ZXInKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggTGF0aW4gVW5pY29kZSBsZXR0ZXJzIChleGNsdWRpbmcgbWF0aGVtYXRpY2FsIG9wZXJhdG9ycykuICovXG52YXIgcmVMYXRpbiA9IC9bXFx4YzAtXFx4ZDZcXHhkOC1cXHhmNlxceGY4LVxceGZmXFx1MDEwMC1cXHUwMTdmXS9nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2hhcmFjdGVyIGNsYXNzZXMuICovXG52YXIgcnNDb21ib01hcmtzUmFuZ2UgPSAnXFxcXHUwMzAwLVxcXFx1MDM2ZicsXG4gICAgcmVDb21ib0hhbGZNYXJrc1JhbmdlID0gJ1xcXFx1ZmUyMC1cXFxcdWZlMmYnLFxuICAgIHJzQ29tYm9TeW1ib2xzUmFuZ2UgPSAnXFxcXHUyMGQwLVxcXFx1MjBmZicsXG4gICAgcnNDb21ib1JhbmdlID0gcnNDb21ib01hcmtzUmFuZ2UgKyByZUNvbWJvSGFsZk1hcmtzUmFuZ2UgKyByc0NvbWJvU3ltYm9sc1JhbmdlO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgY2FwdHVyZSBncm91cHMuICovXG52YXIgcnNDb21ibyA9ICdbJyArIHJzQ29tYm9SYW5nZSArICddJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIFtjb21iaW5pbmcgZGlhY3JpdGljYWwgbWFya3NdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbWJpbmluZ19EaWFjcml0aWNhbF9NYXJrcykgYW5kXG4gKiBbY29tYmluaW5nIGRpYWNyaXRpY2FsIG1hcmtzIGZvciBzeW1ib2xzXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21iaW5pbmdfRGlhY3JpdGljYWxfTWFya3NfZm9yX1N5bWJvbHMpLlxuICovXG52YXIgcmVDb21ib01hcmsgPSBSZWdFeHAocnNDb21ibywgJ2cnKTtcblxuLyoqXG4gKiBEZWJ1cnJzIGBzdHJpbmdgIGJ5IGNvbnZlcnRpbmdcbiAqIFtMYXRpbi0xIFN1cHBsZW1lbnRdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluLTFfU3VwcGxlbWVudF8oVW5pY29kZV9ibG9jaykjQ2hhcmFjdGVyX3RhYmxlKVxuICogYW5kIFtMYXRpbiBFeHRlbmRlZC1BXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MYXRpbl9FeHRlbmRlZC1BKVxuICogbGV0dGVycyB0byBiYXNpYyBMYXRpbiBsZXR0ZXJzIGFuZCByZW1vdmluZ1xuICogW2NvbWJpbmluZyBkaWFjcml0aWNhbCBtYXJrc10oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29tYmluaW5nX0RpYWNyaXRpY2FsX01hcmtzKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBkZWJ1cnIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBkZWJ1cnJlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVidXJyKCdkw6lqw6AgdnUnKTtcbiAqIC8vID0+ICdkZWphIHZ1J1xuICovXG5mdW5jdGlvbiBkZWJ1cnIoc3RyaW5nKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHJldHVybiBzdHJpbmcgJiYgc3RyaW5nLnJlcGxhY2UocmVMYXRpbiwgZGVidXJyTGV0dGVyKS5yZXBsYWNlKHJlQ29tYm9NYXJrLCAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVidXJyO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpc1xuICogYHVuZGVmaW5lZGAsIHRoZSBgZGVmYXVsdFZhbHVlYCBpcyByZXR1cm5lZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsInZhciBiYXNlSGFzID0gcmVxdWlyZSgnLi9fYmFzZUhhcycpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogeyAnYic6IDIgfSB9O1xuICogdmFyIG90aGVyID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG90aGVyLCAnYScpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKTtcblxuLyoqXG4gKiBUaGUgb3Bwb3NpdGUgb2YgYF8ubWFwVmFsdWVzYDsgdGhpcyBtZXRob2QgY3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0aGVcbiAqIHNhbWUgdmFsdWVzIGFzIGBvYmplY3RgIGFuZCBrZXlzIGdlbmVyYXRlZCBieSBydW5uaW5nIGVhY2ggb3duIGVudW1lcmFibGVcbiAqIHN0cmluZyBrZXllZCBwcm9wZXJ0eSBvZiBgb2JqZWN0YCB0aHJ1IGBpdGVyYXRlZWAuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkXG4gKiB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBvYmplY3QuXG4gKiBAc2VlIF8ubWFwVmFsdWVzXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ubWFwS2V5cyh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgcmV0dXJuIGtleSArIHZhbHVlO1xuICogfSk7XG4gKiAvLyA9PiB7ICdhMSc6IDEsICdiMic6IDIgfVxuICovXG5mdW5jdGlvbiBtYXBLZXlzKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShpdGVyYXRlZSwgMyk7XG5cbiAgYmFzZUZvck93bihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShyZXN1bHQsIGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iamVjdCksIHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwS2V5cztcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggdGhlIHNhbWUga2V5cyBhcyBgb2JqZWN0YCBhbmQgdmFsdWVzIGdlbmVyYXRlZFxuICogYnkgcnVubmluZyBlYWNoIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0eSBvZiBgb2JqZWN0YCB0aHJ1XG4gKiBgaXRlcmF0ZWVgLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwga2V5LCBvYmplY3QpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgb2JqZWN0LlxuICogQHNlZSBfLm1hcEtleXNcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0ge1xuICogICAnZnJlZCc6ICAgIHsgJ3VzZXInOiAnZnJlZCcsICAgICdhZ2UnOiA0MCB9LFxuICogICAncGViYmxlcyc6IHsgJ3VzZXInOiAncGViYmxlcycsICdhZ2UnOiAxIH1cbiAqIH07XG4gKlxuICogXy5tYXBWYWx1ZXModXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8uYWdlOyB9KTtcbiAqIC8vID0+IHsgJ2ZyZWQnOiA0MCwgJ3BlYmJsZXMnOiAxIH0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8ubWFwVmFsdWVzKHVzZXJzLCAnYWdlJyk7XG4gKiAvLyA9PiB7ICdmcmVkJzogNDAsICdwZWJibGVzJzogMSB9IChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIG1hcFZhbHVlcyhvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgaXRlcmF0ZWUgPSBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDMpO1xuXG4gIGJhc2VGb3JPd24ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUocmVzdWx0LCBrZXksIGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iamVjdCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBWYWx1ZXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsInZhciBjcmVhdGVDb21wb3VuZGVyID0gcmVxdWlyZSgnLi9fY3JlYXRlQ29tcG91bmRlcicpO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvXG4gKiBbc25ha2UgY2FzZV0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvU25ha2VfY2FzZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNuYWtlIGNhc2VkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zbmFrZUNhc2UoJ0ZvbyBCYXInKTtcbiAqIC8vID0+ICdmb29fYmFyJ1xuICpcbiAqIF8uc25ha2VDYXNlKCdmb29CYXInKTtcbiAqIC8vID0+ICdmb29fYmFyJ1xuICpcbiAqIF8uc25ha2VDYXNlKCctLUZPTy1CQVItLScpO1xuICogLy8gPT4gJ2Zvb19iYXInXG4gKi9cbnZhciBzbmFrZUNhc2UgPSBjcmVhdGVDb21wb3VuZGVyKGZ1bmN0aW9uKHJlc3VsdCwgd29yZCwgaW5kZXgpIHtcbiAgcmV0dXJuIHJlc3VsdCArIChpbmRleCA/ICdfJyA6ICcnKSArIHdvcmQudG9Mb3dlckNhc2UoKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNuYWtlQ2FzZTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwidmFyIGNyZWF0ZUNhc2VGaXJzdCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUNhc2VGaXJzdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYHN0cmluZ2AgdG8gdXBwZXIgY2FzZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51cHBlckZpcnN0KCdmcmVkJyk7XG4gKiAvLyA9PiAnRnJlZCdcbiAqXG4gKiBfLnVwcGVyRmlyc3QoJ0ZSRUQnKTtcbiAqIC8vID0+ICdGUkVEJ1xuICovXG52YXIgdXBwZXJGaXJzdCA9IGNyZWF0ZUNhc2VGaXJzdCgndG9VcHBlckNhc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB1cHBlckZpcnN0O1xuIiwidmFyIGFzY2lpV29yZHMgPSByZXF1aXJlKCcuL19hc2NpaVdvcmRzJyksXG4gICAgaGFzVW5pY29kZVdvcmQgPSByZXF1aXJlKCcuL19oYXNVbmljb2RlV29yZCcpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpLFxuICAgIHVuaWNvZGVXb3JkcyA9IHJlcXVpcmUoJy4vX3VuaWNvZGVXb3JkcycpO1xuXG4vKipcbiAqIFNwbGl0cyBgc3RyaW5nYCBpbnRvIGFuIGFycmF5IG9mIGl0cyB3b3Jkcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtSZWdFeHB8c3RyaW5nfSBbcGF0dGVybl0gVGhlIHBhdHRlcm4gdG8gbWF0Y2ggd29yZHMuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB3b3JkcyBvZiBgc3RyaW5nYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy53b3JkcygnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnKTtcbiAqIC8vID0+IFsnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcyddXG4gKlxuICogXy53b3JkcygnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnLCAvW14sIF0rL2cpO1xuICogLy8gPT4gWydmcmVkJywgJ2Jhcm5leScsICcmJywgJ3BlYmJsZXMnXVxuICovXG5mdW5jdGlvbiB3b3JkcyhzdHJpbmcsIHBhdHRlcm4sIGd1YXJkKSB7XG4gIHN0cmluZyA9IHRvU3RyaW5nKHN0cmluZyk7XG4gIHBhdHRlcm4gPSBndWFyZCA/IHVuZGVmaW5lZCA6IHBhdHRlcm47XG5cbiAgaWYgKHBhdHRlcm4gPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBoYXNVbmljb2RlV29yZChzdHJpbmcpID8gdW5pY29kZVdvcmRzKHN0cmluZykgOiBhc2NpaVdvcmRzKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIHN0cmluZy5tYXRjaChwYXR0ZXJuKSB8fCBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3b3JkcztcbiIsIi8vIEVTNiBNYXBcbnZhciBtYXBcbnRyeSB7XG4gIG1hcCA9IE1hcFxufSBjYXRjaCAoXykgeyB9XG52YXIgc2V0XG5cbi8vIEVTNiBTZXRcbnRyeSB7XG4gIHNldCA9IFNldFxufSBjYXRjaCAoXykgeyB9XG5cbmZ1bmN0aW9uIGJhc2VDbG9uZSAoc3JjLCBjaXJjdWxhcnMsIGNsb25lcykge1xuICAvLyBOdWxsL3VuZGVmaW5lZC9mdW5jdGlvbnMvZXRjXG4gIGlmICghc3JjIHx8IHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBzcmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3JjXG4gIH1cblxuICAvLyBET00gTm9kZVxuICBpZiAoc3JjLm5vZGVUeXBlICYmICdjbG9uZU5vZGUnIGluIHNyYykge1xuICAgIHJldHVybiBzcmMuY2xvbmVOb2RlKHRydWUpXG4gIH1cblxuICAvLyBEYXRlXG4gIGlmIChzcmMgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHNyYy5nZXRUaW1lKCkpXG4gIH1cblxuICAvLyBSZWdFeHBcbiAgaWYgKHNyYyBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHNyYylcbiAgfVxuXG4gIC8vIEFycmF5c1xuICBpZiAoQXJyYXkuaXNBcnJheShzcmMpKSB7XG4gICAgcmV0dXJuIHNyYy5tYXAoY2xvbmUpXG4gIH1cblxuICAvLyBFUzYgTWFwc1xuICBpZiAobWFwICYmIHNyYyBpbnN0YW5jZW9mIG1hcCkge1xuICAgIHJldHVybiBuZXcgTWFwKEFycmF5LmZyb20oc3JjLmVudHJpZXMoKSkpXG4gIH1cblxuICAvLyBFUzYgU2V0c1xuICBpZiAoc2V0ICYmIHNyYyBpbnN0YW5jZW9mIHNldCkge1xuICAgIHJldHVybiBuZXcgU2V0KEFycmF5LmZyb20oc3JjLnZhbHVlcygpKSlcbiAgfVxuXG4gIC8vIE9iamVjdFxuICBpZiAoc3JjIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgY2lyY3VsYXJzLnB1c2goc3JjKVxuICAgIHZhciBvYmogPSBPYmplY3QuY3JlYXRlKHNyYylcbiAgICBjbG9uZXMucHVzaChvYmopXG4gICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgdmFyIGlkeCA9IGNpcmN1bGFycy5maW5kSW5kZXgoZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIGkgPT09IHNyY1trZXldXG4gICAgICB9KVxuICAgICAgb2JqW2tleV0gPSBpZHggPiAtMSA/IGNsb25lc1tpZHhdIDogYmFzZUNsb25lKHNyY1trZXldLCBjaXJjdWxhcnMsIGNsb25lcylcbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgLy8gPz8/XG4gIHJldHVybiBzcmNcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xvbmUgKHNyYykge1xuICByZXR1cm4gYmFzZUNsb25lKHNyYywgW10sIFtdKVxufVxuIiwiLyoqXG4gKiBCYXNlZCBvbiBLZW5kbyBVSSBDb3JlIGV4cHJlc3Npb24gY29kZSA8aHR0cHM6Ly9naXRodWIuY29tL3RlbGVyaWsva2VuZG8tdWktY29yZSNsaWNlbnNlLWluZm9ybWF0aW9uPlxuICovXG4ndXNlIHN0cmljdCdcblxuZnVuY3Rpb24gQ2FjaGUobWF4U2l6ZSkge1xuICB0aGlzLl9tYXhTaXplID0gbWF4U2l6ZVxuICB0aGlzLmNsZWFyKClcbn1cbkNhY2hlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5fc2l6ZSA9IDBcbiAgdGhpcy5fdmFsdWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxufVxuQ2FjaGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX3ZhbHVlc1trZXldXG59XG5DYWNoZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdGhpcy5fc2l6ZSA+PSB0aGlzLl9tYXhTaXplICYmIHRoaXMuY2xlYXIoKVxuICBpZiAoIShrZXkgaW4gdGhpcy5fdmFsdWVzKSkgdGhpcy5fc2l6ZSsrXG5cbiAgcmV0dXJuICh0aGlzLl92YWx1ZXNba2V5XSA9IHZhbHVlKVxufVxuXG52YXIgU1BMSVRfUkVHRVggPSAvW14uXlxcXV5bXSt8KD89XFxbXFxdfFxcLlxcLikvZyxcbiAgRElHSVRfUkVHRVggPSAvXlxcZCskLyxcbiAgTEVBRF9ESUdJVF9SRUdFWCA9IC9eXFxkLyxcbiAgU1BFQ19DSEFSX1JFR0VYID0gL1t+YCEjJCVcXF4mKis9XFwtXFxbXFxdXFxcXCc7LC97fXxcXFxcXCI6PD5cXD9dL2csXG4gIENMRUFOX1FVT1RFU19SRUdFWCA9IC9eXFxzKihbJ1wiXT8pKC4qPykoXFwxKVxccyokLyxcbiAgTUFYX0NBQ0hFX1NJWkUgPSA1MTJcblxudmFyIHBhdGhDYWNoZSA9IG5ldyBDYWNoZShNQVhfQ0FDSEVfU0laRSksXG4gIHNldENhY2hlID0gbmV3IENhY2hlKE1BWF9DQUNIRV9TSVpFKSxcbiAgZ2V0Q2FjaGUgPSBuZXcgQ2FjaGUoTUFYX0NBQ0hFX1NJWkUpXG5cbnZhciBjb25maWdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENhY2hlOiBDYWNoZSxcblxuICBzcGxpdDogc3BsaXQsXG5cbiAgbm9ybWFsaXplUGF0aDogbm9ybWFsaXplUGF0aCxcblxuICBzZXR0ZXI6IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIHNldENhY2hlLmdldChwYXRoKSB8fFxuICAgICAgc2V0Q2FjaGUuc2V0KHBhdGgsIGZ1bmN0aW9uIHNldHRlcihvYmosIHZhbHVlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IDBcbiAgICAgICAgdmFyIGxlbiA9IHBhcnRzLmxlbmd0aFxuICAgICAgICB2YXIgZGF0YSA9IG9ialxuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbiAtIDEpIHtcbiAgICAgICAgICB2YXIgcGFydCA9IHBhcnRzW2luZGV4XVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHBhcnQgPT09ICdfX3Byb3RvX18nIHx8XG4gICAgICAgICAgICBwYXJ0ID09PSAnY29uc3RydWN0b3InIHx8XG4gICAgICAgICAgICBwYXJ0ID09PSAncHJvdG90eXBlJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEgPSBkYXRhW3BhcnRzW2luZGV4KytdXVxuICAgICAgICB9XG4gICAgICAgIGRhdGFbcGFydHNbaW5kZXhdXSA9IHZhbHVlXG4gICAgICB9KVxuICAgIClcbiAgfSxcblxuICBnZXR0ZXI6IGZ1bmN0aW9uIChwYXRoLCBzYWZlKSB7XG4gICAgdmFyIHBhcnRzID0gbm9ybWFsaXplUGF0aChwYXRoKVxuICAgIHJldHVybiAoXG4gICAgICBnZXRDYWNoZS5nZXQocGF0aCkgfHxcbiAgICAgIGdldENhY2hlLnNldChwYXRoLCBmdW5jdGlvbiBnZXR0ZXIoZGF0YSkge1xuICAgICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgIGxlbiA9IHBhcnRzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW4pIHtcbiAgICAgICAgICBpZiAoZGF0YSAhPSBudWxsIHx8ICFzYWZlKSBkYXRhID0gZGF0YVtwYXJ0c1tpbmRleCsrXV1cbiAgICAgICAgICBlbHNlIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9KVxuICAgIClcbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiAoc2VnbWVudHMpIHtcbiAgICByZXR1cm4gc2VnbWVudHMucmVkdWNlKGZ1bmN0aW9uIChwYXRoLCBwYXJ0KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBwYXRoICtcbiAgICAgICAgKGlzUXVvdGVkKHBhcnQpIHx8IERJR0lUX1JFR0VYLnRlc3QocGFydClcbiAgICAgICAgICA/ICdbJyArIHBhcnQgKyAnXSdcbiAgICAgICAgICA6IChwYXRoID8gJy4nIDogJycpICsgcGFydClcbiAgICAgIClcbiAgICB9LCAnJylcbiAgfSxcblxuICBmb3JFYWNoOiBmdW5jdGlvbiAocGF0aCwgY2IsIHRoaXNBcmcpIHtcbiAgICBmb3JFYWNoKEFycmF5LmlzQXJyYXkocGF0aCkgPyBwYXRoIDogc3BsaXQocGF0aCksIGNiLCB0aGlzQXJnKVxuICB9LFxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIChcbiAgICBwYXRoQ2FjaGUuZ2V0KHBhdGgpIHx8XG4gICAgcGF0aENhY2hlLnNldChcbiAgICAgIHBhdGgsXG4gICAgICBzcGxpdChwYXRoKS5tYXAoZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgcmV0dXJuIHBhcnQucmVwbGFjZShDTEVBTl9RVU9URVNfUkVHRVgsICckMicpXG4gICAgICB9KVxuICAgIClcbiAgKVxufVxuXG5mdW5jdGlvbiBzcGxpdChwYXRoKSB7XG4gIHJldHVybiBwYXRoLm1hdGNoKFNQTElUX1JFR0VYKSB8fCBbJyddXG59XG5cbmZ1bmN0aW9uIGZvckVhY2gocGFydHMsIGl0ZXIsIHRoaXNBcmcpIHtcbiAgdmFyIGxlbiA9IHBhcnRzLmxlbmd0aCxcbiAgICBwYXJ0LFxuICAgIGlkeCxcbiAgICBpc0FycmF5LFxuICAgIGlzQnJhY2tldFxuXG4gIGZvciAoaWR4ID0gMDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgIHBhcnQgPSBwYXJ0c1tpZHhdXG5cbiAgICBpZiAocGFydCkge1xuICAgICAgaWYgKHNob3VsZEJlUXVvdGVkKHBhcnQpKSB7XG4gICAgICAgIHBhcnQgPSAnXCInICsgcGFydCArICdcIidcbiAgICAgIH1cblxuICAgICAgaXNCcmFja2V0ID0gaXNRdW90ZWQocGFydClcbiAgICAgIGlzQXJyYXkgPSAhaXNCcmFja2V0ICYmIC9eXFxkKyQvLnRlc3QocGFydClcblxuICAgICAgaXRlci5jYWxsKHRoaXNBcmcsIHBhcnQsIGlzQnJhY2tldCwgaXNBcnJheSwgaWR4LCBwYXJ0cylcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNRdW90ZWQoc3RyKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgJiYgc3RyICYmIFtcIidcIiwgJ1wiJ10uaW5kZXhPZihzdHIuY2hhckF0KDApKSAhPT0gLTFcbiAgKVxufVxuXG5mdW5jdGlvbiBoYXNMZWFkaW5nTnVtYmVyKHBhcnQpIHtcbiAgcmV0dXJuIHBhcnQubWF0Y2goTEVBRF9ESUdJVF9SRUdFWCkgJiYgIXBhcnQubWF0Y2goRElHSVRfUkVHRVgpXG59XG5cbmZ1bmN0aW9uIGhhc1NwZWNpYWxDaGFycyhwYXJ0KSB7XG4gIHJldHVybiBTUEVDX0NIQVJfUkVHRVgudGVzdChwYXJ0KVxufVxuXG5mdW5jdGlvbiBzaG91bGRCZVF1b3RlZChwYXJ0KSB7XG4gIHJldHVybiAhaXNRdW90ZWQocGFydCkgJiYgKGhhc0xlYWRpbmdOdW1iZXIocGFydCkgfHwgaGFzU3BlY2lhbENoYXJzKHBhcnQpKVxufVxuIiwiXG4vKipcbiAqIFRvcG9sb2dpY2FsIHNvcnRpbmcgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBlZGdlc1xuICogQHJldHVybnMge0FycmF5fVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWRnZXMpIHtcbiAgcmV0dXJuIHRvcG9zb3J0KHVuaXF1ZU5vZGVzKGVkZ2VzKSwgZWRnZXMpXG59XG5cbm1vZHVsZS5leHBvcnRzLmFycmF5ID0gdG9wb3NvcnRcblxuZnVuY3Rpb24gdG9wb3NvcnQobm9kZXMsIGVkZ2VzKSB7XG4gIHZhciBjdXJzb3IgPSBub2Rlcy5sZW5ndGhcbiAgICAsIHNvcnRlZCA9IG5ldyBBcnJheShjdXJzb3IpXG4gICAgLCB2aXNpdGVkID0ge31cbiAgICAsIGkgPSBjdXJzb3JcbiAgICAvLyBCZXR0ZXIgZGF0YSBzdHJ1Y3R1cmVzIG1ha2UgYWxnb3JpdGhtIG11Y2ggZmFzdGVyLlxuICAgICwgb3V0Z29pbmdFZGdlcyA9IG1ha2VPdXRnb2luZ0VkZ2VzKGVkZ2VzKVxuICAgICwgbm9kZXNIYXNoID0gbWFrZU5vZGVzSGFzaChub2RlcylcblxuICAvLyBjaGVjayBmb3IgdW5rbm93biBub2Rlc1xuICBlZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICBpZiAoIW5vZGVzSGFzaC5oYXMoZWRnZVswXSkgfHwgIW5vZGVzSGFzaC5oYXMoZWRnZVsxXSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBub2RlLiBUaGVyZSBpcyBhbiB1bmtub3duIG5vZGUgaW4gdGhlIHN1cHBsaWVkIGVkZ2VzLicpXG4gICAgfVxuICB9KVxuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoIXZpc2l0ZWRbaV0pIHZpc2l0KG5vZGVzW2ldLCBpLCBuZXcgU2V0KCkpXG4gIH1cblxuICByZXR1cm4gc29ydGVkXG5cbiAgZnVuY3Rpb24gdmlzaXQobm9kZSwgaSwgcHJlZGVjZXNzb3JzKSB7XG4gICAgaWYocHJlZGVjZXNzb3JzLmhhcyhub2RlKSkge1xuICAgICAgdmFyIG5vZGVSZXBcbiAgICAgIHRyeSB7XG4gICAgICAgIG5vZGVSZXAgPSBcIiwgbm9kZSB3YXM6XCIgKyBKU09OLnN0cmluZ2lmeShub2RlKVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIG5vZGVSZXAgPSBcIlwiXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N5Y2xpYyBkZXBlbmRlbmN5JyArIG5vZGVSZXApXG4gICAgfVxuXG4gICAgaWYgKCFub2Rlc0hhc2guaGFzKG5vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIHVua25vd24gbm9kZS4gTWFrZSBzdXJlIHRvIHByb3ZpZGVkIGFsbCBpbnZvbHZlZCBub2Rlcy4gVW5rbm93biBub2RlOiAnK0pTT04uc3RyaW5naWZ5KG5vZGUpKVxuICAgIH1cblxuICAgIGlmICh2aXNpdGVkW2ldKSByZXR1cm47XG4gICAgdmlzaXRlZFtpXSA9IHRydWVcblxuICAgIHZhciBvdXRnb2luZyA9IG91dGdvaW5nRWRnZXMuZ2V0KG5vZGUpIHx8IG5ldyBTZXQoKVxuICAgIG91dGdvaW5nID0gQXJyYXkuZnJvbShvdXRnb2luZylcblxuICAgIGlmIChpID0gb3V0Z29pbmcubGVuZ3RoKSB7XG4gICAgICBwcmVkZWNlc3NvcnMuYWRkKG5vZGUpXG4gICAgICBkbyB7XG4gICAgICAgIHZhciBjaGlsZCA9IG91dGdvaW5nWy0taV1cbiAgICAgICAgdmlzaXQoY2hpbGQsIG5vZGVzSGFzaC5nZXQoY2hpbGQpLCBwcmVkZWNlc3NvcnMpXG4gICAgICB9IHdoaWxlIChpKVxuICAgICAgcHJlZGVjZXNzb3JzLmRlbGV0ZShub2RlKVxuICAgIH1cblxuICAgIHNvcnRlZFstLWN1cnNvcl0gPSBub2RlXG4gIH1cbn1cblxuZnVuY3Rpb24gdW5pcXVlTm9kZXMoYXJyKXtcbiAgdmFyIHJlcyA9IG5ldyBTZXQoKVxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBhcnJbaV1cbiAgICByZXMuYWRkKGVkZ2VbMF0pXG4gICAgcmVzLmFkZChlZGdlWzFdKVxuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKHJlcylcbn1cblxuZnVuY3Rpb24gbWFrZU91dGdvaW5nRWRnZXMoYXJyKXtcbiAgdmFyIGVkZ2VzID0gbmV3IE1hcCgpXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgZWRnZSA9IGFycltpXVxuICAgIGlmICghZWRnZXMuaGFzKGVkZ2VbMF0pKSBlZGdlcy5zZXQoZWRnZVswXSwgbmV3IFNldCgpKVxuICAgIGlmICghZWRnZXMuaGFzKGVkZ2VbMV0pKSBlZGdlcy5zZXQoZWRnZVsxXSwgbmV3IFNldCgpKVxuICAgIGVkZ2VzLmdldChlZGdlWzBdKS5hZGQoZWRnZVsxXSlcbiAgfVxuICByZXR1cm4gZWRnZXNcbn1cblxuZnVuY3Rpb24gbWFrZU5vZGVzSGFzaChhcnIpe1xuICB2YXIgcmVzID0gbmV3IE1hcCgpXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICByZXMuc2V0KGFycltpXSwgaSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG4iLCJpbXBvcnQgaGFzIGZyb20gJ2xvZGFzaC9oYXMnO1xuaW1wb3J0IGlzU2NoZW1hIGZyb20gJy4vdXRpbC9pc1NjaGVtYSc7XG5cbmNsYXNzIENvbmRpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHJlZnMsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmZuID0gdm9pZCAwO1xuICAgIHRoaXMucmVmcyA9IHJlZnM7XG4gICAgdGhpcy5yZWZzID0gcmVmcztcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5mbiA9IG9wdGlvbnM7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFoYXMob3B0aW9ucywgJ2lzJykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BpczpgIGlzIHJlcXVpcmVkIGZvciBgd2hlbigpYCBjb25kaXRpb25zJyk7XG4gICAgaWYgKCFvcHRpb25zLnRoZW4gJiYgIW9wdGlvbnMub3RoZXJ3aXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdlaXRoZXIgYHRoZW46YCBvciBgb3RoZXJ3aXNlOmAgaXMgcmVxdWlyZWQgZm9yIGB3aGVuKClgIGNvbmRpdGlvbnMnKTtcbiAgICBsZXQge1xuICAgICAgaXMsXG4gICAgICB0aGVuLFxuICAgICAgb3RoZXJ3aXNlXG4gICAgfSA9IG9wdGlvbnM7XG4gICAgbGV0IGNoZWNrID0gdHlwZW9mIGlzID09PSAnZnVuY3Rpb24nID8gaXMgOiAoLi4udmFsdWVzKSA9PiB2YWx1ZXMuZXZlcnkodmFsdWUgPT4gdmFsdWUgPT09IGlzKTtcblxuICAgIHRoaXMuZm4gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgbGV0IG9wdGlvbnMgPSBhcmdzLnBvcCgpO1xuICAgICAgbGV0IHNjaGVtYSA9IGFyZ3MucG9wKCk7XG4gICAgICBsZXQgYnJhbmNoID0gY2hlY2soLi4uYXJncykgPyB0aGVuIDogb3RoZXJ3aXNlO1xuICAgICAgaWYgKCFicmFuY2gpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBpZiAodHlwZW9mIGJyYW5jaCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGJyYW5jaChzY2hlbWEpO1xuICAgICAgcmV0dXJuIHNjaGVtYS5jb25jYXQoYnJhbmNoLnJlc29sdmUob3B0aW9ucykpO1xuICAgIH07XG4gIH1cblxuICByZXNvbHZlKGJhc2UsIG9wdGlvbnMpIHtcbiAgICBsZXQgdmFsdWVzID0gdGhpcy5yZWZzLm1hcChyZWYgPT4gcmVmLmdldFZhbHVlKG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMudmFsdWUsIG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMucGFyZW50LCBvcHRpb25zID09IG51bGwgPyB2b2lkIDAgOiBvcHRpb25zLmNvbnRleHQpKTtcbiAgICBsZXQgc2NoZW1hID0gdGhpcy5mbi5hcHBseShiYXNlLCB2YWx1ZXMuY29uY2F0KGJhc2UsIG9wdGlvbnMpKTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQgfHwgc2NoZW1hID09PSBiYXNlKSByZXR1cm4gYmFzZTtcbiAgICBpZiAoIWlzU2NoZW1hKHNjaGVtYSkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbmRpdGlvbnMgbXVzdCByZXR1cm4gYSBzY2hlbWEgb2JqZWN0Jyk7XG4gICAgcmV0dXJuIHNjaGVtYS5yZXNvbHZlKG9wdGlvbnMpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uZGl0aW9uOyIsImltcG9ydCBpc1NjaGVtYSBmcm9tICcuL3V0aWwvaXNTY2hlbWEnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShidWlsZGVyKSB7XG4gIHJldHVybiBuZXcgTGF6eShidWlsZGVyKTtcbn1cblxuY2xhc3MgTGF6eSB7XG4gIGNvbnN0cnVjdG9yKGJ1aWxkZXIpIHtcbiAgICB0aGlzLnR5cGUgPSAnbGF6eSc7XG4gICAgdGhpcy5fX2lzWXVwU2NoZW1hX18gPSB0cnVlO1xuICAgIHRoaXMuX19pbnB1dFR5cGUgPSB2b2lkIDA7XG4gICAgdGhpcy5fX291dHB1dFR5cGUgPSB2b2lkIDA7XG5cbiAgICB0aGlzLl9yZXNvbHZlID0gKHZhbHVlLCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgIGxldCBzY2hlbWEgPSB0aGlzLmJ1aWxkZXIodmFsdWUsIG9wdGlvbnMpO1xuICAgICAgaWYgKCFpc1NjaGVtYShzY2hlbWEpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdsYXp5KCkgZnVuY3Rpb25zIG11c3QgcmV0dXJuIGEgdmFsaWQgc2NoZW1hJyk7XG4gICAgICByZXR1cm4gc2NoZW1hLnJlc29sdmUob3B0aW9ucyk7XG4gICAgfTtcblxuICAgIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XG4gIH1cblxuICByZXNvbHZlKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZShvcHRpb25zLnZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNhc3QodmFsdWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZSh2YWx1ZSwgb3B0aW9ucykuY2FzdCh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICB2YWxpZGF0ZSh2YWx1ZSwgb3B0aW9ucywgbWF5YmVDYikge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgbWlzc2luZyBwdWJsaWMgY2FsbGJhY2sgb24gdHlwZVxuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlKHZhbHVlLCBvcHRpb25zKS52YWxpZGF0ZSh2YWx1ZSwgb3B0aW9ucywgbWF5YmVDYik7XG4gIH1cblxuICB2YWxpZGF0ZVN5bmModmFsdWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZSh2YWx1ZSwgb3B0aW9ucykudmFsaWRhdGVTeW5jKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHZhbGlkYXRlQXQocGF0aCwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZSh2YWx1ZSwgb3B0aW9ucykudmFsaWRhdGVBdChwYXRoLCB2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICB2YWxpZGF0ZVN5bmNBdChwYXRoLCB2YWx1ZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlKHZhbHVlLCBvcHRpb25zKS52YWxpZGF0ZVN5bmNBdChwYXRoLCB2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBkZXNjcmliZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlzVmFsaWQodmFsdWUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZSh2YWx1ZSwgb3B0aW9ucykuaXNWYWxpZCh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBpc1ZhbGlkU3luYyh2YWx1ZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlKHZhbHVlLCBvcHRpb25zKS5pc1ZhbGlkU3luYyh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBMYXp5OyIsImltcG9ydCB7IGdldHRlciB9IGZyb20gJ3Byb3BlcnR5LWV4cHInO1xuY29uc3QgcHJlZml4ZXMgPSB7XG4gIGNvbnRleHQ6ICckJyxcbiAgdmFsdWU6ICcuJ1xufTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoa2V5LCBvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgUmVmZXJlbmNlKGtleSwgb3B0aW9ucyk7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWZlcmVuY2Uge1xuICBjb25zdHJ1Y3RvcihrZXksIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMua2V5ID0gdm9pZCAwO1xuICAgIHRoaXMuaXNDb250ZXh0ID0gdm9pZCAwO1xuICAgIHRoaXMuaXNWYWx1ZSA9IHZvaWQgMDtcbiAgICB0aGlzLmlzU2libGluZyA9IHZvaWQgMDtcbiAgICB0aGlzLnBhdGggPSB2b2lkIDA7XG4gICAgdGhpcy5nZXR0ZXIgPSB2b2lkIDA7XG4gICAgdGhpcy5tYXAgPSB2b2lkIDA7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWYgbXVzdCBiZSBhIHN0cmluZywgZ290OiAnICsga2V5KTtcbiAgICB0aGlzLmtleSA9IGtleS50cmltKCk7XG4gICAgaWYgKGtleSA9PT0gJycpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3JlZiBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuICAgIHRoaXMuaXNDb250ZXh0ID0gdGhpcy5rZXlbMF0gPT09IHByZWZpeGVzLmNvbnRleHQ7XG4gICAgdGhpcy5pc1ZhbHVlID0gdGhpcy5rZXlbMF0gPT09IHByZWZpeGVzLnZhbHVlO1xuICAgIHRoaXMuaXNTaWJsaW5nID0gIXRoaXMuaXNDb250ZXh0ICYmICF0aGlzLmlzVmFsdWU7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuaXNDb250ZXh0ID8gcHJlZml4ZXMuY29udGV4dCA6IHRoaXMuaXNWYWx1ZSA/IHByZWZpeGVzLnZhbHVlIDogJyc7XG4gICAgdGhpcy5wYXRoID0gdGhpcy5rZXkuc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gICAgdGhpcy5nZXR0ZXIgPSB0aGlzLnBhdGggJiYgZ2V0dGVyKHRoaXMucGF0aCwgdHJ1ZSk7XG4gICAgdGhpcy5tYXAgPSBvcHRpb25zLm1hcDtcbiAgfVxuXG4gIGdldFZhbHVlKHZhbHVlLCBwYXJlbnQsIGNvbnRleHQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5pc0NvbnRleHQgPyBjb250ZXh0IDogdGhpcy5pc1ZhbHVlID8gdmFsdWUgOiBwYXJlbnQ7XG4gICAgaWYgKHRoaXMuZ2V0dGVyKSByZXN1bHQgPSB0aGlzLmdldHRlcihyZXN1bHQgfHwge30pO1xuICAgIGlmICh0aGlzLm1hcCkgcmVzdWx0ID0gdGhpcy5tYXAocmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9ucy5jb250ZXh0XG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0aW9ucy5wYXJlbnRcbiAgICovXG5cblxuICBjYXN0KHZhbHVlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUodmFsdWUsIG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMucGFyZW50LCBvcHRpb25zID09IG51bGwgPyB2b2lkIDAgOiBvcHRpb25zLmNvbnRleHQpO1xuICB9XG5cbiAgcmVzb2x2ZSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlc2NyaWJlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncmVmJyxcbiAgICAgIGtleTogdGhpcy5rZXlcbiAgICB9O1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBSZWYoJHt0aGlzLmtleX0pYDtcbiAgfVxuXG4gIHN0YXRpYyBpc1JlZih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5fX2lzWXVwUmVmO1xuICB9XG5cbn0gLy8gQHRzLWlnbm9yZVxuXG5SZWZlcmVuY2UucHJvdG90eXBlLl9faXNZdXBSZWYgPSB0cnVlOyIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCBwcmludFZhbHVlIGZyb20gJy4vdXRpbC9wcmludFZhbHVlJztcbmltcG9ydCB0b0FycmF5IGZyb20gJy4vdXRpbC90b0FycmF5JztcbmxldCBzdHJSZWcgPSAvXFwkXFx7XFxzKihcXHcrKVxccypcXH0vZztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgc3RhdGljIGZvcm1hdEVycm9yKG1lc3NhZ2UsIHBhcmFtcykge1xuICAgIGNvbnN0IHBhdGggPSBwYXJhbXMubGFiZWwgfHwgcGFyYW1zLnBhdGggfHwgJ3RoaXMnO1xuICAgIGlmIChwYXRoICE9PSBwYXJhbXMucGF0aCkgcGFyYW1zID0gX2V4dGVuZHMoe30sIHBhcmFtcywge1xuICAgICAgcGF0aFxuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHJldHVybiBtZXNzYWdlLnJlcGxhY2Uoc3RyUmVnLCAoXywga2V5KSA9PiBwcmludFZhbHVlKHBhcmFtc1trZXldKSk7XG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnZnVuY3Rpb24nKSByZXR1cm4gbWVzc2FnZShwYXJhbXMpO1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG5cbiAgc3RhdGljIGlzRXJyb3IoZXJyKSB7XG4gICAgcmV0dXJuIGVyciAmJiBlcnIubmFtZSA9PT0gJ1ZhbGlkYXRpb25FcnJvcic7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlcnJvck9yRXJyb3JzLCB2YWx1ZSwgZmllbGQsIHR5cGUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSB2b2lkIDA7XG4gICAgdGhpcy5wYXRoID0gdm9pZCAwO1xuICAgIHRoaXMudHlwZSA9IHZvaWQgMDtcbiAgICB0aGlzLmVycm9ycyA9IHZvaWQgMDtcbiAgICB0aGlzLnBhcmFtcyA9IHZvaWQgMDtcbiAgICB0aGlzLmlubmVyID0gdm9pZCAwO1xuICAgIHRoaXMubmFtZSA9ICdWYWxpZGF0aW9uRXJyb3InO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnBhdGggPSBmaWVsZDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5pbm5lciA9IFtdO1xuICAgIHRvQXJyYXkoZXJyb3JPckVycm9ycykuZm9yRWFjaChlcnIgPT4ge1xuICAgICAgaWYgKFZhbGlkYXRpb25FcnJvci5pc0Vycm9yKGVycikpIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaCguLi5lcnIuZXJyb3JzKTtcbiAgICAgICAgdGhpcy5pbm5lciA9IHRoaXMuaW5uZXIuY29uY2F0KGVyci5pbm5lci5sZW5ndGggPyBlcnIuaW5uZXIgOiBlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEgPyBgJHt0aGlzLmVycm9ycy5sZW5ndGh9IGVycm9ycyBvY2N1cnJlZGAgOiB0aGlzLmVycm9yc1swXTtcbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIFZhbGlkYXRpb25FcnJvcik7XG4gIH1cblxufSIsImZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmltcG9ydCBpc0Fic2VudCBmcm9tICcuL3V0aWwvaXNBYnNlbnQnO1xuaW1wb3J0IGlzU2NoZW1hIGZyb20gJy4vdXRpbC9pc1NjaGVtYSc7XG5pbXBvcnQgcHJpbnRWYWx1ZSBmcm9tICcuL3V0aWwvcHJpbnRWYWx1ZSc7XG5pbXBvcnQgeyBhcnJheSBhcyBsb2NhbGUgfSBmcm9tICcuL2xvY2FsZSc7XG5pbXBvcnQgcnVuVGVzdHMgZnJvbSAnLi91dGlsL3J1blRlc3RzJztcbmltcG9ydCBWYWxpZGF0aW9uRXJyb3IgZnJvbSAnLi9WYWxpZGF0aW9uRXJyb3InO1xuaW1wb3J0IEJhc2VTY2hlbWEgZnJvbSAnLi9zY2hlbWEnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSh0eXBlKSB7XG4gIHJldHVybiBuZXcgQXJyYXlTY2hlbWEodHlwZSk7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnJheVNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgIH0pOyAvLyBgdW5kZWZpbmVkYCBzcGVjaWZpY2FsbHkgbWVhbnMgdW5pbml0aWFsaXplZCwgYXMgb3Bwb3NlZCB0b1xuICAgIC8vIFwibm8gc3VidHlwZVwiXG5cbiAgICB0aGlzLmlubmVyVHlwZSA9IHZvaWQgMDtcbiAgICB0aGlzLmlubmVyVHlwZSA9IHR5cGU7XG4gICAgdGhpcy53aXRoTXV0YXRpb24oKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0oZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ3N0cmluZycpIHRyeSB7XG4gICAgICAgICAgdmFsdWVzID0gSlNPTi5wYXJzZSh2YWx1ZXMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlzVHlwZSh2YWx1ZXMpID8gdmFsdWVzIDogbnVsbDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX3R5cGVDaGVjayh2KSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodik7XG4gIH1cblxuICBnZXQgX3N1YlR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJUeXBlO1xuICB9XG5cbiAgX2Nhc3QoX3ZhbHVlLCBfb3B0cykge1xuICAgIGNvbnN0IHZhbHVlID0gc3VwZXIuX2Nhc3QoX3ZhbHVlLCBfb3B0cyk7IC8vc2hvdWxkIGlnbm9yZSBudWxscyBoZXJlXG5cblxuICAgIGlmICghdGhpcy5fdHlwZUNoZWNrKHZhbHVlKSB8fCAhdGhpcy5pbm5lclR5cGUpIHJldHVybiB2YWx1ZTtcbiAgICBsZXQgaXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgY29uc3QgY2FzdEFycmF5ID0gdmFsdWUubWFwKCh2LCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IGNhc3RFbGVtZW50ID0gdGhpcy5pbm5lclR5cGUuY2FzdCh2LCBfZXh0ZW5kcyh7fSwgX29wdHMsIHtcbiAgICAgICAgcGF0aDogYCR7X29wdHMucGF0aCB8fCAnJ31bJHtpZHh9XWBcbiAgICAgIH0pKTtcblxuICAgICAgaWYgKGNhc3RFbGVtZW50ICE9PSB2KSB7XG4gICAgICAgIGlzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYXN0RWxlbWVudDtcbiAgICB9KTtcbiAgICByZXR1cm4gaXNDaGFuZ2VkID8gY2FzdEFycmF5IDogdmFsdWU7XG4gIH1cblxuICBfdmFsaWRhdGUoX3ZhbHVlLCBvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gICAgdmFyIF9vcHRpb25zJGFib3J0RWFybHksIF9vcHRpb25zJHJlY3Vyc2l2ZTtcblxuICAgIGxldCBlcnJvcnMgPSBbXTtcbiAgICBsZXQgc3luYyA9IG9wdGlvbnMuc3luYztcbiAgICBsZXQgcGF0aCA9IG9wdGlvbnMucGF0aDtcbiAgICBsZXQgaW5uZXJUeXBlID0gdGhpcy5pbm5lclR5cGU7XG4gICAgbGV0IGVuZEVhcmx5ID0gKF9vcHRpb25zJGFib3J0RWFybHkgPSBvcHRpb25zLmFib3J0RWFybHkpICE9IG51bGwgPyBfb3B0aW9ucyRhYm9ydEVhcmx5IDogdGhpcy5zcGVjLmFib3J0RWFybHk7XG4gICAgbGV0IHJlY3Vyc2l2ZSA9IChfb3B0aW9ucyRyZWN1cnNpdmUgPSBvcHRpb25zLnJlY3Vyc2l2ZSkgIT0gbnVsbCA/IF9vcHRpb25zJHJlY3Vyc2l2ZSA6IHRoaXMuc3BlYy5yZWN1cnNpdmU7XG4gICAgbGV0IG9yaWdpbmFsVmFsdWUgPSBvcHRpb25zLm9yaWdpbmFsVmFsdWUgIT0gbnVsbCA/IG9wdGlvbnMub3JpZ2luYWxWYWx1ZSA6IF92YWx1ZTtcblxuICAgIHN1cGVyLl92YWxpZGF0ZShfdmFsdWUsIG9wdGlvbnMsIChlcnIsIHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGlmICghVmFsaWRhdGlvbkVycm9yLmlzRXJyb3IoZXJyKSB8fCBlbmRFYXJseSkge1xuICAgICAgICAgIHJldHVybiB2b2lkIGNhbGxiYWNrKGVyciwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFyZWN1cnNpdmUgfHwgIWlubmVyVHlwZSB8fCAhdGhpcy5fdHlwZUNoZWNrKHZhbHVlKSkge1xuICAgICAgICBjYWxsYmFjayhlcnJvcnNbMF0gfHwgbnVsbCwgdmFsdWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9yaWdpbmFsVmFsdWUgPSBvcmlnaW5hbFZhbHVlIHx8IHZhbHVlOyAvLyAjOTUwIEVuc3VyZSB0aGF0IHNwYXJzZSBhcnJheSBlbXB0eSBzbG90cyBhcmUgdmFsaWRhdGVkXG5cbiAgICAgIGxldCB0ZXN0cyA9IG5ldyBBcnJheSh2YWx1ZS5sZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB2YWx1ZS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGxldCBpdGVtID0gdmFsdWVbaWR4XTtcbiAgICAgICAgbGV0IHBhdGggPSBgJHtvcHRpb25zLnBhdGggfHwgJyd9WyR7aWR4fV1gOyAvLyBvYmplY3QuX3ZhbGlkYXRlIG5vdGUgZm9yIGlzU3RyaWN0IGV4cGxhbmF0aW9uXG5cbiAgICAgICAgbGV0IGlubmVyT3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zLCB7XG4gICAgICAgICAgcGF0aCxcbiAgICAgICAgICBzdHJpY3Q6IHRydWUsXG4gICAgICAgICAgcGFyZW50OiB2YWx1ZSxcbiAgICAgICAgICBpbmRleDogaWR4LFxuICAgICAgICAgIG9yaWdpbmFsVmFsdWU6IG9yaWdpbmFsVmFsdWVbaWR4XVxuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0c1tpZHhdID0gKF8sIGNiKSA9PiBpbm5lclR5cGUudmFsaWRhdGUoaXRlbSwgaW5uZXJPcHRpb25zLCBjYik7XG4gICAgICB9XG5cbiAgICAgIHJ1blRlc3RzKHtcbiAgICAgICAgc3luYyxcbiAgICAgICAgcGF0aCxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGVycm9ycyxcbiAgICAgICAgZW5kRWFybHksXG4gICAgICAgIHRlc3RzXG4gICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICBjbG9uZShzcGVjKSB7XG4gICAgY29uc3QgbmV4dCA9IHN1cGVyLmNsb25lKHNwZWMpO1xuICAgIG5leHQuaW5uZXJUeXBlID0gdGhpcy5pbm5lclR5cGU7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBjb25jYXQoc2NoZW1hKSB7XG4gICAgbGV0IG5leHQgPSBzdXBlci5jb25jYXQoc2NoZW1hKTtcbiAgICBuZXh0LmlubmVyVHlwZSA9IHRoaXMuaW5uZXJUeXBlO1xuICAgIGlmIChzY2hlbWEuaW5uZXJUeXBlKSBuZXh0LmlubmVyVHlwZSA9IG5leHQuaW5uZXJUeXBlID8gLy8gQHRzLWV4cGVjdC1lcnJvciBMYXp5IGRvZXNuJ3QgaGF2ZSBjb25jYXQoKVxuICAgIG5leHQuaW5uZXJUeXBlLmNvbmNhdChzY2hlbWEuaW5uZXJUeXBlKSA6IHNjaGVtYS5pbm5lclR5cGU7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBvZihzY2hlbWEpIHtcbiAgICAvLyBGSVhNRTogdGhpcyBzaG91bGQgcmV0dXJuIGEgbmV3IGluc3RhbmNlIG9mIGFycmF5IHdpdGhvdXQgdGhlIGRlZmF1bHQgdG8gYmVcbiAgICBsZXQgbmV4dCA9IHRoaXMuY2xvbmUoKTtcbiAgICBpZiAoIWlzU2NoZW1hKHNjaGVtYSkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BhcnJheS5vZigpYCBzdWItc2NoZW1hIG11c3QgYmUgYSB2YWxpZCB5dXAgc2NoZW1hIG5vdDogJyArIHByaW50VmFsdWUoc2NoZW1hKSk7IC8vIEZJWE1FKHRzKTpcblxuICAgIG5leHQuaW5uZXJUeXBlID0gc2NoZW1hO1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgbGVuZ3RoKGxlbmd0aCwgbWVzc2FnZSA9IGxvY2FsZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbGVuZ3RoJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBsZW5ndGhcbiAgICAgIH0sXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPT09IHRoaXMucmVzb2x2ZShsZW5ndGgpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBtaW4obWluLCBtZXNzYWdlKSB7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgbG9jYWxlLm1pbjtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWluJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtaW5cbiAgICAgIH0sXG5cbiAgICAgIC8vIEZJWE1FKHRzKTogQXJyYXk8dHlwZW9mIFQ+XG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoID49IHRoaXMucmVzb2x2ZShtaW4pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBtYXgobWF4LCBtZXNzYWdlKSB7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgbG9jYWxlLm1heDtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWF4JyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtYXhcbiAgICAgIH0sXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPD0gdGhpcy5yZXNvbHZlKG1heCk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIGVuc3VyZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0KCgpID0+IFtdKS50cmFuc2Zvcm0oKHZhbCwgb3JpZ2luYWwpID0+IHtcbiAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gcmV0dXJuIGBudWxsYCBmb3IgbnVsbGFibGUgc2NoZW1hXG4gICAgICBpZiAodGhpcy5fdHlwZUNoZWNrKHZhbCkpIHJldHVybiB2YWw7XG4gICAgICByZXR1cm4gb3JpZ2luYWwgPT0gbnVsbCA/IFtdIDogW10uY29uY2F0KG9yaWdpbmFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbXBhY3QocmVqZWN0b3IpIHtcbiAgICBsZXQgcmVqZWN0ID0gIXJlamVjdG9yID8gdiA9PiAhIXYgOiAodiwgaSwgYSkgPT4gIXJlamVjdG9yKHYsIGksIGEpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh2YWx1ZXMgPT4gdmFsdWVzICE9IG51bGwgPyB2YWx1ZXMuZmlsdGVyKHJlamVjdCkgOiB2YWx1ZXMpO1xuICB9XG5cbiAgZGVzY3JpYmUoKSB7XG4gICAgbGV0IGJhc2UgPSBzdXBlci5kZXNjcmliZSgpO1xuICAgIGlmICh0aGlzLmlubmVyVHlwZSkgYmFzZS5pbm5lclR5cGUgPSB0aGlzLmlubmVyVHlwZS5kZXNjcmliZSgpO1xuICAgIHJldHVybiBiYXNlO1xuICB9XG5cbiAgbnVsbGFibGUoaXNOdWxsYWJsZSA9IHRydWUpIHtcbiAgICByZXR1cm4gc3VwZXIubnVsbGFibGUoaXNOdWxsYWJsZSk7XG4gIH1cblxuICBkZWZpbmVkKCkge1xuICAgIHJldHVybiBzdXBlci5kZWZpbmVkKCk7XG4gIH1cblxuICByZXF1aXJlZChtc2cpIHtcbiAgICByZXR1cm4gc3VwZXIucmVxdWlyZWQobXNnKTtcbiAgfVxuXG59XG5jcmVhdGUucHJvdG90eXBlID0gQXJyYXlTY2hlbWEucHJvdG90eXBlOyAvL1xuLy8gSW50ZXJmYWNlc1xuLy8iLCJpbXBvcnQgQmFzZVNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5pbXBvcnQgeyBib29sZWFuIGFzIGxvY2FsZSB9IGZyb20gJy4vbG9jYWxlJztcbmltcG9ydCBpc0Fic2VudCBmcm9tICcuL3V0aWwvaXNBYnNlbnQnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgcmV0dXJuIG5ldyBCb29sZWFuU2NoZW1hKCk7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb29sZWFuU2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0pO1xuICAgIHRoaXMud2l0aE11dGF0aW9uKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmb3JtKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNUeXBlKHZhbHVlKSkge1xuICAgICAgICAgIGlmICgvXih0cnVlfDEpJC9pLnRlc3QoU3RyaW5nKHZhbHVlKSkpIHJldHVybiB0cnVlO1xuICAgICAgICAgIGlmICgvXihmYWxzZXwwKSQvaS50ZXN0KFN0cmluZyh2YWx1ZSkpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIF90eXBlQ2hlY2sodikge1xuICAgIGlmICh2IGluc3RhbmNlb2YgQm9vbGVhbikgdiA9IHYudmFsdWVPZigpO1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nO1xuICB9XG5cbiAgaXNUcnVlKG1lc3NhZ2UgPSBsb2NhbGUuaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRlc3Qoe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICdpcy12YWx1ZScsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6ICd0cnVlJ1xuICAgICAgfSxcblxuICAgICAgdGVzdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNBYnNlbnQodmFsdWUpIHx8IHZhbHVlID09PSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBpc0ZhbHNlKG1lc3NhZ2UgPSBsb2NhbGUuaXNWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRlc3Qoe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICdpcy12YWx1ZScsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6ICdmYWxzZSdcbiAgICAgIH0sXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG59XG5jcmVhdGUucHJvdG90eXBlID0gQm9vbGVhblNjaGVtYS5wcm90b3R5cGU7IiwiLy8gQHRzLWlnbm9yZVxuaW1wb3J0IGlzb1BhcnNlIGZyb20gJy4vdXRpbC9pc29kYXRlJztcbmltcG9ydCB7IGRhdGUgYXMgbG9jYWxlIH0gZnJvbSAnLi9sb2NhbGUnO1xuaW1wb3J0IGlzQWJzZW50IGZyb20gJy4vdXRpbC9pc0Fic2VudCc7XG5pbXBvcnQgUmVmIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBCYXNlU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcbmxldCBpbnZhbGlkRGF0ZSA9IG5ldyBEYXRlKCcnKTtcblxubGV0IGlzRGF0ZSA9IG9iaiA9PiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKCkge1xuICByZXR1cm4gbmV3IERhdGVTY2hlbWEoKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGVTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdHlwZTogJ2RhdGUnXG4gICAgfSk7XG4gICAgdGhpcy53aXRoTXV0YXRpb24oKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHlwZSh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICAgICAgdmFsdWUgPSBpc29QYXJzZSh2YWx1ZSk7IC8vIDAgaXMgYSB2YWxpZCB0aW1lc3RhbXAgZXF1aXZhbGVudCB0byAxOTcwLTAxLTAxVDAwOjAwOjAwWih1bml4IGVwb2NoKSBvciBiZWZvcmUuXG5cbiAgICAgICAgcmV0dXJuICFpc05hTih2YWx1ZSkgPyBuZXcgRGF0ZSh2YWx1ZSkgOiBpbnZhbGlkRGF0ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX3R5cGVDaGVjayh2KSB7XG4gICAgcmV0dXJuIGlzRGF0ZSh2KSAmJiAhaXNOYU4odi5nZXRUaW1lKCkpO1xuICB9XG5cbiAgcHJlcGFyZVBhcmFtKHJlZiwgbmFtZSkge1xuICAgIGxldCBwYXJhbTtcblxuICAgIGlmICghUmVmLmlzUmVmKHJlZikpIHtcbiAgICAgIGxldCBjYXN0ID0gdGhpcy5jYXN0KHJlZik7XG4gICAgICBpZiAoIXRoaXMuX3R5cGVDaGVjayhjYXN0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcihgXFxgJHtuYW1lfVxcYCBtdXN0IGJlIGEgRGF0ZSBvciBhIHZhbHVlIHRoYXQgY2FuIGJlIFxcYGNhc3QoKVxcYCB0byBhIERhdGVgKTtcbiAgICAgIHBhcmFtID0gY2FzdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyYW0gPSByZWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9XG5cbiAgbWluKG1pbiwgbWVzc2FnZSA9IGxvY2FsZS5taW4pIHtcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByZXBhcmVQYXJhbShtaW4sICdtaW4nKTtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWluJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtaW5cbiAgICAgIH0sXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZSA+PSB0aGlzLnJlc29sdmUobGltaXQpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBtYXgobWF4LCBtZXNzYWdlID0gbG9jYWxlLm1heCkge1xuICAgIGxldCBsaW1pdCA9IHRoaXMucHJlcGFyZVBhcmFtKG1heCwgJ21heCcpO1xuICAgIHJldHVybiB0aGlzLnRlc3Qoe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICdtYXgnLFxuICAgICAgZXhjbHVzaXZlOiB0cnVlLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIG1heFxuICAgICAgfSxcblxuICAgICAgdGVzdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNBYnNlbnQodmFsdWUpIHx8IHZhbHVlIDw9IHRoaXMucmVzb2x2ZShsaW1pdCk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG59XG5EYXRlU2NoZW1hLklOVkFMSURfREFURSA9IGludmFsaWREYXRlO1xuY3JlYXRlLnByb3RvdHlwZSA9IERhdGVTY2hlbWEucHJvdG90eXBlO1xuY3JlYXRlLklOVkFMSURfREFURSA9IGludmFsaWREYXRlOyIsImltcG9ydCBNaXhlZFNjaGVtYSwgeyBjcmVhdGUgYXMgbWl4ZWRDcmVhdGUgfSBmcm9tICcuL21peGVkJztcbmltcG9ydCBCb29sZWFuU2NoZW1hLCB7IGNyZWF0ZSBhcyBib29sQ3JlYXRlIH0gZnJvbSAnLi9ib29sZWFuJztcbmltcG9ydCBTdHJpbmdTY2hlbWEsIHsgY3JlYXRlIGFzIHN0cmluZ0NyZWF0ZSB9IGZyb20gJy4vc3RyaW5nJztcbmltcG9ydCBOdW1iZXJTY2hlbWEsIHsgY3JlYXRlIGFzIG51bWJlckNyZWF0ZSB9IGZyb20gJy4vbnVtYmVyJztcbmltcG9ydCBEYXRlU2NoZW1hLCB7IGNyZWF0ZSBhcyBkYXRlQ3JlYXRlIH0gZnJvbSAnLi9kYXRlJztcbmltcG9ydCBPYmplY3RTY2hlbWEsIHsgY3JlYXRlIGFzIG9iamVjdENyZWF0ZSB9IGZyb20gJy4vb2JqZWN0JztcbmltcG9ydCBBcnJheVNjaGVtYSwgeyBjcmVhdGUgYXMgYXJyYXlDcmVhdGUgfSBmcm9tICcuL2FycmF5JztcbmltcG9ydCB7IGNyZWF0ZSBhcyByZWZDcmVhdGUgfSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgeyBjcmVhdGUgYXMgbGF6eUNyZWF0ZSB9IGZyb20gJy4vTGF6eSc7XG5pbXBvcnQgVmFsaWRhdGlvbkVycm9yIGZyb20gJy4vVmFsaWRhdGlvbkVycm9yJztcbmltcG9ydCByZWFjaCBmcm9tICcuL3V0aWwvcmVhY2gnO1xuaW1wb3J0IGlzU2NoZW1hIGZyb20gJy4vdXRpbC9pc1NjaGVtYSc7XG5pbXBvcnQgc2V0TG9jYWxlIGZyb20gJy4vc2V0TG9jYWxlJztcbmltcG9ydCBCYXNlU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcblxuZnVuY3Rpb24gYWRkTWV0aG9kKHNjaGVtYVR5cGUsIG5hbWUsIGZuKSB7XG4gIGlmICghc2NoZW1hVHlwZSB8fCAhaXNTY2hlbWEoc2NoZW1hVHlwZS5wcm90b3R5cGUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwcm92aWRlIGEgeXVwIHNjaGVtYSBjb25zdHJ1Y3RvciBmdW5jdGlvbicpO1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIE1ldGhvZCBuYW1lIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0aG9kIGZ1bmN0aW9uIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgc2NoZW1hVHlwZS5wcm90b3R5cGVbbmFtZV0gPSBmbjtcbn1cblxuZXhwb3J0IHsgbWl4ZWRDcmVhdGUgYXMgbWl4ZWQsIGJvb2xDcmVhdGUgYXMgYm9vbCwgYm9vbENyZWF0ZSBhcyBib29sZWFuLCBzdHJpbmdDcmVhdGUgYXMgc3RyaW5nLCBudW1iZXJDcmVhdGUgYXMgbnVtYmVyLCBkYXRlQ3JlYXRlIGFzIGRhdGUsIG9iamVjdENyZWF0ZSBhcyBvYmplY3QsIGFycmF5Q3JlYXRlIGFzIGFycmF5LCByZWZDcmVhdGUgYXMgcmVmLCBsYXp5Q3JlYXRlIGFzIGxhenksIHJlYWNoLCBpc1NjaGVtYSwgYWRkTWV0aG9kLCBzZXRMb2NhbGUsIFZhbGlkYXRpb25FcnJvciB9O1xuZXhwb3J0IHsgQmFzZVNjaGVtYSwgTWl4ZWRTY2hlbWEsIEJvb2xlYW5TY2hlbWEsIFN0cmluZ1NjaGVtYSwgTnVtYmVyU2NoZW1hLCBEYXRlU2NoZW1hLCBPYmplY3RTY2hlbWEsIEFycmF5U2NoZW1hIH07IiwiaW1wb3J0IHByaW50VmFsdWUgZnJvbSAnLi91dGlsL3ByaW50VmFsdWUnO1xuZXhwb3J0IGxldCBtaXhlZCA9IHtcbiAgZGVmYXVsdDogJyR7cGF0aH0gaXMgaW52YWxpZCcsXG4gIHJlcXVpcmVkOiAnJHtwYXRofSBpcyBhIHJlcXVpcmVkIGZpZWxkJyxcbiAgb25lT2Y6ICcke3BhdGh9IG11c3QgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiAke3ZhbHVlc30nLFxuICBub3RPbmVPZjogJyR7cGF0aH0gbXVzdCBub3QgYmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOiAke3ZhbHVlc30nLFxuICBub3RUeXBlOiAoe1xuICAgIHBhdGgsXG4gICAgdHlwZSxcbiAgICB2YWx1ZSxcbiAgICBvcmlnaW5hbFZhbHVlXG4gIH0pID0+IHtcbiAgICBsZXQgaXNDYXN0ID0gb3JpZ2luYWxWYWx1ZSAhPSBudWxsICYmIG9yaWdpbmFsVmFsdWUgIT09IHZhbHVlO1xuICAgIGxldCBtc2cgPSBgJHtwYXRofSBtdXN0IGJlIGEgXFxgJHt0eXBlfVxcYCB0eXBlLCBgICsgYGJ1dCB0aGUgZmluYWwgdmFsdWUgd2FzOiBcXGAke3ByaW50VmFsdWUodmFsdWUsIHRydWUpfVxcYGAgKyAoaXNDYXN0ID8gYCAoY2FzdCBmcm9tIHRoZSB2YWx1ZSBcXGAke3ByaW50VmFsdWUob3JpZ2luYWxWYWx1ZSwgdHJ1ZSl9XFxgKS5gIDogJy4nKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgbXNnICs9IGBcXG4gSWYgXCJudWxsXCIgaXMgaW50ZW5kZWQgYXMgYW4gZW1wdHkgdmFsdWUgYmUgc3VyZSB0byBtYXJrIHRoZSBzY2hlbWEgYXMgXFxgLm51bGxhYmxlKClcXGBgO1xuICAgIH1cblxuICAgIHJldHVybiBtc2c7XG4gIH0sXG4gIGRlZmluZWQ6ICcke3BhdGh9IG11c3QgYmUgZGVmaW5lZCdcbn07XG5leHBvcnQgbGV0IHN0cmluZyA9IHtcbiAgbGVuZ3RoOiAnJHtwYXRofSBtdXN0IGJlIGV4YWN0bHkgJHtsZW5ndGh9IGNoYXJhY3RlcnMnLFxuICBtaW46ICcke3BhdGh9IG11c3QgYmUgYXQgbGVhc3QgJHttaW59IGNoYXJhY3RlcnMnLFxuICBtYXg6ICcke3BhdGh9IG11c3QgYmUgYXQgbW9zdCAke21heH0gY2hhcmFjdGVycycsXG4gIG1hdGNoZXM6ICcke3BhdGh9IG11c3QgbWF0Y2ggdGhlIGZvbGxvd2luZzogXCIke3JlZ2V4fVwiJyxcbiAgZW1haWw6ICcke3BhdGh9IG11c3QgYmUgYSB2YWxpZCBlbWFpbCcsXG4gIHVybDogJyR7cGF0aH0gbXVzdCBiZSBhIHZhbGlkIFVSTCcsXG4gIHV1aWQ6ICcke3BhdGh9IG11c3QgYmUgYSB2YWxpZCBVVUlEJyxcbiAgdHJpbTogJyR7cGF0aH0gbXVzdCBiZSBhIHRyaW1tZWQgc3RyaW5nJyxcbiAgbG93ZXJjYXNlOiAnJHtwYXRofSBtdXN0IGJlIGEgbG93ZXJjYXNlIHN0cmluZycsXG4gIHVwcGVyY2FzZTogJyR7cGF0aH0gbXVzdCBiZSBhIHVwcGVyIGNhc2Ugc3RyaW5nJ1xufTtcbmV4cG9ydCBsZXQgbnVtYmVyID0ge1xuICBtaW46ICcke3BhdGh9IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7bWlufScsXG4gIG1heDogJyR7cGF0aH0gbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gJHttYXh9JyxcbiAgbGVzc1RoYW46ICcke3BhdGh9IG11c3QgYmUgbGVzcyB0aGFuICR7bGVzc30nLFxuICBtb3JlVGhhbjogJyR7cGF0aH0gbXVzdCBiZSBncmVhdGVyIHRoYW4gJHttb3JlfScsXG4gIHBvc2l0aXZlOiAnJHtwYXRofSBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyxcbiAgbmVnYXRpdmU6ICcke3BhdGh9IG11c3QgYmUgYSBuZWdhdGl2ZSBudW1iZXInLFxuICBpbnRlZ2VyOiAnJHtwYXRofSBtdXN0IGJlIGFuIGludGVnZXInXG59O1xuZXhwb3J0IGxldCBkYXRlID0ge1xuICBtaW46ICcke3BhdGh9IGZpZWxkIG11c3QgYmUgbGF0ZXIgdGhhbiAke21pbn0nLFxuICBtYXg6ICcke3BhdGh9IGZpZWxkIG11c3QgYmUgYXQgZWFybGllciB0aGFuICR7bWF4fSdcbn07XG5leHBvcnQgbGV0IGJvb2xlYW4gPSB7XG4gIGlzVmFsdWU6ICcke3BhdGh9IGZpZWxkIG11c3QgYmUgJHt2YWx1ZX0nXG59O1xuZXhwb3J0IGxldCBvYmplY3QgPSB7XG4gIG5vVW5rbm93bjogJyR7cGF0aH0gZmllbGQgaGFzIHVuc3BlY2lmaWVkIGtleXM6ICR7dW5rbm93bn0nXG59O1xuZXhwb3J0IGxldCBhcnJheSA9IHtcbiAgbWluOiAnJHtwYXRofSBmaWVsZCBtdXN0IGhhdmUgYXQgbGVhc3QgJHttaW59IGl0ZW1zJyxcbiAgbWF4OiAnJHtwYXRofSBmaWVsZCBtdXN0IGhhdmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7bWF4fSBpdGVtcycsXG4gIGxlbmd0aDogJyR7cGF0aH0gbXVzdCBoYXZlICR7bGVuZ3RofSBpdGVtcydcbn07XG5leHBvcnQgZGVmYXVsdCBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHtcbiAgbWl4ZWQsXG4gIHN0cmluZyxcbiAgbnVtYmVyLFxuICBkYXRlLFxuICBvYmplY3QsXG4gIGFycmF5LFxuICBib29sZWFuXG59KTsiLCJpbXBvcnQgQmFzZVNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5jb25zdCBNaXhlZCA9IEJhc2VTY2hlbWE7XG5leHBvcnQgZGVmYXVsdCBNaXhlZDtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoKSB7XG4gIHJldHVybiBuZXcgTWl4ZWQoKTtcbn0gLy8gWFhYOiB0aGlzIGlzIHVzaW5nIHRoZSBCYXNlIHNjaGVtYSBzbyB0aGF0IGBhZGRNZXRob2QobWl4ZWQpYCB3b3JrcyBhcyBhIGJhc2UgY2xhc3NcblxuY3JlYXRlLnByb3RvdHlwZSA9IE1peGVkLnByb3RvdHlwZTsiLCJpbXBvcnQgeyBudW1iZXIgYXMgbG9jYWxlIH0gZnJvbSAnLi9sb2NhbGUnO1xuaW1wb3J0IGlzQWJzZW50IGZyb20gJy4vdXRpbC9pc0Fic2VudCc7XG5pbXBvcnQgQmFzZVNjaGVtYSBmcm9tICcuL3NjaGVtYSc7XG5cbmxldCBpc05hTiA9IHZhbHVlID0+IHZhbHVlICE9ICt2YWx1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgcmV0dXJuIG5ldyBOdW1iZXJTY2hlbWEoKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE51bWJlclNjaGVtYSBleHRlbmRzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgIH0pO1xuICAgIHRoaXMud2l0aE11dGF0aW9uKCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNmb3JtKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBsZXQgcGFyc2VkID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBwYXJzZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcGFyc2VkID0gcGFyc2VkLnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAgICAgICAgaWYgKHBhcnNlZCA9PT0gJycpIHJldHVybiBOYU47IC8vIGRvbid0IHVzZSBwYXJzZUZsb2F0IHRvIGF2b2lkIHBvc2l0aXZlcyBvbiBhbHBoYS1udW1lcmljIHN0cmluZ3NcblxuICAgICAgICAgIHBhcnNlZCA9ICtwYXJzZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1R5cGUocGFyc2VkKSkgcmV0dXJuIHBhcnNlZDtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQocGFyc2VkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX3R5cGVDaGVjayh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE51bWJlcikgdmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKTtcbiAgfVxuXG4gIG1pbihtaW4sIG1lc3NhZ2UgPSBsb2NhbGUubWluKSB7XG4gICAgcmV0dXJuIHRoaXMudGVzdCh7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbmFtZTogJ21pbicsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbWluXG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPj0gdGhpcy5yZXNvbHZlKG1pbik7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIG1heChtYXgsIG1lc3NhZ2UgPSBsb2NhbGUubWF4KSB7XG4gICAgcmV0dXJuIHRoaXMudGVzdCh7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbmFtZTogJ21heCcsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbWF4XG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPD0gdGhpcy5yZXNvbHZlKG1heCk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIGxlc3NUaGFuKGxlc3MsIG1lc3NhZ2UgPSBsb2NhbGUubGVzc1RoYW4pIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWF4JyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBsZXNzXG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPCB0aGlzLnJlc29sdmUobGVzcyk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIG1vcmVUaGFuKG1vcmUsIG1lc3NhZ2UgPSBsb2NhbGUubW9yZVRoYW4pIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWluJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtb3JlXG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPiB0aGlzLnJlc29sdmUobW9yZSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIHBvc2l0aXZlKG1zZyA9IGxvY2FsZS5wb3NpdGl2ZSkge1xuICAgIHJldHVybiB0aGlzLm1vcmVUaGFuKDAsIG1zZyk7XG4gIH1cblxuICBuZWdhdGl2ZShtc2cgPSBsb2NhbGUubmVnYXRpdmUpIHtcbiAgICByZXR1cm4gdGhpcy5sZXNzVGhhbigwLCBtc2cpO1xuICB9XG5cbiAgaW50ZWdlcihtZXNzYWdlID0gbG9jYWxlLmludGVnZXIpIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG5hbWU6ICdpbnRlZ2VyJyxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICB0ZXN0OiB2YWwgPT4gaXNBYnNlbnQodmFsKSB8fCBOdW1iZXIuaXNJbnRlZ2VyKHZhbClcbiAgICB9KTtcbiAgfVxuXG4gIHRydW5jYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh2YWx1ZSA9PiAhaXNBYnNlbnQodmFsdWUpID8gdmFsdWUgfCAwIDogdmFsdWUpO1xuICB9XG5cbiAgcm91bmQobWV0aG9kKSB7XG4gICAgdmFyIF9tZXRob2Q7XG5cbiAgICBsZXQgYXZhaWwgPSBbJ2NlaWwnLCAnZmxvb3InLCAncm91bmQnLCAndHJ1bmMnXTtcbiAgICBtZXRob2QgPSAoKF9tZXRob2QgPSBtZXRob2QpID09IG51bGwgPyB2b2lkIDAgOiBfbWV0aG9kLnRvTG93ZXJDYXNlKCkpIHx8ICdyb3VuZCc7IC8vIHRoaXMgZXhpc3RzIGZvciBzeW1lbXRyeSB3aXRoIHRoZSBuZXcgTWF0aC50cnVuY1xuXG4gICAgaWYgKG1ldGhvZCA9PT0gJ3RydW5jJykgcmV0dXJuIHRoaXMudHJ1bmNhdGUoKTtcbiAgICBpZiAoYXZhaWwuaW5kZXhPZihtZXRob2QudG9Mb3dlckNhc2UoKSkgPT09IC0xKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdPbmx5IHZhbGlkIG9wdGlvbnMgZm9yIHJvdW5kKCkgYXJlOiAnICsgYXZhaWwuam9pbignLCAnKSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHZhbHVlID0+ICFpc0Fic2VudCh2YWx1ZSkgPyBNYXRoW21ldGhvZF0odmFsdWUpIDogdmFsdWUpO1xuICB9XG5cbn1cbmNyZWF0ZS5wcm90b3R5cGUgPSBOdW1iZXJTY2hlbWEucHJvdG90eXBlOyAvL1xuLy8gTnVtYmVyIEludGVyZmFjZXNcbi8vIiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IGhhcyBmcm9tICdsb2Rhc2gvaGFzJztcbmltcG9ydCBzbmFrZUNhc2UgZnJvbSAnbG9kYXNoL3NuYWtlQ2FzZSc7XG5pbXBvcnQgY2FtZWxDYXNlIGZyb20gJ2xvZGFzaC9jYW1lbENhc2UnO1xuaW1wb3J0IG1hcEtleXMgZnJvbSAnbG9kYXNoL21hcEtleXMnO1xuaW1wb3J0IG1hcFZhbHVlcyBmcm9tICdsb2Rhc2gvbWFwVmFsdWVzJztcbmltcG9ydCB7IGdldHRlciB9IGZyb20gJ3Byb3BlcnR5LWV4cHInO1xuaW1wb3J0IHsgb2JqZWN0IGFzIGxvY2FsZSB9IGZyb20gJy4vbG9jYWxlJztcbmltcG9ydCBzb3J0RmllbGRzIGZyb20gJy4vdXRpbC9zb3J0RmllbGRzJztcbmltcG9ydCBzb3J0QnlLZXlPcmRlciBmcm9tICcuL3V0aWwvc29ydEJ5S2V5T3JkZXInO1xuaW1wb3J0IHJ1blRlc3RzIGZyb20gJy4vdXRpbC9ydW5UZXN0cyc7XG5pbXBvcnQgVmFsaWRhdGlvbkVycm9yIGZyb20gJy4vVmFsaWRhdGlvbkVycm9yJztcbmltcG9ydCBCYXNlU2NoZW1hIGZyb20gJy4vc2NoZW1hJztcblxubGV0IGlzT2JqZWN0ID0gb2JqID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gdW5rbm93bihjdHgsIHZhbHVlKSB7XG4gIGxldCBrbm93biA9IE9iamVjdC5rZXlzKGN0eC5maWVsZHMpO1xuICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpLmZpbHRlcihrZXkgPT4ga25vd24uaW5kZXhPZihrZXkpID09PSAtMSk7XG59XG5cbmNvbnN0IGRlZmF1bHRTb3J0ID0gc29ydEJ5S2V5T3JkZXIoW10pO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JqZWN0U2NoZW1hIGV4dGVuZHMgQmFzZVNjaGVtYSB7XG4gIGNvbnN0cnVjdG9yKHNwZWMpIHtcbiAgICBzdXBlcih7XG4gICAgICB0eXBlOiAnb2JqZWN0J1xuICAgIH0pO1xuICAgIHRoaXMuZmllbGRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9zb3J0RXJyb3JzID0gZGVmYXVsdFNvcnQ7XG4gICAgdGhpcy5fbm9kZXMgPSBbXTtcbiAgICB0aGlzLl9leGNsdWRlZEVkZ2VzID0gW107XG4gICAgdGhpcy53aXRoTXV0YXRpb24oKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2Zvcm0oZnVuY3Rpb24gY29lcmNlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNUeXBlKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoc3BlYykge1xuICAgICAgICB0aGlzLnNoYXBlKHNwZWMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX3R5cGVDaGVjayh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgX2Nhc3QoX3ZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICB2YXIgX29wdGlvbnMkc3RyaXBVbmtub3duO1xuXG4gICAgbGV0IHZhbHVlID0gc3VwZXIuX2Nhc3QoX3ZhbHVlLCBvcHRpb25zKTsgLy9zaG91bGQgaWdub3JlIG51bGxzIGhlcmVcblxuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLmdldERlZmF1bHQoKTtcbiAgICBpZiAoIXRoaXMuX3R5cGVDaGVjayh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICBsZXQgZmllbGRzID0gdGhpcy5maWVsZHM7XG4gICAgbGV0IHN0cmlwID0gKF9vcHRpb25zJHN0cmlwVW5rbm93biA9IG9wdGlvbnMuc3RyaXBVbmtub3duKSAhPSBudWxsID8gX29wdGlvbnMkc3RyaXBVbmtub3duIDogdGhpcy5zcGVjLm5vVW5rbm93bjtcblxuICAgIGxldCBwcm9wcyA9IHRoaXMuX25vZGVzLmNvbmNhdChPYmplY3Qua2V5cyh2YWx1ZSkuZmlsdGVyKHYgPT4gdGhpcy5fbm9kZXMuaW5kZXhPZih2KSA9PT0gLTEpKTtcblxuICAgIGxldCBpbnRlcm1lZGlhdGVWYWx1ZSA9IHt9OyAvLyBpcyBmaWxsZWQgZHVyaW5nIHRoZSB0cmFuc2Zvcm0gYmVsb3dcblxuICAgIGxldCBpbm5lck9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgb3B0aW9ucywge1xuICAgICAgcGFyZW50OiBpbnRlcm1lZGlhdGVWYWx1ZSxcbiAgICAgIF9fdmFsaWRhdGluZzogb3B0aW9ucy5fX3ZhbGlkYXRpbmcgfHwgZmFsc2VcbiAgICB9KTtcblxuICAgIGxldCBpc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgICAgbGV0IGZpZWxkID0gZmllbGRzW3Byb3BdO1xuICAgICAgbGV0IGV4aXN0cyA9IGhhcyh2YWx1ZSwgcHJvcCk7XG5cbiAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICBsZXQgZmllbGRWYWx1ZTtcbiAgICAgICAgbGV0IGlucHV0VmFsdWUgPSB2YWx1ZVtwcm9wXTsgLy8gc2FmZSB0byBtdXRhdGUgc2luY2UgdGhpcyBpcyBmaXJlZCBpbiBzZXF1ZW5jZVxuXG4gICAgICAgIGlubmVyT3B0aW9ucy5wYXRoID0gKG9wdGlvbnMucGF0aCA/IGAke29wdGlvbnMucGF0aH0uYCA6ICcnKSArIHByb3A7IC8vIGlubmVyT3B0aW9ucy52YWx1ZSA9IHZhbHVlW3Byb3BdO1xuXG4gICAgICAgIGZpZWxkID0gZmllbGQucmVzb2x2ZSh7XG4gICAgICAgICAgdmFsdWU6IGlucHV0VmFsdWUsXG4gICAgICAgICAgY29udGV4dDogb3B0aW9ucy5jb250ZXh0LFxuICAgICAgICAgIHBhcmVudDogaW50ZXJtZWRpYXRlVmFsdWVcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBmaWVsZFNwZWMgPSAnc3BlYycgaW4gZmllbGQgPyBmaWVsZC5zcGVjIDogdW5kZWZpbmVkO1xuICAgICAgICBsZXQgc3RyaWN0ID0gZmllbGRTcGVjID09IG51bGwgPyB2b2lkIDAgOiBmaWVsZFNwZWMuc3RyaWN0O1xuXG4gICAgICAgIGlmIChmaWVsZFNwZWMgPT0gbnVsbCA/IHZvaWQgMCA6IGZpZWxkU3BlYy5zdHJpcCkge1xuICAgICAgICAgIGlzQ2hhbmdlZCA9IGlzQ2hhbmdlZCB8fCBwcm9wIGluIHZhbHVlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZmllbGRWYWx1ZSA9ICFvcHRpb25zLl9fdmFsaWRhdGluZyB8fCAhc3RyaWN0ID8gLy8gVE9ETzogdXNlIF9jYXN0LCB0aGlzIGlzIGRvdWJsZSByZXNvbHZpbmdcbiAgICAgICAgZmllbGQuY2FzdCh2YWx1ZVtwcm9wXSwgaW5uZXJPcHRpb25zKSA6IHZhbHVlW3Byb3BdO1xuXG4gICAgICAgIGlmIChmaWVsZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpbnRlcm1lZGlhdGVWYWx1ZVtwcm9wXSA9IGZpZWxkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZXhpc3RzICYmICFzdHJpcCkge1xuICAgICAgICBpbnRlcm1lZGlhdGVWYWx1ZVtwcm9wXSA9IHZhbHVlW3Byb3BdO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW50ZXJtZWRpYXRlVmFsdWVbcHJvcF0gIT09IHZhbHVlW3Byb3BdKSB7XG4gICAgICAgIGlzQ2hhbmdlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzQ2hhbmdlZCA/IGludGVybWVkaWF0ZVZhbHVlIDogdmFsdWU7XG4gIH1cblxuICBfdmFsaWRhdGUoX3ZhbHVlLCBvcHRzID0ge30sIGNhbGxiYWNrKSB7XG4gICAgbGV0IGVycm9ycyA9IFtdO1xuICAgIGxldCB7XG4gICAgICBzeW5jLFxuICAgICAgZnJvbSA9IFtdLFxuICAgICAgb3JpZ2luYWxWYWx1ZSA9IF92YWx1ZSxcbiAgICAgIGFib3J0RWFybHkgPSB0aGlzLnNwZWMuYWJvcnRFYXJseSxcbiAgICAgIHJlY3Vyc2l2ZSA9IHRoaXMuc3BlYy5yZWN1cnNpdmVcbiAgICB9ID0gb3B0cztcbiAgICBmcm9tID0gW3tcbiAgICAgIHNjaGVtYTogdGhpcyxcbiAgICAgIHZhbHVlOiBvcmlnaW5hbFZhbHVlXG4gICAgfSwgLi4uZnJvbV07IC8vIHRoaXMgZmxhZyBpcyBuZWVkZWQgZm9yIGhhbmRsaW5nIGBzdHJpY3RgIGNvcnJlY3RseSBpbiB0aGUgY29udGV4dCBvZlxuICAgIC8vIHZhbGlkYXRpb24gdnMganVzdCBjYXN0aW5nLiBlLmcgc3RyaWN0KCkgb24gYSBmaWVsZCBpcyBvbmx5IHVzZWQgd2hlbiB2YWxpZGF0aW5nXG5cbiAgICBvcHRzLl9fdmFsaWRhdGluZyA9IHRydWU7XG4gICAgb3B0cy5vcmlnaW5hbFZhbHVlID0gb3JpZ2luYWxWYWx1ZTtcbiAgICBvcHRzLmZyb20gPSBmcm9tO1xuXG4gICAgc3VwZXIuX3ZhbGlkYXRlKF92YWx1ZSwgb3B0cywgKGVyciwgdmFsdWUpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKCFWYWxpZGF0aW9uRXJyb3IuaXNFcnJvcihlcnIpIHx8IGFib3J0RWFybHkpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCBjYWxsYmFjayhlcnIsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICghcmVjdXJzaXZlIHx8ICFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3JzWzBdIHx8IG51bGwsIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5hbFZhbHVlID0gb3JpZ2luYWxWYWx1ZSB8fCB2YWx1ZTtcblxuICAgICAgbGV0IHRlc3RzID0gdGhpcy5fbm9kZXMubWFwKGtleSA9PiAoXywgY2IpID0+IHtcbiAgICAgICAgbGV0IHBhdGggPSBrZXkuaW5kZXhPZignLicpID09PSAtMSA/IChvcHRzLnBhdGggPyBgJHtvcHRzLnBhdGh9LmAgOiAnJykgKyBrZXkgOiBgJHtvcHRzLnBhdGggfHwgJyd9W1wiJHtrZXl9XCJdYDtcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5maWVsZHNba2V5XTtcblxuICAgICAgICBpZiAoZmllbGQgJiYgJ3ZhbGlkYXRlJyBpbiBmaWVsZCkge1xuICAgICAgICAgIGZpZWxkLnZhbGlkYXRlKHZhbHVlW2tleV0sIF9leHRlbmRzKHt9LCBvcHRzLCB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgZnJvbSxcbiAgICAgICAgICAgIC8vIGlubmVyIGZpZWxkcyBhcmUgYWx3YXlzIHN0cmljdDpcbiAgICAgICAgICAgIC8vIDEuIHRoaXMgaXNuJ3Qgc3RyaWN0IHNvIHRoZSBjYXN0aW5nIHdpbGwgYWxzbyBoYXZlIGNhc3QgaW5uZXIgdmFsdWVzXG4gICAgICAgICAgICAvLyAyLiB0aGlzIGlzIHN0cmljdCBpbiB3aGljaCBjYXNlIHRoZSBuZXN0ZWQgdmFsdWVzIHdlcmVuJ3QgY2FzdCBlaXRoZXJcbiAgICAgICAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICAgICAgICAgIHBhcmVudDogdmFsdWUsXG4gICAgICAgICAgICBvcmlnaW5hbFZhbHVlOiBvcmlnaW5hbFZhbHVlW2tleV1cbiAgICAgICAgICB9KSwgY2IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNiKG51bGwpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1blRlc3RzKHtcbiAgICAgICAgc3luYyxcbiAgICAgICAgdGVzdHMsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBlcnJvcnMsXG4gICAgICAgIGVuZEVhcmx5OiBhYm9ydEVhcmx5LFxuICAgICAgICBzb3J0OiB0aGlzLl9zb3J0RXJyb3JzLFxuICAgICAgICBwYXRoOiBvcHRzLnBhdGhcbiAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsb25lKHNwZWMpIHtcbiAgICBjb25zdCBuZXh0ID0gc3VwZXIuY2xvbmUoc3BlYyk7XG4gICAgbmV4dC5maWVsZHMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5maWVsZHMpO1xuICAgIG5leHQuX25vZGVzID0gdGhpcy5fbm9kZXM7XG4gICAgbmV4dC5fZXhjbHVkZWRFZGdlcyA9IHRoaXMuX2V4Y2x1ZGVkRWRnZXM7XG4gICAgbmV4dC5fc29ydEVycm9ycyA9IHRoaXMuX3NvcnRFcnJvcnM7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBjb25jYXQoc2NoZW1hKSB7XG4gICAgbGV0IG5leHQgPSBzdXBlci5jb25jYXQoc2NoZW1hKTtcbiAgICBsZXQgbmV4dEZpZWxkcyA9IG5leHQuZmllbGRzO1xuXG4gICAgZm9yIChsZXQgW2ZpZWxkLCBzY2hlbWFPclJlZl0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5maWVsZHMpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBuZXh0RmllbGRzW2ZpZWxkXTtcblxuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5leHRGaWVsZHNbZmllbGRdID0gc2NoZW1hT3JSZWY7XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEJhc2VTY2hlbWEgJiYgc2NoZW1hT3JSZWYgaW5zdGFuY2VvZiBCYXNlU2NoZW1hKSB7XG4gICAgICAgIG5leHRGaWVsZHNbZmllbGRdID0gc2NoZW1hT3JSZWYuY29uY2F0KHRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQud2l0aE11dGF0aW9uKCgpID0+IG5leHQuc2hhcGUobmV4dEZpZWxkcywgdGhpcy5fZXhjbHVkZWRFZGdlcykpO1xuICB9XG5cbiAgZ2V0RGVmYXVsdEZyb21TaGFwZSgpIHtcbiAgICBsZXQgZGZ0ID0ge307XG5cbiAgICB0aGlzLl9ub2Rlcy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2tleV07XG4gICAgICBkZnRba2V5XSA9ICdkZWZhdWx0JyBpbiBmaWVsZCA/IGZpZWxkLmdldERlZmF1bHQoKSA6IHVuZGVmaW5lZDtcbiAgICB9KTtcblxuICAgIHJldHVybiBkZnQ7XG4gIH1cblxuICBfZ2V0RGVmYXVsdCgpIHtcbiAgICBpZiAoJ2RlZmF1bHQnIGluIHRoaXMuc3BlYykge1xuICAgICAgcmV0dXJuIHN1cGVyLl9nZXREZWZhdWx0KCk7XG4gICAgfSAvLyBpZiB0aGVyZSBpcyBubyBkZWZhdWx0IHNldCBpbnZlbnQgb25lXG5cblxuICAgIGlmICghdGhpcy5fbm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRGcm9tU2hhcGUoKTtcbiAgfVxuXG4gIHNoYXBlKGFkZGl0aW9ucywgZXhjbHVkZXMgPSBbXSkge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIGxldCBmaWVsZHMgPSBPYmplY3QuYXNzaWduKG5leHQuZmllbGRzLCBhZGRpdGlvbnMpO1xuICAgIG5leHQuZmllbGRzID0gZmllbGRzO1xuICAgIG5leHQuX3NvcnRFcnJvcnMgPSBzb3J0QnlLZXlPcmRlcihPYmplY3Qua2V5cyhmaWVsZHMpKTtcblxuICAgIGlmIChleGNsdWRlcy5sZW5ndGgpIHtcbiAgICAgIC8vIHRoaXMgaXMgYSBjb252ZW5pZW5jZSBmb3Igd2hlbiB1c2VycyBvbmx5IHN1cHBseSBhIHNpbmdsZSBwYWlyXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhjbHVkZXNbMF0pKSBleGNsdWRlcyA9IFtleGNsdWRlc107XG4gICAgICBuZXh0Ll9leGNsdWRlZEVkZ2VzID0gWy4uLm5leHQuX2V4Y2x1ZGVkRWRnZXMsIC4uLmV4Y2x1ZGVzXTtcbiAgICB9XG5cbiAgICBuZXh0Ll9ub2RlcyA9IHNvcnRGaWVsZHMoZmllbGRzLCBuZXh0Ll9leGNsdWRlZEVkZ2VzKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHBpY2soa2V5cykge1xuICAgIGNvbnN0IHBpY2tlZCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgaWYgKHRoaXMuZmllbGRzW2tleV0pIHBpY2tlZFtrZXldID0gdGhpcy5maWVsZHNba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLndpdGhNdXRhdGlvbihuZXh0ID0+IHtcbiAgICAgIG5leHQuZmllbGRzID0ge307XG4gICAgICByZXR1cm4gbmV4dC5zaGFwZShwaWNrZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgb21pdChrZXlzKSB7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMuY2xvbmUoKTtcbiAgICBjb25zdCBmaWVsZHMgPSBuZXh0LmZpZWxkcztcbiAgICBuZXh0LmZpZWxkcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgZGVsZXRlIGZpZWxkc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0LndpdGhNdXRhdGlvbigoKSA9PiBuZXh0LnNoYXBlKGZpZWxkcykpO1xuICB9XG5cbiAgZnJvbShmcm9tLCB0bywgYWxpYXMpIHtcbiAgICBsZXQgZnJvbUdldHRlciA9IGdldHRlcihmcm9tLCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0ob2JqID0+IHtcbiAgICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGxldCBuZXdPYmogPSBvYmo7XG5cbiAgICAgIGlmIChoYXMob2JqLCBmcm9tKSkge1xuICAgICAgICBuZXdPYmogPSBfZXh0ZW5kcyh7fSwgb2JqKTtcbiAgICAgICAgaWYgKCFhbGlhcykgZGVsZXRlIG5ld09ialtmcm9tXTtcbiAgICAgICAgbmV3T2JqW3RvXSA9IGZyb21HZXR0ZXIob2JqKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9KTtcbiAgfVxuXG4gIG5vVW5rbm93bihub0FsbG93ID0gdHJ1ZSwgbWVzc2FnZSA9IGxvY2FsZS5ub1Vua25vd24pIHtcbiAgICBpZiAodHlwZW9mIG5vQWxsb3cgPT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlID0gbm9BbGxvdztcbiAgICAgIG5vQWxsb3cgPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCBuZXh0ID0gdGhpcy50ZXN0KHtcbiAgICAgIG5hbWU6ICdub1Vua25vd24nLFxuICAgICAgZXhjbHVzaXZlOiB0cnVlLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcblxuICAgICAgdGVzdCh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGNvbnN0IHVua25vd25LZXlzID0gdW5rbm93bih0aGlzLnNjaGVtYSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gIW5vQWxsb3cgfHwgdW5rbm93bktleXMubGVuZ3RoID09PSAwIHx8IHRoaXMuY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdW5rbm93bjogdW5rbm93bktleXMuam9pbignLCAnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICBuZXh0LnNwZWMubm9Vbmtub3duID0gbm9BbGxvdztcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHVua25vd24oYWxsb3cgPSB0cnVlLCBtZXNzYWdlID0gbG9jYWxlLm5vVW5rbm93bikge1xuICAgIHJldHVybiB0aGlzLm5vVW5rbm93bighYWxsb3csIG1lc3NhZ2UpO1xuICB9XG5cbiAgdHJhbnNmb3JtS2V5cyhmbikge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybShvYmogPT4gb2JqICYmIG1hcEtleXMob2JqLCAoXywga2V5KSA9PiBmbihrZXkpKSk7XG4gIH1cblxuICBjYW1lbENhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtS2V5cyhjYW1lbENhc2UpO1xuICB9XG5cbiAgc25ha2VDYXNlKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUtleXMoc25ha2VDYXNlKTtcbiAgfVxuXG4gIGNvbnN0YW50Q2FzZSgpIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1LZXlzKGtleSA9PiBzbmFrZUNhc2Uoa2V5KS50b1VwcGVyQ2FzZSgpKTtcbiAgfVxuXG4gIGRlc2NyaWJlKCkge1xuICAgIGxldCBiYXNlID0gc3VwZXIuZGVzY3JpYmUoKTtcbiAgICBiYXNlLmZpZWxkcyA9IG1hcFZhbHVlcyh0aGlzLmZpZWxkcywgdmFsdWUgPT4gdmFsdWUuZGVzY3JpYmUoKSk7XG4gICAgcmV0dXJuIGJhc2U7XG4gIH1cblxufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShzcGVjKSB7XG4gIHJldHVybiBuZXcgT2JqZWN0U2NoZW1hKHNwZWMpO1xufVxuY3JlYXRlLnByb3RvdHlwZSA9IE9iamVjdFNjaGVtYS5wcm90b3R5cGU7IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IGNsb25lRGVlcCBmcm9tICduYW5vY2xvbmUnO1xuaW1wb3J0IHsgbWl4ZWQgYXMgbG9jYWxlIH0gZnJvbSAnLi9sb2NhbGUnO1xuaW1wb3J0IENvbmRpdGlvbiBmcm9tICcuL0NvbmRpdGlvbic7XG5pbXBvcnQgcnVuVGVzdHMgZnJvbSAnLi91dGlsL3J1blRlc3RzJztcbmltcG9ydCBjcmVhdGVWYWxpZGF0aW9uIGZyb20gJy4vdXRpbC9jcmVhdGVWYWxpZGF0aW9uJztcbmltcG9ydCBwcmludFZhbHVlIGZyb20gJy4vdXRpbC9wcmludFZhbHVlJztcbmltcG9ydCBSZWYgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IHsgZ2V0SW4gfSBmcm9tICcuL3V0aWwvcmVhY2gnO1xuaW1wb3J0IFZhbGlkYXRpb25FcnJvciBmcm9tICcuL1ZhbGlkYXRpb25FcnJvcic7XG5pbXBvcnQgUmVmZXJlbmNlU2V0IGZyb20gJy4vdXRpbC9SZWZlcmVuY2VTZXQnO1xuaW1wb3J0IHRvQXJyYXkgZnJvbSAnLi91dGlsL3RvQXJyYXknOyAvLyBjb25zdCBVTlNFVCA9ICd1bnNldCcgYXMgY29uc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTY2hlbWEge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5kZXBzID0gW107XG4gICAgdGhpcy50ZXN0cyA9IHZvaWQgMDtcbiAgICB0aGlzLnRyYW5zZm9ybXMgPSB2b2lkIDA7XG4gICAgdGhpcy5jb25kaXRpb25zID0gW107XG4gICAgdGhpcy5fbXV0YXRlID0gdm9pZCAwO1xuICAgIHRoaXMuX3R5cGVFcnJvciA9IHZvaWQgMDtcbiAgICB0aGlzLl93aGl0ZWxpc3QgPSBuZXcgUmVmZXJlbmNlU2V0KCk7XG4gICAgdGhpcy5fYmxhY2tsaXN0ID0gbmV3IFJlZmVyZW5jZVNldCgpO1xuICAgIHRoaXMuZXhjbHVzaXZlVGVzdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuc3BlYyA9IHZvaWQgMDtcbiAgICB0aGlzLnRlc3RzID0gW107XG4gICAgdGhpcy50cmFuc2Zvcm1zID0gW107XG4gICAgdGhpcy53aXRoTXV0YXRpb24oKCkgPT4ge1xuICAgICAgdGhpcy50eXBlRXJyb3IobG9jYWxlLm5vdFR5cGUpO1xuICAgIH0pO1xuICAgIHRoaXMudHlwZSA9IChvcHRpb25zID09IG51bGwgPyB2b2lkIDAgOiBvcHRpb25zLnR5cGUpIHx8ICdtaXhlZCc7XG4gICAgdGhpcy5zcGVjID0gX2V4dGVuZHMoe1xuICAgICAgc3RyaXA6IGZhbHNlLFxuICAgICAgc3RyaWN0OiBmYWxzZSxcbiAgICAgIGFib3J0RWFybHk6IHRydWUsXG4gICAgICByZWN1cnNpdmU6IHRydWUsXG4gICAgICBudWxsYWJsZTogZmFsc2UsXG4gICAgICBwcmVzZW5jZTogJ29wdGlvbmFsJ1xuICAgIH0sIG9wdGlvbnMgPT0gbnVsbCA/IHZvaWQgMCA6IG9wdGlvbnMuc3BlYyk7XG4gIH0gLy8gVE9ETzogcmVtb3ZlXG5cblxuICBnZXQgX3R5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbiAgfVxuXG4gIF90eXBlQ2hlY2soX3ZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjbG9uZShzcGVjKSB7XG4gICAgaWYgKHRoaXMuX211dGF0ZSkge1xuICAgICAgaWYgKHNwZWMpIE9iamVjdC5hc3NpZ24odGhpcy5zcGVjLCBzcGVjKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8gaWYgdGhlIG5lc3RlZCB2YWx1ZSBpcyBhIHNjaGVtYSB3ZSBjYW4gc2tpcCBjbG9uaW5nLCBzaW5jZVxuICAgIC8vIHRoZXkgYXJlIGFscmVhZHkgaW1tdXRhYmxlXG5cblxuICAgIGNvbnN0IG5leHQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSk7IC8vIEB0cy1leHBlY3QtZXJyb3IgdGhpcyBpcyByZWFkb25seVxuXG4gICAgbmV4dC50eXBlID0gdGhpcy50eXBlO1xuICAgIG5leHQuX3R5cGVFcnJvciA9IHRoaXMuX3R5cGVFcnJvcjtcbiAgICBuZXh0Ll93aGl0ZWxpc3RFcnJvciA9IHRoaXMuX3doaXRlbGlzdEVycm9yO1xuICAgIG5leHQuX2JsYWNrbGlzdEVycm9yID0gdGhpcy5fYmxhY2tsaXN0RXJyb3I7XG4gICAgbmV4dC5fd2hpdGVsaXN0ID0gdGhpcy5fd2hpdGVsaXN0LmNsb25lKCk7XG4gICAgbmV4dC5fYmxhY2tsaXN0ID0gdGhpcy5fYmxhY2tsaXN0LmNsb25lKCk7XG4gICAgbmV4dC5leGNsdXNpdmVUZXN0cyA9IF9leHRlbmRzKHt9LCB0aGlzLmV4Y2x1c2l2ZVRlc3RzKTsgLy8gQHRzLWV4cGVjdC1lcnJvciB0aGlzIGlzIHJlYWRvbmx5XG5cbiAgICBuZXh0LmRlcHMgPSBbLi4udGhpcy5kZXBzXTtcbiAgICBuZXh0LmNvbmRpdGlvbnMgPSBbLi4udGhpcy5jb25kaXRpb25zXTtcbiAgICBuZXh0LnRlc3RzID0gWy4uLnRoaXMudGVzdHNdO1xuICAgIG5leHQudHJhbnNmb3JtcyA9IFsuLi50aGlzLnRyYW5zZm9ybXNdO1xuICAgIG5leHQuc3BlYyA9IGNsb25lRGVlcChfZXh0ZW5kcyh7fSwgdGhpcy5zcGVjLCBzcGVjKSk7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBsYWJlbChsYWJlbCkge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIG5leHQuc3BlYy5sYWJlbCA9IGxhYmVsO1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgbWV0YSguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5zcGVjLm1ldGE7XG4gICAgbGV0IG5leHQgPSB0aGlzLmNsb25lKCk7XG4gICAgbmV4dC5zcGVjLm1ldGEgPSBPYmplY3QuYXNzaWduKG5leHQuc3BlYy5tZXRhIHx8IHt9LCBhcmdzWzBdKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfSAvLyB3aXRoQ29udGV4dDxUQ29udGV4dCBleHRlbmRzIEFueU9iamVjdD4oKTogQmFzZVNjaGVtYTxcbiAgLy8gICBUQ2FzdCxcbiAgLy8gICBUQ29udGV4dCxcbiAgLy8gICBUT3V0cHV0XG4gIC8vID4ge1xuICAvLyAgIHJldHVybiB0aGlzIGFzIGFueTtcbiAgLy8gfVxuXG5cbiAgd2l0aE11dGF0aW9uKGZuKSB7XG4gICAgbGV0IGJlZm9yZSA9IHRoaXMuX211dGF0ZTtcbiAgICB0aGlzLl9tdXRhdGUgPSB0cnVlO1xuICAgIGxldCByZXN1bHQgPSBmbih0aGlzKTtcbiAgICB0aGlzLl9tdXRhdGUgPSBiZWZvcmU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbmNhdChzY2hlbWEpIHtcbiAgICBpZiAoIXNjaGVtYSB8fCBzY2hlbWEgPT09IHRoaXMpIHJldHVybiB0aGlzO1xuICAgIGlmIChzY2hlbWEudHlwZSAhPT0gdGhpcy50eXBlICYmIHRoaXMudHlwZSAhPT0gJ21peGVkJykgdGhyb3cgbmV3IFR5cGVFcnJvcihgWW91IGNhbm5vdCBcXGBjb25jYXQoKVxcYCBzY2hlbWEncyBvZiBkaWZmZXJlbnQgdHlwZXM6ICR7dGhpcy50eXBlfSBhbmQgJHtzY2hlbWEudHlwZX1gKTtcbiAgICBsZXQgYmFzZSA9IHRoaXM7XG4gICAgbGV0IGNvbWJpbmVkID0gc2NoZW1hLmNsb25lKCk7XG5cbiAgICBjb25zdCBtZXJnZWRTcGVjID0gX2V4dGVuZHMoe30sIGJhc2Uuc3BlYywgY29tYmluZWQuc3BlYyk7IC8vIGlmIChjb21iaW5lZC5zcGVjLm51bGxhYmxlID09PSBVTlNFVClcbiAgICAvLyAgIG1lcmdlZFNwZWMubnVsbGFibGUgPSBiYXNlLnNwZWMubnVsbGFibGU7XG4gICAgLy8gaWYgKGNvbWJpbmVkLnNwZWMucHJlc2VuY2UgPT09IFVOU0VUKVxuICAgIC8vICAgbWVyZ2VkU3BlYy5wcmVzZW5jZSA9IGJhc2Uuc3BlYy5wcmVzZW5jZTtcblxuXG4gICAgY29tYmluZWQuc3BlYyA9IG1lcmdlZFNwZWM7XG4gICAgY29tYmluZWQuX3R5cGVFcnJvciB8fCAoY29tYmluZWQuX3R5cGVFcnJvciA9IGJhc2UuX3R5cGVFcnJvcik7XG4gICAgY29tYmluZWQuX3doaXRlbGlzdEVycm9yIHx8IChjb21iaW5lZC5fd2hpdGVsaXN0RXJyb3IgPSBiYXNlLl93aGl0ZWxpc3RFcnJvcik7XG4gICAgY29tYmluZWQuX2JsYWNrbGlzdEVycm9yIHx8IChjb21iaW5lZC5fYmxhY2tsaXN0RXJyb3IgPSBiYXNlLl9ibGFja2xpc3RFcnJvcik7IC8vIG1hbnVhbGx5IG1lcmdlIHRoZSBibGFja2xpc3Qvd2hpdGVsaXN0ICh0aGUgb3RoZXIgYHNjaGVtYWAgdGFrZXNcbiAgICAvLyBwcmVjZWRlbmNlIGluIGNhc2Ugb2YgY29uZmxpY3RzKVxuXG4gICAgY29tYmluZWQuX3doaXRlbGlzdCA9IGJhc2UuX3doaXRlbGlzdC5tZXJnZShzY2hlbWEuX3doaXRlbGlzdCwgc2NoZW1hLl9ibGFja2xpc3QpO1xuICAgIGNvbWJpbmVkLl9ibGFja2xpc3QgPSBiYXNlLl9ibGFja2xpc3QubWVyZ2Uoc2NoZW1hLl9ibGFja2xpc3QsIHNjaGVtYS5fd2hpdGVsaXN0KTsgLy8gc3RhcnQgd2l0aCB0aGUgY3VycmVudCB0ZXN0c1xuXG4gICAgY29tYmluZWQudGVzdHMgPSBiYXNlLnRlc3RzO1xuICAgIGNvbWJpbmVkLmV4Y2x1c2l2ZVRlc3RzID0gYmFzZS5leGNsdXNpdmVUZXN0czsgLy8gbWFudWFsbHkgYWRkIHRoZSBuZXcgdGVzdHMgdG8gZW5zdXJlXG4gICAgLy8gdGhlIGRlZHVwaW5nIGxvZ2ljIGlzIGNvbnNpc3RlbnRcblxuICAgIGNvbWJpbmVkLndpdGhNdXRhdGlvbihuZXh0ID0+IHtcbiAgICAgIHNjaGVtYS50ZXN0cy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgbmV4dC50ZXN0KGZuLk9QVElPTlMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29tYmluZWQudHJhbnNmb3JtcyA9IFsuLi5iYXNlLnRyYW5zZm9ybXMsIC4uLmNvbWJpbmVkLnRyYW5zZm9ybXNdO1xuICAgIHJldHVybiBjb21iaW5lZDtcbiAgfVxuXG4gIGlzVHlwZSh2KSB7XG4gICAgaWYgKHRoaXMuc3BlYy5udWxsYWJsZSAmJiB2ID09PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5fdHlwZUNoZWNrKHYpO1xuICB9XG5cbiAgcmVzb2x2ZShvcHRpb25zKSB7XG4gICAgbGV0IHNjaGVtYSA9IHRoaXM7XG5cbiAgICBpZiAoc2NoZW1hLmNvbmRpdGlvbnMubGVuZ3RoKSB7XG4gICAgICBsZXQgY29uZGl0aW9ucyA9IHNjaGVtYS5jb25kaXRpb25zO1xuICAgICAgc2NoZW1hID0gc2NoZW1hLmNsb25lKCk7XG4gICAgICBzY2hlbWEuY29uZGl0aW9ucyA9IFtdO1xuICAgICAgc2NoZW1hID0gY29uZGl0aW9ucy5yZWR1Y2UoKHNjaGVtYSwgY29uZGl0aW9uKSA9PiBjb25kaXRpb24ucmVzb2x2ZShzY2hlbWEsIG9wdGlvbnMpLCBzY2hlbWEpO1xuICAgICAgc2NoZW1hID0gc2NoZW1hLnJlc29sdmUob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNjaGVtYTtcbiAgfVxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0geyo9fSBvcHRpb25zLnBhcmVudFxuICAgKiBAcGFyYW0geyo9fSBvcHRpb25zLmNvbnRleHRcbiAgICovXG5cblxuICBjYXN0KHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgcmVzb2x2ZWRTY2hlbWEgPSB0aGlzLnJlc29sdmUoX2V4dGVuZHMoe1xuICAgICAgdmFsdWVcbiAgICB9LCBvcHRpb25zKSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gcmVzb2x2ZWRTY2hlbWEuX2Nhc3QodmFsdWUsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5hc3NlcnQgIT09IGZhbHNlICYmIHJlc29sdmVkU2NoZW1hLmlzVHlwZShyZXN1bHQpICE9PSB0cnVlKSB7XG4gICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSBwcmludFZhbHVlKHZhbHVlKTtcbiAgICAgIGxldCBmb3JtYXR0ZWRSZXN1bHQgPSBwcmludFZhbHVlKHJlc3VsdCk7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgdmFsdWUgb2YgJHtvcHRpb25zLnBhdGggfHwgJ2ZpZWxkJ30gY291bGQgbm90IGJlIGNhc3QgdG8gYSB2YWx1ZSBgICsgYHRoYXQgc2F0aXNmaWVzIHRoZSBzY2hlbWEgdHlwZTogXCIke3Jlc29sdmVkU2NoZW1hLl90eXBlfVwiLiBcXG5cXG5gICsgYGF0dGVtcHRlZCB2YWx1ZTogJHtmb3JtYXR0ZWRWYWx1ZX0gXFxuYCArIChmb3JtYXR0ZWRSZXN1bHQgIT09IGZvcm1hdHRlZFZhbHVlID8gYHJlc3VsdCBvZiBjYXN0OiAke2Zvcm1hdHRlZFJlc3VsdH1gIDogJycpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgX2Nhc3QocmF3VmFsdWUsIF9vcHRpb25zKSB7XG4gICAgbGV0IHZhbHVlID0gcmF3VmFsdWUgPT09IHVuZGVmaW5lZCA/IHJhd1ZhbHVlIDogdGhpcy50cmFuc2Zvcm1zLnJlZHVjZSgodmFsdWUsIGZuKSA9PiBmbi5jYWxsKHRoaXMsIHZhbHVlLCByYXdWYWx1ZSwgdGhpcyksIHJhd1ZhbHVlKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMuZ2V0RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIF92YWxpZGF0ZShfdmFsdWUsIG9wdGlvbnMgPSB7fSwgY2IpIHtcbiAgICBsZXQge1xuICAgICAgc3luYyxcbiAgICAgIHBhdGgsXG4gICAgICBmcm9tID0gW10sXG4gICAgICBvcmlnaW5hbFZhbHVlID0gX3ZhbHVlLFxuICAgICAgc3RyaWN0ID0gdGhpcy5zcGVjLnN0cmljdCxcbiAgICAgIGFib3J0RWFybHkgPSB0aGlzLnNwZWMuYWJvcnRFYXJseVxuICAgIH0gPSBvcHRpb25zO1xuICAgIGxldCB2YWx1ZSA9IF92YWx1ZTtcblxuICAgIGlmICghc3RyaWN0KSB7XG4gICAgICAvLyB0aGlzLl92YWxpZGF0aW5nID0gdHJ1ZTtcbiAgICAgIHZhbHVlID0gdGhpcy5fY2FzdCh2YWx1ZSwgX2V4dGVuZHMoe1xuICAgICAgICBhc3NlcnQ6IGZhbHNlXG4gICAgICB9LCBvcHRpb25zKSk7IC8vIHRoaXMuX3ZhbGlkYXRpbmcgPSBmYWxzZTtcbiAgICB9IC8vIHZhbHVlIGlzIGNhc3QsIHdlIGNhbiBjaGVjayBpZiBpdCBtZWV0cyB0eXBlIHJlcXVpcmVtZW50c1xuXG5cbiAgICBsZXQgYXJncyA9IHtcbiAgICAgIHZhbHVlLFxuICAgICAgcGF0aCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBvcmlnaW5hbFZhbHVlLFxuICAgICAgc2NoZW1hOiB0aGlzLFxuICAgICAgbGFiZWw6IHRoaXMuc3BlYy5sYWJlbCxcbiAgICAgIHN5bmMsXG4gICAgICBmcm9tXG4gICAgfTtcbiAgICBsZXQgaW5pdGlhbFRlc3RzID0gW107XG4gICAgaWYgKHRoaXMuX3R5cGVFcnJvcikgaW5pdGlhbFRlc3RzLnB1c2godGhpcy5fdHlwZUVycm9yKTtcbiAgICBsZXQgZmluYWxUZXN0cyA9IFtdO1xuICAgIGlmICh0aGlzLl93aGl0ZWxpc3RFcnJvcikgZmluYWxUZXN0cy5wdXNoKHRoaXMuX3doaXRlbGlzdEVycm9yKTtcbiAgICBpZiAodGhpcy5fYmxhY2tsaXN0RXJyb3IpIGZpbmFsVGVzdHMucHVzaCh0aGlzLl9ibGFja2xpc3RFcnJvcik7XG4gICAgcnVuVGVzdHMoe1xuICAgICAgYXJncyxcbiAgICAgIHZhbHVlLFxuICAgICAgcGF0aCxcbiAgICAgIHN5bmMsXG4gICAgICB0ZXN0czogaW5pdGlhbFRlc3RzLFxuICAgICAgZW5kRWFybHk6IGFib3J0RWFybHlcbiAgICB9LCBlcnIgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHZvaWQgY2IoZXJyLCB2YWx1ZSk7XG4gICAgICBydW5UZXN0cyh7XG4gICAgICAgIHRlc3RzOiB0aGlzLnRlc3RzLmNvbmNhdChmaW5hbFRlc3RzKSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgcGF0aCxcbiAgICAgICAgc3luYyxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGVuZEVhcmx5OiBhYm9ydEVhcmx5XG4gICAgICB9LCBjYik7XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0ZSh2YWx1ZSwgb3B0aW9ucywgbWF5YmVDYikge1xuICAgIGxldCBzY2hlbWEgPSB0aGlzLnJlc29sdmUoX2V4dGVuZHMoe30sIG9wdGlvbnMsIHtcbiAgICAgIHZhbHVlXG4gICAgfSkpOyAvLyBjYWxsYmFjayBjYXNlIGlzIGZvciBuZXN0ZWQgdmFsaWRhdGlvbnNcblxuICAgIHJldHVybiB0eXBlb2YgbWF5YmVDYiA9PT0gJ2Z1bmN0aW9uJyA/IHNjaGVtYS5fdmFsaWRhdGUodmFsdWUsIG9wdGlvbnMsIG1heWJlQ2IpIDogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gc2NoZW1hLl92YWxpZGF0ZSh2YWx1ZSwgb3B0aW9ucywgKGVyciwgdmFsdWUpID0+IHtcbiAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpO2Vsc2UgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSkpO1xuICB9XG5cbiAgdmFsaWRhdGVTeW5jKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgbGV0IHNjaGVtYSA9IHRoaXMucmVzb2x2ZShfZXh0ZW5kcyh7fSwgb3B0aW9ucywge1xuICAgICAgdmFsdWVcbiAgICB9KSk7XG4gICAgbGV0IHJlc3VsdDtcblxuICAgIHNjaGVtYS5fdmFsaWRhdGUodmFsdWUsIF9leHRlbmRzKHt9LCBvcHRpb25zLCB7XG4gICAgICBzeW5jOiB0cnVlXG4gICAgfSksIChlcnIsIHZhbHVlKSA9PiB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpc1ZhbGlkKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGUodmFsdWUsIG9wdGlvbnMpLnRoZW4oKCkgPT4gdHJ1ZSwgZXJyID0+IHtcbiAgICAgIGlmIChWYWxpZGF0aW9uRXJyb3IuaXNFcnJvcihlcnIpKSByZXR1cm4gZmFsc2U7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cblxuICBpc1ZhbGlkU3luYyh2YWx1ZSwgb3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnZhbGlkYXRlU3luYyh2YWx1ZSwgb3B0aW9ucyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChWYWxpZGF0aW9uRXJyb3IuaXNFcnJvcihlcnIpKSByZXR1cm4gZmFsc2U7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgX2dldERlZmF1bHQoKSB7XG4gICAgbGV0IGRlZmF1bHRWYWx1ZSA9IHRoaXMuc3BlYy5kZWZhdWx0O1xuXG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAnZnVuY3Rpb24nID8gZGVmYXVsdFZhbHVlLmNhbGwodGhpcykgOiBjbG9uZURlZXAoZGVmYXVsdFZhbHVlKTtcbiAgfVxuXG4gIGdldERlZmF1bHQob3B0aW9ucykge1xuICAgIGxldCBzY2hlbWEgPSB0aGlzLnJlc29sdmUob3B0aW9ucyB8fCB7fSk7XG4gICAgcmV0dXJuIHNjaGVtYS5fZ2V0RGVmYXVsdCgpO1xuICB9XG5cbiAgZGVmYXVsdChkZWYpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2dldERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBsZXQgbmV4dCA9IHRoaXMuY2xvbmUoe1xuICAgICAgZGVmYXVsdDogZGVmXG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBzdHJpY3QoaXNTdHJpY3QgPSB0cnVlKSB7XG4gICAgbGV0IG5leHQgPSB0aGlzLmNsb25lKCk7XG4gICAgbmV4dC5zcGVjLnN0cmljdCA9IGlzU3RyaWN0O1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgX2lzUHJlc2VudCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPSBudWxsO1xuICB9XG5cbiAgZGVmaW5lZChtZXNzYWdlID0gbG9jYWxlLmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnZGVmaW5lZCcsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIHJlcXVpcmVkKG1lc3NhZ2UgPSBsb2NhbGUucmVxdWlyZWQpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSh7XG4gICAgICBwcmVzZW5jZTogJ3JlcXVpcmVkJ1xuICAgIH0pLndpdGhNdXRhdGlvbihzID0+IHMudGVzdCh7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbmFtZTogJ3JlcXVpcmVkJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcblxuICAgICAgdGVzdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2hlbWEuX2lzUHJlc2VudCh2YWx1ZSk7XG4gICAgICB9XG5cbiAgICB9KSk7XG4gIH1cblxuICBub3RSZXF1aXJlZCgpIHtcbiAgICBsZXQgbmV4dCA9IHRoaXMuY2xvbmUoe1xuICAgICAgcHJlc2VuY2U6ICdvcHRpb25hbCdcbiAgICB9KTtcbiAgICBuZXh0LnRlc3RzID0gbmV4dC50ZXN0cy5maWx0ZXIodGVzdCA9PiB0ZXN0Lk9QVElPTlMubmFtZSAhPT0gJ3JlcXVpcmVkJyk7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBudWxsYWJsZShpc051bGxhYmxlID0gdHJ1ZSkge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSh7XG4gICAgICBudWxsYWJsZTogaXNOdWxsYWJsZSAhPT0gZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHRyYW5zZm9ybShmbikge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIG5leHQudHJhbnNmb3Jtcy5wdXNoKGZuKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuICAvKipcbiAgICogQWRkcyBhIHRlc3QgZnVuY3Rpb24gdG8gdGhlIHNjaGVtYSdzIHF1ZXVlIG9mIHRlc3RzLlxuICAgKiB0ZXN0cyBjYW4gYmUgZXhjbHVzaXZlIG9yIG5vbi1leGNsdXNpdmUuXG4gICAqXG4gICAqIC0gZXhjbHVzaXZlIHRlc3RzLCB3aWxsIHJlcGxhY2UgYW55IGV4aXN0aW5nIHRlc3RzIG9mIHRoZSBzYW1lIG5hbWUuXG4gICAqIC0gbm9uLWV4Y2x1c2l2ZTogY2FuIGJlIHN0YWNrZWRcbiAgICpcbiAgICogSWYgYSBub24tZXhjbHVzaXZlIHRlc3QgaXMgYWRkZWQgdG8gYSBzY2hlbWEgd2l0aCBhbiBleGNsdXNpdmUgdGVzdCBvZiB0aGUgc2FtZSBuYW1lXG4gICAqIHRoZSBleGNsdXNpdmUgdGVzdCBpcyByZW1vdmVkIGFuZCBmdXJ0aGVyIHRlc3RzIG9mIHRoZSBzYW1lIG5hbWUgd2lsbCBiZSBzdGFja2VkLlxuICAgKlxuICAgKiBJZiBhbiBleGNsdXNpdmUgdGVzdCBpcyBhZGRlZCB0byBhIHNjaGVtYSB3aXRoIG5vbi1leGNsdXNpdmUgdGVzdHMgb2YgdGhlIHNhbWUgbmFtZVxuICAgKiB0aGUgcHJldmlvdXMgdGVzdHMgYXJlIHJlbW92ZWQgYW5kIGZ1cnRoZXIgdGVzdHMgb2YgdGhlIHNhbWUgbmFtZSB3aWxsIHJlcGxhY2UgZWFjaCBvdGhlci5cbiAgICovXG5cblxuICB0ZXN0KC4uLmFyZ3MpIHtcbiAgICBsZXQgb3B0cztcblxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9wdHMgPSB7XG4gICAgICAgICAgdGVzdDogYXJnc1swXVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0cyA9IGFyZ3NbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgb3B0cyA9IHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgdGVzdDogYXJnc1sxXVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cyA9IHtcbiAgICAgICAgbmFtZTogYXJnc1swXSxcbiAgICAgICAgbWVzc2FnZTogYXJnc1sxXSxcbiAgICAgICAgdGVzdDogYXJnc1syXVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5tZXNzYWdlID09PSB1bmRlZmluZWQpIG9wdHMubWVzc2FnZSA9IGxvY2FsZS5kZWZhdWx0O1xuICAgIGlmICh0eXBlb2Ygb3B0cy50ZXN0ICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdgdGVzdGAgaXMgYSByZXF1aXJlZCBwYXJhbWV0ZXJzJyk7XG4gICAgbGV0IG5leHQgPSB0aGlzLmNsb25lKCk7XG4gICAgbGV0IHZhbGlkYXRlID0gY3JlYXRlVmFsaWRhdGlvbihvcHRzKTtcbiAgICBsZXQgaXNFeGNsdXNpdmUgPSBvcHRzLmV4Y2x1c2l2ZSB8fCBvcHRzLm5hbWUgJiYgbmV4dC5leGNsdXNpdmVUZXN0c1tvcHRzLm5hbWVdID09PSB0cnVlO1xuXG4gICAgaWYgKG9wdHMuZXhjbHVzaXZlKSB7XG4gICAgICBpZiAoIW9wdHMubmFtZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhjbHVzaXZlIHRlc3RzIG11c3QgcHJvdmlkZSBhIHVuaXF1ZSBgbmFtZWAgaWRlbnRpZnlpbmcgdGhlIHRlc3QnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5uYW1lKSBuZXh0LmV4Y2x1c2l2ZVRlc3RzW29wdHMubmFtZV0gPSAhIW9wdHMuZXhjbHVzaXZlO1xuICAgIG5leHQudGVzdHMgPSBuZXh0LnRlc3RzLmZpbHRlcihmbiA9PiB7XG4gICAgICBpZiAoZm4uT1BUSU9OUy5uYW1lID09PSBvcHRzLm5hbWUpIHtcbiAgICAgICAgaWYgKGlzRXhjbHVzaXZlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChmbi5PUFRJT05TLnRlc3QgPT09IHZhbGlkYXRlLk9QVElPTlMudGVzdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBuZXh0LnRlc3RzLnB1c2godmFsaWRhdGUpO1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgd2hlbihrZXlzLCBvcHRpb25zKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXMpICYmIHR5cGVvZiBrZXlzICE9PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucyA9IGtleXM7XG4gICAgICBrZXlzID0gJy4nO1xuICAgIH1cblxuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIGxldCBkZXBzID0gdG9BcnJheShrZXlzKS5tYXAoa2V5ID0+IG5ldyBSZWYoa2V5KSk7XG4gICAgZGVwcy5mb3JFYWNoKGRlcCA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpZiAoZGVwLmlzU2libGluZykgbmV4dC5kZXBzLnB1c2goZGVwLmtleSk7XG4gICAgfSk7XG4gICAgbmV4dC5jb25kaXRpb25zLnB1c2gobmV3IENvbmRpdGlvbihkZXBzLCBvcHRpb25zKSk7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICB0eXBlRXJyb3IobWVzc2FnZSkge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIG5leHQuX3R5cGVFcnJvciA9IGNyZWF0ZVZhbGlkYXRpb24oe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICd0eXBlRXJyb3InLFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLnNjaGVtYS5pc1R5cGUodmFsdWUpKSByZXR1cm4gdGhpcy5jcmVhdGVFcnJvcih7XG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnNjaGVtYS5fdHlwZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBvbmVPZihlbnVtcywgbWVzc2FnZSA9IGxvY2FsZS5vbmVPZikge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIGVudW1zLmZvckVhY2godmFsID0+IHtcbiAgICAgIG5leHQuX3doaXRlbGlzdC5hZGQodmFsKTtcblxuICAgICAgbmV4dC5fYmxhY2tsaXN0LmRlbGV0ZSh2YWwpO1xuICAgIH0pO1xuICAgIG5leHQuX3doaXRlbGlzdEVycm9yID0gY3JlYXRlVmFsaWRhdGlvbih7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbmFtZTogJ29uZU9mJyxcblxuICAgICAgdGVzdCh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG4gICAgICAgIGxldCB2YWxpZHMgPSB0aGlzLnNjaGVtYS5fd2hpdGVsaXN0O1xuICAgICAgICBsZXQgcmVzb2x2ZWQgPSB2YWxpZHMucmVzb2x2ZUFsbCh0aGlzLnJlc29sdmUpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWQuaW5jbHVkZXModmFsdWUpID8gdHJ1ZSA6IHRoaXMuY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdmFsdWVzOiB2YWxpZHMudG9BcnJheSgpLmpvaW4oJywgJyksXG4gICAgICAgICAgICByZXNvbHZlZFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIG5vdE9uZU9mKGVudW1zLCBtZXNzYWdlID0gbG9jYWxlLm5vdE9uZU9mKSB7XG4gICAgbGV0IG5leHQgPSB0aGlzLmNsb25lKCk7XG4gICAgZW51bXMuZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgbmV4dC5fYmxhY2tsaXN0LmFkZCh2YWwpO1xuXG4gICAgICBuZXh0Ll93aGl0ZWxpc3QuZGVsZXRlKHZhbCk7XG4gICAgfSk7XG4gICAgbmV4dC5fYmxhY2tsaXN0RXJyb3IgPSBjcmVhdGVWYWxpZGF0aW9uKHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbm90T25lT2YnLFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIGxldCBpbnZhbGlkcyA9IHRoaXMuc2NoZW1hLl9ibGFja2xpc3Q7XG4gICAgICAgIGxldCByZXNvbHZlZCA9IGludmFsaWRzLnJlc29sdmVBbGwodGhpcy5yZXNvbHZlKTtcbiAgICAgICAgaWYgKHJlc29sdmVkLmluY2x1ZGVzKHZhbHVlKSkgcmV0dXJuIHRoaXMuY3JlYXRlRXJyb3Ioe1xuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdmFsdWVzOiBpbnZhbGlkcy50b0FycmF5KCkuam9pbignLCAnKSxcbiAgICAgICAgICAgIHJlc29sdmVkXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHN0cmlwKHN0cmlwID0gdHJ1ZSkge1xuICAgIGxldCBuZXh0ID0gdGhpcy5jbG9uZSgpO1xuICAgIG5leHQuc3BlYy5zdHJpcCA9IHN0cmlwO1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgZGVzY3JpYmUoKSB7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMuY2xvbmUoKTtcbiAgICBjb25zdCB7XG4gICAgICBsYWJlbCxcbiAgICAgIG1ldGFcbiAgICB9ID0gbmV4dC5zcGVjO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0ge1xuICAgICAgbWV0YSxcbiAgICAgIGxhYmVsLFxuICAgICAgdHlwZTogbmV4dC50eXBlLFxuICAgICAgb25lT2Y6IG5leHQuX3doaXRlbGlzdC5kZXNjcmliZSgpLFxuICAgICAgbm90T25lT2Y6IG5leHQuX2JsYWNrbGlzdC5kZXNjcmliZSgpLFxuICAgICAgdGVzdHM6IG5leHQudGVzdHMubWFwKGZuID0+ICh7XG4gICAgICAgIG5hbWU6IGZuLk9QVElPTlMubmFtZSxcbiAgICAgICAgcGFyYW1zOiBmbi5PUFRJT05TLnBhcmFtc1xuICAgICAgfSkpLmZpbHRlcigobiwgaWR4LCBsaXN0KSA9PiBsaXN0LmZpbmRJbmRleChjID0+IGMubmFtZSA9PT0gbi5uYW1lKSA9PT0gaWR4KVxuICAgIH07XG4gICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICB9XG5cbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXG4vLyBAdHMtZXhwZWN0LWVycm9yXG5CYXNlU2NoZW1hLnByb3RvdHlwZS5fX2lzWXVwU2NoZW1hX18gPSB0cnVlO1xuXG5mb3IgKGNvbnN0IG1ldGhvZCBvZiBbJ3ZhbGlkYXRlJywgJ3ZhbGlkYXRlU3luYyddKSBCYXNlU2NoZW1hLnByb3RvdHlwZVtgJHttZXRob2R9QXRgXSA9IGZ1bmN0aW9uIChwYXRoLCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHtcbiAgICBwYXJlbnQsXG4gICAgcGFyZW50UGF0aCxcbiAgICBzY2hlbWFcbiAgfSA9IGdldEluKHRoaXMsIHBhdGgsIHZhbHVlLCBvcHRpb25zLmNvbnRleHQpO1xuICByZXR1cm4gc2NoZW1hW21ldGhvZF0ocGFyZW50ICYmIHBhcmVudFtwYXJlbnRQYXRoXSwgX2V4dGVuZHMoe30sIG9wdGlvbnMsIHtcbiAgICBwYXJlbnQsXG4gICAgcGF0aFxuICB9KSk7XG59O1xuXG5mb3IgKGNvbnN0IGFsaWFzIG9mIFsnZXF1YWxzJywgJ2lzJ10pIEJhc2VTY2hlbWEucHJvdG90eXBlW2FsaWFzXSA9IEJhc2VTY2hlbWEucHJvdG90eXBlLm9uZU9mO1xuXG5mb3IgKGNvbnN0IGFsaWFzIG9mIFsnbm90JywgJ25vcGUnXSkgQmFzZVNjaGVtYS5wcm90b3R5cGVbYWxpYXNdID0gQmFzZVNjaGVtYS5wcm90b3R5cGUubm90T25lT2Y7XG5cbkJhc2VTY2hlbWEucHJvdG90eXBlLm9wdGlvbmFsID0gQmFzZVNjaGVtYS5wcm90b3R5cGUubm90UmVxdWlyZWQ7IiwiaW1wb3J0IGxvY2FsZSBmcm9tICcuL2xvY2FsZSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRMb2NhbGUoY3VzdG9tKSB7XG4gIE9iamVjdC5rZXlzKGN1c3RvbSkuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgT2JqZWN0LmtleXMoY3VzdG9tW3R5cGVdKS5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBsb2NhbGVbdHlwZV1bbWV0aG9kXSA9IGN1c3RvbVt0eXBlXVttZXRob2RdO1xuICAgIH0pO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBzdHJpbmcgYXMgbG9jYWxlIH0gZnJvbSAnLi9sb2NhbGUnO1xuaW1wb3J0IGlzQWJzZW50IGZyb20gJy4vdXRpbC9pc0Fic2VudCc7XG5pbXBvcnQgQmFzZVNjaGVtYSBmcm9tICcuL3NjaGVtYSc7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXG5sZXQgckVtYWlsID0gL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC9pOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblxubGV0IHJVcmwgPSAvXigoaHR0cHM/fGZ0cCk6KT9cXC9cXC8oKCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OikqQCk/KCgoXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pXFwuKFxcZHxbMS05XVxcZHwxXFxkXFxkfDJbMC00XVxcZHwyNVswLTVdKVxcLihcXGR8WzEtOV1cXGR8MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC01XSlcXC4oXFxkfFsxLTldXFxkfDFcXGRcXGR8MlswLTRdXFxkfDI1WzAtNV0pKXwoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4/KSg6XFxkKik/KShcXC8oKChbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoJVtcXGRhLWZdezJ9KXxbIVxcJCYnXFwoXFwpXFwqXFwrLDs9XXw6fEApKyhcXC8oKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCkqKSopPyk/KFxcPygoKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCglW1xcZGEtZl17Mn0pfFshXFwkJidcXChcXClcXCpcXCssOz1dfDp8QCl8W1xcdUUwMDAtXFx1RjhGRl18XFwvfFxcPykqKT8oXFwjKCgoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KCVbXFxkYS1mXXsyfSl8WyFcXCQmJ1xcKFxcKVxcKlxcKyw7PV18OnxAKXxcXC98XFw/KSopPyQvaTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cbmxldCByVVVJRCA9IC9eKD86WzAtOWEtZl17OH0tWzAtOWEtZl17NH0tWzEtNV1bMC05YS1mXXszfS1bODlhYl1bMC05YS1mXXszfS1bMC05YS1mXXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTtcblxubGV0IGlzVHJpbW1lZCA9IHZhbHVlID0+IGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZSA9PT0gdmFsdWUudHJpbSgpO1xuXG5sZXQgb2JqU3RyaW5nVGFnID0ge30udG9TdHJpbmcoKTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoKSB7XG4gIHJldHVybiBuZXcgU3RyaW5nU2NoZW1hKCk7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHJpbmdTY2hlbWEgZXh0ZW5kcyBCYXNlU2NoZW1hIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9KTtcbiAgICB0aGlzLndpdGhNdXRhdGlvbigoKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zZm9ybShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUeXBlKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICAgICAgY29uc3Qgc3RyVmFsdWUgPSB2YWx1ZSAhPSBudWxsICYmIHZhbHVlLnRvU3RyaW5nID8gdmFsdWUudG9TdHJpbmcoKSA6IHZhbHVlO1xuICAgICAgICBpZiAoc3RyVmFsdWUgPT09IG9ialN0cmluZ1RhZykgcmV0dXJuIHZhbHVlO1xuICAgICAgICByZXR1cm4gc3RyVmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIF90eXBlQ2hlY2sodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpIHZhbHVlID0gdmFsdWUudmFsdWVPZigpO1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICB9XG5cbiAgX2lzUHJlc2VudCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5faXNQcmVzZW50KHZhbHVlKSAmJiAhIXZhbHVlLmxlbmd0aDtcbiAgfVxuXG4gIGxlbmd0aChsZW5ndGgsIG1lc3NhZ2UgPSBsb2NhbGUubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMudGVzdCh7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbmFtZTogJ2xlbmd0aCcsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbGVuZ3RoXG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoID09PSB0aGlzLnJlc29sdmUobGVuZ3RoKTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgbWluKG1pbiwgbWVzc2FnZSA9IGxvY2FsZS5taW4pIHtcbiAgICByZXR1cm4gdGhpcy50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnbWluJyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBtaW5cbiAgICAgIH0sXG5cbiAgICAgIHRlc3QodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGlzQWJzZW50KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPj0gdGhpcy5yZXNvbHZlKG1pbik7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIG1heChtYXgsIG1lc3NhZ2UgPSBsb2NhbGUubWF4KSB7XG4gICAgcmV0dXJuIHRoaXMudGVzdCh7XG4gICAgICBuYW1lOiAnbWF4JyxcbiAgICAgIGV4Y2x1c2l2ZTogdHJ1ZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbWF4XG4gICAgICB9LFxuXG4gICAgICB0ZXN0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoIDw9IHRoaXMucmVzb2x2ZShtYXgpO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBtYXRjaGVzKHJlZ2V4LCBvcHRpb25zKSB7XG4gICAgbGV0IGV4Y2x1ZGVFbXB0eVN0cmluZyA9IGZhbHNlO1xuICAgIGxldCBtZXNzYWdlO1xuICAgIGxldCBuYW1lO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgKHtcbiAgICAgICAgICBleGNsdWRlRW1wdHlTdHJpbmcgPSBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIG5hbWVcbiAgICAgICAgfSA9IG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVzc2FnZSA9IG9wdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGVzdCh7XG4gICAgICBuYW1lOiBuYW1lIHx8ICdtYXRjaGVzJyxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UgfHwgbG9jYWxlLm1hdGNoZXMsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgcmVnZXhcbiAgICAgIH0sXG4gICAgICB0ZXN0OiB2YWx1ZSA9PiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPT09ICcnICYmIGV4Y2x1ZGVFbXB0eVN0cmluZyB8fCB2YWx1ZS5zZWFyY2gocmVnZXgpICE9PSAtMVxuICAgIH0pO1xuICB9XG5cbiAgZW1haWwobWVzc2FnZSA9IGxvY2FsZS5lbWFpbCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXMockVtYWlsLCB7XG4gICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGV4Y2x1ZGVFbXB0eVN0cmluZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgdXJsKG1lc3NhZ2UgPSBsb2NhbGUudXJsKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhyVXJsLCB7XG4gICAgICBuYW1lOiAndXJsJyxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBleGNsdWRlRW1wdHlTdHJpbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHV1aWQobWVzc2FnZSA9IGxvY2FsZS51dWlkKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhyVVVJRCwge1xuICAgICAgbmFtZTogJ3V1aWQnLFxuICAgICAgbWVzc2FnZSxcbiAgICAgIGV4Y2x1ZGVFbXB0eVN0cmluZzogZmFsc2VcbiAgICB9KTtcbiAgfSAvLy0tIHRyYW5zZm9ybXMgLS1cblxuXG4gIGVuc3VyZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0KCcnKS50cmFuc2Zvcm0odmFsID0+IHZhbCA9PT0gbnVsbCA/ICcnIDogdmFsKTtcbiAgfVxuXG4gIHRyaW0obWVzc2FnZSA9IGxvY2FsZS50cmltKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHZhbCA9PiB2YWwgIT0gbnVsbCA/IHZhbC50cmltKCkgOiB2YWwpLnRlc3Qoe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICd0cmltJyxcbiAgICAgIHRlc3Q6IGlzVHJpbW1lZFxuICAgIH0pO1xuICB9XG5cbiAgbG93ZXJjYXNlKG1lc3NhZ2UgPSBsb2NhbGUubG93ZXJjYXNlKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHZhbHVlID0+ICFpc0Fic2VudCh2YWx1ZSkgPyB2YWx1ZS50b0xvd2VyQ2FzZSgpIDogdmFsdWUpLnRlc3Qoe1xuICAgICAgbWVzc2FnZSxcbiAgICAgIG5hbWU6ICdzdHJpbmdfY2FzZScsXG4gICAgICBleGNsdXNpdmU6IHRydWUsXG4gICAgICB0ZXN0OiB2YWx1ZSA9PiBpc0Fic2VudCh2YWx1ZSkgfHwgdmFsdWUgPT09IHZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICB9KTtcbiAgfVxuXG4gIHVwcGVyY2FzZShtZXNzYWdlID0gbG9jYWxlLnVwcGVyY2FzZSkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh2YWx1ZSA9PiAhaXNBYnNlbnQodmFsdWUpID8gdmFsdWUudG9VcHBlckNhc2UoKSA6IHZhbHVlKS50ZXN0KHtcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBuYW1lOiAnc3RyaW5nX2Nhc2UnLFxuICAgICAgZXhjbHVzaXZlOiB0cnVlLFxuICAgICAgdGVzdDogdmFsdWUgPT4gaXNBYnNlbnQodmFsdWUpIHx8IHZhbHVlID09PSB2YWx1ZS50b1VwcGVyQ2FzZSgpXG4gICAgfSk7XG4gIH1cblxufVxuY3JlYXRlLnByb3RvdHlwZSA9IFN0cmluZ1NjaGVtYS5wcm90b3R5cGU7IC8vXG4vLyBTdHJpbmcgSW50ZXJmYWNlc1xuLy8iLCJpbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWZlcmVuY2VTZXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmxpc3QgPSB2b2lkIDA7XG4gICAgdGhpcy5yZWZzID0gdm9pZCAwO1xuICAgIHRoaXMubGlzdCA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnJlZnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0LnNpemUgKyB0aGlzLnJlZnMuc2l6ZTtcbiAgfVxuXG4gIGRlc2NyaWJlKCkge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5saXN0KSBkZXNjcmlwdGlvbi5wdXNoKGl0ZW0pO1xuXG4gICAgZm9yIChjb25zdCBbLCByZWZdIG9mIHRoaXMucmVmcykgZGVzY3JpcHRpb24ucHVzaChyZWYuZGVzY3JpYmUoKSk7XG5cbiAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gIH1cblxuICB0b0FycmF5KCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubGlzdCkuY29uY2F0KEFycmF5LmZyb20odGhpcy5yZWZzLnZhbHVlcygpKSk7XG4gIH1cblxuICByZXNvbHZlQWxsKHJlc29sdmUpIHtcbiAgICByZXR1cm4gdGhpcy50b0FycmF5KCkucmVkdWNlKChhY2MsIGUpID0+IGFjYy5jb25jYXQoUmVmZXJlbmNlLmlzUmVmKGUpID8gcmVzb2x2ZShlKSA6IGUpLCBbXSk7XG4gIH1cblxuICBhZGQodmFsdWUpIHtcbiAgICBSZWZlcmVuY2UuaXNSZWYodmFsdWUpID8gdGhpcy5yZWZzLnNldCh2YWx1ZS5rZXksIHZhbHVlKSA6IHRoaXMubGlzdC5hZGQodmFsdWUpO1xuICB9XG5cbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgUmVmZXJlbmNlLmlzUmVmKHZhbHVlKSA/IHRoaXMucmVmcy5kZWxldGUodmFsdWUua2V5KSA6IHRoaXMubGlzdC5kZWxldGUodmFsdWUpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgbmV4dCA9IG5ldyBSZWZlcmVuY2VTZXQoKTtcbiAgICBuZXh0Lmxpc3QgPSBuZXcgU2V0KHRoaXMubGlzdCk7XG4gICAgbmV4dC5yZWZzID0gbmV3IE1hcCh0aGlzLnJlZnMpO1xuICAgIHJldHVybiBuZXh0O1xuICB9XG5cbiAgbWVyZ2UobmV3SXRlbXMsIHJlbW92ZUl0ZW1zKSB7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMuY2xvbmUoKTtcbiAgICBuZXdJdGVtcy5saXN0LmZvckVhY2godmFsdWUgPT4gbmV4dC5hZGQodmFsdWUpKTtcbiAgICBuZXdJdGVtcy5yZWZzLmZvckVhY2godmFsdWUgPT4gbmV4dC5hZGQodmFsdWUpKTtcbiAgICByZW1vdmVJdGVtcy5saXN0LmZvckVhY2godmFsdWUgPT4gbmV4dC5kZWxldGUodmFsdWUpKTtcbiAgICByZW1vdmVJdGVtcy5yZWZzLmZvckVhY2godmFsdWUgPT4gbmV4dC5kZWxldGUodmFsdWUpKTtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG59IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkgeyBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTsgdmFyIHRhcmdldCA9IHt9OyB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7IHZhciBrZXksIGk7IGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7IGtleSA9IHNvdXJjZUtleXNbaV07IGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5pbXBvcnQgbWFwVmFsdWVzIGZyb20gJ2xvZGFzaC9tYXBWYWx1ZXMnO1xuaW1wb3J0IFZhbGlkYXRpb25FcnJvciBmcm9tICcuLi9WYWxpZGF0aW9uRXJyb3InO1xuaW1wb3J0IFJlZiBmcm9tICcuLi9SZWZlcmVuY2UnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVmFsaWRhdGlvbihjb25maWcpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUoX3JlZiwgY2IpIHtcbiAgICBsZXQge1xuICAgICAgdmFsdWUsXG4gICAgICBwYXRoID0gJycsXG4gICAgICBsYWJlbCxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBvcmlnaW5hbFZhbHVlLFxuICAgICAgc3luY1xuICAgIH0gPSBfcmVmLFxuICAgICAgICByZXN0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgW1widmFsdWVcIiwgXCJwYXRoXCIsIFwibGFiZWxcIiwgXCJvcHRpb25zXCIsIFwib3JpZ2luYWxWYWx1ZVwiLCBcInN5bmNcIl0pO1xuXG4gICAgY29uc3Qge1xuICAgICAgbmFtZSxcbiAgICAgIHRlc3QsXG4gICAgICBwYXJhbXMsXG4gICAgICBtZXNzYWdlXG4gICAgfSA9IGNvbmZpZztcbiAgICBsZXQge1xuICAgICAgcGFyZW50LFxuICAgICAgY29udGV4dFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZShpdGVtKSB7XG4gICAgICByZXR1cm4gUmVmLmlzUmVmKGl0ZW0pID8gaXRlbS5nZXRWYWx1ZSh2YWx1ZSwgcGFyZW50LCBjb250ZXh0KSA6IGl0ZW07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRXJyb3Iob3ZlcnJpZGVzID0ge30pIHtcbiAgICAgIGNvbnN0IG5leHRQYXJhbXMgPSBtYXBWYWx1ZXMoX2V4dGVuZHMoe1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgb3JpZ2luYWxWYWx1ZSxcbiAgICAgICAgbGFiZWwsXG4gICAgICAgIHBhdGg6IG92ZXJyaWRlcy5wYXRoIHx8IHBhdGhcbiAgICAgIH0sIHBhcmFtcywgb3ZlcnJpZGVzLnBhcmFtcyksIHJlc29sdmUpO1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgVmFsaWRhdGlvbkVycm9yKFZhbGlkYXRpb25FcnJvci5mb3JtYXRFcnJvcihvdmVycmlkZXMubWVzc2FnZSB8fCBtZXNzYWdlLCBuZXh0UGFyYW1zKSwgdmFsdWUsIG5leHRQYXJhbXMucGF0aCwgb3ZlcnJpZGVzLnR5cGUgfHwgbmFtZSk7XG4gICAgICBlcnJvci5wYXJhbXMgPSBuZXh0UGFyYW1zO1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cblxuICAgIGxldCBjdHggPSBfZXh0ZW5kcyh7XG4gICAgICBwYXRoLFxuICAgICAgcGFyZW50LFxuICAgICAgdHlwZTogbmFtZSxcbiAgICAgIGNyZWF0ZUVycm9yLFxuICAgICAgcmVzb2x2ZSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBvcmlnaW5hbFZhbHVlXG4gICAgfSwgcmVzdCk7XG5cbiAgICBpZiAoIXN5bmMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0ZXN0LmNhbGwoY3R4LCB2YWx1ZSwgY3R4KSkudGhlbih2YWxpZE9yRXJyb3IgPT4ge1xuICAgICAgICAgIGlmIChWYWxpZGF0aW9uRXJyb3IuaXNFcnJvcih2YWxpZE9yRXJyb3IpKSBjYih2YWxpZE9yRXJyb3IpO2Vsc2UgaWYgKCF2YWxpZE9yRXJyb3IpIGNiKGNyZWF0ZUVycm9yKCkpO2Vsc2UgY2IobnVsbCwgdmFsaWRPckVycm9yKTtcbiAgICAgICAgfSkuY2F0Y2goY2IpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNiKGVycik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0O1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBfcmVmMjtcblxuICAgICAgcmVzdWx0ID0gdGVzdC5jYWxsKGN0eCwgdmFsdWUsIGN0eCk7XG5cbiAgICAgIGlmICh0eXBlb2YgKChfcmVmMiA9IHJlc3VsdCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9yZWYyLnRoZW4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVmFsaWRhdGlvbiB0ZXN0IG9mIHR5cGU6IFwiJHtjdHgudHlwZX1cIiByZXR1cm5lZCBhIFByb21pc2UgZHVyaW5nIGEgc3luY2hyb25vdXMgdmFsaWRhdGUuIGAgKyBgVGhpcyB0ZXN0IHdpbGwgZmluaXNoIGFmdGVyIHRoZSB2YWxpZGF0ZSBjYWxsIGhhcyByZXR1cm5lZGApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY2IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoVmFsaWRhdGlvbkVycm9yLmlzRXJyb3IocmVzdWx0KSkgY2IocmVzdWx0KTtlbHNlIGlmICghcmVzdWx0KSBjYihjcmVhdGVFcnJvcigpKTtlbHNlIGNiKG51bGwsIHJlc3VsdCk7XG4gIH1cblxuICB2YWxpZGF0ZS5PUFRJT05TID0gY29uZmlnO1xuICByZXR1cm4gdmFsaWRhdGU7XG59IiwiY29uc3QgaXNBYnNlbnQgPSB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBpc0Fic2VudDsiLCJjb25zdCBpc1NjaGVtYSA9IG9iaiA9PiBvYmogJiYgb2JqLl9faXNZdXBTY2hlbWFfXztcblxuZXhwb3J0IGRlZmF1bHQgaXNTY2hlbWE7IiwiLyogZXNsaW50LWRpc2FibGUgKi9cblxuLyoqXG4gKlxuICogRGF0ZS5wYXJzZSB3aXRoIHByb2dyZXNzaXZlIGVuaGFuY2VtZW50IGZvciBJU08gODYwMSA8aHR0cHM6Ly9naXRodWIuY29tL2Nzbm92ZXIvanMtaXNvODYwMT5cbiAqIE5PTi1DT05GT1JNQU5UIEVESVRJT04uXG4gKiDCqSAyMDExIENvbGluIFNub3ZlciA8aHR0cDovL3pldGFmbGVldC5jb20+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqL1xuLy8gICAgICAgICAgICAgIDEgWVlZWSAgICAgICAgICAgICAgICAgMiBNTSAgICAgICAgMyBERCAgICAgICAgICAgICAgNCBISCAgICAgNSBtbSAgICAgICAgNiBzcyAgICAgICAgICAgIDcgbXNlYyAgICAgICAgIDggWiA5IMKxICAgIDEwIHR6SEggICAgMTEgdHptbVxudmFyIGlzb1JlZyA9IC9eKFxcZHs0fXxbK1xcLV1cXGR7Nn0pKD86LT8oXFxkezJ9KSg/Oi0/KFxcZHsyfSkpPyk/KD86WyBUXT8oXFxkezJ9KTo/KFxcZHsyfSkoPzo6PyhcXGR7Mn0pKD86WyxcXC5dKFxcZHsxLH0pKT8pPyg/OihaKXwoWytcXC1dKShcXGR7Mn0pKD86Oj8oXFxkezJ9KSk/KT8pPyQvO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VJc29EYXRlKGRhdGUpIHtcbiAgdmFyIG51bWVyaWNLZXlzID0gWzEsIDQsIDUsIDYsIDcsIDEwLCAxMV0sXG4gICAgICBtaW51dGVzT2Zmc2V0ID0gMCxcbiAgICAgIHRpbWVzdGFtcCxcbiAgICAgIHN0cnVjdDtcblxuICBpZiAoc3RydWN0ID0gaXNvUmVnLmV4ZWMoZGF0ZSkpIHtcbiAgICAvLyBhdm9pZCBOYU4gdGltZXN0YW1wcyBjYXVzZWQgYnkg4oCcdW5kZWZpbmVk4oCdIHZhbHVlcyBiZWluZyBwYXNzZWQgdG8gRGF0ZS5VVENcbiAgICBmb3IgKHZhciBpID0gMCwgazsgayA9IG51bWVyaWNLZXlzW2ldOyArK2kpIHN0cnVjdFtrXSA9ICtzdHJ1Y3Rba10gfHwgMDsgLy8gYWxsb3cgdW5kZWZpbmVkIGRheXMgYW5kIG1vbnRoc1xuXG5cbiAgICBzdHJ1Y3RbMl0gPSAoK3N0cnVjdFsyXSB8fCAxKSAtIDE7XG4gICAgc3RydWN0WzNdID0gK3N0cnVjdFszXSB8fCAxOyAvLyBhbGxvdyBhcmJpdHJhcnkgc3ViLXNlY29uZCBwcmVjaXNpb24gYmV5b25kIG1pbGxpc2Vjb25kc1xuXG4gICAgc3RydWN0WzddID0gc3RydWN0WzddID8gU3RyaW5nKHN0cnVjdFs3XSkuc3Vic3RyKDAsIDMpIDogMDsgLy8gdGltZXN0YW1wcyB3aXRob3V0IHRpbWV6b25lIGlkZW50aWZpZXJzIHNob3VsZCBiZSBjb25zaWRlcmVkIGxvY2FsIHRpbWVcblxuICAgIGlmICgoc3RydWN0WzhdID09PSB1bmRlZmluZWQgfHwgc3RydWN0WzhdID09PSAnJykgJiYgKHN0cnVjdFs5XSA9PT0gdW5kZWZpbmVkIHx8IHN0cnVjdFs5XSA9PT0gJycpKSB0aW1lc3RhbXAgPSArbmV3IERhdGUoc3RydWN0WzFdLCBzdHJ1Y3RbMl0sIHN0cnVjdFszXSwgc3RydWN0WzRdLCBzdHJ1Y3RbNV0sIHN0cnVjdFs2XSwgc3RydWN0WzddKTtlbHNlIHtcbiAgICAgIGlmIChzdHJ1Y3RbOF0gIT09ICdaJyAmJiBzdHJ1Y3RbOV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtaW51dGVzT2Zmc2V0ID0gc3RydWN0WzEwXSAqIDYwICsgc3RydWN0WzExXTtcbiAgICAgICAgaWYgKHN0cnVjdFs5XSA9PT0gJysnKSBtaW51dGVzT2Zmc2V0ID0gMCAtIG1pbnV0ZXNPZmZzZXQ7XG4gICAgICB9XG5cbiAgICAgIHRpbWVzdGFtcCA9IERhdGUuVVRDKHN0cnVjdFsxXSwgc3RydWN0WzJdLCBzdHJ1Y3RbM10sIHN0cnVjdFs0XSwgc3RydWN0WzVdICsgbWludXRlc09mZnNldCwgc3RydWN0WzZdLCBzdHJ1Y3RbN10pO1xuICAgIH1cbiAgfSBlbHNlIHRpbWVzdGFtcCA9IERhdGUucGFyc2UgPyBEYXRlLnBhcnNlKGRhdGUpIDogTmFOO1xuXG4gIHJldHVybiB0aW1lc3RhbXA7XG59IiwiY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgZXJyb3JUb1N0cmluZyA9IEVycm9yLnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IHJlZ0V4cFRvU3RyaW5nID0gUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IHN5bWJvbFRvU3RyaW5nID0gdHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgPyBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nIDogKCkgPT4gJyc7XG5jb25zdCBTWU1CT0xfUkVHRVhQID0gL15TeW1ib2xcXCgoLiopXFwpKC4qKSQvO1xuXG5mdW5jdGlvbiBwcmludE51bWJlcih2YWwpIHtcbiAgaWYgKHZhbCAhPSArdmFsKSByZXR1cm4gJ05hTic7XG4gIGNvbnN0IGlzTmVnYXRpdmVaZXJvID0gdmFsID09PSAwICYmIDEgLyB2YWwgPCAwO1xuICByZXR1cm4gaXNOZWdhdGl2ZVplcm8gPyAnLTAnIDogJycgKyB2YWw7XG59XG5cbmZ1bmN0aW9uIHByaW50U2ltcGxlVmFsdWUodmFsLCBxdW90ZVN0cmluZ3MgPSBmYWxzZSkge1xuICBpZiAodmFsID09IG51bGwgfHwgdmFsID09PSB0cnVlIHx8IHZhbCA9PT0gZmFsc2UpIHJldHVybiAnJyArIHZhbDtcbiAgY29uc3QgdHlwZU9mID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGVPZiA9PT0gJ251bWJlcicpIHJldHVybiBwcmludE51bWJlcih2YWwpO1xuICBpZiAodHlwZU9mID09PSAnc3RyaW5nJykgcmV0dXJuIHF1b3RlU3RyaW5ncyA/IGBcIiR7dmFsfVwiYCA6IHZhbDtcbiAgaWYgKHR5cGVPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuICdbRnVuY3Rpb24gJyArICh2YWwubmFtZSB8fCAnYW5vbnltb3VzJykgKyAnXSc7XG4gIGlmICh0eXBlT2YgPT09ICdzeW1ib2wnKSByZXR1cm4gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWwpLnJlcGxhY2UoU1lNQk9MX1JFR0VYUCwgJ1N5bWJvbCgkMSknKTtcbiAgY29uc3QgdGFnID0gdG9TdHJpbmcuY2FsbCh2YWwpLnNsaWNlKDgsIC0xKTtcbiAgaWYgKHRhZyA9PT0gJ0RhdGUnKSByZXR1cm4gaXNOYU4odmFsLmdldFRpbWUoKSkgPyAnJyArIHZhbCA6IHZhbC50b0lTT1N0cmluZyh2YWwpO1xuICBpZiAodGFnID09PSAnRXJyb3InIHx8IHZhbCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gJ1snICsgZXJyb3JUb1N0cmluZy5jYWxsKHZhbCkgKyAnXSc7XG4gIGlmICh0YWcgPT09ICdSZWdFeHAnKSByZXR1cm4gcmVnRXhwVG9TdHJpbmcuY2FsbCh2YWwpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJpbnRWYWx1ZSh2YWx1ZSwgcXVvdGVTdHJpbmdzKSB7XG4gIGxldCByZXN1bHQgPSBwcmludFNpbXBsZVZhbHVlKHZhbHVlLCBxdW90ZVN0cmluZ3MpO1xuICBpZiAocmVzdWx0ICE9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgbGV0IHJlc3VsdCA9IHByaW50U2ltcGxlVmFsdWUodGhpc1trZXldLCBxdW90ZVN0cmluZ3MpO1xuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LCAyKTtcbn0iLCJpbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAncHJvcGVydHktZXhwcic7XG5cbmxldCB0cmltID0gcGFydCA9PiBwYXJ0LnN1YnN0cigwLCBwYXJ0Lmxlbmd0aCAtIDEpLnN1YnN0cigxKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluKHNjaGVtYSwgcGF0aCwgdmFsdWUsIGNvbnRleHQgPSB2YWx1ZSkge1xuICBsZXQgcGFyZW50LCBsYXN0UGFydCwgbGFzdFBhcnREZWJ1ZzsgLy8gcm9vdCBwYXRoOiAnJ1xuXG4gIGlmICghcGF0aCkgcmV0dXJuIHtcbiAgICBwYXJlbnQsXG4gICAgcGFyZW50UGF0aDogcGF0aCxcbiAgICBzY2hlbWFcbiAgfTtcbiAgZm9yRWFjaChwYXRoLCAoX3BhcnQsIGlzQnJhY2tldCwgaXNBcnJheSkgPT4ge1xuICAgIGxldCBwYXJ0ID0gaXNCcmFja2V0ID8gdHJpbShfcGFydCkgOiBfcGFydDtcbiAgICBzY2hlbWEgPSBzY2hlbWEucmVzb2x2ZSh7XG4gICAgICBjb250ZXh0LFxuICAgICAgcGFyZW50LFxuICAgICAgdmFsdWVcbiAgICB9KTtcblxuICAgIGlmIChzY2hlbWEuaW5uZXJUeXBlKSB7XG4gICAgICBsZXQgaWR4ID0gaXNBcnJheSA/IHBhcnNlSW50KHBhcnQsIDEwKSA6IDA7XG5cbiAgICAgIGlmICh2YWx1ZSAmJiBpZHggPj0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgWXVwLnJlYWNoIGNhbm5vdCByZXNvbHZlIGFuIGFycmF5IGl0ZW0gYXQgaW5kZXg6ICR7X3BhcnR9LCBpbiB0aGUgcGF0aDogJHtwYXRofS4gYCArIGBiZWNhdXNlIHRoZXJlIGlzIG5vIHZhbHVlIGF0IHRoYXQgaW5kZXguIGApO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSB2YWx1ZTtcbiAgICAgIHZhbHVlID0gdmFsdWUgJiYgdmFsdWVbaWR4XTtcbiAgICAgIHNjaGVtYSA9IHNjaGVtYS5pbm5lclR5cGU7XG4gICAgfSAvLyBzb21ldGltZXMgdGhlIGFycmF5IGluZGV4IHBhcnQgb2YgYSBwYXRoIGRvZXNuJ3QgZXhpc3Q6IFwibmVzdGVkLmFyci5jaGlsZFwiXG4gICAgLy8gaW4gdGhlc2UgY2FzZXMgdGhlIGN1cnJlbnQgcGFydCBpcyB0aGUgbmV4dCBzY2hlbWEgYW5kIHNob3VsZCBiZSBwcm9jZXNzZWRcbiAgICAvLyBpbiB0aGlzIGl0ZXJhdGlvbi4gRm9yIGNhc2VzIHdoZXJlIHRoZSBpbmRleCBzaWduYXR1cmUgaXMgaW5jbHVkZWQgdGhpc1xuICAgIC8vIGNoZWNrIHdpbGwgZmFpbCBhbmQgd2UnbGwgaGFuZGxlIHRoZSBgY2hpbGRgIHBhcnQgb24gdGhlIG5leHQgaXRlcmF0aW9uIGxpa2Ugbm9ybWFsXG5cblxuICAgIGlmICghaXNBcnJheSkge1xuICAgICAgaWYgKCFzY2hlbWEuZmllbGRzIHx8ICFzY2hlbWEuZmllbGRzW3BhcnRdKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzY2hlbWEgZG9lcyBub3QgY29udGFpbiB0aGUgcGF0aDogJHtwYXRofS4gYCArIGAoZmFpbGVkIGF0OiAke2xhc3RQYXJ0RGVidWd9IHdoaWNoIGlzIGEgdHlwZTogXCIke3NjaGVtYS5fdHlwZX1cIilgKTtcbiAgICAgIHBhcmVudCA9IHZhbHVlO1xuICAgICAgdmFsdWUgPSB2YWx1ZSAmJiB2YWx1ZVtwYXJ0XTtcbiAgICAgIHNjaGVtYSA9IHNjaGVtYS5maWVsZHNbcGFydF07XG4gICAgfVxuXG4gICAgbGFzdFBhcnQgPSBwYXJ0O1xuICAgIGxhc3RQYXJ0RGVidWcgPSBpc0JyYWNrZXQgPyAnWycgKyBfcGFydCArICddJyA6ICcuJyArIF9wYXJ0O1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBzY2hlbWEsXG4gICAgcGFyZW50LFxuICAgIHBhcmVudFBhdGg6IGxhc3RQYXJ0XG4gIH07XG59XG5cbmNvbnN0IHJlYWNoID0gKG9iaiwgcGF0aCwgdmFsdWUsIGNvbnRleHQpID0+IGdldEluKG9iaiwgcGF0aCwgdmFsdWUsIGNvbnRleHQpLnNjaGVtYTtcblxuZXhwb3J0IGRlZmF1bHQgcmVhY2g7IiwiaW1wb3J0IFZhbGlkYXRpb25FcnJvciBmcm9tICcuLi9WYWxpZGF0aW9uRXJyb3InO1xuXG5jb25zdCBvbmNlID0gY2IgPT4ge1xuICBsZXQgZmlyZWQgPSBmYWxzZTtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgaWYgKGZpcmVkKSByZXR1cm47XG4gICAgZmlyZWQgPSB0cnVlO1xuICAgIGNiKC4uLmFyZ3MpO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcnVuVGVzdHMob3B0aW9ucywgY2IpIHtcbiAgbGV0IHtcbiAgICBlbmRFYXJseSxcbiAgICB0ZXN0cyxcbiAgICBhcmdzLFxuICAgIHZhbHVlLFxuICAgIGVycm9ycyxcbiAgICBzb3J0LFxuICAgIHBhdGhcbiAgfSA9IG9wdGlvbnM7XG4gIGxldCBjYWxsYmFjayA9IG9uY2UoY2IpO1xuICBsZXQgY291bnQgPSB0ZXN0cy5sZW5ndGg7XG4gIGNvbnN0IG5lc3RlZEVycm9ycyA9IFtdO1xuICBlcnJvcnMgPSBlcnJvcnMgPyBlcnJvcnMgOiBbXTtcbiAgaWYgKCFjb3VudCkgcmV0dXJuIGVycm9ycy5sZW5ndGggPyBjYWxsYmFjayhuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9ycywgdmFsdWUsIHBhdGgpKSA6IGNhbGxiYWNrKG51bGwsIHZhbHVlKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdGVzdCA9IHRlc3RzW2ldO1xuICAgIHRlc3QoYXJncywgZnVuY3Rpb24gZmluaXNoVGVzdFJ1bihlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gYWx3YXlzIHJldHVybiBlYXJseSBmb3Igbm9uIHZhbGlkYXRpb24gZXJyb3JzXG4gICAgICAgIGlmICghVmFsaWRhdGlvbkVycm9yLmlzRXJyb3IoZXJyKSkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmRFYXJseSkge1xuICAgICAgICAgIGVyci52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5lc3RlZEVycm9ycy5wdXNoKGVycik7XG4gICAgICB9XG5cbiAgICAgIGlmICgtLWNvdW50IDw9IDApIHtcbiAgICAgICAgaWYgKG5lc3RlZEVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoc29ydCkgbmVzdGVkRXJyb3JzLnNvcnQoc29ydCk7IC8vc2hvdyBwYXJlbnQgZXJyb3JzIGFmdGVyIHRoZSBuZXN0ZWQgb25lczogbmFtZS5maXJzdCwgbmFtZVxuXG4gICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIG5lc3RlZEVycm9ycy5wdXNoKC4uLmVycm9ycyk7XG4gICAgICAgICAgZXJyb3JzID0gbmVzdGVkRXJyb3JzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9ycywgdmFsdWUsIHBhdGgpLCB2YWx1ZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59IiwiZnVuY3Rpb24gZmluZEluZGV4KGFyciwgZXJyKSB7XG4gIGxldCBpZHggPSBJbmZpbml0eTtcbiAgYXJyLnNvbWUoKGtleSwgaWkpID0+IHtcbiAgICB2YXIgX2VyciRwYXRoO1xuXG4gICAgaWYgKCgoX2VyciRwYXRoID0gZXJyLnBhdGgpID09IG51bGwgPyB2b2lkIDAgOiBfZXJyJHBhdGguaW5kZXhPZihrZXkpKSAhPT0gLTEpIHtcbiAgICAgIGlkeCA9IGlpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGlkeDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc29ydEJ5S2V5T3JkZXIoa2V5cykge1xuICByZXR1cm4gKGEsIGIpID0+IHtcbiAgICByZXR1cm4gZmluZEluZGV4KGtleXMsIGEpIC0gZmluZEluZGV4KGtleXMsIGIpO1xuICB9O1xufSIsImltcG9ydCBoYXMgZnJvbSAnbG9kYXNoL2hhcyc7IC8vIEB0cy1leHBlY3QtZXJyb3JcblxuaW1wb3J0IHRvcG9zb3J0IGZyb20gJ3RvcG9zb3J0JztcbmltcG9ydCB7IHNwbGl0IH0gZnJvbSAncHJvcGVydHktZXhwcic7XG5pbXBvcnQgUmVmIGZyb20gJy4uL1JlZmVyZW5jZSc7XG5pbXBvcnQgaXNTY2hlbWEgZnJvbSAnLi9pc1NjaGVtYSc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzb3J0RmllbGRzKGZpZWxkcywgZXhjbHVkZWRFZGdlcyA9IFtdKSB7XG4gIGxldCBlZGdlcyA9IFtdO1xuICBsZXQgbm9kZXMgPSBuZXcgU2V0KCk7XG4gIGxldCBleGNsdWRlcyA9IG5ldyBTZXQoZXhjbHVkZWRFZGdlcy5tYXAoKFthLCBiXSkgPT4gYCR7YX0tJHtifWApKTtcblxuICBmdW5jdGlvbiBhZGROb2RlKGRlcFBhdGgsIGtleSkge1xuICAgIGxldCBub2RlID0gc3BsaXQoZGVwUGF0aClbMF07XG4gICAgbm9kZXMuYWRkKG5vZGUpO1xuICAgIGlmICghZXhjbHVkZXMuaGFzKGAke2tleX0tJHtub2RlfWApKSBlZGdlcy5wdXNoKFtrZXksIG5vZGVdKTtcbiAgfVxuXG4gIGZvciAoY29uc3Qga2V5IGluIGZpZWxkcykgaWYgKGhhcyhmaWVsZHMsIGtleSkpIHtcbiAgICBsZXQgdmFsdWUgPSBmaWVsZHNba2V5XTtcbiAgICBub2Rlcy5hZGQoa2V5KTtcbiAgICBpZiAoUmVmLmlzUmVmKHZhbHVlKSAmJiB2YWx1ZS5pc1NpYmxpbmcpIGFkZE5vZGUodmFsdWUucGF0aCwga2V5KTtlbHNlIGlmIChpc1NjaGVtYSh2YWx1ZSkgJiYgJ2RlcHMnIGluIHZhbHVlKSB2YWx1ZS5kZXBzLmZvckVhY2gocGF0aCA9PiBhZGROb2RlKHBhdGgsIGtleSkpO1xuICB9XG5cbiAgcmV0dXJuIHRvcG9zb3J0LmFycmF5KEFycmF5LmZyb20obm9kZXMpLCBlZGdlcykucmV2ZXJzZSgpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBbXSA6IFtdLmNvbmNhdCh2YWx1ZSk7XG59IiwiaW1wb3J0IHsgbG9nLCBvYnNlcnZlTWVzc2FnZXMgfSBmcm9tIFwiLi4vb2JzZXJ2ZXJcIjtcclxuXHJcbi8qKlxyXG4gKlxyXG4gKiAgQWJzdHJhY3QgYWdlbnQgY2xhc3Mgd2l0aCBkZWZhdWx0IGZ1bmN0aW9ucy5cclxuICogXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQWdlbnQge1xyXG4gIC8vIHRoZSBuYW1lIG9mIHRoZSBhZ2VudFxyXG4gIG5hbWUgPSBcIlwiO1xyXG5cclxuICAvLyBkZWJ1ZyBmaWVsZCB0byB0dXJuIG9uXHJcbiAgLy8gb3Igb2ZmIGxvZ2dpbmcgZnVuY3Rpb25hbGl0eVxyXG4gIGRlYnVnID0gZmFsc2U7XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogU2V0cyB0aGUgbmFtZSBhbmQgdGhlIGRlYnVnXHJcbiAgICogc3RhdGUgb2YgdGhlIGFnZW50LlxyXG4gICAqXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IobmFtZSwgZGVidWcpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLmRlYnVnID0gZGVidWc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIFJldHVybnMgdGhlIG5hbWUgb2YgdGhlIGFnZW50LlxyXG4gICAqXHJcbiAgICovXHJcbiAgZ2V0IG5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IGRlYnVnIFxyXG4gICAqIHN0YXRlIG9mIHRoZSBhZ2VudC5cclxuICAgKiBcclxuICAgKi9cclxuICBnZXQgZGVidWcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kZWJ1ZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBhIHdyYXBwZXIgYXJvdW5kIFxyXG4gICAqIHRoZSBsb2cgZnVuY3Rpb24gb2YgdGhlIG9ic2VydmVyIGNsYXNzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgbG9nKG1lc3NhZ2VzKSB7XHJcbiAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICBsb2cobWVzc2FnZXMsIHRoaXMubmFtZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKCkgPT4ge307XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqXHJcbiAgICovXHJcbiAgc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xyXG4gICAgaWYgKCFtZXNzYWdlLmhhc093blByb3BlcnR5KFwic2VuZGVyXCIpKSB7XHJcbiAgICAgIG1lc3NhZ2VbXCJzZW5kZXJcIl0gPSB0aGlzLm5hbWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JzZXJ2ZU1lc3NhZ2VzKG1lc3NhZ2UpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBZ2VudCB9IGZyb20gXCIuLi9hZ2VudFwiO1xyXG5pbXBvcnQgKiBhcyBPYnNlcnZlciBmcm9tIFwiLi4vLi4vb2JzZXJ2ZXIuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudEFnZW50IGV4dGVuZHMgQWdlbnQge1xyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGFnZW50LlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVidWcgRW5hYmxlcyBsb2dnaW5nIGZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgYWdlbnQuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IobmFtZSwgZGVidWcpIHtcclxuICAgIHN1cGVyKG5hbWUsIGRlYnVnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogSW5pdGlhdGVzIGFsbCBuZWNlc3NhcnkgcGFyYW1ldGVycyBmb3IgdGhlIGFnZW50IHRvIHdvcmsuXHJcbiAgICogVGhpcyBmdW5jdGlvbiBnZXRzIGNhbGxlZCBieSB0aGUgZW52aXJvbm1lbnQgdXBvbiBjcmVhdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGluaXQgPSBhc3luYyAoKSA9PiB7fTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGludGVyZmFjZSB0byBjb21tdW5pY2F0ZSB3aXRoIHRoaXMgYWdlbnQuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbW1hbmQgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRoZSBhZ2VudCBzaG91bGQgZXhlY3V0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHRoZSBkYXRhIHRoYXQgZ2V0cyBwYXNzZWQgYWxvbmcgdG8gdGhlIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVjaWV2ZShjb21tYW5kLCBkYXRhLCB0YWJJZCkge1xyXG4gICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgIGNhc2UgXCJoYXNFdmVudFwiOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmhhc0V2ZW50KHRhYklkKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aGlzLmxvZyhbXCJVbmtub3duIGNvbW1hbmQuXCJdKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIGEgYnJvd3NlciB0YWIgd2l0aCBnaXZlbiB0YWJJZC5cclxuICAgKiBOb3Qgd29ya2luZyBhcyBvZiBub3cuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRhYklkXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2VcclxuICAgKi9cclxuICBhc3luYyBzZW5kKHRhYklkLCBtZXNzYWdlKSB7XHJcbiAgICBhd2FpdCBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VhcmNoZXMgZm9yIGFuIGV2ZW50IGluIHRoZSBlbWFpbCBib2R5IG9mIGEgdGFiLlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0YWJJZCBUaGUgdGFiIGlkIHRvIHF1ZXJ5IHRoZSBkaXNwbGF5ZWQgbWVzc2FnZS5cclxuICAgKi9cclxuICBhc3luYyBoYXNFdmVudCh0YWJJZCkge1xyXG4gICAgLy8gZ2V0IHRoZSBjdXJyZW50IG1lc3NhZ2UgZnJvbSB0aGUgZ2l2ZW4gdGFiXHJcbiAgICBjb25zdCBtZXNzYWdlSGVhZGVyID0gYXdhaXQgYnJvd3Nlci5tZXNzYWdlRGlzcGxheS5nZXREaXNwbGF5ZWRNZXNzYWdlKFxyXG4gICAgICB0YWJJZFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAobWVzc2FnZUhlYWRlcikge1xyXG4gICAgICBjb25zdCBlbWFpbEJvZHkgPSBhd2FpdCB0aGlzLmdldEVtYWlsQm9keShtZXNzYWdlSGVhZGVyLmlkLCBcInBsYWluXCIpO1xyXG4gICAgICBjb25zdCBldmVudHMgPSBhd2FpdCB0aGlzLnNlYXJjaEZvckV2ZW50cyhcclxuICAgICAgICBlbWFpbEJvZHksXHJcbiAgICAgICAgbWVzc2FnZUhlYWRlci5pZCxcclxuICAgICAgICBtZXNzYWdlSGVhZGVyLnN1YmplY3RcclxuICAgICAgKTtcclxuICAgICAgY29uc29sZS5sb2coZXZlbnRzKTtcclxuICAgICAgcmV0dXJuIGV2ZW50cyB8fCBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogU2VhcmNoZXMgZm9yIGFuIGV2ZW50IGluc2lkZSBhIGdpdmVuIHRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZW1haWxib2R5IFRoZSBlbWFpbCB0ZXh0LlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBtYWlsSWQgVGhlIGlkIG9mIHRoZSBlbWFpbC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3ViamVjdCBUaGUgc3ViamVjdCBvZiB0aGUgZW1haWwuXHJcbiAgICogQHJldHVybnMge0FycmF5fSBldmVudHNcclxuICAgKi9cclxuICBhc3luYyBzZWFyY2hGb3JFdmVudHMoZW1haWxib2R5LCBtYWlsSWQsIHN1YmplY3QpIHtcclxuICAgIGNvbnN0IHJ1bGVzID0gYXdhaXQgT2JzZXJ2ZXIub2JzZXJ2ZU1lc3NhZ2VzKHtcclxuICAgICAgY29tbWFuZDogXCJnZXRBbGxSdWxlc1wiLFxyXG4gICAgICByZWNpZXZlcjogXCJPcHRpb25zQWdlbnRcIixcclxuICAgICAgc2VuZGVyOiBcIkV2ZW50QWdlbnRcIixcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBldmVudHMgPSBbXTtcclxuICAgIHJ1bGVzLmV2ZXJ5KChwYXR0ZXJuKSA9PiB7XHJcbiAgICAgIGlmIChwYXR0ZXJuLmVuYWJsZWQpIHtcclxuICAgICAgICBldmVudHMgPSB0aGlzLnRlc3RQYXR0ZXJuKGVtYWlsYm9keSwgcGF0dGVybik7XHJcbiAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgLy9leGl0IGxvb3BcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy9jb250aW51ZVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGV2ZW50cy5mb3JFYWNoKChldnQpID0+IHtcclxuICAgICAgKGV2dFtcIm1haWxJRFwiXSA9IG1haWxJZCksIChldnRbXCJzdWJqZWN0XCJdID0gc3ViamVjdCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBldmVudHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUZXN0cyBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gYW5kIHJldHVybnMgYSByZXN1bHQuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVtYWlsYm9keVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZWdleFxyXG4gICAqL1xyXG4gIHRlc3RQYXR0ZXJuKGVtYWlsYm9keSwgcmVnZXgpIHtcclxuICAgIGNvbnN0IHJlID0gbmV3IFJlZ0V4cChyZWdleC5wYXR0ZXJuLCBcImdtXCIpO1xyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgbGV0IGFsbE1hdGNoZXMgPSBbXTtcclxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKGVtYWlsYm9keSkpICE9PSBudWxsKSB7XHJcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzIHdpdGggemVyby13aWR0aCBtYXRjaGVzXHJcbiAgICAgIGlmIChtYXRjaC5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XHJcbiAgICAgICAgcmUubGFzdEluZGV4Kys7XHJcbiAgICAgIH1cclxuICAgICAgbWF0Y2hbXCJwYXR0ZXJuXCJdID0gcmVnZXgucGF0dGVybjtcclxuICAgICAgaWYgKCF0aGlzLmZpbmREdXBsaWNhdGVFdmVudHMoYWxsTWF0Y2hlcywgbWF0Y2gpKSB7XHJcbiAgICAgICAgYWxsTWF0Y2hlcy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIG1hdGNoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBkZWJ1Z3N0ciA9IFtdO1xyXG4gICAgYWxsTWF0Y2hlcy5ldmVyeSgoYXJyKSA9PiBkZWJ1Z3N0ci5wdXNoKGFyclswXSkpO1xyXG4gICAgdGhpcy5sb2coW1xyXG4gICAgICBhbGxNYXRjaGVzLmxlbmd0aCArXHJcbiAgICAgICAgXCIgbWF0Y2hcIiArXHJcbiAgICAgICAgKGFsbE1hdGNoZXMubGVuZ3RoID4gMSA/IFwiZXNcIiA6IFwiXCIpICtcclxuICAgICAgICBcIi4gW1wiICtcclxuICAgICAgICBkZWJ1Z3N0ci5qb2luKFwifFwiKSArXHJcbiAgICAgICAgXCJdXCIsXHJcbiAgICBdKTtcclxuICAgIHJldHVybiBhbGxNYXRjaGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBldmVudCBpcyBhbHJlYWR5IGluXHJcbiAgICogdGhlIGV2ZW50cyBhcnJheS4gUmV0dXJucyBmYWxzZSBvdGhlcndpc2UuXHJcbiAgICogQHBhcmFtIHtBcnJheX0gZXZlbnRzIEFycmF5IG9mIGV2ZW50IG9iamVjdHMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCB0byBmaW5kIGEgZHVwbGljYXRlIG9mLlxyXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGZpbmREdXBsaWNhdGVFdmVudHMoZXZlbnRzLCBldmVudCkge1xyXG4gICAgcmV0dXJuIGV2ZW50cy5maW5kKChldnQpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coZXZ0WzBdICsgXCI9PVwiICsgZXZlbnRbMF0gKyBcIjpcIiArIChldnRbMF0gPT0gZXZlbnRbMF0pKTtcclxuICAgICAgcmV0dXJuIGV2dFswXSA9PSBldmVudFswXTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVmFsaWRhdGVzIGFuZCBleHRyYWN0cyBtZXNzYWdlIGJvZHkuXHJcbiAgICogQHBhcmFtIHtNZXNzYWdlUGFydH0gbWVzc2FnZXBhcnQgVGhlIHBhcnQgb2YgdGhlIG1lc3NhZ2UgdG8gZmluZFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBib2R5XHJcbiAgICovXHJcbiAgZXh0cmFjdE1lc3NhZ2UobWVzc2FnZXBhcnQsIGJvZHkpIHtcclxuICAgIGlmICghYm9keSkge1xyXG4gICAgICBib2R5ID0ge307XHJcbiAgICB9XHJcbiAgICBpZiAoXCJwYXJ0c1wiIGluIG1lc3NhZ2VwYXJ0KSB7XHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBtZXNzYWdlcGFydC5wYXJ0cy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICB0aGlzLmV4dHJhY3RNZXNzYWdlKG1lc3NhZ2VwYXJ0LnBhcnRzW2luZGV4XSwgYm9keSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChtZXNzYWdlcGFydC5oYXNPd25Qcm9wZXJ0eShcImJvZHlcIikpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIG1lc3NhZ2VwYXJ0Lmhhc093blByb3BlcnR5KFwiY29udGVudFR5cGVcIikgJiZcclxuICAgICAgICBtZXNzYWdlcGFydC5jb250ZW50VHlwZSA9PT0gXCJ0ZXh0L3BsYWluXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgYm9keS5wbGFpbiA9IG1lc3NhZ2VwYXJ0LmJvZHk7XHJcbiAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgbWVzc2FnZXBhcnQuaGFzT3duUHJvcGVydHkoXCJjb250ZW50VHlwZVwiKSAmJlxyXG4gICAgICAgIG1lc3NhZ2VwYXJ0LmNvbnRlbnRUeXBlID09PSBcInRleHQvaHRtbFwiXHJcbiAgICAgICkge1xyXG4gICAgICAgIGJvZHkuaHRtbCA9IG1lc3NhZ2VwYXJ0LmJvZHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBib2R5O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgY29ycmVzcG9uZGluZyBlbWFpbCB0byB0aGUgbWVzc2FnZSBpZCxcclxuICAgKiBleHRyYWN0cyB0aGUgYWN0dWFsIG1lc3NhZ2UgYW5kIHJldHVybnMgZGF0YVxyXG4gICAqIGJhc2VkIG9uIHRoZSB2YWx1ZSBvZiB0aGUgZm9ybWF0IHZhcmlhYmxlLlxyXG4gICAqICdwbGFpbicgYW5kICdodG1sJyBhcmUgcG9zc2libGUgZm9ybWF0IG9wdGlvbnMuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG1lc3NhZ2VJZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmb3JtYXRcclxuICAgKi9cclxuICBhc3luYyBnZXRFbWFpbEJvZHkobWVzc2FnZUlkLCBmb3JtYXQpIHtcclxuICAgIGxldCBib2R5ID0gYXdhaXQgYnJvd3Nlci5tZXNzYWdlc1xyXG4gICAgICAuZ2V0RnVsbChtZXNzYWdlSWQpXHJcbiAgICAgIC50aGVuKChtZXNzYWdlcGFydCkgPT4gdGhpcy5leHRyYWN0TWVzc2FnZShtZXNzYWdlcGFydCkpO1xyXG4gICAgcmV0dXJuIGZvcm1hdCA9PT0gXCJwbGFpblwiID8gYm9keS5wbGFpbiA6IGZvcm1hdCA9PT0gXCJodG1sXCIgPyBib2R5Lmh0bWwgOiBcIlwiO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBZ2VudCB9IGZyb20gXCIuLi9hZ2VudFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0S25vd2xlZGdlYmFzZSB9IGZyb20gXCIuLi8uLi9rbm93bGVkZ2ViYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3B0aW9uc0FnZW50IGV4dGVuZHMgQWdlbnQge1xyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGFnZW50LlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVidWcgRW5hYmxlcyBsb2dnaW5nIGZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgYWdlbnQuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IobmFtZSwgZGVidWcpIHtcclxuICAgIHN1cGVyKG5hbWUsIGRlYnVnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogSW5pdGlhdGVzIGFsbCBuZWNlc3NhcnkgcGFyYW1ldGVycyBmb3IgdGhlIGFnZW50IHRvIHdvcmsuXHJcbiAgICogVGhpcyBmdW5jdGlvbiBnZXRzIGNhbGxlZCBieSB0aGUgZW52aXJvbm1lbnQgdXBvbiBjcmVhdGlvbi5cclxuICAgKlxyXG4gICAqL1xyXG4gIGluaXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG4gICAgYXdhaXQgdGhpcy5sb2FkS25vd2xlZGdlYmFzZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogVGhlIGludGVyZmFjZSB0byBjb21tdW5pY2F0ZSB3aXRoIHRoaXMgYWdlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29tbWFuZCB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gdGhlIGFnZW50IHNob3VsZCBleGVjdXRlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgdGhlIGRhdGEgdGhhdCBnZXRzIHBhc3NlZCBhbG9uZyB0byB0aGUgZnVuY3Rpb25cclxuICAgKlxyXG4gICAqL1xyXG4gIHJlY2lldmUgPSBhc3luYyAoY29tbWFuZCwgZGF0YSkgPT4ge1xyXG4gICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgIGNhc2UgXCJjbGVhcktub3dsZWRnZWJhc2VcIjpcclxuICAgICAgICB0aGlzLmNsZWFyS25vd2xlZGdlYmFzZSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwicmVzZXRLbm93bGVkZ2ViYXNlXCI6XHJcbiAgICAgICAgdGhpcy5yZXNldEtub3dsZWRnZWJhc2UoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcImdldEFsbFJ1bGVzXCI6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsUnVsZXMoKTtcclxuICAgICAgY2FzZSBcInRvZ2dsZVJ1bGVcIjpcclxuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVSdWxlKGRhdGEpO1xyXG4gICAgICBjYXNlIFwiYWRkTmV3UnVsZVwiOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZE5ld1J1bGUoZGF0YSk7XHJcbiAgICAgIGNhc2UgXCJzZXRcIjpcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zZXQoZGF0YS5rZXksIGRhdGEudmFsdWUpO1xyXG4gICAgICBjYXNlIFwiZ2V0XCI6XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0KGRhdGEua2V5KTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aGlzLmxvZyhbXCJVbmtub3duIGNvbW1hbmQuXCJdKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUcmllcyB0byBzZXQgYSB2YWx1ZSBpbiB0aGUgbG9jYWwgc3RvcmFnZSBhcmVhXHJcbiAgICogb2YgdGhlIHdlYmV4dGVuc2lvbiBieSBhIGdpdmVuIGtleS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2V0IHRoZSB2YWx1ZSBmb3IuXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxyXG4gICAqL1xyXG4gIHNldCA9IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XHJcbiAgICBsZXQgb2JqID0ge307XHJcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsXHJcbiAgICAgIC5zZXQob2JqKVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2coW1wiU3VjY2VzZnVsbHkgc2V0IFwiICsga2V5ICsgXCIgdG8gXCIgKyB2YWx1ZV0pO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgIHRoaXMubG9nKFtcIkZhaWxlZCBzZXR0aW5nIFwiICsga2V5ICsgXCIgdG8gXCIgKyB2YWx1ZV0pO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIFJldHVybnMgYSBQcm9taXNlIG9mIHRoZSB2YWx1ZSBmb3IgZ2l2ZW4ga2V5XHJcbiAgICogZnJvbSBsb2NhbCBzdG9yYWdlLlxyXG4gICAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvciBpbiB0aGUgc3RvcmFnZS5cclxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxyXG4gICAqL1xyXG4gIGdldCA9IChrZXkpID0+IHtcclxuICAgIHJldHVybiBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBBdHRlbXB0cyB0byBsb2FkIHRoZSBzZXR0aW5ncyBmcm9tIHRoZSBzZXR0aW5ncy5qc29uXHJcbiAgICogYW5kIHNhdmUgdGhlIGNvbnRlbnQgaW4gdGhlIGxvY2FsIHN0b3JhZ2UgYXJlYSBvZlxyXG4gICAqIHRoZSBleHRlbnNpb24uXHJcbiAgICpcclxuICAgKi9cclxuICBsb2FkU2V0dGluZ3MgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB0aGlzLmxvZyhbXCJCdWlsZCBzZXR0aW5ncyBmcm9tIHNldHRpbmdzLmpzb24gZmlsZS4uLlwiXSk7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IGZldGNoKFxyXG4gICAgICBicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKFwiY29uZmlnL3NldHRpbmdzLmpzb25cIilcclxuICAgICkudGhlbigocmVzKSA9PiByZXMuanNvbigpKTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIHNldHRpbmdzKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuc2V0KGtleSwgc2V0dGluZ3Nba2V5XSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmxvZyhbXCJEb25lLlwiXSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBSZWNyZWF0ZXMgdGhlIGRhdGFiYXNlIGVpdGhlciBmcm9tIGZpbGVcclxuICAgKiBvciBmcm9tIGRlZmF1bHQgdmFsdWVzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgbG9hZEtub3dsZWRnZWJhc2UgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB0aGlzLmxvZyhbXCJCdWlsZCBrbm93bGVkZ2ViYXNlIGZyb20gZGIuanNvbiBmaWxlLi4uXCJdKTtcclxuICAgIC8vIHdlYiBhY2Nlc2FibGVfcmVzc291cmNlcyBpbiBtYW5pZmVzdCBhbmRcclxuICAgIC8vIGZldGNoL1htbEh0dHBSZXF1ZXN0IGFsbG93cyB0byByZWFkIHRob3NlIGZpbGVzXHJcbiAgICAvLyBubyBuZWVkIGZvciBleHBlcmltZW50IGFwaVxyXG4gICAgbGV0IGRiO1xyXG4gICAgdHJ5IHtcclxuICAgICAgZGIgPSBhd2FpdCBmZXRjaChicm93c2VyLnJ1bnRpbWUuZ2V0VVJMKFwiY29uZmlnL2RiLmpzb25cIikpLnRoZW4oKHJlcykgPT5cclxuICAgICAgICByZXMuanNvbigpXHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmxvZyhbXCJGYWlsZWQgdG8gcmVhZCBkYiBmcm9tIGRiLmpzb24uXCIsIGVycm9yXSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRiKSB7XHJcbiAgICAgIHRoaXMubG9nKFtcIkZvdW5kIGRhdGFiYXNlIGZpbGUuLi5cIl0pO1xyXG4gICAgICAvLyBpZiB0aGUgZGF0YWJhc2Ugb2JqZWN0IGlzIG5vdCBlbXB0eSBzZXQgaXQgaW50byBzdG9yYWdlXHJcbiAgICAgIGlmIChPYmplY3Qua2V5cyhkYikubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zZXQoXCJkYlwiLCBkYik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubG9nKFtcIkRhdGFiYXNlIGZpbGUgY29udGFpbnMgZW1wdHkgb2JqZWN0LlwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFrZSBkZWZhdWx0IHJ1bGVzXHJcbiAgICB0aGlzLmxvZyhbXCJVc2luZyBkZWZhdWx0IGRhdGFiYXNlIGZpbGUuLi5cIl0pO1xyXG4gICAgYXdhaXQgdGhpcy5zZXQoXCJkYlwiLCBkZWZhdWx0S25vd2xlZGdlYmFzZSk7XHJcbiAgICBicm93c2VyLm15YXBpLndyaXRlSnNvbihkZWZhdWx0S25vd2xlZGdlYmFzZSwgXCJkYlwiKTtcclxuICAgIHRoaXMubG9nKFtcIkRvbmUuXCJdKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEF0dGVtcHRzIHRvIGNsZWFyIHRoZSBkYXRhYmFzZVxyXG4gICAqIGluIHN0b3JhZ2UgYW5kIGluc2lkZSB0aGUgZmlsZS5cclxuICAgKiBcclxuICAgKi9cclxuICBjbGVhcktub3dsZWRnZWJhc2UgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB0aGlzLmxvZyhbXCJDbGVhcmluZyBrbm93bGVkZ2ViYXNlLi4uXCJdKTtcclxuICAgIGF3YWl0IHRoaXMuc2V0KFwiZGJcIiwgeyBkZToge30sIGVuOiB7fSB9KTtcclxuICAgIGF3YWl0IGJyb3dzZXIubXlhcGkud3JpdGVKc29uKHsgZGU6IHt9LCBlbjoge30gfSwgXCJkYlwiKTtcclxuICAgIHRoaXMubG9nKFtcIkRvbmUuXCIsIFwiXCJdKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEF0dGVtcHRzIHRvIHJlc2V0IHRoZSBkYXRhYmFzZVxyXG4gICAqIHRvIGRlZmF1bHQuXHJcbiAgICogXHJcbiAgICovXHJcbiAgcmVzZXRLbm93bGVkZ2ViYXNlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgdGhpcy5sb2coW1wiUmVzZXR0aW5nIGtub3dsZWRnZWJhc2UuLi5cIl0pO1xyXG4gICAgYXdhaXQgdGhpcy5zZXQoXCJkYlwiLCBkZWZhdWx0S25vd2xlZGdlYmFzZSk7XHJcbiAgICBhd2FpdCBicm93c2VyLm15YXBpLndyaXRlSnNvbihkZWZhdWx0S25vd2xlZGdlYmFzZSwgXCJkYlwiKTtcclxuICAgIHRoaXMubG9nKFtcIkRvbmUuXCIsIFwiXCJdKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEdldCBhbGwgcnVsZXMgc3RvcmVkIGluc2lkZVxyXG4gICAqIHRoZSBkYXRhYmFzZS5cclxuICAgKiBcclxuICAgKi9cclxuICBnZXRBbGxSdWxlcyA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHsgZGIgfSA9IGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoXCJkYlwiKS50aGVuKChpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCB7IGRlLCBlbiB9ID0gZGI7XHJcbiAgICBjb25zdCBydWxlcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGUpIHtcclxuICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlLCBrZXkpKSB7XHJcbiAgICAgICAgY29uc3QgcnVsZSA9IGRlW2tleV07XHJcbiAgICAgICAgaWYgKHJ1bGUuZW5hYmxlZCkge1xyXG4gICAgICAgICAgcnVsZXMucHVzaChydWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAoY29uc3Qga2V5IGluIGVuKSB7XHJcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChlbiwga2V5KSkge1xyXG4gICAgICAgIGNvbnN0IHJ1bGUgPSBlbltrZXldO1xyXG4gICAgICAgIGlmIChydWxlLmVuYWJsZWQpIHtcclxuICAgICAgICAgIHJ1bGVzLnB1c2gocnVsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmxvZyhbcnVsZXNdKTtcclxuICAgIHJldHVybiBydWxlcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEFkZHMgYSBuZXcgcnVsZSB0byB0aGUgZGF0YWJhc2UuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcclxuICAgKi9cclxuICBhZGROZXdSdWxlID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHsgcGF0dGVybiwgbGFuZ3VhZ2UsIGV4YW1wbGUgfSA9IGRhdGE7XHJcblxyXG4gICAgbGV0IHsgZGIgfSA9IGF3YWl0IHRoaXMuZ2V0KFwiZGJcIik7XHJcbiAgICBjb25zb2xlLmxvZyhkYik7XHJcbiAgICBsZXQgbGFzdEtleSA9IE9iamVjdC5rZXlzKGRiW2xhbmd1YWdlXSlbXHJcbiAgICAgIE9iamVjdC5rZXlzKGRiW2xhbmd1YWdlXSkubGVuZ3RoIC0gMVxyXG4gICAgXTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBsYXN0S2V5ID0gcGFyc2VJbnQobGFzdEtleSk7XHJcbiAgICAgIGNvbnN0IG5leHRLZXkgPSBsYXN0S2V5ICsgMTtcclxuICAgICAgZGJbbGFuZ3VhZ2VdW25leHRLZXldID0geyBlbmFibGVkOiB0cnVlLCBwYXR0ZXJuLCBleGFtcGxlIH07XHJcbiAgICAgIGF3YWl0IHRoaXMuc2V0KFwiZGJcIiwgZGIpO1xyXG4gICAgICBhd2FpdCBicm93c2VyLm15YXBpLndyaXRlSnNvbihkYiwgXCJkYlwiKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFxyXG4gICAqIFR1cm4gYSBydWxlIG9uIG9yIG9mZi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxyXG4gICAqIFxyXG4gICAqL1xyXG4gIHRvZ2dsZVJ1bGUgPSBhc3luYyAoZGF0YSkgPT4ge1xyXG4gICAgY29uc3QgeyBwYXRoLCBlbmFibGVkIH0gPSBkYXRhO1xyXG4gICAgbGV0IGtleXMgPSBwYXRoLnNwbGl0KFwiLlwiKTtcclxuICAgIGxldCB7IGRiIH0gPSBhd2FpdCB0aGlzLmdldChcImRiXCIpO1xyXG4gICAgZGJba2V5c1swXV1ba2V5c1sxXV1bXCJlbmFibGVkXCJdID0gZW5hYmxlZDtcclxuICAgIHRoaXMuc2V0KFwiZGJcIiwgZGIpO1xyXG4gICAgYXdhaXQgYnJvd3Nlci5teWFwaS53cml0ZUpzb24oZGIsIFwiZGJcIik7XHJcbiAgfTtcclxuICBcclxufSIsImltcG9ydCB7IEFnZW50IH0gZnJvbSBcIi4uL2FnZW50XCI7XHJcbmltcG9ydCAqIGFzIGljc2FwaSBmcm9tIFwiaWNzXCI7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hZGFtZ2liYm9ucy9pY3NcclxuaW1wb3J0ICogYXMgRGF0ZVBhcnNlciBmcm9tIFwiYW55LWRhdGUtcGFyc2VyXCI7IC8vaHR0cHM6Ly9naXRodWIuY29tL2tlbnNueWRlci9hbnktZGF0ZS1wYXJzZXJcclxuXHJcbmV4cG9ydCBjbGFzcyBPdXRwdXRBZ2VudCBleHRlbmRzIEFnZW50IHtcclxuICBjYWxlbmRhcklkID0gXCJcIjtcclxuICBjYWxlbmRhcjtcclxuICBjYWxlbmRhck5hbWUgPSBcIlwiO1xyXG4gIGRlZmF1bHRDYWxlbmRhck5hbWUgPSBcIkVSUyBDYWxlbmRhclwiO1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhZ2VudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGFnZW50LlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVidWcgRW5hYmxlcyBsb2dnaW5nIGZ1bmN0aW9uYWxpdHkgZm9yIHRoaXMgYWdlbnQuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoYWdlbnROYW1lLCBkZWJ1Zykge1xyXG4gICAgc3VwZXIoYWdlbnROYW1lLCBkZWJ1Zyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEluaXRpYXRlcyBhbGwgbmVjZXNzYXJ5IHBhcmFtZXRlcnMgZm9yIHRoZSBhZ2VudCB0byB3b3JrLlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgYnkgdGhlIGVudmlyb25tZW50IHVwb24gY3JlYXRpb24uXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgY2FsZW5kYXIgbmFtZSBhbmQgYXR0ZW1wdHMgdG8gY3JlYXRlIGEgY2FsZW5kYXJcclxuICAgKiB3aXRoIGRlZmF1bHQgbmFtZSBpbiBjYXNlIG5vbmUgaXMgZXhpc3RlbnQuXHJcbiAgICpcclxuICAgKi9cclxuICBpbml0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgLy8gYXNrIGFnZW50IGlmIHRoZXJlIGlzIGEgY2FsZW5kYXJOYW1lIGluIHN0b3JhZ2VcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJOYW1lIH0gPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKHtcclxuICAgICAgcmVjaWV2ZXI6IFwiT3B0aW9uc0FnZW50XCIsXHJcbiAgICAgIGNvbW1hbmQ6IFwiZ2V0XCIsXHJcbiAgICAgIGRhdGE6IHsga2V5OiBcImNhbGVuZGFyTmFtZVwiIH0sXHJcbiAgICB9KTtcclxuICAgIGlmICh0eXBlb2YgY2FsZW5kYXJOYW1lID09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgLy8gZGVmYXVsdCBjYWxlbmRhciBuYW1lXHJcbiAgICAgIHRoaXMuY2FsZW5kYXJOYW1lID0gdGhpcy5kZWZhdWx0Q2FsZW5kYXJOYW1lO1xyXG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKHtcclxuICAgICAgICBjb21tYW5kOiBcInNldFwiLFxyXG4gICAgICAgIHJlY2lldmVyOiBcIk9wdGlvbnNBZ2VudFwiLFxyXG4gICAgICAgIGRhdGE6IHsga2V5OiBcImNhbGVuZGFyTmFtZVwiLCB2YWx1ZTogdGhpcy5kZWZhdWx0Q2FsZW5kYXJOYW1lIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmxvZyhbXCJVc2luZyBkZWZhdWx0IGNhbGVuZGFyIG5hbWU6IFwiICsgdGhpcy5kZWZhdWx0Q2FsZW5kYXJOYW1lXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBnaXZlbiBjYWxlbmRhciBuYW1lIGJ5IGVudmlyb25tZW50XHJcbiAgICAgIHRoaXMubG9nKFtcIkZvdW5kIGV4aXN0aW5nIGNhbGVuZGFyIG5hbWUuXCJdKTtcclxuICAgICAgdGhpcy5jYWxlbmRhck5hbWUgPSBjYWxlbmRhck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgdGhpcy5maW5kRXhpc3RpbmdDYWxlbmRhcih0aGlzLmNhbGVuZGFyTmFtZSk7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuY2FsZW5kYXIgPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLmF0dGVtcHRDcmVhdGVDYWxlbmRhcih0aGlzLmNhbGVuZGFyTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIFRoZSBpbnRlcmZhY2UgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGlzIGFnZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbW1hbmQgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRoZSBhZ2VudCBzaG91bGQgZXhlY3V0ZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHRoZSBkYXRhIHRoYXQgZ2V0cyBwYXNzZWQgYWxvbmcgdG8gdGhlIGZ1bmN0aW9uXHJcbiAgICovXHJcbiAgcmVjaWV2ZSA9IGFzeW5jIChjb21tYW5kLCBkYXRhKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgY2FzZSBcInRyaWdnZXJJY3NEb3dubG9hZFwiOlxyXG4gICAgICAgIHRoaXMuY3JlYXRlSWNzRG93bmxvYWQoZGF0YS5ldmVudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJ0cmlnZ2VyQ2FsZW5kYXJFbnRyeVwiOlxyXG4gICAgICAgIHRoaXMuY3JlYXRlQ2FsZW5kYXJFbnRyeShkYXRhLmV2ZW50KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcImF0dGVtcHRDcmVhdGVDYWxlbmRhclwiOlxyXG4gICAgICAgIHRoaXMuYXR0ZW1wdENyZWF0ZUNhbGVuZGFyKGRhdGEubmFtZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5sb2coW1wiVW5rbm93biBjb21tYW5kLlwiXSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8jcmVnaW9uIENBTEVOREFSXHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgbGlzdGVuZXIgb25DcmVhdGVkIGZvciB1c2Vybm90aWZpY2F0aW9uLlxyXG4gICAqL1xyXG4gIGFkZExpc3RlbmVycyA9ICgpID0+IHtcclxuICAgIG1lc3Nlbmdlci5jYWxlbmRhci5pdGVtcy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoXHJcbiAgICAgIChpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGVkIGl0ZW1cIiwgaXRlbSk7XHJcbiAgICAgICAgYnJvd3Nlci5ub3RpZmljYXRpb25zLmNyZWF0ZSh7XHJcbiAgICAgICAgICB0eXBlOiBcImJhc2ljXCIsXHJcbiAgICAgICAgICB0aXRsZTogXCJOZXcgY2FsZW5kZXIgZW50cnlcIixcclxuICAgICAgICAgIG1lc3NhZ2U6IGl0ZW0udGl0bGUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHsgcmV0dXJuRm9ybWF0OiBcImljYWxcIiB9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGVtcHRzIHRvIGNyZWF0ZSBhIGNhbGVuZGFyLlxyXG4gICAqL1xyXG4gIGF0dGVtcHRDcmVhdGVDYWxlbmRhciA9IGFzeW5jIChjYWxlbmRhck5hbWUpID0+IHtcclxuICAgIHRoaXMubG9nKFtcIkF0dGVtcHQgdG8gY3JlYXRlIGEgY2FsZW5kYXIgd2l0aCBuYW1lOiBcIiArIGNhbGVuZGFyTmFtZV0pO1xyXG4gICAgYXdhaXQgbWVzc2VuZ2VyLmNhbGVuZGFyLmNhbGVuZGFycy5jcmVhdGUoe1xyXG4gICAgICBuYW1lOiBjYWxlbmRhck5hbWUsXHJcbiAgICAgIHR5cGU6IFwic3RvcmFnZVwiLFxyXG4gICAgICBjb2xvcjogXCJyZWRcIixcclxuICAgICAgdXJsOiBcIm1vei1zdG9yYWdlLWNhbGVuZGFyOi8vXCIsXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEZpbmQgYSBjYWxlbmRhciBieSBpdHMgbmFtZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjYWxlbmRhci5cclxuICAgKiBAcmV0dXJuc1xyXG4gICAqL1xyXG4gIGZpbmRFeGlzdGluZ0NhbGVuZGFyID0gYXN5bmMgKG5hbWUpID0+IHtcclxuICAgIHRoaXMubG9nKFtcIlRyeSBmaW5kaW5nIGNhbGVuZGFyIGJ5IG5hbWU6IFwiICsgbmFtZV0sIHRoaXMubmFtZSk7XHJcblxyXG4gICAgLy8gcG9zc2libGUgcXVlcnkgcGFyYW1zOlxyXG4gICAgLy97XHJcbiAgICAvLyAgICAgdHlwZSxcclxuICAgIC8vICAgICB1cmwsXHJcbiAgICAvLyAgICAgbmFtZSxcclxuICAgIC8vICAgICBjb2xvcixcclxuICAgIC8vICAgICByZWFkT25seSxcclxuICAgIC8vICAgICBlbmFibGVkLFxyXG4gICAgLy8gfVxyXG4gICAgY29uc3QgZm91bmRDYWxlbmRhciA9IGF3YWl0IG1lc3Nlbmdlci5jYWxlbmRhci5jYWxlbmRhcnMucXVlcnkoeyBuYW1lIH0pO1xyXG5cclxuICAgIGlmIChmb3VuZENhbGVuZGFyLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvZyhbXHJcbiAgICAgIFwiRm91bmQgZXhpc3RpbmcgY2FsZW5kYXIgXCIgKyBmb3VuZENhbGVuZGFyWzBdLmlkICsgXCIuLi5cIixcclxuICAgICAgZm91bmRDYWxlbmRhcixcclxuICAgIF0pO1xyXG4gICAgdGhpcy5jYWxlbmRhcklkID0gZm91bmRDYWxlbmRhclswXS5pZDtcclxuICAgIHRoaXMuY2FsZW5kYXIgPSBmb3VuZENhbGVuZGFyO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIGNhbGVuZGFyIGVudHJ5LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxyXG4gICAqL1xyXG4gIGNyZWF0ZUNhbGVuZGFyRW50cnkgPSAoZXZlbnQpID0+IHtcclxuICAgIGlmIChldmVudCkge1xyXG4gICAgICBjb25zdCBwYXJzZWREYXRlID0gRGF0ZVBhcnNlci5mcm9tU3RyaW5nKGV2ZW50WzBdKTtcclxuICAgICAgdGhpcy5sb2coW1wicGFyc2VkIGRhdGU6IFwiLCBwYXJzZWREYXRlXSk7XHJcblxyXG4gICAgICBjb25zdCBldmVudHByb3BlcnRpZXMgPSB0aGlzLmNyZWF0ZUljc1Byb3BlcnRpZXMocGFyc2VkRGF0ZSk7XHJcbiAgICAgIGNvbnN0IGljcyA9IHRoaXMuY3JlYXRlSWNzU3RyaW5nKGV2ZW50cHJvcGVydGllcyk7XHJcblxyXG4gICAgICBjb25zdCBlbnRyeSA9IHtcclxuICAgICAgICBpZDogY3J5cHRvLnJhbmRvbVVVSUQoKSxcclxuICAgICAgICB0eXBlOiBcImV2ZW50XCIsXHJcbiAgICAgICAgdGl0bGU6IGV2ZW50W1wic3ViamVjdFwiXSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZXZlbnRbXCJpbnB1dFwiXSxcclxuICAgICAgICBjYXRlZ29yaWVzOiBbXCJBc3Npc3RlbnpzeXN0ZW1cIl0sXHJcbiAgICAgICAgc3RhcnREYXRlOiB0aGlzLmZvcm1hdERhdGVGb3JDYWxlbmRhckVudHJ5KHBhcnNlZERhdGUpLFxyXG4gICAgICAgIGVuZERhdGU6IHRoaXMuZm9ybWF0RGF0ZUZvckNhbGVuZGFyRW50cnkocGFyc2VkRGF0ZSksXHJcbiAgICAgICAgZm9ybWF0czogeyB1c2U6IG51bGwsIGljYWw6IGljcyB9LFxyXG4gICAgICB9O1xyXG4gICAgICBtZXNzZW5nZXIuY2FsZW5kYXIuaXRlbXMuY3JlYXRlKHRoaXMuY2FsZW5kYXJJZCwgZW50cnkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vI2VuZHJlZ2lvblxyXG5cclxuICAvLyNyZWdpb24gSUNBTFxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGljYWwgc3RyaW5nIHRvIG9mZmVyIHRvIHRoZSBicm93c2VyJ3NcclxuICAgKiBkb3dubG9hZCBmdW5jdGlvbmFsaXR5LiBJdCBzdGFydHMgdGhlIGRvd25sb2FkLlxyXG4gICAqXHJcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL01vemlsbGEvQWRkLW9ucy9XZWJFeHRlbnNpb25zL0FQSS9kb3dubG9hZHMvZG93bmxvYWRcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcclxuICAgKi9cclxuICBjcmVhdGVJY3NEb3dubG9hZChldmVudCkge1xyXG4gICAgaWYgKGV2ZW50KSB7XHJcbiAgICAgIHRoaXMubG9nKFtcclxuICAgICAgICBcIkNyZWF0aW5nIG1hcmt1cCBmb3IgSUNhbCBkb3dubG9hZC4gQXR0ZW1wdGluZyB0byBwYXJzZSBldmVudHN0cmluZzogXCIgK1xyXG4gICAgICAgICAgZXZlbnRbMF0sXHJcbiAgICAgIF0pO1xyXG4gICAgICBjb25zdCBwYXJzZWREYXRlID0gRGF0ZVBhcnNlci5mcm9tU3RyaW5nKGV2ZW50WzBdKTtcclxuICAgICAgdGhpcy5sb2coXCJwYXJzZWREYXRlOiBcIiArIHBhcnNlZERhdGUpO1xyXG4gICAgICBjb25zdCBldmVudHByb3BlcnRpZXMgPSB0aGlzLmNyZWF0ZUljc1Byb3BlcnRpZXMocGFyc2VkRGF0ZSk7XHJcbiAgICAgIGNvbnN0IGljYWwgPSB0aGlzLmNyZWF0ZUljc1N0cmluZyhldmVudHByb3BlcnRpZXMpO1xyXG4gICAgICBpZiAoaWNhbCkge1xyXG4gICAgICAgIGJyb3dzZXIuZG93bmxvYWRzLmRvd25sb2FkKHtcclxuICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChcclxuICAgICAgICAgICAgbmV3IEJsb2IoW2ljYWxdLCB7IHR5cGU6IFwidGV4dC9jYWxlbmRhcjtjaGFyc2V0PXV0Zi04XCIgfSlcclxuICAgICAgICAgICksXHJcbiAgICAgICAgICBmaWxlbmFtZTogXCJldmVudC5pY3NcIixcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtEYXRlfSBkYXRlXHJcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYWRhbWdpYmJvbnMvaWNzXHJcbiAgICovXHJcbiAgY3JlYXRlSWNzUHJvcGVydGllcyhkYXRlKSB7XHJcbiAgICB0aGlzLmxvZyhbXCJjcmVhdGVJY3NQcm9wZXJ0aWVzKGRhdGUpIGdvdDogXCIsIGRhdGVdKTtcclxuXHJcbiAgICBjb25zdCBhcnIgPSBpY3NhcGkuY29udmVydFRpbWVzdGFtcFRvQXJyYXkoZGF0ZSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogXCJcIixcclxuICAgICAgc3RhcnQ6IGFycixcclxuICAgICAgZHVyYXRpb246IHsgaG91cnM6IDAsIG1pbnV0ZXM6IDMwIH0sXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcImdlbmVyYXRlZCBieSBleHRlbnNpb25cIixcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHByb3BlcnRpZXNcclxuICAgKi9cclxuICBjcmVhdGVJY3NTdHJpbmcoZXZlbnRwcm9wZXJ0aWVzKSB7XHJcbiAgICB0aGlzLmxvZyhbXCJjcmVhdGVJY3NTdHJpbmcoZXZlbnRwcm9wZXJ0aWVzKSBnb3Q6IFwiLCBldmVudHByb3BlcnRpZXNdKTtcclxuICAgIGNvbnN0IHsgZXJyb3IsIHZhbHVlIH0gPSBpY3NhcGkuY3JlYXRlRXZlbnQoZXZlbnRwcm9wZXJ0aWVzKTtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVxyXG4gICAqL1xyXG4gIGZvcm1hdERhdGVGb3JDYWxlbmRhckVudHJ5KGRhdGUpIHtcclxuICAgIHJldHVybiBkYXRlXHJcbiAgICAgIC50b0lTT1N0cmluZygpXHJcbiAgICAgIC5yZXBsYWNlKC9cXC5cXGQrWiQvLCBcIlwiKVxyXG4gICAgICAucmVwbGFjZSgvWzotXS9nLCBcIlwiKTtcclxuICB9XHJcblxyXG4gIC8vI2VuZHJlZ2lvblxyXG59XHJcbiIsImltcG9ydCAqIGFzIE9ic2VydmVyIGZyb20gXCIuL29ic2VydmVyLmpzXCI7XHJcbmltcG9ydCB7IEV2ZW50QWdlbnQgfSBmcm9tIFwiLi9hZ2VudHMvZXZlbnRBZ2VudFwiO1xyXG5pbXBvcnQgeyBPcHRpb25zQWdlbnQgfSBmcm9tIFwiLi9hZ2VudHMvb3B0aW9uc0FnZW50XCI7XHJcbmltcG9ydCB7IE91dHB1dEFnZW50IH0gZnJvbSBcIi4vYWdlbnRzL291dHB1dEFnZW50XCI7XHJcblxyXG4vKipcclxuICogTWFpbiBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdoZW5ldmVyIFRodW5kZXJiaXJkIGhhcyBmaW5pc2hlZFxyXG4gKiBsb2FkaW5nIHRoZSBET00uXHJcbiAqXHJcbiAqIEluIFRodW5kZXJiaXJkLCBhbGwgV2ViRXh0ZW5zaW9uIEFQSSBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCB0aGVcclxuICogYnJvd3Nlci4qIG5hbWVzcGFjZSwgYXMgd2l0aCBGaXJlZm94LCBidXQgYWxzbyB0aHJvdWdoIHRoZVxyXG4gKiBtZXNzZW5nZXIuKiBuYW1lc3BhY2UsIHdoaWNoIGlzIGEgYmV0dGVyIGZpdCBmb3IgVGh1bmRlcmJpcmQuXHJcbiAqL1xyXG5jb25zdCBpbml0ID0gYXN5bmMgKCkgPT4ge1xyXG4gIFxyXG4gIC8qKlxyXG4gICAqIFVzZSB0aGUgc3RhcnR1cCBwaGFzZSB0byB0ZWxsIFRodW5kZXJiaXJkIHRoYXQgaXQgc2hvdWxkIGxvYWRcclxuICAgKiB0aGUgRGlzcGxheSBBZ2VudCB3aGVuZXZlciBhIG1lc3NhZ2UgaXMgZGlzcGxheWVkXHJcbiAgICogUmVxdWlyZWQgcGVybWlzc2lvbnM6IFttZXNzYWdlc01vZGlmeV1cclxuICAgKlxyXG4gICAqL1xyXG4gIG1lc3Nlbmdlci5tZXNzYWdlRGlzcGxheVNjcmlwdHMucmVnaXN0ZXIoe1xyXG4gICAganM6IFt7IGZpbGU6IFwiLi9vdXRwdXQvaW5kZXguanNcIiB9XSxcclxuICAgIGNzczogW3sgZmlsZTogXCIuL291dHB1dC9pbmRleC5jc3NcIiB9XSxcclxuICB9KTtcclxuXHJcbiAgLy8gUmVnaXN0ZXJzIGFsbCBuZWVkZWQgYWdlbnRzXHJcblxyXG4gIC8vIE9wdGlvbnNBZ2VudFxyXG4gIGNvbnN0IG9wdGlvbnNBZ2VudCA9IG5ldyBPcHRpb25zQWdlbnQoXCJPcHRpb25zQWdlbnRcIiwgdHJ1ZSk7XHJcbiAgT2JzZXJ2ZXIucmVnaXN0ZXJBZ2VudChcIk9wdGlvbnNBZ2VudFwiLCBvcHRpb25zQWdlbnQpO1xyXG5cclxuICAvLyBFdmVudEFnZW50XHJcbiAgY29uc3QgZXZlbnRBZ2VudCA9IG5ldyBFdmVudEFnZW50KFwiRXZlbnRBZ2VudFwiLCB0cnVlKTtcclxuICBPYnNlcnZlci5yZWdpc3RlckFnZW50KFwiRXZlbnRBZ2VudFwiLCBldmVudEFnZW50KTtcclxuXHJcbiAgLy8gT3V0cHV0QWdlbnRcclxuICBjb25zdCBvdXRwdXRBZ2VudCA9IG5ldyBPdXRwdXRBZ2VudChcIk91dHB1dEFnZW50XCIsIHRydWUpO1xyXG4gIE9ic2VydmVyLnJlZ2lzdGVyQWdlbnQoXCJPdXRwdXRBZ2VudFwiLCBvdXRwdXRBZ2VudCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZCBhIGhhbmRsZXIgZm9yIGNvbW11bmljYXRpb24gd2l0aCBvdGhlciBwYXJ0cyBvZiB0aGUgZXh0ZW5zaW9uLFxyXG4gICAqIGxpa2UgdGhlIG1lc3NhZ2VEaXNwbGF5U2NyaXB0LlxyXG4gICAqXHJcbiAgICogVGhlcmUgc2hvdWxkIGJlIG9ubHkgb25lIGhhbmRsZXIgaW4gdGhlIGJhY2tncm91bmQgc2NyaXB0XHJcbiAgICogZm9yIGFsbCBpbmNvbWluZyBtZXNzYWdlcy5cclxuICAgKi9cclxuICBtZXNzZW5nZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoT2JzZXJ2ZXIub2JzZXJ2ZU1lc3NhZ2VzKTtcclxuXHJcbiAgYXdhaXQgb3B0aW9uc0FnZW50LmluaXQoKTtcclxuICBhd2FpdCBvdXRwdXRBZ2VudC5pbml0KCk7XHJcbiAgYXdhaXQgZXZlbnRBZ2VudC5pbml0KCk7XHJcbn07XHJcblxyXG4vKipcclxuICogRXhlY3V0ZSB0aGUgc3RhcnR1cCBoYW5kbGVyIHdoZW5ldmVyIFRodW5kZXJiaXJkIGhhcyBmaW5pc2hlZFxyXG4gKiBsb2FkaW5nIHRoZSBET01cclxuICovXHJcbmF3YWl0IGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xyXG4iLCIvKipcclxuICogVGhlIGZhbGxiYWNrIHJ1bGVzIGZvciB0aGUgd2ViZXh0ZW5zaW9uLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRLbm93bGVkZ2ViYXNlID0ge1xyXG4gIGRlOiB7XHJcbiAgICAxOiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIHBhdHRlcm46XHJcbiAgICAgICAgXCIoPzxkYXk+WzAtM10/WzAtOV0pWy5dKD88bW9udGg+WzAtM10/WzAtOV0pWy5dKD88eWVhcj4oPzpbMC05XXsyfSk/WzAtOV17Mn0pXCIsXHJcbiAgICAgIGV4YW1wbGU6IFwiNy4xLjIwMThcIixcclxuICAgIH0sXHJcbiAgICAyOiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIHBhdHRlcm46XHJcbiAgICAgICAgXCIoPzxkYXk+WzAtM10/WzAtOV0pWy5dKD88bW9udGg+WzAtM10/WzAtOV0pWy5dKD88eWVhcj4oPzpbMC05XVswLTldKT9bMC05XVswLTldKVwiLFxyXG4gICAgICBleGFtcGxlOiBbXCIwNy4wMS4yMDE4XCJdLFxyXG4gICAgfSxcclxuICAgIDM6IHtcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICBcIig/PHllYXI+KD86WzAtOV1bMC05XSk/WzAtOV1bMC05XSlbLV17MX0oPzxtb250aD5bMC0zXVswLTldKVstXXsxfSg/PGRheT5bMC0zXVswLTldKVwiLFxyXG4gICAgICBleGFtcGxlOiBbXCIyMDE4LTAxLTA3XCJdLFxyXG4gICAgfSxcclxuICAgIDQ6IHtcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICBcIig/PGRheT5bMC0zXT9bMC05XSlbLl1cXFxccz8oPzxtb250aD5KYW51YXJ8RmVicnVhcnxNw6RyenxNYWVyenxBcHJpbHxNYWl8SnVuaXxKdWx5fEF1Z3VzdHxTZXB0ZW1iZXJ8T2t0b2JlcnxOb3ZlbWJlcnxEZXplbWJlcilcXFxccz8oPzx5ZWFyPig/OlswLTldWzAtOV0pP1swLTldWzAtOV0pXCIsXHJcbiAgICAgIG1hdGNoZXM6IFtdLFxyXG4gICAgICBleGFtcGxlOiBbXCI3LiBKYW51YXIgMjAxOFwiXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBlbjoge1xyXG4gICAgMToge1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICBwYXR0ZXJuOlxyXG4gICAgICAgIFwiKD88bW9udGg+WzAtMV1bMC05XSlbL10oPzxkYXk+WzAtM11bMC05XSlbL10oPzx5ZWFyPig/OlswLTldWzAtOV0pP1swLTldWzAtOV0pXFxcXHM/WzAtMl1bMC05XVs6XXsxfVswLTVdWzAtOV1cXFxccz9bQXxQXVtNXVwiLFxyXG4gICAgICBleGFtcGxlOiBcIjA0LzI1LzIwMDEgMTE6NDggQU1cIixcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuIiwiLyoqXHJcbiAqXHJcbiAqIFRoZSBvYnNlcnZlciBjbGFzcyBwcm92aWRlcyB0aGUgbG9nIGZ1bmN0aW9uXHJcbiAqIHRoYXQgZ2V0cyBpbmplY3RlZCBpbnRvIGV2ZXJ5IGFnZW50IGFuZCBpcyB1c2VkXHJcbiAqIGZvciBsb2dnaW5nIHB1cnBvc2Ugd2hlbiBhZ2VudHMgY29tbXVuaWNhdGUgYmV0d2VlblxyXG4gKiBlYWNob3RoZXIuXHJcbiAqIFxyXG4gKi9cclxuXHJcbi8vIHRoZSBhZ2VudHMgdGhhdCB3ZXJlIHJlZ2lzdGVyZWRcclxubGV0IGFnZW50cyA9IHt9O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtBcnJheVtdfSBtZXNzYWdlcyBNZXNzYWdlcyB0aGF0IGdldHRpbmcgbG9nZ2VkIHRvIGNvbnNvbGUuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2UgTmFtZSBvZiB0aGUgc291cmNlIHRoYXQgaXMgbG9nZ2luZyB0aGUgbWVzc2FnZXMuXHJcbiAqIFxyXG4gKi9cclxuY29uc3QgbG9nID0gYXN5bmMgKG1lc3NhZ2VzLCBzb3VyY2UpID0+IHtcclxuICBtZXNzYWdlcy5mb3JFYWNoKChtZXNzYWdlKSA9PlxyXG4gICAgY29uc29sZS5sb2coXHJcbiAgICAgIFwiW1wiICtcclxuICAgICAgICBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygpICtcclxuICAgICAgICBcIl1cIiArXHJcbiAgICAgICAgKHNvdXJjZSA/IFwiW1wiICsgc291cmNlICsgXCJdXCIgOiBcIlwiKSArXHJcbiAgICAgICAgXCI6IFwiLFxyXG4gICAgICBtZXNzYWdlXHJcbiAgICApXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcclxuICogUmVnaXN0ZXIgYW4gYWdlbnQgc28gdGhlIG9ic2VydmVyIGhhcyBhY2Nlc3NcclxuICogdG8gaXRzIGNvbW11bmljYXRpb24uXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGFnZW50LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gYWdlbnQgVGhlIGFnZW50IG9iamVjdC5cclxuICovXHJcbmNvbnN0IHJlZ2lzdGVyQWdlbnQgPSAobmFtZSwgYWdlbnQpID0+IHtcclxuICBhZ2VudHNbbmFtZV0gPSBhZ2VudDtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogXHJcbiAqIEhhbmRsZXMgdGhlIGNvbW1hbmRzIHJlY2VpdmVkIGZyb20gYW4gb2JzZXJ2ZWQgbWVzc2FnZVxyXG4gKiBvZiBvbmUgb2YgdGhlIGFnZW50cy5cclxuICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2UgVGhlIG1lc3NhZ2Ugb2JqZWN0IGZvciBjb21tdW5pY2F0aW9uIHdpdGggYWdlbnRzLlxyXG4gKiBAcGFyYW0ge051bWJlcn0gdGFiSWQgT3B0aW9uYWwgdGFiIGlkIG9mIGluaXRpYXRpbmcgYWdlbnQuXHJcbiAqL1xyXG5jb25zdCBkb0hhbmRsZUNvbW1hbmQgPSBhc3luYyAobWVzc2FnZSwgdGFiSWQpID0+IHtcclxuICBsZXQgeyBjb21tYW5kLCByZWNpZXZlciwgc2VuZGVyLCBkYXRhIH0gPSBtZXNzYWdlO1xyXG5cclxuICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgIGNhc2UgXCJsb2dcIjpcclxuICAgICAgbG9nKFttZXNzYWdlLnRleHRdLCBcIk9ic2VydmVyXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBsb2coW3NlbmRlciArIFwiIC0+IFwiICsgY29tbWFuZCArIFwiIC0+IFwiICsgcmVjaWV2ZXJdLCBcIk9ic2VydmVyXCIpO1xyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIGxvZyhbZGF0YV0sIFwiT2JzZXJ2ZXJcIik7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICBpZiAocmVjaWV2ZXIpIHtcclxuICAgIHJldHVybiBhZ2VudHNbcmVjaWV2ZXJdLnJlY2lldmUoY29tbWFuZCwgZGF0YSwgdGFiSWQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsb2coW1wiTm8gcmVjaWV2ZXIgc3BlY2lmaWVkLlwiXSwgXCJPYnNlcnZlclwiKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogXHJcbiAqIEhhbmRsZSB0aGUgcmVjZWl2ZWQgbWVzc2FnZSBieSBmaWx0ZXJpbmcgZm9yIGFsbCBtZXNzYWdlc1xyXG4gKiB3aG9zZSBcInR5cGVcIiBwcm9wZXJ0eSBpcyBzZXQgdG8gXCJjb21tYW5kXCIuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlIFRoZSBtZXNzYWdlIG9iamVjdCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIGFnZW50cy5cclxuICogQHBhcmFtIHtPYmplY3R9IHNlbmRlciBUaGUgc2VuZGVyIG9iamVjdC5cclxuICogQHNlZSBodHRwczovL2RldmVsb3Blci50aHVuZGVyYmlyZC5uZXQvYWRkLW9ucy9oZWxsby13b3JsZC1hZGQtb24vdXNpbmctY29udGVudC1zY3JpcHRzI3JlY2VpdmluZy1hLXJ1bnRpbWUtbWVzc2FnZVxyXG4gKi9cclxuY29uc3Qgb2JzZXJ2ZU1lc3NhZ2VzID0gKG1lc3NhZ2UsIHNlbmRlcikgPT4ge1xyXG4gIGlmIChtZXNzYWdlICYmIG1lc3NhZ2UuaGFzT3duUHJvcGVydHkoXCJjb21tYW5kXCIpKSB7XHJcbiAgICAvLyBUaGUgcGFyYW1ldGVyIHRhYklkIGlzIG5lY2Vzc2FyeSBmb3IgdGhlIGV2ZW50IGFnZW50XHJcbiAgICAvLyBmb3IgcXVlcnlpbmcgdGhlIGVtYWlsIGNvbnRlbnQgb2YgdGhlIGFjdGl2ZSBhbmQgc2hvd24gdGFiXHJcbiAgICBjb25zdCB0YWJJZCA9IHNlbmRlcj8udGFiPy5pZDtcclxuICAgIHJldHVybiBkb0hhbmRsZUNvbW1hbmQobWVzc2FnZSwgdGFiSWQpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCB7IG9ic2VydmVNZXNzYWdlcywgcmVnaXN0ZXJBZ2VudCwgbG9nIH07XHJcbiIsImltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5sZXQgcmFuZG9tID0gYnl0ZXMgPT4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShieXRlcykpXG5sZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplID0gMjEpID0+XG4gIGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxubGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+XG4gIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpLnJlZHVjZSgoaWQsIGJ5dGUpID0+IHtcbiAgICBieXRlICY9IDYzXG4gICAgaWYgKGJ5dGUgPCAzNikge1xuICAgICAgaWQgKz0gYnl0ZS50b1N0cmluZygzNilcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPCA2Mikge1xuICAgICAgaWQgKz0gKGJ5dGUgLSAyNikudG9TdHJpbmcoMzYpLnRvVXBwZXJDYXNlKClcbiAgICB9IGVsc2UgaWYgKGJ5dGUgPiA2Mikge1xuICAgICAgaWQgKz0gJy0nXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH1cbiAgICByZXR1cm4gaWRcbiAgfSwgJycpXG5leHBvcnQgeyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwibGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG5leHBvcnQgeyB1cmxBbHBoYWJldCB9XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJ2YXIgd2VicGFja1F1ZXVlcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgcXVldWVzXCIpIDogXCJfX3dlYnBhY2tfcXVldWVzX19cIjtcbnZhciB3ZWJwYWNrRXhwb3J0cyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXhwb3J0c1wiKSA6IFwiX193ZWJwYWNrX2V4cG9ydHNfX1wiO1xudmFyIHdlYnBhY2tFcnJvciA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgZXJyb3JcIikgOiBcIl9fd2VicGFja19lcnJvcl9fXCI7XG52YXIgcmVzb2x2ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlICYmIHF1ZXVlLmQgPCAxKSB7XG5cdFx0cXVldWUuZCA9IDE7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tRdWV1ZXNdKSByZXR1cm4gZGVwO1xuXHRcdGlmKGRlcC50aGVuKSB7XG5cdFx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHRcdHF1ZXVlLmQgPSAwO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdHJlc29sdmVRdWV1ZShxdWV1ZSk7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKGZuKHF1ZXVlKSk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHR2YXIgcmV0ID0ge307XG5cdHJldFt3ZWJwYWNrUXVldWVzXSA9IHggPT4ge307XG5cdHJldFt3ZWJwYWNrRXhwb3J0c10gPSBkZXA7XG5cdHJldHVybiByZXQ7XG59KSk7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmEgPSAobW9kdWxlLCBib2R5LCBoYXNBd2FpdCkgPT4ge1xuXHR2YXIgcXVldWU7XG5cdGhhc0F3YWl0ICYmICgocXVldWUgPSBbXSkuZCA9IC0xKTtcblx0dmFyIGRlcFF1ZXVlcyA9IG5ldyBTZXQoKTtcblx0dmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGN1cnJlbnREZXBzO1xuXHR2YXIgb3V0ZXJSZXNvbHZlO1xuXHR2YXIgcmVqZWN0O1xuXHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcblx0XHRyZWplY3QgPSByZWo7XG5cdFx0b3V0ZXJSZXNvbHZlID0gcmVzb2x2ZTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrUXVldWVzXSA9IChmbikgPT4gKHF1ZXVlICYmIGZuKHF1ZXVlKSwgZGVwUXVldWVzLmZvckVhY2goZm4pLCBwcm9taXNlW1wiY2F0Y2hcIl0oeCA9PiB7fSkpO1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGJvZHkoKGRlcHMpID0+IHtcblx0XHRjdXJyZW50RGVwcyA9IHdyYXBEZXBzKGRlcHMpO1xuXHRcdHZhciBmbjtcblx0XHR2YXIgZ2V0UmVzdWx0ID0gKCkgPT4gKGN1cnJlbnREZXBzLm1hcCgoZCkgPT4ge1xuXHRcdFx0aWYoZFt3ZWJwYWNrRXJyb3JdKSB0aHJvdyBkW3dlYnBhY2tFcnJvcl07XG5cdFx0XHRyZXR1cm4gZFt3ZWJwYWNrRXhwb3J0c107XG5cdFx0fSkpXG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0dmFyIGZuUXVldWUgPSAocSkgPT4gKHEgIT09IHF1ZXVlICYmICFkZXBRdWV1ZXMuaGFzKHEpICYmIChkZXBRdWV1ZXMuYWRkKHEpLCBxICYmICFxLmQgJiYgKGZuLnIrKywgcS5wdXNoKGZuKSkpKTtcblx0XHRcdGN1cnJlbnREZXBzLm1hcCgoZGVwKSA9PiAoZGVwW3dlYnBhY2tRdWV1ZXNdKGZuUXVldWUpKSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH0sIChlcnIpID0+ICgoZXJyID8gcmVqZWN0KHByb21pc2Vbd2VicGFja0Vycm9yXSA9IGVycikgOiBvdXRlclJlc29sdmUoZXhwb3J0cykpLCByZXNvbHZlUXVldWUocXVldWUpKSk7XG5cdHF1ZXVlICYmIHF1ZXVlLmQgPCAwICYmIChxdWV1ZS5kID0gMCk7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9lbnZpcm9ubWVudC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==