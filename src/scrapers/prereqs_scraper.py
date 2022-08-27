import requests
from bs4 import BeautifulSoup

def scrap(dep, number):

    URL = "https://www.courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept={}&course={}".format(dep,number)
   # issues a GET request to the URL  and returns the HTML request
    page = requests.get(URL)



   # parses the HTML binary data into HTML file
    soup = BeautifulSoup(page.content, "html.parser")

   # gets all the paragraph tags (Pre-reqs is in a <p></p> tag)
   # returns an array of <p></p> tags
    courses = soup.find_all("p")

    pre_reqs_list = courses[2].text
