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

2. 运行schedule-parser

  在 Linux 或 Mac OS 中，打开 Terminal ，打开保存有 HTML 文件和```parser.py```的文件夹，执行命令
  ```
  python3 parser.py
  ```
  然后根据提示，输入HTML文件的文件名。

  在同一个文件夹下，会生成class.ics。此文件可以被导入 Apple Calendar, Google Calendar 和 Microsoft Outlook 等日历系统，也可通过邮件、AirDrop等方式发送至移动设备，从而将日历信息添加到手机、平板电脑等设备。

## 路线图
- 提供GUI
- 提供更多信息，例如考试时间、考试地点等
- 自动下载选课结果HTML

GUI和自动下载功能将优先被添加。
