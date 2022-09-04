# UBC Major And Courses API

## STATUS:
[![CI](https://github.com/serajsas/Course_Fetcher/actions/workflows/node.js.yml/badge.svg?branch=rel)](https://github.com/serajsas/Course_Fetcher/actions/workflows/node.js.yml)

## Features:
- Allow user to fetch real time courses from UBC website. 
- Allow user to fetch any Science Major requirements. 

## Installation:

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

## Documentation for API Endpoints

All URIs are relative to *http://localhost:8000/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*CourseApi* | [**courseGet**](docs/CourseApi.md#courseGet) | **GET** /course/ | Get course details
*MajorApi* | [**majorGet**](docs/MajorApi.md#majorGet) | **GET** /major/ | Get major requirements

- api_host/course/?dept=string&number=int&campus=string
  - dept is the department code, example: CPSC, MATH. It's case insensitive. 
  - number is the course number, example 304. 
  - campus is an optional query param. If not provided, it will be defaulted to Vancouver campus. 
- api_host/major/?name=string&specialization=string
  - name is the name of the major, could be two majors, example: Mathematics and Statistics or one major, example Mathematics.
  - specialization could be the name of the specialization, example: Major, Honours, Combined Major, Combined Honour, or it could be an actual name example: Cognition and Brain. 
  - To get the requirements for a specific specialization such as Cognition and Brain, make sure to provide the name of the major where the requirements could be found. For example, Cognition and Brain is under major Neuroscience. 

# Contribution: 
- Please feel free to create issue for any bugs found. 
- Please feel free to create Pull requests if you would like to participate.
