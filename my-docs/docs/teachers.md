# Teachers

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
