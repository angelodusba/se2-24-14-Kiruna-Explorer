-----------------
-- Users table --
-----------------
INSERT INTO "users" (email, username, password, role, salt) VALUES ('john@kiruna.com', 'john', '1af1ee4c85bcbba4146ab20de52cde6b', 'Urban Planner', '70706c1bbff40ddcbee4f6de82fd450f');
INSERT INTO "users" (email, username, password, role, salt) VALUES ('kevin@kiruna.com', 'kevin', '1af1ee4c85bcbba4146ab20de52cde6b', 'Resident', '70706c1bbff40ddcbee4f6de82fd450f');

-----------------
-- Types table --
-----------------
INSERT INTO "types" (name) VALUES ('Design');
INSERT INTO "types" (name) VALUES ('Informative');
INSERT INTO "types" (name) VALUES ('Prescriptive');
INSERT INTO "types" (name) VALUES ('Technical');
INSERT INTO "types" (name) VALUES ('Agreement');
INSERT INTO "types" (name) VALUES ('Conflict');
INSERT INTO "types" (name) VALUES ('Consultation');
INSERT INTO "types" (name) VALUES ('Action');
INSERT INTO "types" (name) VALUES ('Material Effect');


---------------------
-- Documents table --
---------------------

-- 1. Document with a single point location
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Block 1 begins', 
    'Simultaneously with the start of construction on 
    the Aurora Center, work also began on Block 1, 
    another mixed-use building overlooking the main 
    square and the road leading to old Kiruna. These are 
    the first residential buildings in the new town.', 
    9, -- type_id
    '2019-06', 
    'Blueprints/Material effects', 
    '', 
    '', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.300333 67.848556)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Aurora Center begins', 
    'Shortly after the construction of the Scandic hotel 
    began, work on the Aurora Center also started, a 
    multifunctional complex that includes the munici
    pal library of Kiruna. The two buildings are close to 
    each other and connected by a skywalk, just like in 
    the old town center.', 
    9, -- type_id
    '2019-05', 
    'Blueprints/Material effects', 
    '', 
    '', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.304389 67.849167)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Town Hall demolition', 
    'After the construction of the new town hall was 
    completed, the old building, nicknamed "The Igloo," 
    was demolished. The only elements preserved were 
    the door handles, a masterpiece of Sami art made of 
    wood and bone, and the clock tower, which once 
    stood on the roof of the old town hall. The clock 
    tower was relocated to the central square of New 
    Kiruna, in front of the new building.', 
    9, -- type_id
    '2019-04', 
    'Blueprints/Material effects', 
    '', 
    '', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.222444 67.8525)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Construction of Scandic Hotel begins', 
    'After two extensions of the land acquisition agree
    ment, necessary because this document in Sweden 
    is valid for only two years, construction of the hotel 
    finally began in 2019.', 
    9, -- type_id
    '2019-04', 
    'Blueprints/Material effects', 
    '', 
    '', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.304778 67.848528)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);


-- 2. Document with a null location (all the Kiruna's area)
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Compilation of responses “So what the 
    people of Kiruna think?”', 
    'This document is a compilation of the responses to 
    the survey ''What is your impression of Kiruna?'' 
    From the citizens'' responses to this last part of the 
    survey, it is evident that certain buildings, such as 
    the Kiruna Church, the Hjalmar Lundbohmsgården, 
    and the Town Hall, are considered of significant 
    value to the population. The municipality views the 
    experience of this survey positively, to the extent 
    that over the years it will propose various consulta
    tion opportunities.', 
    2, -- type_id
    '2007', 
    'Text', 
    'Swedish', 
    ''
);
/*
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Document with noa', 
    'This document has no specificocation.', 
    1, -- type_id
    '2020', 
    '1:8000', 
    'English', 
    '32'
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Document wit area', 
    'This document has noecific location.', 
    1, -- type_id
    '2020', 
    '1:8000', 
    'English', 
    '32'
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Document no area', 
    'This document has no specific location.', 
    1, -- type_id
    '2020', 
    '1:8000', 
    'English', 
    '32'
);
*/

-- 3. Document with an area location
INSERT INTO "documents"  (title, description, type_id, issue_date, scale,language,pages, location) VALUES (
    'Detail plan for Bolagsomradet Gruvstad
    spark', 
    'This is the first of 8 detailed plans located in the old 
    center of Kiruna, aimed at transforming the 
    residential areas into mining industry zones to allow 
    the demolition of buildings. The area includes the 
    town hall, the Ullspiran district, and the A10 
    highway, and it will be the first to be dismantled. 
    The plan consists, like all detailed plans, of two 
    documents: the area map that regulates it, and a 
    text explaining the reasons that led to the drafting 
    of the plan with these characteristics. The plan 
    gained legal validity in 2012.', 
    3, -- type_id
    '2010-10-20', 
    '1:8000', 
    'Swedish',
    '1-32',
    ST_SetSRID(ST_GeometryFromText('POLYGON((
        6.6235 36.6192,
        9.5635 36.6192,
        10.4734 37.1156,
        10.4502 37.6798,
        9.4971 38.6771,
        9.0933 39.1508,
        8.3918 39.3791,
        8.3574 40.6487,
        6.7658 41.1858,
        6.3391 41.0717,
        6.6235 36.6192
    ))'), 4326));  -- Simplified outline of Italy


--The location of the previous document has to be changed with the real one in card number 18. All the other card related to an area are not inserted (41-45-47-50)--






-----------------------
-- Connections table --
-----------------------
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 2, TRUE); -- at least one connection type must be TRUE
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 3, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (3, 4, TRUE);

------------------------
-- Stakeholders table --
------------------------
INSERT INTO "stakeholders" (name) VALUES ('LKAB');
INSERT INTO "stakeholders" (name) VALUES ('Municipality');
INSERT INTO "stakeholders" (name) VALUES ('Regional authority');
INSERT INTO "stakeholders" (name) VALUES ('Architecture firms');
INSERT INTO "stakeholders" (name) VALUES ('Citizens');
INSERT INTO "stakeholders" (name) VALUES ('Others');

----------------------------------
-- Documents_stakeholders table --
----------------------------------
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (1, 1);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (2, 1);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (3, 1);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (4, 1);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (5, 2);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (5, 5);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (6, 2);
