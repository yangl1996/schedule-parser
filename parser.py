# -*- coding: utf-8 -*-

from html.parser import HTMLParser


class ScheduleParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print("Encountered a start tag:", tag)

    def handle_endtag(self, tag):
        print("Encountered an end tag :", tag)

    def handle_data(self, data):
        print("Encountered some data  :", data)


file_name = 'sample.html'
raw_file = open(file_name, 'r', encoding='utf-8')
file_text = raw_file.read()


parser = ScheduleParser()
parser.feed(file_text)