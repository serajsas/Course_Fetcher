drop database if exists course_fetcher;
create database if not exists course_fetcher;
use course_fetcher;

Create table Course
(
    dept_name char(10),
    course_no int,
    primary key (dept_name, course_no)
);

Create table Prereq
(
    course_dept_name     char(10),
    course_number        int,
    prereq_dept_name     char(10),
    prereq_course_number int,
    primary key (course_dept_name, course_number, prereq_dept_name, prereq_course_number),
    foreign key (course_dept_name, course_number) references Course (dept_name, course_no),
    foreign key (prereq_dept_name, prereq_course_number) references Course (dept_name, course_no)
);

