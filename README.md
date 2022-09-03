# UBC Major And Courses API

# STATUS:
[![CI](https://github.com/serajsas/Course_Fetcher/actions/workflows/node.js.yml/badge.svg?branch=rel)](https://github.com/serajsas/Course_Fetcher/actions/workflows/node.js.yml)

# Features:
- Allow user to fetch real time courses from UBC website. 
- Allow user to fetch any Science Major requirements. 

# Installation:

```
Clone the repo from [Github](https://github.com/serajsas/Course_Fetcher.git)
```

run
```
npm run docker:start
```

To run the tests
```
npm run test
```

# Exposed endpoints:
- api_host/prerequisite/?dept=string&number=int
  - dept is the department code, example: CPSC, MATH. It's case insensitive. 
  - number is the course number, example 304. 
- api_host/major/?name=string&specialization=string
  - name is the name of the major, could be two majors, example: Mathematics and Statistics or one major, example Mathematics.
  - specialization could be the name of the specialization, example: Major, Honours, Combined Major, Combined Honour, or it could be an actual name example: Cognition and Brain. 
  - To get the requirements for a specific specialization such as Cognition and Brain, make sure to provide the name of the major where the requirements could be found. For example, Cognition and Brain is under major Neuroscience. 

# Contribution: 
- Please feel free to create any issues for any bugs found. 
- Please feel free to create any Pull requests if you would like to participate.


