#!/usr/bin/python
import cgi
form = cgi.FieldStorage()
print("Content-Type: text/html")
print("")
print("<html>")
print("<h2>CGI Script Output</h2>")
print("<p>")
print("The user entered data are:<br>")
print("<b>First Name:</b> "+form["stuID"].value+"<br>")
print("<b>Last Name:</b> "+form["password"].value+"<br>")
print("</p>")
print("</html>")
