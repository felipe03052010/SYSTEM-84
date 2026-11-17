CREATE DATABASE IF NOT EXISTS system84 CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE system84;

CREATE TABLE IF NOT EXISTS works (
  id BIGINT UNSIGNED PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  type VARCHAR(32) NOT NULL,
  title VARCHAR(300) NOT NULL,
  publication_year SMALLINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  tags JSON NOT NULL,
  metadata JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_works_type_year (type, publication_year),
  FULLTEXT INDEX idx_works_search (title, description)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  work_id BIGINT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL,
  title VARCHAR(300) NOT NULL,
  kind VARCHAR(32) NOT NULL,
  file_path VARCHAR(700) NOT NULL,
  source_url TEXT,
  license TEXT,
  language VARCHAR(80),
  metadata JSON NOT NULL,
  UNIQUE KEY uq_media_position (work_id, position),
  CONSTRAINT fk_media_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  work_id BIGINT UNSIGNED NOT NULL,
  position INT UNSIGNED NOT NULL,
  title VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  metadata JSON NOT NULL,
  UNIQUE KEY uq_source_position (work_id, position),
  CONSTRAINT fk_source_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB;
