# Die Artikel der Sueddeutschen Zeitung sind in einer JSON Datei gespeichert.
# Die Daten des Bundestages sind im xml Format.
# Der Enron Email Datensatz hat ausschließlich ascii formatierte Textdateien.

from itertools import count
import json
import os
import re

file_root = os.path.abspath(os.path.dirname(__file__))
data_root = "../../Data"

# Date Expressions
# Time Expression
# Duration Expression
# Set/Frequency Expression

# keywords deutsch
months_de = ["Januar", "Februar", "März", "April", "Mai", "Juni",
             "July", "August", "September", "Oktober", "November", "Dezember"]
days_de = ["Montag", "Dienstag", "Mittwoch", "Donnerstag",
           "Freitag", "Samstag", "Sonntag"]
keywords_de = ["am", "Uhr", "vormittags", "heute",
               "nachmittags", "mittags", "abends", "morgen", "morgens",
               "nachts", "mitternachts", "Sekunden", "Sekunde",
               "Minuten", "Minute", "Stunden", "Stunde", "Tage", "Tag"]

# keywords englisch
months_en = ["january", "february", "march", "april", "may", "june",
             "july", "august", "september", "october", "november", "december"]
days_en = ["monday", "tuesday", "wednesday", "thursday",
           "friday", "saturday", "sunday"]
keywords_en = ["at", "after", "before", "between", "by", "during",
               "following", "for", "from", "on", "since", "till",
               "to", "until", "within", "while", "when", "except",
               "in", "a.m.", "am", "a m", "midday", "afternoon", "noon",
               "evening", "overnight", "midnight", "night",
               "p m", "pm", "p.m.", "seconds", "second", "minutes",
               "minute", "hours", "hour", "days", "day"]


def filterKeywords(words, lang):
    # print(globals()[("keywords_"+lang)])
    # print(line)
    keywords = '\\b|\\b'.join(globals()[("keywords_"+lang)]
                              + globals()[("months_"+lang)]
                              + globals()[("days_"+lang)])
    keywords = '\\b' + keywords + '\\b'

    # finde den index der
    # potential = list(filter(lambda x: re.search(r"%s" %
    #                  keywords, x, re.IGNORECASE), words))
    result = {}
    result['found'] = []

    for i in range(len(words)):
        found = re.search(r"%s" % keywords, words[i], re.IGNORECASE)
        if found:
            result['found'].append({'index': i, 'word': found.string})

    if len(result['found']) > 0:
        result['words'] = words
        # print(result)
        return result


def readCodEAlltagTextfile(filepath, lang):
    with open(filepath, 'r', encoding='utf-8') as file:
        filecontent = file.read()
        file.close()
        if (filecontent != None):
            words = re.split('[-_\s]+', filecontent)
            # print(words)
            return filterKeywords(words, lang)


def walkPath(path, lang, output):
    for (dirpath, dirnames, filenames) in os.walk(path):
        for name in dirnames:
            # print(os.path.join(dirpath, name))
            walkPath(os.path.join(dirpath, name), lang, output)
        for name in filenames:
            if name.endswith(".txt"):
                result = readCodEAlltagTextfile(
                    os.path.join(dirpath, name), lang)
                if result:
                    output.write(json.dumps(result))
                    output.write(',')


def loadArticles():
    # path to data of newspaper
    path = os.path.join(file_root, data_root, "de", "sueddeutsche")
    # walk all files inside folder
    for (dirpath, dirnames, filenames) in os.walk(path):
        for name in filenames:
            data = {}
            # read and parse every json file
            with open(os.path.join(path, name), encoding='utf-8') as f:
                data = json.load(f)
                f.close()

            sentences = []
            filtered_sentences = []
            with open(os.path.join(path, "sentencesplitted_" + name[0:-5]+'.txt'), 'w', encoding='utf-8') as output:
                # split sentences for every article in data object
                for i in data:
                    # split text
                    sentences = re.split('(?<!(\d))[.]', i['content'])
                    for index, sentence in enumerate(sentences):
                        if sentence != None:
                            # write new file for comparisen
                            output.write(sentence)
                            output.write('\n')
                            # filter sentences for keywords
                            if filterKeywordSentences(sentence):
                                filtered_sentences.append(sentence)

            with open(os.path.join(path, "sentencesfiltered_" + name[0:-5]+'.txt'), 'w', encoding='utf-8') as output:
                for sentence in filtered_sentences:
                    output.write(sentence)
                    output.write('\n')

            output.close


def loadCodEAlltagDataset():
    dataset_name = "CodEAlltag"
    dataset_lang = "de"
    # path to dataset
    path = os.path.join(file_root, data_root, dataset_lang,
                        dataset_name, "1-", "100-dir")
    with open(os.path.join(file_root, "possibleEntries.json"), 'w', encoding='utf-8') as output:
        output.write('[')
        walkPath(path, dataset_lang, output)
        output.write(']')
        output.close()

def loadEnronDataset():
    pass


if __name__ == '__main__':
    loadCodEAlltagDataset()
