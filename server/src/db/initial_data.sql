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


-----------------
-- Types table --
-----------------
INSERT INTO "scales" (name) VALUES ('Blueprints/material effects');
INSERT INTO "scales" (name) VALUES ('Text');
INSERT INTO "scales" (name) VALUES ('Concept');
INSERT INTO "scales" (name) VALUES ('1:1000');  -- Architectural scale
INSERT INTO "scales" (name) VALUES ('1:7500');  -- Architectural scale
INSERT INTO "scales" (name) VALUES ('1:8000');  -- Architectural scale
INSERT INTO "scales" (name) VALUES ('1:12000'); -- Architectural scale


-----------------
-- Areas table --
-----------------
INSERT INTO "areas"  (name, location) VALUES (
    'Municipality area', 
	ST_GeomFromText(
        'POLYGON((
            21.9621 67.3562, 22.0589 67.4263, 22.1965 67.5545, 22.3241 67.6468, 
            22.4646 67.7458, 22.5947 67.7798, 22.8129 67.8383, 23.2867 68.1542, 
            23.2603 68.1569, 23.2484 68.1484, 23.2179 68.1466, 23.2013 68.1399, 
            23.1685 68.1331, 23.1524 68.1383, 23.1415 68.1543, 23.147 68.1714, 
            23.1425 68.1795, 23.1576 68.1994, 23.1415 68.2061, 23.1528 68.231, 
            23.1419 68.2479, 23.1095 68.2527, 23.0765 68.2684, 23.0648 68.2806, 
            23.0702 68.2997, 23.0607 68.3058, 23.0375 68.3071, 22.9864 68.3206, 
            22.9706 68.3322, 22.9181 68.3335, 22.8935 68.3487, 22.8761 68.3521, 
            22.8359 68.3661, 22.8465 68.381, 22.8041 68.3929, 22.764 68.3851, 
            22.7384 68.3849, 22.7114 68.3973, 22.6889 68.3995, 22.6903 68.4069, 
            22.6482 68.416, 22.6439 68.4319, 22.5751 68.4218, 22.5562 68.4338, 
            22.5379 68.4342, 22.4964 68.4422, 22.4653 68.4417, 22.4383 68.4597, 
            22.4134 68.4665, 22.3973 68.4639, 22.3667 68.4498, 22.3441 68.4452, 
            22.349 68.4624, 22.3435 68.4706, 22.3499 68.4813, 22.296 68.484, 
            22.2819 68.4796, 22.2517 68.4823, 22.2256 68.4741, 22.2051 68.4797, 
            22.1793 68.4776, 22.1544 68.4702, 22.1277 68.4719, 22.1224 68.4808, 
            22.077 68.4822, 22.0439 68.4795, 22.011 68.4999, 21.9959 68.5217, 
            22.0074 68.5307, 21.9921 68.5338, 21.9677 68.5513, 21.9471 68.5559, 
            21.9275 68.5675, 21.8878 68.5847, 21.842 68.5912, 21.7727 68.5855, 
            21.7221 68.5907, 21.7 68.5972, 21.6991 68.6143, 21.7095 68.6254, 
            21.6972 68.6322, 21.6634 68.6407, 21.6512 68.6506, 21.627 68.6549, 
            21.6241 68.6621, 21.5842 68.6678, 21.5532 68.6772, 21.5099 68.6757, 
            21.4359 68.6899, 21.4215 68.6952, 21.4131 68.7101, 21.4219 68.7157, 
            21.4055 68.7363, 21.4125 68.7483, 21.3915 68.7639, 21.3668 68.7672, 
            21.3256 68.7591, 21.2991 68.7623, 21.2702 68.7797, 21.2536 68.8022, 
            21.2259 68.816, 21.1842 68.8252, 21.1713 68.8336, 21.1447 68.84, 
            21.1295 68.853, 21.078 68.8649, 21.0771 68.8712, 20.9908 68.8973, 
            20.9156 68.8971, 20.9034 68.8998, 20.8802 68.9186, 20.8527 68.9232, 
            20.8452 68.9372, 20.8712 68.9433, 20.8916 68.9414, 20.9137 68.9603, 
            20.9116 68.9688, 20.8838 68.983, 20.8353 68.9958, 20.8134 69.0171, 
            20.775 69.0326, 20.7188 69.0397, 20.7027 69.0444, 20.6594 69.0432, 
            20.5778 69.0526, 20.5486 69.0599, 20.303 69.0526, 20.06 69.0457, 
            20.2378 68.956, 20.3065 68.9261, 20.3218 68.8556, 20.3358 68.8023, 
            20.2738 68.7402, 20.2028 68.6659, 20.0523 68.591, 19.9375 68.5579, 
            20.0258 68.5308, 20.2266 68.4908, 20.1106 68.4438, 19.978 68.3881, 
            19.9213 68.356, 19.7079 68.3938, 19.2685 68.4688, 18.9838 68.5169, 
            18.6212 68.5069, 18.4855 68.5564, 18.4056 68.5818, 18.1259 68.5365, 
            18.1009 68.406, 18.1146 68.3405, 18.1513 68.1987, 18.0958 68.1461, 
            18.0523 68.1082, 17.8998 67.9693, 18.1902 67.8942, 18.3518 67.8543, 
            18.7832 67.852, 18.8374 67.8488, 18.8521 67.8445, 19.005 67.8571, 
            19.0811 67.8513, 19.1304 67.85, 19.1791 67.8508, 19.2376 67.8481, 
            19.322 67.8563, 19.408 67.8521, 19.4511 67.8464, 19.4844 67.8376, 
            19.5383 67.8322, 19.6357 67.828, 19.6418 67.8209, 19.702 67.8132, 
            19.7813 67.8149, 19.8127 67.8013, 19.9217 67.7835, 19.9733 67.7768, 
            20.0003 67.771, 20.091 67.7418, 20.1528 67.7162, 20.2188 67.6891, 
            20.2911 67.6754, 20.3639 67.6591, 20.3925 67.6544, 20.4436 67.6487, 
            20.5148 67.6284, 20.5474 67.6201, 20.5881 67.6079, 20.6616 67.577, 
            20.7431 67.5484, 20.8267 67.5195, 20.9112 67.4935, 21.0383 67.4546, 
            21.1603 67.4063, 21.1908 67.3843, 21.2944 67.3486, 21.4553 67.3206, 
            21.4702 67.324, 21.5813 67.2917, 21.6621 67.2737, 21.7582 67.2653, 
            21.8702 67.2922, 21.9621 67.3562
        ))', 4326)
); 


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

