-----------------
-- Users table --
-----------------
INSERT INTO "Users" (email, username, password, role, salt) VALUES ('urban@planner.com', 'urban', 'planner', 'UrbanPlanner', 'salt');

-----------------
-- Types table --
-----------------
INSERT INTO "Types" (name) VALUES ('Design');
INSERT INTO "Types" (name) VALUES ('Informative');
INSERT INTO "Types" (name) VALUES ('Prescriptive');
INSERT INTO "Types" (name) VALUES ('Technical');
INSERT INTO "Types" (name) VALUES ('Agreement');
INSERT INTO "Types" (name) VALUES ('Conflict');
INSERT INTO "Types" (name) VALUES ('Consultation');
INSERT INTO "Types" (name) VALUES ('Action');

---------------------
-- Documents table --
---------------------

-- 1. Document with a single point location
INSERT INTO "Documents" (title, description, type_id, issue_date, scale, language, pages, location) VALUES (
    'Sample Location Document', 
    'This document has a specific point location.', 
    1, -- type_id
    '2023-10-01', 
    '1:1000', 
    'English', 
    '5', 
    ST_SetSRID(ST_GeometryFromText('POINT(30.0 -90.0)'), 4326)  -- Point location using WKT
 -- ST_SetSRID(ST_MakePoint(30.0, -90.0), 4326)  -- Variant
);

-- 2. Document with an area location
INSERT INTO "Documents"  (title, description, type_id, issue_date, scale, location) VALUES (
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
INSERT INTO "Connections" (document_id_1, document_id_2, collateral_conn) VALUES (1, 2, TRUE); -- at least one connection type must be TRUE

------------------------
-- Stakeholders table --
------------------------
INSERT INTO "Stakeholders" (name) VALUES ('LKAB');
INSERT INTO "Stakeholders" (name) VALUES ('Municipality');
INSERT INTO "Stakeholders" (name) VALUES ('Regional authority');
INSERT INTO "Stakeholders" (name) VALUES ('Architecture firms');
INSERT INTO "Stakeholders" (name) VALUES ('Citizens');
INSERT INTO "Stakeholders" (name) VALUES ('Others');

----------------------------------
-- Documents_stakeholders table --
----------------------------------
INSERT INTO "Documents_stakeholders" (document_id, stakeholder_id) VALUES (1, 1);

