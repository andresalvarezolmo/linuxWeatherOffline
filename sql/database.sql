-- Creating database
CREATE DATABASE weatherapp;
-- Selecting DB
USE weatherapp;

-- Table users
CREATE TABLE users(
    userID int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pass varchar(255) NOT NULL
);

-- Table locations
CREATE TABLE locations (
    cityName varchar(255) NOT NULL,
    countryCode varchar (5) NOT NULL,
	fk_userID int(12),
    referenceCode varchar(12) NOT NULL UNIQUE,
    cityID varchar(12) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_userID) REFERENCES users(userID)
);

-- Test
INSERT INTO users(username, pass) VALUES(
	'1', '$2b$10$OpzCVeEAb/2I9iR0uuSYi.UwShutNmC1doVhl6Er/w/xiG/z9Iniu'
);
