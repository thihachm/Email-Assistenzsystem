
/**
 * The knowledgebase of the extension.
 */
export const db = {

    // 7.1.2018 | 7.1.91                         [0-3]?[0-9][\.][0-3]?[0-9][\.](?:[0-9]{2})?[0-9]{2}
    // 07.01.2018                                [0-3][0-9][\.][0-3][0-9][\.](?:[0-9][0-9])?[0-9][0-9]
    // 2018-01-07                                (?:[0-9][0-9])?[0-9][0-9][-]{1}[0-3][0-9][-]{1}[0-3][0-9]
    // 7. Januar 2018                            [0-3]?[0-9][\.]\s?(Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\s?(?:[0-9][0-9])?[0-9][0-9]
    de: [
        { pattern: "(?<day>[0-3]?[0-9])[\.](?<month>[0-3]?[0-9])[\.](?<year>(?:[0-9]{2})?[0-9]{2})", matches: [] },
        // { pattern: "[0-3][0-9][\.][0-3][0-9][\.](?:[0-9][0-9])?[0-9][0-9]", format: { split: ".", order: ["d,m,y"] } },
        // { pattern: "(?:[0-9][0-9])?[0-9][0-9][-]{1}[0-3][0-9][-]{1}[0-3][0-9]", format: { split: "-", order: ["y,m,d", "y,d,m"] } },
        // { pattern: "(?<day>[0-3]?[0-9])\.\s?(?<month>Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\s?(?<year>(?:[0-9][0-9])?[0-9][0-9])", format: { split: " ", order: ["d,m,y"] } },
    ],

    // 04/25/2001 11:48 AM
    en: [
        { pattern: "[0-1][0-9][\/][0-3][0-9][\/](?:[0-9][0-9])?[0-9][0-9]\s?[0-2][0-9][:]{1}[0-5][0-9]\s?[A|P][M]", matches: [] },
    ]
}