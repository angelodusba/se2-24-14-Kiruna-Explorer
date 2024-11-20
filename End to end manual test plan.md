# End-to-End Test Plan

## Table of Contents

1. [KX1-Create document](#KX1-create-document)
2. [KX2-Link documents](#KX2-link-documents)
3. [KX3-Georeferencing document](#KX3-georeferencing-document)
4. [KX4-View documents on the map](#KX4-view-documents-on-the-map)
5. [KX5-Adjust georeference of a document on the map](#KX5-adjust-georeference-of-a-document-on-the-map)
6. [KX6-List documents](#KX6-list-documents)
7. [KX7-Add attachments](#KX7-add-attachments)
8. [KX8-Search documents](#KX8-search-documents)

---

## KX1-Create document

### Description

_As an Urban Planner
I want to add a new document description_.

### Acceptance Criteria

- Urban planners are able to insert the documents
- Fields validation is reliable

### Test Cases

The following first step is the same for all the cases:
Navigate hover the dial on the bottom right of the page and click on add documents

#### Test Case 1: Successful insertion

- **Preconditions:** User is logged in and is an urban planner
- **Used data:** Title: sample, Description: sample, scale: 1:1000, type: Design stakeholders: LKAB, issue date: 2020, language: -, pages:-.
- **Test Steps:**
  - Insert Title, description, scale, type, stakeholders, issue date, language(optional) and pages(optional).
  - Go to the next step
  - Insert georeference of a document
  - Submit
- **Expected Result:** The document is successfully inserted

#### Test Case 2: Invalid date

- **Preconditions:** User is logged in and is an urban planner
- **Used data:** Title: sample, Description: sample, scale: 1:1000, type: Design, stakeholders: LKAB, issue date: 2020/20/20, language: -, pages:-.
- **Test Steps:**
  - Insert Title, description, scale, type, stakeholders, issue date, language(optional) and pages(optional).
  - Go to the next step
- **Expected Result:** The document is not inserted, error displayed

#### Test Case 3: Invalid character insertion

- **Preconditions:** User is logged in and is an urban planner

- **Test Steps:**
  - Try to insert a letter in numeric field(date,scale,pages).
- **Expected Result:** The letter is not inserted and an error is displayed

---

## KX2-Link documents

### Description

_As an Urban Planner
I want to link documents to each other
So that I can study their relationships_.

### Acceptance Criteria

- Urban planners are able to link documents and edit existing links

### Test Cases

The following first step is the same for all the cases:
Navigate hover the dial on the bottom right of the page and click on link documents

#### Test Case 1: Successfull linking

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select document to link
  - Select linked document
  - Select connection types among the 2 documents
  - Submit
- **Expected Result:** Documents successfully linked

#### Test Case 1: Successfull edit

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select document to link
  - Change/delete already linked document's connection type
  - Select connection types among the 2 documents
  - Submit
- **Expected Result:** Document's links successfully edited

## KX3-Georeferencing document

### Description

_As an Urban Planner
I want to georeference a document (possibly at insertion time)
So that I can study its relationship to the territory_.

### Acceptance Criteria

- - Urban planners are able to georeference documents (at insertion time)

### Test Cases

The following first step is the same for all the cases:
Navigate hover the dial on the bottom right of the page and click on add documents, provide info for the first step and go on the second one.

#### Test Case 1: Successfull georeference as whole municipality area

- **Preconditions:** User is logged in and is an urban planner, data of the first step is valid
- **Test Steps:**
  - Select georeference modality as municipality area
  - Submit
- **Expected Result:** Document is successfully created and georeferenced

#### Test Case 2: Successfull georeference as single point

- **Preconditions:** User is logged in and is an urban planner, data of the first step is valid
- **Test Steps:**
  - Select georeference modality as single point
  - Insert manually coordinates or pick them by the map
  - Submit
- **Expected Result:** Document is successfully created and georeferenced

#### Test Case 3: Invalid character insertion

- **Preconditions:** User is logged in and is an urban planner, data of the first step is valid
- **Test Steps:**
  - Select georeference modality as single point
  - Insert manually coordinates, type a letter
  - Submit
- **Expected Result:** The letter is not inserted

---

## KX4-View documents on the map

### Description

_As a resident/visitor/urban planner
I want to view the documents on the map
So that I can see to which position or area they relate_.

### Acceptance Criteria

- Documents are displayed on the map

### Test Cases

#### Test Case 1: Successfull show

- **Test Steps:**
  - Enter the map page
- **Expected Result:** Documents displayed on the map as markers

---

## KX5-Adjust georeference of a document on the map

### Description

\_As an Urban Planner
I want to adjust/define the georeferencing of a document on the map
So that I can study its relationship to the territory.

### Acceptance Criteria

- Urban planners are able to adjust the georeference of a document on the map

### Test Cases

The following first step is the same for all the cases:
Click on a document on the map to show its card and then click on the pencil on the right of location field to enter edit mode

#### Test Case 1: Successfull adjust as whole municipality area

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select georeference modality as municipality area
  - Submit
- **Expected Result:** Georeference of the document is adjusted according to the given info

#### Test Case 2: Successfull adjust as single point

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select georeference modality as single point
  - Insert manually coordinates or pick them by the map
  - Submit
- **Expected Result:** Georeference of the document is adjusted according to the given info

#### Test Case 3: Invalid character insertion

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select georeference modality as single point
  - Insert manually coordinates, type a letter
  - Submit
- **Expected Result:** The letter is not inserted

---

## KX6-List documents

### Description

_As an Urban Planner
I want to list all documents_.

### Acceptance Criteria

- Urban planners are able to list the documents

### Test Cases

The following first step is the same for all the cases:
Navigate hover the dial on the bottom left of the page and click on list documents

#### Test Case 1: List display

- **Preconditions:** User is logged in and is an urban planner
- **Expected Result:** Documents are listed in a table

#### Test Case 2: Sort the list

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Select the sorting criteria and order
  - Submit
- **Expected Result:** Documents are sorted according to the given criteria and order

---

## KX7-Add attachments

### Description

_As an Urban Planner
I want to add one or more original resources for a document_.

### Acceptance Criteria

- Urban planners are able to add attachments(original resources) to documents

### Test Cases

The following first step is the same for all the cases:
Click on a document on the map to show its card and then click on the pencil on the right of original resources field to enter edit mode

#### Test Case 1: Original resource added

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  1. Click the upload button
  2. Select an original resource to add
  3. Submit
- **Expected Result:** The original resource is added to the document and the file is in the public folder of the server

#### Test Case 2: Original resource delete

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  1. Click the delete button of an existing resource
- **Expected Result:** The original resource is deleted from the document and the file is removed by the public folder of the server

---

## KX8-Search documents

### Description

_As an Urban Planner
I want to search documents
So that I can find what I am interested in_.

### Acceptance Criteria

- Urban planners are able to search documents

### Test Cases

#### Test Case 1: Nominal search

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Access the search bar
  - Type the title of the document you want to search
  - Submit
- **Expected Result:** The matching document/s appear on the map and on the list

#### Test Case 2: Search with filters

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Access the search bar
  - Click on the advanced search icon
  - Select the filters to use for searching documents
  - Submit
- **Expected Result:** The matching document/s appear on the map and on the list

#### Test Case 3: Search with invalid filters

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Access the search bar
  - Click on the advanced search icon
  - Select the filters to use for searching documents (with invalid data)
  - Submit
- **Expected Result:** The filters are invalid, search is not performed

---
