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

---------------------
-- Documents table --
---------------------

-- 1. Document with a single point location
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Sample Location Document', 
    'This document has a specific point location.', 
    1, -- type_id
    '2023-10-01', 
    '1:1000', 
    'English', 
    '5', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.257458 67.857175)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);

INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Sample Location Document', 
    'This document has a specific point location.', 
    1, -- type_id
    '2023-10-01', 
    '1:1000', 
    'English', 
    '5', 
    ST_SetSRID(ST_GeometryFromText('POINT(20.220723 67.861445)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);


-- 2. Document with a null location (all the Kiruna's area)
INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages) VALUES (
    'Document with no area', 
    'This document has no specific location.', 
    1, -- type_id
    '2020', 
    '1:8000', 
    'English', 
    '32'
);

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

-- 3. Document with an area location
INSERT INTO "documents"  (title, description, type_id, issue_date, scale, location) VALUES (
    'Italy Outline', 
    'A polygon representing the outline of Italy.', 
    1, -- type_id
    '2023', 
    '1:500000', 
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
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (2, 2);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (3, 3);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (4, 4);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (5, 5);
INSERT INTO "documents_stakeholders" (document_id, stakeholder_id) VALUES (6, 3);
