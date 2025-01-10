# Students

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
