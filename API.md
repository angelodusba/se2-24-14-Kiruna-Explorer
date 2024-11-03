# Kiruna Explorer Full API Specifications

This document lists all the expected behaviors for the APIs that compose the Kiruna Explorer application.

TODO: More complete description to be added here eventually.

## API List

For all constraints on request parameters and request body content, always assume a `422` error in case one constraint is not satisfied.
For all access constraints, always assume a `401` error in case the access rule is not satisfied.
For all success scenarios, always assume a `200` status code for the API response.
Specific error scenarios will have their corresponding error code.

### Access APIs

#### POST `kirunaexplorer/sessions`

Allows login for a user with the provided credentials.

- Request Parameters: None
- Request Body Content: An object having as attributes:
  - `email`: a string that must not be empty, and must be a valid email
  - `password`: a string that must not be empty
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "password": "MarioRossi"
}
```

- Response Body Content: A **User** object that represents the logged in user
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "role": "resident"
}
```

- Access Constraints: None
- Additional Constraints:
  - Returns a 401 error if the username does not exist
  - Returns a 401 error if the password provided does not match the one in the database

#### DELETE `kirunaexplorer/sessions`

Performs logout for the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: None
- Access Constraints: Can only be called by a logged in User

#### GET `kirunaexplorer/sessions`

Retrieves information about the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: A **User** object that represents the logged in user
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "role": "resident"
}
```

- Access Constraints: Can only be called by a logged in User

### User APIs

TODO: Add here the user APIs.

### Document APIs

#### POST `kirunaexplorer/documents`

Adds a new document to the database.

- Request Parameters: None
- Request Body Content: An object that represents the document to be added. The object must have the following attributes:
  - `title`: a string that must not be empty
  - `description`: a string that must not be empty
  - `type_id`: an integer that must not be empty
  - `issue_date`: a string that must not be empty, in the format **DD/MM/YYYY** or **MM/YYYY** or **YYYY**
  - `scale`: a string that must not be empty
  - `location`: an array of strings that must not be empty, representing the coordinates (logitude, latitude) of the document, can be a single point or a polygon
  - `language`: a string that can be empty
  - `pages`: TODO: optional attachment will be here
  - `stakeholders`: an array of integers that must not be empty, representing the ids of the stakeholders of the document
  - `connections`: an array of objects that must not be empty, representing the connections of the document
  - Example:

```JSON
{
    "title": "This is a title",
    "description": "This is a description",
    "type_id": 1,
    "issue_date": "01/01/2020",
    "scale": "blueprints/effects",
    "location": [
        "1 2",
        "3 4"
    ],
    "language": "",
    "pages": {},
    "stakeholders": [1, 2],
    "connections": [
        {
            "connected_document_id": 1,
            "connection_name": "direct_conn"
        },
        {
            "connected_document_id": 2,
            "connection_name": "prevision_conn"
        }
    ]
}
```

- Response Body Content: None
- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.
- Additional Constraints:
  - It should return a `409` error if a document with the same title already exists in the database
  - It should return a `404` error if the type of the document does not exist in the database
  - It should return a `404` error if at least one of the stakeholder does not exist in the database
  - It should return a `404` error if the scale does not exist in the database
  - It should return a `404` error if at least one of the connected documents does not exist in the database

#### GET `kirunaexplorer/documents/names`

Retrieves all the names and ids of the documents in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of objects, each representing a document:
  - Example:

```JSON
[
    {
        "id": 1,
        "title": "Document 1"
    },
    {
        "id": 2,
        "title": "Document 2"
    }
]
```

- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.

### Stakeholder APIs

#### GET `kirunaexplorer/stakeholders`

Retrieves all the stakeholders in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **Stakeholder** objects, each representing a stakeholder:
  - Example:

```JSON
[
    {
        "id": 1,
        "name": "Stakeholder 1"
    },
    {
        "id": 2,
        "name": "Stakeholder 2"
    }
]
```

- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.

### Type APIs

#### GET `kirunaexplorer/types`

Retrieves all the node types in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **Type** objects, each representing a node type:
  - Example:

```JSON
[
    {
        "id": 1,
        "name": "Node type 1"
    },
    {
        "id": 2,
        "name": "Node type 2"
    }
]
```

- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.

### Scale APIs

#### GET `kirunaexplorer/scales`

Retrieves all the scales in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **Scale** objects, each representing a node type:
  - Example:

```JSON
[
    {
        "id": 1,
        "name": "Scale 1"
    },
    {
        "id": 2,
        "name": "Scale 2"
    }
]
```

### Connection APIs

#### GET `kirunaexplorer/connections/names`

Retrieves all the names of the connections in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of strings, each representing a connection:
  - Example:

```JSON
[
    "Connection 1",
    "Connection 2"
]
```

#### POST `kirunaexplorer/connections`

Creates a new connection between the selected existing document and one or more other documents in the database.

- Request Parameters: None
- Request Body Content: An object that represents the connection to be added. The object must have the following attributes:
  - `starting_document_id`: an integer that must not be empty
  - `connections`: an array of objects that must not be empty, representing the connections of the selected document
  - Example:

```JSON
{
    "starting_document_id": 1,
    "connections": [
        {
            "connected_document_id": 1,
            "connection_name": "direct_conn"
        },
        {
            "connected_document_id": 2,
            "connection_name": "prevision_conn"
        }
    ]
}
```

- Response Body Content: None
- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.
- Additional Constraints:
  - It should return a `404` error if the starting document does not exist in the database
  - It should return a `404` error if at least one of the connected documents does not exist in the database
