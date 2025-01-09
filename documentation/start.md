# School API Documentation

Welcome to the School API! It's a simple REST API created with express.js inspired by school structure. In this document you can find information about available endpoints for managing Classes, Students, Subjects, and Teachers.

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

 ```

### Endpoints:
- [Classes](#classes)
- [Students](#students)
- [Subjects](#subjects)
- [Teachers](#teachers)

---

## Classes

### Endpoints

- **GET /classes**
    - Retrieve all classes.
    - Response: List of classes with links to detailed actions.

- **GET /classes/:id**
    - Retrieve details of a specific class.
    - Response: Class details and action links.

- **POST /classes**
    - Create a new class.
    - Required Body:
      ```json
      {
        "name": "<class_name>",
        "subjects": ["<subject_id>"]
      }
      ```

- **PUT /classes/:id**
    - Fully update a class.
    - Required Body:
      ```json
      {
        "name": "<class_name>",
        "subjects": ["<subject_id>"]
      }
      ```

- **PATCH /classes/:id**
    - Partially update a class.
    - Example Body:
      ```json
      {
        "name": "<new_class_name>"
      }
      ```

- **DELETE /classes/:id**
    - Delete a class.

---

## Students

### Endpoints

- **GET /students**
    - Retrieve all students.
    - Response: List of students with links to detailed actions.

- **GET /students/:id**
    - Retrieve details of a specific student.
    - Response: Student details and action links.

- **POST /students**
    - Create a new student.
    - Required Body:
      ```json
      {
        "name": "<student_name>",
        "age": <age>,
        "gender": "<gender>",
        "classId": "<class_id>",
        "grades": {},
        "absences": {}
      }
      ```

- **PUT /students/:id**
    - Fully update a student.
    - Required Body: Same as POST.

- **PATCH /students/:id**
    - Partially update a student.
    - Example Body:
      ```json
      {
        "age": <new_age>
      }
      ```

- **DELETE /students/:id**
    - Delete a student.

---

## Subjects

### Endpoints

- **GET /subjects**
    - Retrieve all subjects.
    - Response: List of subjects with links to detailed actions.

- **GET /subjects/:id**
    - Retrieve details of a specific subject.
    - Response: Subject details and action links.

- **POST /subjects**
    - Create a new subject.
    - Required Body:
      ```json
      {
        "name": "<subject_name>",
        "teacher": {
          "id": "<teacher_id>",
          "name": "<teacher_name>"
        }
      }
      ```

- **PUT /subjects/:id**
    - Fully update a subject.
    - Required Body: Same as POST.

- **PATCH /subjects/:id**
    - Partially update a subject.
    - Example Body:
      ```json
      {
        "name": "<new_subject_name>"
      }
      ```

- **DELETE /subjects/:id**
    - Delete a subject.


---

## Teachers

### Endpoints

- **GET /teachers**
    - Retrieve all teachers.
    - Response: List of teachers with links to detailed actions.

- **GET /teachers/:id**
    - Retrieve details of a specific teacher.
    - Response: Teacher details and action links.

- **POST /teachers**
    - Create a new teacher.
    - Required Body:
      ```json
      {
        "name": "<teacher_name>",
        "gender": "<gender>",
        "subject": "<subject_name>"
      }
      ```

- **PUT /teachers/:id**
    - Fully update a teacher.
    - Required Body: Same as POST.

- **PATCH /teachers/:id**
    - Partially update a teacher.
    - Example Body:
      ```json
      {
        "name": "<new_teacher_name>"
      }
      ```

- **DELETE /teachers/:id**
    - Delete a teacher.


