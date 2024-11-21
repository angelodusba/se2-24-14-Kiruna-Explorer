# Kiruna Explorer Full API Specifications

This document lists all the expected behaviors for the APIs that compose the Kiruna Explorer application.

TODO: More complete description to be added here eventually.

## API List

- For all constraints on request parameters and request body content, always assume a `422` error in case one constraint is not satisfied.
- For all access constraints, always assume a `401` error in case the access rule is not satisfied.
- For all success scenarios, always assume a `200` status code for the API response.
- Specific error scenarios will have their corresponding error code.

### Access APIs

#### POST `kirunaexplorer/sessions`

Allows login for a user with the provided credentials.

- Request Parameters: None
- Request Body Content: An object having as attributes:
  - `email`: a string that must not be empty, and must be a valid email
  - `password`: a string that must not be empty
  - `username`: a string that must not be empty
  - `role`: a string that must not be empty
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "password": "password",
    "username": "MarioRossi",
    "role": "Resident"
}
```

- Response Body Content: A **User** object that represents the logged in user
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "username": "MarioRossi",
    "role": "Resident"
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
- Access Constraints: Can only be called by a logged in user

#### GET `kirunaexplorer/sessions`

Retrieves information about the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: A **User** object that represents the logged in user
  - Example:

```JSON
{
    "email": "mario.rossi@email.com",
    "username": "MarioRossi",
    "role": "Resident"
}
```

- Access Constraints: Can only be called by a logged in user

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
  - `location`: an array of objects that can be empty, representing the coordinates (logitude, latitude) of the document, can be a single point or a polygon (if empty, it represents the entire municipality area)
  - `language`: a string that can be empty
  - `pages`: a string that can be empty
  - `stakeholders`: an array of integers that must not be empty, representing the ids of the stakeholders of the document
  - Example:

```JSON
{
    "title": "This is a title",
    "description": "This is a description",
    "type_id": 1,
    "issue_date": "01/01/2020",
    "scale": "blueprints/effects",
    "location": [
        {"lat": 1.0, "lng": 3.0},
        {"lat": 5.0, "lng": 7.0},
    ],
    "language": "",
    "pages": {},
    "stakeholders": [1, 2]
}
```

- Response Body Content: An object that contains the id of the newly created document.
  - Example:

```JSON
{
  "id": 1
}
```

- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.
- Additional Constraints:
  - It should return a `409` error if a document with the same title already exists in the database
  - It should return a `404` error if the type of the document does not exist in the database
  - It should return a `404` error if at least one of the stakeholder does not exist in the database
  - It should return a `404` error if the scale does not exist in the database

#### PUT `kirunaexplorer/documents/location`

Updates the location of a document in the database.

- Request Parameters: None
- Request Body Content: An object that represents the document to be updated. The object must have the following attributes:
  - `id`: an integer that must not be empty, representing the id of the document to be updated
  - `location`: an array of objects that can be empty, representing the coordinates (logitude, latitude) of the document, can be a single point or a polygon (if empty, it represents the entire municipality area)
  - Example:

```JSON
{
    "id": 1,
    "location": [
		{
			"lng": 7.5,
			"lat": 46.5
		}
    ]
}
```

- Response Body Content: None
- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.
- Additional Constraints:
  - It should return a `404` error if the document does not exist in the database

#### GET `kirunaexplorer/documents/location`

Retrieves all the locations of the documents in the database.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **DocumentLocationResponse** objects, each containing a document's ID, type, and location coordinates (if available):
  - Example:

```JSON
[
    {
        "id": 1,
        "type":  {
            "id": 1,
            "name": "Design"
        },
        "location": [
            {
                "lng": 19.5,
                "lat": 48.5
            }
        ]
    },
    {
        "id": 2,
        "type":  {
            "id": 1,
            "name": "Design"
        },
        "location": [
            {
                "lng": 7.5,
                "lat": 46.5
            },
            {
                "lng": 12.5,
                "lat": 46.5
            },
            {
                "lng": 12.5,
                "lat": 42.5
            },
            {
                "lng": 7.5,
                "lat": 42.5
            },
            {
                "lng": 7.5,
                "lat": 46.5
            }
        ]
    }
]
```

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

#### GET `kirunaexplorer/documents/municipality`

Retrieves all the documents that belong to the municipality area.

- Request Parameters: None
- Request Body Content: None
- Response Body Content: An array of **Document** objects, each representing a document:
  - Example:

```JSON
[
    {
        "id": 1,
        "title": "Document 1",
        "description": "Description 1",
        "type": {
            "id": 1,
            "name": "Design"
        },
        "issue_date": "22/07/1980",
        "scale": "blueprints/effects",
        "location": [],
        "language": "en",
        "pages": "10"
    },
    {
        "id": 3,
        "title": "Document 3",
        "description": "Description 3",
        "type": {
            "id": 1,
            "name": "Design"
        },
        "issue_date": "2022",
        "scale": "blueprints/effects",
        "location": [],
        "language": "it",
        "pages": "45"
    }
]
```

#### GET `kirunaexplorer/documents/card/:id`

Retrieves all the information of the requested document to be displayed in a card.

- Request Parameters:
  - `id`: an integer greater than 0
- Request Body Content: None
- Response Body Content: A **DocumentCardResponse** object representing a document:
  - Example:

```JSON
{
	"id": 5,
	"title": "Paris",
	"description": "Capital of France",
	"type": {
		"id": 1,
		"name": "Design"
	},
	"issue_date": "22/07/1980",
	"scale": "1:8000",
	"location": [
		{
			"lng": 7.5,
			"lat": 46.5
		},
		{
			"lng": 12.5,
			"lat": 46.5
		},
		{
			"lng": 12.5,
			"lat": 42.5
		},
		{
			"lng": 7.5,
			"lat": 42.5
		},
		{
			"lng": 7.5,
			"lat": 46.5
		}
	],
	"language": "french",
	"pages": "60",
    "conn_count": 3,
    "stakeholders": ["LKAB", "Municipality"],
    "attachments": [
        {
            "id": 1,
            "document_id": 5,
            "type": "image/png",
            "original": true,
            "path": "doc5/att_photo.png"
        },
        {
            "id": 2,
            "document_id": 5,
            "type": "application/pdf",
            "original": false,
            "path": "doc5/att_plan.pdf"
        }
    ]
}
```

#### GET `kirunaexplorer/documents/:id`

Retrieves all the information of the requested document.

- Request Parameters:
  - `id`: an integer greater than 0
- Request Body Content: None
- Response Body Content: A **Document** object representing a document:
  - Example:

```JSON
{
	"id": 5,
	"title": "Paris",
	"description": "Capital of France",
	"type": {
		"id": 1,
		"name": "Design"
	},
	"issue_date": "22/07/1980",
	"scale": "1:8000",
	"location": [
		{
			"lng": 7.5,
			"lat": 46.5
		},
		{
			"lng": 12.5,
			"lat": 46.5
		},
		{
			"lng": 12.5,
			"lat": 42.5
		},
		{
			"lng": 7.5,
			"lat": 42.5
		},
		{
			"lng": 7.5,
			"lat": 46.5
		}
	],
	"language": "french",
	"pages": "60"
}
```

- TODO: Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.

#### POST `kirunaexplorer/documents/filtered`

Retrieves all the information of the documents matching the specified filters.

- Request Parameters: None
- Query parameters:
  - `page` (number) - Page number to visualize.
  - `size` (number) - Number of elements in a page (1 <= size <= 20).
  - `sort` (string) - Sort results for one of the following fields in asc or desc order:
    - `title`, `description`, `type_name`, `issue_date`, `scale`, `language`, `pages`.
  - The format is: `attribute:asc` or `attribute:desc`.
  - Example: `http://localhost:3001/kirunaexplorer/documents/filtered?page=2&size=10&sort=title:desc`.
