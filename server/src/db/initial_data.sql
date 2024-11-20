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


------------------------
-- Stakeholders table --
------------------------
INSERT INTO "stakeholders" (name) VALUES ('LKAB');
INSERT INTO "stakeholders" (name) VALUES ('Municipality');
INSERT INTO "stakeholders" (name) VALUES ('Regional authority');
INSERT INTO "stakeholders" (name) VALUES ('Architecture firms');
INSERT INTO "stakeholders" (name) VALUES ('Citizens');
INSERT INTO "stakeholders" (name) VALUES ('Others');


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
    ST_SetSRID(ST_GeometryFromText('POINT(20.300333 67.848556)'), 4326)
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
    ST_SetSRID(ST_GeometryFromText('POINT(20.304389 67.849167)'), 4326)
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
    ST_SetSRID(ST_GeometryFromText('POINT(20.222444 67.8525)'), 4326)
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
    ST_SetSRID(ST_GeometryFromText('POINT(20.304778 67.848528)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) 
VALUES 
('Kiruna Mining History', 'A look at the iron ore mining activities and their economic impact.', 2, '1925', 'Text', 'Swedish', '25', ST_SetSRID(ST_GeometryFromText('POINT(20.19987814645499 67.87772277791264)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Sami Cultural Integration', 'Text documenting Sami culture in Kiruna and its influence on the city.', 2, '1975', 'Text', 'Swedish', '32', ST_SetSRID(ST_GeometryFromText('POINT(20.26331233642294 67.8651978803257)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Mining Safety Improvements', 'A detailed report on safety measures implemented in Kiruna mines.', 4, '1985-05', 'Text', 'English', '20', ST_SetSRID(ST_GeometryFromText('POINT(20.238568503456722 67.85545419070905)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Impact of Mining on Environment', 'Studies showing the environmental impact of mining activities.', 5, '1990', 'Text', 'English', '30', ST_SetSRID(ST_GeometryFromText('POINT(20.257238850149392 67.84816494344281)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Concept Art for New Kiruna Center', 'Early concept designs for the new relocated city center.', 3, '2020', 'Concept', 'Swedish', '6', ST_SetSRID(ST_GeometryFromText('POINT(20.2592633455739 67.84502817093676)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Development of Iron Ore Technology', 'Technical documentation on iron ore mining technology.', 4, '1965-03', '1:500', 'Swedish', '18', ST_SetSRID(ST_GeometryFromText('POINT(20.190880389012708 67.85223364145514)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna in World War II', 'An analysis of Kiruna''s strategic importance during World War II.', 6, '1945', 'Text', 'English', '22', ST_SetSRID(ST_GeometryFromText('POINT(20.297278870767478 67.84714765803393)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('History of LKAB Mining Company', 'History and milestones of the LKAB mining company.', 1, '2000', 'Text', 'Swedish', '35', ST_SetSRID(ST_GeometryFromText('POINT(20.234969400479795 67.85842009260008)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Mining Technology Patents', 'Patent records for mining technology innovations from Kiruna.', 4, '1995', 'Text', 'English', '40', ST_SetSRID(ST_GeometryFromText('POINT(20.17153521051184 67.8613008931881)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Modernization of Kiruna Mines', 'A study on the modernization efforts in Kiruna mining operations.', 2, '2005-06', 'Text', 'Swedish', '16', ST_SetSRID(ST_GeometryFromText('POINT(20.284906954284384 67.83442784655827)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Festival Programs', 'Annual Kiruna festival program archives.', 6, '2000-07', 'Text', 'Swedish', '5', ST_SetSRID(ST_GeometryFromText('POINT(20.160063069772946 67.84392596154214)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Relocation Cultural Effects', 'Exploring the cultural effects of Kiruna''s urban relocation.', 5, '2022', 'Text', 'English', '25', ST_SetSRID(ST_GeometryFromText('POINT(20.229795689950482 67.83383408600587)'), 4326));

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Mapping the Old Kiruna', 'Old maps showcasing the original city layout of Kiruna.', 3, '1920', '1:1000', 'Swedish', '8', ST_SetSRID(ST_GeometryFromText('POINT(20.278833468010845 67.84172138652919)'), 4326));

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

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Science and Innovations', 'Scientific innovations emerging from Kiruna''s industrial growth.', 4, '1980', 'Text', 'English', '30', NULL);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Geology Reports', 'Geological survey reports of Kiruna area.', 1, '1970', '1:5000', 'English', '20', NULL);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Urban Relocation Timelines', 'Timeline documentation of the relocation of city districts.', 5, '2018', 'Text', 'English', '14', NULL);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Sami Traditional Crafts', 'Illustrations and descriptions of Sami traditional crafts.', 3, '1930', 'Concept', 'Swedish', '10', NULL);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location)
VALUES 
('Kiruna Railway System', 'Documents related to the establishment of the Kiruna railway system.', 1, '1910', 'Blueprints/material effects', 'English', '15', NULL);

-- 3. Document with an area location
-- INSERT INTO "documents"  (title, description, type_id, issue_date, scale,language,pages, location) VALUES (
--     'Detail plan for Bolagsomradet Gruvstad
--     spark', 
--     'This is the first of 8 detailed plans located in the old 
--     center of Kiruna, aimed at transforming the 
--     residential areas into mining industry zones to allow 
--     the demolition of buildings. The area includes the 
--     town hall, the Ullspiran district, and the A10 
--     highway, and it will be the first to be dismantled. 
--     The plan consists, like all detailed plans, of two 
--     documents: the area map that regulates it, and a 
--     text explaining the reasons that led to the drafting 
--     of the plan with these characteristics. The plan 
--     gained legal validity in 2012.', 
--     3, -- type_id
--     '2010-10-20', 
--     '1:8000', 
--     'Swedish',
--     '1-32',
--     ST_SetSRID(ST_GeometryFromText('POLYGON((
--         6.6235 36.6192,
--         9.5635 36.6192,
--         10.4734 37.1156,
--         10.4502 37.6798,
--         9.4971 38.6771,
--         9.0933 39.1508,
--         8.3918 39.3791,
--         8.3574 40.6487,
--         6.7658 41.1858,
--         6.3391 41.0717,
--         6.6235 36.6192
--     ))'), 4326));  -- Simplified outline of Italy


--The location of the previous document has to be changed with the real one in card number 18. All the other card related to an area are not inserted (41-45-47-50)--


-----------------------
-- Connections table --
-----------------------
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 2, TRUE); -- at least one connection type must be TRUE
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 3, TRUE);
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (3, 4, TRUE);

----------------------------------
-- Documents_stakeholders table --
----------------------------------
-- Document 1
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (1, 1);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (1, 3);

-- Document 2
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (2, 2);

-- Document 3
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (3, 1);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (3, 4);

-- Document 4
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (4, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (4, 5);

-- Document 5
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (5, 6);

-- Document 6
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (6, 3);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (6, 4);

-- Document 7
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (7, 1);

-- Document 8
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (8, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (8, 6);

-- Document 9
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (9, 1);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (9, 5);

-- Document 10
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (10, 3);

-- Document 11
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (11, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (11, 6);

-- Document 12
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (12, 4);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (12, 1);

-- Document 13
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (13, 5);

-- Document 14
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (14, 6);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (14, 3);

-- Document 15
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (15, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (15, 4);

-- Document 16
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (16, 1);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (16, 5);

-- Document 17
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (17, 6);

-- Document 18
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (18, 3);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (18, 2);

-- Document 19
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (19, 4);

-- Document 20
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (20, 5);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (20, 6);

-- Document 21
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (21, 1);

-- Document 22
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (22, 3);

-- Document 23
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (23, 2);
INSERT INTO documents_stakeholders (document_id, stakeholder_id) VALUES (23, 4);
