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
        rel_path = '../../../../Data/de/sueddeutsche/items_{datestr}.json'.format(datestr =  datetime.today().strftime('%Y%m%d%H%M%S'))
        abs_file_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), rel_path)
        self.file = codecs.open(abs_file_path, 'w+', encoding='utf-8', errors=ignore)
        self.file.write("[")

    def process_item(self, item, spider):
        self.file.writeline(json.dumps(OrderedDict(item), ensure_ascii=False, sort_keys=False))
        self.file.write(',')
        return item

    def close_spider(self, spider):
        self.file.seek(self.file.tell() - 1, os.SEEK_SET)
        self.file.write(']')
        self.file.close()