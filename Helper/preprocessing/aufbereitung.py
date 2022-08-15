# Die Artikel der Sueddeutschen Zeitung sind in einer JSON Datei gespeichert.
# Die Daten des Bundestages sind im xml Format.
# Der Enron Email Datensatz hat ausschließlich ascii formatierte Textdateien.

import json
import os
import re

file_root = os.path.abspath(os.path.dirname(__file__))
data_root = "../../Data"

# Date Expressions
# Time Expression
# Duration Expression
# Set/Frequency Expression

#keywords deutsch
monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", 
        "July", "August", "September", "Oktober", "November", "Dezember"]
wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", 
            "Freitag", "Samstag", "Sonntag"]
keywords = ["am","Uhr","vormittags", "heute",
            "nachmittags","mittags","abends", "morgen", "morgens",
            "nachts","mitternachts", "Sekunden", "Sekunde",
            "Minuten","Minute","Stunden","Stunde","Tage","Tag"]

#keywords englisch
keywords_en = ["at","after","before","between","by","during",
               "following","for","from","on","since","till",
               "to","until","within","while","when","except",
               "in","a.m.","am","a m","midday","afternoon","noon",
               "evening","overnight","midnight","night",
               "p m","pm","p.m.","seconds","second","minutes",
               "minute","hours","hour","days","day"]

def preprocessSentence(sentence):
    
    words = '\\b|\\b'.join(keywords+monate+wochentage)
    print(words)
            
    return re.search(r"(\\b%s\\b)" % words, sentence, re.IGNORECASE)


def filterKeywordSentences(sentence):
    
    words = '\\b|\\b'.join(keywords+monate+wochentage)
    print(words)
            
    return re.search(r"(\\b%s\\b)" % words, sentence, re.IGNORECASE)
            
def loadArticles():
    # path to data of newspaper
    path = os.path.join(file_root, data_root, "de","sueddeutsche")
    #walk all files inside folder
    for (dirpath, dirnames, filenames) in os.walk(path):
        for name in filenames:
            data = {}
            # read and parse every json file
            with open(os.path.join(path,name), encoding='utf-8') as f:
                data = json.load(f)
                f.close()
                
            sentences = []
            filtered_sentences = []
            with open(os.path.join(path,"sentencesplitted_" + name[0:-5]+'.txt'), 'w', encoding='utf-8') as output:
                # split sentences for every article in data object
                for i in data:
                    #split text
                    sentences = re.split('(?<!(\d))[.]', i['content'])
                    for index, sentence in enumerate(sentences):
                        if sentence != None:
                            #write new file for comparisen
                            output.write(sentence)
                            output.write('\n')
                            #filter sentences for keywords
                            if filterKeywordSentences(sentence):
                                filtered_sentences.append(sentence)
                            
            with open(os.path.join(path,"sentencesfiltered_" + name[0:-5]+'.txt'), 'w', encoding='utf-8') as output:
                for sentence in filtered_sentences:
                    output.write(sentence)
                    output.write('\n')
                        
            output.close
           
                    
def loadBundestag():
    pass

def loadEnron():
    pass


if __name__ == '__main__':
    loadArticles()