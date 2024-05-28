/**
 * The fallback rules for the webextension.
 */
export const defaultKnowledgebase = {
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
