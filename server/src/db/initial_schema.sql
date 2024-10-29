-- Users table
CREATE TABLE IF NOT EXISTS public."Users"
(
    id serial NOT NULL,
    email character varying(150) UNIQUE NOT NULL,
    password text NOT NULL,
    role character varying(50) NOT NULL,
    salt text NOT NULL,
    PRIMARY KEY (id)
);

