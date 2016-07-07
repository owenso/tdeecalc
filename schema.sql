DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS nutrition CASCADE;

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	username VARCHAR(40),
	firstname VARCHAR(40),
	password VARCHAR(255),
	lastname VARCHAR(40),
	email VARCHAR(255),
    mfp_username VARCHAR(40),
);

CREATE TABLE nutrition(
	id SERIAL PRIMARY KEY,
    calories: INTEGER,
    carbs: INTEGER,
    fat: INTEGER,
    protein: INTEGER,
    cholesterol: INTEGER,
    sodium: INTEGER,
    sugar: INTEGER,
    fiber: INTEGER,
    date_entered: VARCHAR(40),
	users_id INTEGER references users
);
