DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS nutrition CASCADE;

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	username VARCHAR(255),
	firstname VARCHAR(255),
	password VARCHAR(255),
	lastname VARCHAR(255),
	email VARCHAR(255),
	mfp_username VARCHAR(255)
);

CREATE TABLE bodytracking(
	id SERIAL PRIMARY KEY,
	bodyfat INTEGER,
    date_entered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	users_id INTEGER references users
);

CREATE TABLE nutrition(
	id SERIAL PRIMARY KEY,
    calories INTEGER,
    carbs INTEGER,
    fat INTEGER,
    protein INTEGER,
    cholesterol INTEGER,
    sodium INTEGER,
    sugar INTEGER,
    fiber INTEGER,
    date_entered DATE,
	users_id INTEGER references users
);

INSERT INTO users (username, firstname, password, lastname, email, mfp_username) VALUES ('Owens', 'Owens', 'password', 'O''Brien', 'hi@owenso.com', 'snewo531');
