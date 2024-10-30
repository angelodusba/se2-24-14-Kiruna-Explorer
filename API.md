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
``` JSON
{
    "email": "mario.rossi@email.com", 
    "password": "MarioRossi"
}
```
- Response Body Content: A **User** object that represents the logged in user
  - Example: 
``` JSON
{
    "email": "mario.rossi@email.com",
    "role": "resident"
}
```
- Access Constraints: None
- Additional Constraints:
  - Returns a 401 error if the username does not exist
  - Returns a 401 error if the password provided does not match the one in the database

#### DELETE `kirunaexplorer/sessions/current`

Performs logout for the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: None
- Access Constraints: Can only be called by a logged in User

#### GET `kirunaexplorer/sessions/current`

Retrieves information about the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: A **User** object that represents the logged in user
  - Example: 
``` JSON
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
  - `location`: an array of objects that must not be empty, representing the coordinates of the document, can be a single point or a polygon
  - `language`: a string that can be empty
  - `pages`: TODO: optional attachment will be here
  - `stakeholders`: an array of integers that must not be empty, representing the ids of the stakeholders of the document
  - Example:
``` JSON
{
    "title": "This is a title",
    "description": "This is a description",
    "type_id": 1,
    "issue_date": "01/01/2020",
    "scale": "blueprints/effects",
    "location": [
        {"lat": 1, "long": "2"}
    ],
    "language": "",
    "pages": {},
    "stakeholders": [1, 2]
}
```
- Response Body Content: None
- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.
- Additional Constraints:
  - It should return a `409` error if a document with the same title already exists in the database


### Stakeholder APIs

#### GET `kirunaexplorer/stakeholders`

Retrieves all the stakeholders in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **Stakeholder** objects, each representing a stakeholder:
  - Example:
``` JSON
[
    {
        "id": 1,
        "name": "Name 1"
    },
    {
        "id": 2, 
        "name": "Name 2"
    }
]
```

