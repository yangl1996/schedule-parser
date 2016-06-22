exports.parse_schedule = parse_schedule;

var cheerio = require('cheerio');

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
