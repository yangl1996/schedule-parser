# PKU Schedule Parser

schedule-parser 读取北京大学选课系统选课结果页面，并自动将课程信息生成 .ics 文件，以供快速导入 Apple Calendar, Google Calendar 和 Microsoft Outlook 等日历系统，从而方便在桌面、移动设备和 Web 上查看课表。

## 运行环境

### 已测试的环境
- Python 3.4.2 on OS X

### 支持的环境
- Python 3.x

## 使用方法

1. 下载选课结果HTML

  登陆北京大学选课系统，进入选课结果页面，使用浏览器的下载功能，将选课结果页面保存为HTML文件

2. 精简HTML文件

  用文本编辑器（如：记事本）打开HTML文件，找到
  ```<table id="classAssignment" class="course" width="100%">```
  这一行，删去这一行之前的所有内容，并且将文件命名为为```sample.html```，和```parser.py```保存在同一个文件夹下。

3. 运行schedule-parser

  在 Linux 或 Mac OS 中，打开 Terminal ，打开保存有```sample.html```和```parser.py```的文件夹，执行命令
  ```
  python3 parser.py
  ```
  在同一个文件夹下，会生成class.ics。此文件可以被导入 Apple Calendar, Google Calendar 和 Microsoft Outlook 等日历系统，也可通过邮件、AirDrop等方式发送至移动设备，从而将日历信息添加到手机、平板电脑等设备。

## 路线图
- 提供GUI
- 提供可自定义的HTML文件名
- 提供更多信息，例如考试时间、考试地点等
- 自动下载、截取选课结果HTML

GUI和自定义HTML文件名等功能将优先被添加。