- Request Body Content: An object that can contain one or more of the following filter parameters:
  - `title` (string) - Documents' title.
  - `description` (string) - Documents' description.
  - `start_year` (string) - Documents' issue year must be after this value.
  - `end_year` (string) - Documents' issue year must be before or within this value.
  - `scales` (string[]) - Documents' scales, it accepts the following values:
    - "Blueprints/material effects"
    - "Text"
    - "Concept"
    - "1:NUMBER" (architectural scale)
  - `types` (number[]) - List of document types ids.
  - `languages` (string[]) - Documents' languages, it can be either "English" or "Swedish".
  - `stakeholders` (number[]) - List of stakeholders ids related to the documents.
  - `municipality` (boolean) - If true, it will return only documents related to the all municipality area.
  - Example:

```JSON
{
  "title": "doc1",
  "description": "descr",
  "start_year": "2020",
  "end_year": "2022",
  "scales": ["Concept"],
  "types": [1,2],
  "languages": ["English"],
  "stakeholders": [3,5,7],
  "municipality": true
}
```

- Response Body Content: An object with three fields:
  - `docs` (Document[]) - An array of filtered documents.
  - `totalRows` (number) - Total number of rows found in the db for the selected filtering criteria.
  - `totalPages` (number) - Maximum number of pages the client can request for the selected filtering criteria.
  - Example:

