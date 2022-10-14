/**
 * The knowledgebase of the extension.
 */
export const defaultKnowledgebase = {
    de: {
        // 7.1.2018 | 7.1.91                         [0-3]?[0-9][\.][0-3]?[0-9][\.](?:[0-9]{2})?[0-9]{2}
        1: { active: true, pattern: "(?<day>[0-3]?[0-9])[\.](?<month>[0-3]?[0-9])[\.](?<year>(?:[0-9]{2})?[0-9]{2})", matches: [], example: "7.1.2018" },
        // 07.01.2018                                [0-3][0-9][\.][0-3][0-9][\.](?:[0-9][0-9])?[0-9][0-9]
        2: { active: true, pattern: "(?<day>[0-3]?[0-9])[\.](?<month>[0-3]?[0-9])[\.](?<year>(?:[0-9][0-9])?[0-9][0-9])", matches: [], example: ["07.01.2018"] },
        // 2018-01-07                                (?:[0-9][0-9])?[0-9][0-9][-]{1}[0-3][0-9][-]{1}[0-3][0-9]
        3: { active: true, pattern: "(?<year>(?:[0-9][0-9])?[0-9][0-9])[-]{1}(?<month>[0-3][0-9])[-]{1}(?<day>[0-3][0-9])", matches: [], example: ["2018-01-07"] },
        // 7. Januar 2018                            [0-3]?[0-9][\.]\s?(Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\s?(?:[0-9][0-9])?[0-9][0-9]
        4: { active: true, pattern: "(?<day>[0-3]?[0-9])[\.]\\s?(?<month>Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\\s?(?<year>(?:[0-9][0-9])?[0-9][0-9])", matches: [], example: ["7. Januar 2018"] },
    },
    en: {
        // 04/25/2001 11:48 AM
        1: { active: true, pattern: "(?<month>[0-1][0-9])[\/](?<day>[0-3][0-9])[\/](?<year>(?:[0-9][0-9])?[0-9][0-9])\\s?[0-2][0-9][:]{1}[0-5][0-9]\\s?[A|P][M]", matches: [], example: "04/25/2001 11:48 AM" },
    }
}
