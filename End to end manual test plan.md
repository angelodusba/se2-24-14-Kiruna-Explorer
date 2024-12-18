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
9. [KX9-Define the geolocated area](#KX9-Define-the-geolocated-area)
10. [KX19-Select an existing point or areas](#Select-an-existing-ponit-or-area)
11. [KX10-Visualize all documents on the diagram](#Visualize-all-documents-on-the-diagram)
12. [KX11-Visualize the area](#Visualize-the-area)
13. [KX14-Click on the documents on diagram](#Click-on-the-documents-on-diagram)
14. [KX20-Single cluster](#Single-cluster)
15. [KX17-See the selected document from the map in the diagram](#See-the-selected-document-from-the-map-in-the-diagram)
16. [KX12-Addjust the position of the documents on the diagram](#Addjust-the-documents-on-the-diagram)
17. [KX13-Adjust the connections on diagram](#Adjust-the-connections-on-diagram)
18. [KX15-Filter documents on the diagram](#Filter-documents-on-the-diagram)
19. [KX16-See the selected document from the diagram in the map](#See-the-selected-document-from-the-diagram-in-the-map)
20. [KX18-Add attachments](#Add-attachments)


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

## KX9-Define the geolocated area

### Description

_As an Urban Planner
I want to define the geolocated area of a document on the map

### Acceptance Criteria

- Urban planners are able to define the geolocated area of a document on the map

#### Test Case 1: Add  the geolocated area

- **Preconditions:** User is logged in and is an urban planner
- **Expected Result:** Urban planners can define the geolocated area on the map

#### Test Case 2: Draw an area on the map

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - select the draw a polygon button 
  - draw an area by choosing more than 2 points
  - select the save button on the buttom of the page
  - or select the edit button to edith it or selecting delete button to delet an area
- **Expected Result:** Area will be save and is accesible   when we want to add documents


10. [KX19-Select an existing point or areas](#Select-an-existing-ponit-or-area)

### Description

_As an Urban Planner
I want the option to select an existing point or areas instead of drawing a new one so that georefrencing is more consistent and faster to define

### Acceptance Criteria

- Urban planners are able select existing area or points

#### Test Case 1: Select existing area

- **Preconditions:** User is logged in and is an urban planner
- **Expected Result:** Urban planners can choose an existing area or point

#### Test Case 2: Select an area on the map

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - select the add document and 
  - In the georefrene part from thr drop down menue on the top of the screen we can choose areas from the predefined area part
  
- **Expected Result:** Area will be choose for the specific document


11. [KX10-Visualize all documents on the diagram](#Visualize-all-documents-on-the-diagram)


### Description

_As an Urban Planner
I want to visualize all documents on the diagram so that I can study their relationship with time

### Acceptance Criteria

- Urban planners can visualize all documents on the diagram and study their relationship with time

#### Test Case 1: Study the diagram

- **Preconditions:** User is logged in and is an urban planner
- **Expected Result:** Urban planners can study documents 

#### Test Case 2: Study the diagrams with details in the Legend drop down menue

- **Preconditions:** User is logged in and is an urban planner
- **Test Steps:**
  - Swipping the diagram veiw button to the right
  - In the diagram view there are some buttons which help urban planners to study the diagram and documents and their relationships
  
- **Expected Result:** Urban planners can study all the relationships between documents


12. [KX11-Visualize the area](#Visualize-the-area)

### Description

_As resident
I want to visualize the area associated with the different documents so that I can assess their impact

### Acceptance Criteria

- Residents can visualize the area associated with the different documents

#### Test Case 1: Visualize the area 

- **Preconditions:** User is logged in and is resident
- **Expected Result:**Residents can review documents within a defined area specified by themselves or by other residents by using the button that shows the areas.


13. [KX14-Click on the documents on diagram](#Click-on-the-documents-on-diagram)

### Description

_As a resident/ visitor/urban planner
I want to click on the documents shown on the diagram so that I can access to the document

### Acceptance Criteria

- Resident/ visitor/ urban planner can access to the document by clicking on the documents

#### Test Case 1: Visualize the area 

- **Preconditions:** User is logged in and is resident
- **Expected Result:**Residents / visitor/ UP can access the diagram by the button and access the documents card by clicking on them.



14. [JX20-Single cluster](#Single-cluster)

### Description

_ As a visitor/UP/Citizen
I want to see points and areas too close represented as a single cluster so that the map is not cluttered

### Acceptance Criteria

- Visitor/UP/Citizen can see points and areas too close as a single cluster

#### Test Case 1: view points and areas as a cluster 
- **Preconditions:** User is logged in and is visitor/UP/citizen
- **Expected Result:** User can zoom out to view all points and areas as a single cluster; the number of points decreases as the zoom level increases.



15. [KX17-See the selected document from the map in the diagram](#See-the-selected-document-from-the-map-in-the-diagram)

### Description

_ As a visitor/UP/Citizen
I want to see on the diagram the documetns selected in the map

### Acceptance Criteria

- Visitor/UP/Citizen can see on the diagram the documets that are selected on the map

#### Test Case 1: view selected documents on the diagram
- **Preconditions:** User is logged in and is visitor/UP/citizen
- **Expected Result:** User can access the diagram using the plus button, and when we select a document on the map, it will also appear on the diagram



16. [KX12-Addjust the position of the documents on the diagram](#Addjust-the-documents-on-the-diagram)

### Description

_ As an urnban planner
I want to adjust the position of docements on the diagram so that I can assess their impact

### Acceptance Criteria

- Urban planner can adjust the position of documents on the diagram and they can assess their impact

#### Test Case 1: adjust the position of the documents
- **Preconditions:** User is logged in and is urban planner
- **Expected Result:** Users can adjust the position of documents by clicking the edit button next to the location on the document card


17. [KX13-Adjust the connections on diagram](#Adjust-the-connections-on-diagram)

### Description

_ As an urnban planner
I want to adjust the connections of documents on the diagram
So that I can update it

### Acceptance Criteria

- Urban planner can adjust the connections of documents on the diagram and they can update it

#### Test Case 1: adjust the connections of the documents
- **Preconditions:** User is logged in and is urban planner
- **Expected Result:** Users can adjust the connections of documents on the diagram by clicking on one document and dragging the link to the next document. They can save the links by clicking the "Save new connections" button

18. [KX15-Filter documents on the diagram](#Filter-documents-on-the-diagram)

### Description

_ As a resident/visitor/urban planner
I want to filter the documents shown on the diagram
So that I can focus on what is relevant

### Acceptance Criteria

- Urban planner can filter the documents shown on the diagram so they can focuse on what is relevant

#### Test Case 1: filter documents on the diagram
- **Preconditions:** User is logged in and is resident/visitor/urban planner
- **Expected Result:** User can filter documents by using the filter button in the navbar

19. [KX16-See the selected document from the diagram in the map](#See-the-selected-document-from-the-diagram-in-the-map)

### Description

_ As a visitor/UP/Citizen
I want to see on the diagram the documetns selected in the diagram

### Acceptance Criteria

- Visitor/UP/Citizen can see on the diagram the documets that are selected on the diagram

#### Test Case 1: view selected documents on the diagram
- **Preconditions:** User is logged in and is visitor/UP/citizen
- **Expected Result:** User can access the diagram using the plus button, and when we select a document on the diagram, it will also appear on the map

20. [KX18-Add attachments](#Add-attachments)

### Description

_ As an Urban Planner
I want to add one or more attachments for a document

### Acceptance Criteria

- Urban planner can add more attachments to a document

#### Test Case 1: view selected documents on the diagram
- **Preconditions:** User is logged in and is urban planner
- **Expected Result:** User can add multiple attachments to a document using the edit button next to attachment in the document card

---
