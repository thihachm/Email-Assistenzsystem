import scrapy
from scraper.items import PostItem
from scrapy import Selector
import random

class PostSpider(scrapy.Spider):
    
    name = "archive"
    
    resorts = [
        "Politik",
        "Wirtschaft",
        "Geld",
        "Panorama",
        "Sport",
        "München",
        "Bayern",
        "Landkreis",
        "Dachau",
        "Ebersberg",
        "Erding",
        "Freising",
        "Fürstenfeldbruck",
        "Starnberg",
        "wolfratshausen",
        "Sport",
        "Kultur",
        "Medien",
        "Wissen",
        "Gesundheit",
        "Digital",
        "Karriere",
        "Bildung",
        "Reise",
        "Auto",
        "Stil",
        "leben",
        "Service"
    ]
    
    months = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
    ]
    
    year = [
        # "2001",
        # "2002",
        # "2003",
        # "2004",
        # "2005",
        # "2006",
        # "2007",
        # "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022"
    ]
    
    def start_requests(self):
        url = "https://www.sueddeutsche.de/archiv/" + random.choice(self.resorts).lower() + "/" + random.choice(self.year) + "/" + random.choice(self.months)
        return [scrapy.Request(url, callback=self.parse)]
    
    def parse(self, response):
        links = response.xpath('//*[@id="entrylist-container"]/div').getall()
        # for index, link in enumerate(links, start=1):
        for index, link in enumerate(links):
            item = PostItem()
            sel = Selector(text=link)
            item['title'] = sel.css('.entrylist__title::text').get()
            item['url'] = sel.css('.entrylist__link::attr(href)').get()
            request = scrapy.Request(item['url'], callback=self.parseMainText) 
            request.meta['item'] = item
            yield request

    def parseMainText(self, response):
        item = response.meta['item'] 
        links = response.xpath('//*[@itemprop="articleBody"]//p/text()').getall()
        item['content'] = ''.join(str(x) for x in links) 
        yield item

