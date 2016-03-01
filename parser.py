#!/usr/bin/python3
# -*- coding: utf-8 -*-
import requests
import random
import json
from html.parser import HTMLParser
import cgi
form = cgi.FieldStorage()
import cgitb
cgitb.enable()

import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())


def handle_iaaa(username, password):
    URL = 'https://iaaa.pku.edu.cn/iaaa/oauthlogin.do'
    random_number = random.random()
    payload = {'appid': 'syllabus',
               'userName': str(username),
               'password': str(password),
               'randCode': str(random_number),
               'redirUrl': 'http://elective.pku.edu.cn:80/elective2008/agent4Iaaa.jsp/../ssoLogin.do'}
    session = requests.Session()
    r = session.post(URL, data=payload)
    result = json.loads(r.text)
    if result['success'] is True:
        token = result['token']
        session.headers.update({'referer': "http://elective.pku.edu.cn/elective2008/ssoLogin.do"})
        new_url = 'http://elective.pku.edu.cn/elective2008/ssoLogin.do' + '?rand=' + str(random_number) + '&token=' + token
        session.get(new_url)
        return session.get('http://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/electiveWork/showResults.do').text
    else:
        return 'LoginError'


def get_time(class_no, start=True):
    if start is True:
        if class_no == 1:
            return '080000'
        elif class_no == 2:
            return '090000'
        elif class_no == 3:
            return '101000'
        elif class_no == 4:
            return '111000'
        elif class_no == 5:
            return '130000'
        elif class_no == 6:
            return '140000'
        elif class_no == 7:
            return '151000'
        elif class_no == 8:
            return '161000'
        elif class_no == 9:
            return '171000'
        elif class_no == 10:
            return '184000'
        elif class_no == 11:
            return '194000'
        elif class_no == 12:
            return '204000'
    else:
        if class_no == 1:
            return '085000'
        elif class_no == 2:
            return '095000'
        elif class_no == 3:
            return '110000'
        elif class_no == 4:
            return '120000'
        elif class_no == 5:
            return '135000'
        elif class_no == 6:
            return '145000'
        elif class_no == 7:
            return '160000'
        elif class_no == 8:
            return '170000'
        elif class_no == 9:
            return '180000'
        elif class_no == 10:
            return '193000'
        elif class_no == 11:
            return '203000'
        elif class_no == 12:
            return '213000'


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

file_text = handle_iaaa(form["stuID"].value, form["password"].value)  # enter username and password
if not file_text == 'LoginError':
    file_text = file_text[file_text.find('<table id="classAssignment" class="course" width="100%">'):file_text.find('<script language="JavaScript" type="text/JavaScript">')]
else:
    error_page = open('error.html', 'r', encoding='utf-8')
    print("Content-Type: text/html; charset=utf-8")
    print()
    print(error_page.read())
    error_page.close()
    exit()

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
    
for every_class in refined_table:
    for another_class in refined_table:
        if not another_class == every_class:
            if another_class['day'] == every_class['day'] and another_class['name'] == every_class['name']:
                if another_class['end'] == every_class['start'] - 1:
                    every_class['start'] = another_class['start']
                elif another_class['start'] == every_class['end'] + 1:
                    every_class['end'] = another_class['end']
                refined_table.remove(another_class)




ics_file = '''BEGIN:VCALENDAR
CALSCALE:GREGORIAN
VERSION:2.0
METHOD:PUBLISH
X-WR-CALNAME:课程
X-WR-TIMEZONE:Asia/Shanghai
X-APPLE-CALENDAR-COLOR:#1BADF8
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
BEGIN:STANDARD
TZOFFSETFROM:+0900
RRULE:FREQ=YEARLY;UNTIL=19910914T150000Z;BYMONTH=9;BYDAY=3SU
DTSTART:19890917T000000
TZNAME:GMT+8
TZOFFSETTO:+0800
END:STANDARD
BEGIN:DAYLIGHT
TZOFFSETFROM:+0800
DTSTART:19910414T000000
TZNAME:GMT+8
TZOFFSETTO:+0900
RDATE:19910414T000000
END:DAYLIGHT
END:VTIMEZONE
'''
uid_count = 0
uid_identifier = str(random.random())

for every_class in refined_table:
    class_file = '''BEGIN:VEVENT
TRANSP:OPAQUE
SEQUENCE:0
LAST-MODIFIED:20150305T080000Z
DTSTAMP:20150305T080000Z
CREATED:20150305T080000Z
'''

    class_file += ("UID:lei's-schedule-generator-" + uid_identifier)
    class_file += str(uid_count) + '\n'
    uid_count += 1

    # EXDATE;TZID=Asia/Shanghai:20141111T151000 means exclude the date in the event loop
    class_file += ('SUMMARY:' + every_class['name'] + '\n')

    class_file += ('LOCATION:' + every_class['room'] + '\n')

    if every_class['type'] == 0:
        class_file += ('RRULE:FREQ=WEEKLY;COUNT=16' + '\n')
    else:
        class_file += ('RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=8' + '\n')

    class_file += 'DTSTART;TZID=Asia/Shanghai:'
    if every_class['type'] == 0 or every_class['type'] == 1:
        class_file += str(20150301 + every_class['day'])
    else:
        class_file += str(20150308 + every_class['day'])
    class_file += 'T'
    class_file += get_time(every_class['start'])
    class_file += '\n'

    class_file += 'DTEND;TZID=Asia/Shanghai:'
    if every_class['type'] == 0 or every_class['type'] == 1:
        class_file += str(20150301 + every_class['day'])
    else:
        class_file += str(20150308 + every_class['day'])
    class_file += 'T'
    class_file += get_time(every_class['end'], False)
    class_file += '\n'

    class_file += 'END:VEVENT'
    class_file += '\n'

    ics_file += class_file
    class_file = ''


ics_file += 'END:VCALENDAR'


print("Content-Type: text/calendar; charset=utf-8")
print("Content-Disposition: attachment; filename=%s" % 'class.ics')
print()
print(ics_file)
