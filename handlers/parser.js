exports.parse_schedule = parse_schedule;
exports.schedule_to_ical = schedule_to_ical;

var cheerio = require('cheerio');
var randomstring = require('randomstring');
var moment = require('moment');

function weekday_conversion(kanji) {
  switch (kanji) {
    case '一':
      return 1;
    case '二':
      return 2;
    case '三':
      return 3;
    case '四':
      return 4;
    case '五':
      return 5;
    case '六':
      return 6;
    case '日':
      return 7;
  }
}

function class_start_time(class_idx) {
  switch (class_idx) {
    case 1:
      return {'hour': 8, 'minute': 0, 'second': 0};
    case 2:
      return {'hour': 9, 'minute': 0, 'second': 0};
    case 3:
      return {'hour': 10, 'minute': 10, 'second': 0};
    case 4:
      return {'hour': 11, 'minute': 10, 'second': 0};
    case 5:
      return {'hour': 13, 'minute': 0, 'second': 0};
    case 6:
      return {'hour': 14, 'minute': 0, 'second': 0};
    case 7:
      return {'hour': 15, 'minute': 10, 'second': 0};
    case 8:
      return {'hour': 16, 'minute': 10, 'second': 0};
    case 9:
      return {'hour': 17, 'minute': 10, 'second': 0};
    case 10:
      return {'hour': 18, 'minute': 40, 'second': 0};
    case 11:
      return {'hour': 19, 'minute': 40, 'second': 0};
    case 12:
      return {'hour': 20, 'minute': 40, 'second': 0};
  }
}

function class_end_time(class_idx) {
  switch (class_idx) {
    case 1:
      return {'hour': 8, 'minute': 50, 'second': 0};
    case 2:
      return {'hour': 9, 'minute': 50, 'second': 0};
    case 3:
      return {'hour': 11, 'minute': 0, 'second': 0};
    case 4:
      return {'hour': 12, 'minute': 0, 'second': 0};
    case 5:
      return {'hour': 13, 'minute': 50, 'second': 0};
    case 6:
      return {'hour': 14, 'minute': 50, 'second': 0};
    case 7:
      return {'hour': 16, 'minute': 0, 'second': 0};
    case 8:
      return {'hour': 17, 'minute': 0, 'second': 0};
    case 9:
      return {'hour': 18, 'minute': 0, 'second': 0};
    case 10:
      return {'hour': 19, 'minute': 30, 'second': 0};
    case 11:
      return {'hour': 20, 'minute': 30, 'second': 0};
    case 12:
      return {'hour': 21, 'minute': 30, 'second': 0};
  }
}

function parse_schedule(html_string) {
  $ = cheerio.load(html_string, {decodeEntities: false});
  /* select the table and iterate through all non-header rows */
  var class_schedule = [];
  $('body table').children('tr').each(function(index, element) {
    var class_metadata = {'title': null, 'time': [], 'classroom': null};
    /* get course title */
    class_metadata['title'] = $(this).children().eq(1).text();
    /* get course classroom and time */
    var time_location_str = $(this).children().eq(8).text();

    var match_result;
    var time_matcher = /周([一二三四五六日])(\d+)-(\d+)(\(([单双])\))?/g;
    var classroom_matcher = /地点: (.+)$/g;

    while ((match_result = time_matcher.exec(time_location_str)) !== null) {
      var class_time_instance = {'day': null, 'start': null, 'end': null, 'parity': null};
      if (match_result[1]) {
        class_time_instance['day'] = weekday_conversion(match_result[1]);
      }
      if (match_result[2]) {
        class_time_instance['start'] = parseInt(match_result[2], 10);
      }
      if (match_result[3]) {
        class_time_instance['end'] = parseInt(match_result[3], 10);
      }
      if (match_result[5]) {
        if (match_result[5] === '单') {
          class_time_instance['parity'] = 1;
        }
        else if (match_result[5] === '双') {
          class_time_instance['parity'] = 2;
        }
      }
      else {
        class_time_instance['parity'] = 0;
      }
      class_metadata['time'].push(class_time_instance);
    }
    if ((match_result = classroom_matcher.exec(time_location_str)) !== null) {
      class_metadata['classroom'] = match_result[1];
    }
    class_schedule.push(class_metadata);
  });
  return class_schedule;
}

function class_to_ical(class_meta, first_monday) {
  /* first_monday: the first day of that semester, in moment.js object */
  var vevent_str = '';
  for (time_instance in class_meta['time']) {
    vevent_str += 'BEGIN:VEVENT\n';
    vevent_str += 'TRANSP:OPAQUE\n';
    vevent_str += 'SEQUENCE:0\n';
    vevent_str += 'LAST-MODIFIED:20150305T080000Z\n';
    vevent_str += 'DTSTAMP:20150305T080000Z\n';
    vevent_str += 'CREATED:20150305T080000Z\n';
    vevent_str += ('UID:yangl1996-' + randomstring.generate(16) + '\n');
    vevent_str += ('SUMMARY:' + class_meta['title'] + '\n');
    if (class_meta['classroom']) {
      vevent_str += ('LOCATION:' + class_meta['classroom'] + '\n');
    }
    if (time_instance['parity'] === 0) {
      vevent_str += 'RRULE:FREQ=WEEKLY;COUNT=16\n';
    }
    else {
      vevent_str += 'RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=8\n';
    }
    var start_time = moment(first_monday);
    start_time.add(time_instance['day'] - 1, 'days');
    var end_time = moment(first_monday);
    end_time.add(time_instance['day'] - 1, 'days');
    start_time.set(class_start_time(time_instance['start']));
    end_time.set(class_end_time(time_instance['end']));
    if (time_instance['parity'] === 2) {
      start_time.add(7, 'days');
      end_time.add(7, 'days');
    }
    vevent_str += 'DTSTART;TZID=Asia/Shanghai:';
    vevent_str += start_time.format('YYYYMMDD[T]HHmmss');
    vevent_str += '\n';
    vevent_str += 'DTEND;TZID=Asia/Shanghai:';
    vevent_str += end_time.format('YYYYMMDD[T]HHmmss');
    vevent_str += '\n';
    vevent_str += 'END:VEVENT\n';
  }
  return vevent_str;
}

function schedule_to_ical(class_schedule, first_monday) {
  var ical_string =
    ['BEGIN:VCALENDAR',
     'CALSCALE:GREGORIAN',
     'VERSION:2.0',
     'METHOD:PUBLISH',
     'X-WR-CALNAME:课程',
     'X-WR-TIMEZONE:Asia/Shanghai',
     'X-APPLE-CALENDAR-COLOR:#1BADF8',
     'BEGIN:VTIMEZONE',
     'TZID:Asia/Shanghai',
     'BEGIN:STANDARD',
     'TZOFFSETFROM:+0900',
     'RRULE:FREQ=YEARLY;UNTIL=19910914T150000Z;BYMONTH=9;BYDAY=3SU',
     'DTSTART:19890917T000000',
     'TZNAME:GMT+8',
     'TZOFFSETTO:+0800',
     'END:STANDARD',
     'BEGIN:DAYLIGHT',
     'TZOFFSETFROM:+0800',
     'DTSTART:19910414T000000',
     'TZNAME:GMT+8',
     'TZOFFSETTO:+0900',
     'RDATE:19910414T000000',
     'END:DAYLIGHT',
     'END:VTIMEZONE'].join('\n');
  for (class_instance in class_schedule) {
    if (class_instance['time'].length > 0) {
      ical_string += class_to_ical(class_instance, first_monday);
    }
  }
  ical_string += 'END:VCALENDAR';
  return ical_string;
}
