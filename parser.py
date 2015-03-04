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


# Parsing completed
refined_table = []

for every_class in class_info:
    class_day = every_class['day']
    class_time = every_class['time']
    class_name = every_class['info'][0]
    #  0 for each week
    #  1 for odd  week
    # -1 for even week
    class_type = 0
    for all_info in every_class['info']:
        if not all_info.find('单周') == -1:
            class_type = 1
            break
        elif  not all_info.find('双周') == -1:
            class_type = -1
            break
    class_test = 'N/A'
    for all_info in every_class['info']:
        if not all_info.find('考试') == -1:
            class_test = all_info
    class_location = 'N/A'
    for all_info in every_class['info']:
        if all_info.startswith('(') and not all_info.startswith('(备注'):
            class_location = all_info[1:all_info.find(')')]
    class_remark = 'N/A'
    for all_info in every_class['info']:
        if all_info.startswith('(备注'):
            class_remark = all_info[1:all_info.find(')')]
    refined_info = {'day': class_day, 'time': class_time, 'name': class_name,
                    'type': class_type, 'exam': class_test, 'room': class_location, 'remark': class_remark}
    refined_table.append(refined_info)


# Refine completed
for every_class in refined_table:
    every_class['start'] = every_class['time']
    every_class['end'] = every_class['time']
    del every_class['time']
    for another_class in refined_table:
        if not another_class == every_class:
            if another_class['day'] == every_class['day'] and another_class['name'] == every_class['name']:
                if another_class['time'] < every_class['start']:
                    every_class['start'] = another_class['time']
                elif another_class['time'] > every_class['end']:
                    every_class['end'] = another_class['time']
                refined_table.remove(another_class)


print(refined_table)