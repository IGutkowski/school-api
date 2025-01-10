# School API Documentation

Welcome to the School API! It's a simple REST API created with express.js inspired by school structure. In this document you can find information about available endpoints for managing [Classes](./classes.md)
[Students](./students.md)
[Subjects](./subjects.md)
[Teachers](./teachers.md).



## API Overview

Base URL: `http://localhost:8989`

 ```json
 {
  "message": "Welcome to the School API!",
  "_links": {
    "allStudents": {
      "href": "http://localhost:8989/students",
      "method": "GET"
    },
    "allClasses": {
      "href": "http://localhost:8989/classes",
      "method": "GET"
    },
    "allTeachers": {
      "href": "http://localhost:8989/teachers",
      "method": "GET"
    },
    "allSubjects": {
      "href": "http://localhost:8989/subjects",
      "method": "GET"
    }
  }
}
