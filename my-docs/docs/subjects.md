# Subjects

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