```JSON
{
  "docs": [
    {
      "id": 1,
      "title": "Doc title",
      "description": "Doc description",
      "type": {
        "id": 5,
        "name": "Prescriptive"
      },
      "issue_date": "1980",
      "scale": "Text",
      "location": [
        {"lat": 20.94, "lng": 33.21}
      ],
      "language": "English",
      "pages": "32"
    },
    {
      ...
    }
  ],
  "totalRows": 24,
  "totalPages": 3
}
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

### Attachment APIs

#### POST `kirunaexplorer/attachments/:document_id`

Uploads an attachment for a specific document.

- Request Parameters:
  - `document_id`: an integer greater than 0
- Request Body Content: An object with one field:
  - `original` - A boolean value to indicate if the attachment is original or not.
- Additional Requirements:
  - The user must have uploaded a file whose extension is one of the following:
    `jpeg`, `png`, `gif`, `pdf`, `doc`, `docx`, `xls`, `xlsx`.
- Response Body Content: An **Attachment** object that represents the uploaded attachment:
  - Example:

```JSON
{
    "id": 1,
    "document_id": 2,
    "type": "image/jpeg",
    "original": true,
    "path": "doc2/file1.jpg"
}
```

- Access Constraints: Can only be called by a logged in user whose role is `Urban Planner`.

#### GET `kirunaexplorer/attachments/:document_id`

Retrieves all the attachments for a specific document.

- Request Parameters:
  - `document_id`: an integer greater than 0
- Request Body Content: None
- Response Body Content: An array of **Attachment** objects, each representing an attachment belonging to the document:
  - Example:

```JSON
[
    {
        "id": 1,
        "document_id": 2,
        "type": "image/jpeg",
        "original": true,
        "path": "doc2/file1.jpg"
    },
    {
        "id": 2,
        "document_id": 2,
        "type": "application/pdf",
        "original": false,
        "path": "doc2/file2.pdf"
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

#### GET `kirunaexplorer/connections`

Retrieves all connections between documents

- Request Parameters: none
- Request Body Content: None
- Response Body Content: An array of object, each containing
  - Example:

```JSON
[
  {
    "document_id_1": 1,
    "document_id_2": 2,
    "connection_name": "direct_conn"
  },
    {
    "document_id_1": 1,
    "document_id_2": 3,
    "connection_name": "prevision_conn"
  },
]
```
