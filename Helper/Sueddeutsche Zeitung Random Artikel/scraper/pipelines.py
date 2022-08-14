# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exporters import JsonItemExporter
import json
import codecs
from collections import OrderedDict
from datetime import datetime
from pathlib import Path
import os

class JsonWithEncodingPipeline(object):

    def __init__(self):
        script_dir = os.path.dirname(__file__)
        rel_path = 'scrapes/items_{datestr}.json'.format(datestr =  datetime.today().strftime('%Y%m%d%H%M%S'))
        abs_file_path = os.path.join(script_dir, rel_path)
        self.file = codecs.open(abs_file_path, 'w+', encoding='utf-8')
        self.file.write('[')

    def process_item(self, item, spider):
        line = json.dumps(OrderedDict(item), ensure_ascii=False, sort_keys=False) + ","
        self.file.write(line)
        return item

    def close_spider(self, spider):
        self.file.write(']')
        self.file.close()