# Date Expressions
# Time Expression
# Duration Expression
# Set/Frequency Expression


monat = ["Januar","Februar","März", "April", "Mai", "Juni", "July", "August", "September", "Oktober","November","Dezember"]
wochentag = ["Montag","Dienstag","Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

replace_umlaute = ['äüö']




# um 05:00 Uhr am Montagmorgen
# um 13.50 Uhr
# um 18:50 Uhr


# am Samstag
# am 4. April
# Mitte März
# an diesem Freitag
# an diesem Donnerstag
# am 24. Juni
# bis zum 31. August
# 31. August
# am 24. Februar 2010
# 27. Juni 2010
# am 27. Oktober 1962
# im Zeitraum zwischen dem 19. September 2005 und dem 22.Juni 2006
# am 24. Januar 2000
# am 6.Mai
# von Oktober 2009 bis Februar 2010
# am 16. Mai
# bis 30. Juni
# am 9. September 2009
# Bis Januar 2011

# 7.1.91                                    [0-3]?[0-9][\.][0-3]?[0-9][\.](?:[0-9]{2})?[0-9]{2}
# 7.1.2018                                  [0-3]?[0-9][\.][0-3]?[0-9][\.](?:[0-9]{2})?[0-9]{2}
# 07.01.2018                                [0-3][0-9][\.][0-3][0-9][\.](?:[0-9][0-9])?[0-9][0-9]
# 2018-01-07                                (?:[0-9][0-9])?[0-9][0-9][-]{1}[0-3][0-9][-]{1}[0-3][0-9]
# 7. Januar 2018                            [0-3]?[0-9][\.]\s?(Januar|Februar|März|Maerz|April|Mai|Juni|July|August|September|Oktober|November|Dezember)\s?(?:[0-9][0-9])?[0-9][0-9]
# 7. Jan. 2018