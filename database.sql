-- SQL to create required tables (MySQL)
CREATE DATABASE IF NOT EXISTS sfss_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sfss_db;

CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  email VARCHAR(200),
  origin VARCHAR(50),
  destination VARCHAR(50),
  details TEXT,
  created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  awb VARCHAR(150),
  status VARCHAR(150),
  note TEXT,
  updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
