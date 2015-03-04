# -*- coding: utf-8 -*-

from html.parser import HTMLParser


time_count = 0
day_count = -1
now_class = False
temp_data_field = []


class_info = []


class ScheduleParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        global time_count
        global now_class
        global day_count
        if tag == 'tr' and (attrs[0][1] == 'course-even' or attrs[0][1] == 'course-odd'):
            time_count += 1
        elif tag == 'td' and len(attrs) == 2:
            day_count += 1
            if day_count == 8:
                day_count = 0
        elif tag == 'td' and len(attrs) == 3:
            day_count += 1
            now_class = True

    def handle_endtag(self, tag):
        global now_class
        global temp_data_field
        global class_info
        if tag == 'td':
            if now_class == True:
                this_class = {'day': day_count, 'time': time_count, 'info': temp_data_field[:]}
                class_info.append(this_class)
                temp_data_field = []
                now_class = False

    def handle_data(self, data):
        global temp_data_field
        if now_class:
            temp_data_field.append(data)


file_name = 'sample.html'
raw_file = open(file_name, 'r', encoding='utf-8')
file_text = raw_file.read()


parser = ScheduleParser()
parser.feed(file_text)
print(class_info)