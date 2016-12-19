-- Database name: to_do_database
-- Table name: todos

CREATE TABLE todos (
id SERIAL PRIMARY KEY NOT NULL,
task VARCHAR (100),
complete BOOLEAN DEFAULT true
);

INSERT INTO todos (task) VALUES ('Finish this program.');
INSERT INTO todos (task, complete) VALUES ('Learn about Promises.', true);
