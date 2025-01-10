# Classes

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
