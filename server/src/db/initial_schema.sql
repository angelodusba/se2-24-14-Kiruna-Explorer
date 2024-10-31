-- Users table
CREATE TABLE IF NOT EXISTS public."users"
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    username VARCHAR(30) NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    salt TEXT NOT NULL
);

-- Types table
CREATE TABLE IF NOT EXISTS public."types"
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS public."documents"
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type_id INT NOT NULL REFERENCES public."types"(id),
    issue_date VARCHAR(10) NOT NULL,  -- handle different date formats
    scale VARCHAR(50) NOT NULL,
    language VARCHAR(50),
    pages VARCHAR(50),
    location GEOMETRY(Geometry, 4326) NOT NULL  -- Geometry type for point or polygon
);

-- Connections table
CREATE TABLE IF NOT EXISTS public."connections" (
    document_id_1 INT NOT NULL REFERENCES public."documents"(id),
    document_id_2 INT NOT NULL REFERENCES public."documents"(id),
    direct_conn BOOLEAN DEFAULT FALSE,
    collateral_conn BOOLEAN DEFAULT FALSE,
    prevision_conn BOOLEAN DEFAULT FALSE,
    update_conn BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (document_id_1, document_id_2),
    CHECK ( direct_conn OR collateral_conn OR prevision_conn OR update_conn )
);

-- Stakeholders table
CREATE TABLE IF NOT EXISTS public."stakeholders"
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

-- Documents_stakeholders table
CREATE TABLE IF NOT EXISTS public."documents_stakeholders"
(
    document_id INT NOT NULL REFERENCES public."documents"(id),
    stakeholder_id INT NOT NULL REFERENCES public."stakeholders"(id),
    PRIMARY KEY (document_id, stakeholder_id)
);

-- Search tables inside public schema
SET search_path TO public;

