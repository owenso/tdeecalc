-- DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS nutrition CASCADE;
DROP TABLE IF EXISTS bodytracking CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
	id uuid PRIMARY KEY,
	username VARCHAR(255),
	firstname VARCHAR(255),
	password VARCHAR(255),
	lastname VARCHAR(255),
	email VARCHAR(255),
	mfp_username VARCHAR(255)
);

CREATE TABLE bodytracking(
	id uuid PRIMARY KEY,
	bodyfat REAL,
	weight REAL NOT NULL,
    date_entered DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
	users_id uuid NOT NULL references users
);

CREATE TABLE nutrition(
	id uuid PRIMARY KEY,
    calories INTEGER NOT NULL,
    carbs INTEGER,
    fat INTEGER,
    protein INTEGER,
    cholesterol INTEGER,
    sodium INTEGER,
    sugar INTEGER,
    fiber INTEGER,
    date_entered DATE NOT NULL,
	users_id uuid NOT NULL references users
);

-- INSERT INTO users (id, username, firstname, password, lastname, email, mfp_username) VALUES (uuid_generate_v1mc(), 'Owens', 'Owens', 'password', 'O''Brien', 'hi@owenso.com', 'snewo531');