-- 1. Documents with a single point location
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

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Mining History',
    'A look at the iron ore mining activities and their economic impact.',
    2,
    '1925',
    'Text',
    'Swedish',
    '25',
    ST_SetSRID(ST_GeometryFromText('POINT(20.19987814645499 67.87772277791264)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Sami Cultural Integration',
    'Text documenting Sami culture in Kiruna and its influence on the city.',
    2,
    '1975',
    'Text',
    'Swedish',
    '32',
    ST_SetSRID(ST_GeometryFromText('POINT(20.26331233642294 67.8651978803257)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Mining Safety Improvements',
    'A detailed report on safety measures implemented in Kiruna mines.',
    4,
    '1985-05',
    'Text',
    'English',
    '20',
    ST_SetSRID(ST_GeometryFromText('POINT(20.238568503456722 67.85545419070905)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Impact of Mining on Environment',
    'Studies showing the environmental impact of mining activities.',
    5,
    '1990',
    'Text',
    'English',
    '30',
    ST_SetSRID(ST_GeometryFromText('POINT(20.257238850149392 67.84816494344281)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Concept Art for New Kiruna Center',
    'Early concept designs for the new relocated city center.',
    3,
    '2020',
    'Concept',
    'Swedish',
    '6',
    ST_SetSRID(ST_GeometryFromText('POINT(20.2592633455739 67.84502817093676)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Development of Iron Ore Technology',
    'Technical documentation on iron ore mining technology.',
    4,
    '1965-03',
    '1:500',
    'Swedish',
    '18',
    ST_SetSRID(ST_GeometryFromText('POINT(20.190880389012708 67.85223364145514)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna in World War II', 
    'An analysis of Kiruna''s strategic importance during World War II.',
    6,
    '1945',
    'Text',
    'English',
    '22',
    ST_SetSRID(ST_GeometryFromText('POINT(20.297278870767478 67.84714765803393)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'History of LKAB Mining Company',
    'History and milestones of the LKAB mining company.',
    1,
    '2000',
    'Text',
    'Swedish',
    '35',
    ST_SetSRID(ST_GeometryFromText('POINT(20.234969400479795 67.85842009260008)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Mining Technology Patents',
    'Patent records for mining technology innovations from Kiruna.', 
    4,
    '1995',
    'Text',
    'English',
    '40',
    ST_SetSRID(ST_GeometryFromText('POINT(20.17153521051184 67.8613008931881)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Modernization of Kiruna Mines',
    'A study on the modernization efforts in Kiruna mining operations.',
    2,
    '2005-06',
    'Text',
    'Swedish',
    '16',
    ST_SetSRID(ST_GeometryFromText('POINT(20.284906954284384 67.83442784655827)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Festival Programs',
    'Annual Kiruna festival program archives.',
    6, 
    '2000-07',
    'Text',
    'Swedish',
    '5',
    ST_SetSRID(ST_GeometryFromText('POINT(20.160063069772946 67.84392596154214)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Relocation Cultural Effects',
    'Exploring the cultural effects of Kiruna''s urban relocation.',
    5,
    '2022',
    'Text',
    'English',
    '25',
    ST_SetSRID(ST_GeometryFromText('POINT(20.229795689950482 67.83383408600587)'), 4326)
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Mapping the Old Kiruna',
    'Old maps showcasing the original city layout of Kiruna.',
    3,
    '1920',
    '1:1000',
    'Swedish',
    '8',
    ST_SetSRID(ST_GeometryFromText('POINT(20.278833468010845 67.84172138652919)'), 4326)
);

-- 2. Document with a null location (all the Kiruna's area)
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Compilation of responses “So what the people of Kiruna think?”', 
    'This document is a compilation of the responses to the survey ''What is your impression of Kiruna?'' 
    From the citizens'' responses to this last part of the survey, it is evident that certain buildings, such as 
    the Kiruna Church, the Hjalmar Lundbohmsgården, and the Town Hall, are considered of significant 
    value to the population. The municipality views the experience of this survey positively, to the extent 
    that over the years it will propose various consultation opportunities.', 
    2, -- type_id
    '2007', 
    'Text', 
    'Swedish', 
    ''
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Science and Innovations',
    'Scientific innovations emerging from Kiruna''s industrial growth.',
    4,
    '1980',
    'Text',
    'English',
    '30',
    NULL
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Geology Reports',
    'Geological survey reports of Kiruna area.',
    1,
    '1970',
    '1:5000',
    'English',
    '20',
    NULL
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Urban Relocation Timelines',
    'Timeline documentation of the relocation of city districts.',
    5,
    '2018',
    'Text',
    'English',
    '14',
    NULL
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Sami Traditional Crafts',
    'Illustrations and descriptions of Sami traditional crafts.',
    3,
    '1930',
    'Concept',
    'Swedish',
    '10',
    NULL
);

INSERT INTO documents (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Kiruna Railway System',
    'Documents related to the establishment of the Kiruna railway system.',
    1,
    '1910',
    'Blueprints/material effects',
    'English',
    '15',
    NULL
);


-----------------------
-- Connections table --
-----------------------

-- possible values: direct_conn, collateral_conn, prevision_conn, update_conn
-- at least one connection type must be set to TRUE
INSERT INTO "connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 2, TRUE); 
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
