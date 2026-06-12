-- =============================================================
-- Zepnest Database Schema
-- MySQL 8.0+
-- =============================================================

CREATE DATABASE IF NOT EXISTS zepnest_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zepnest_db;

-- =============================================================
-- Table: users
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  id          CHAR(36)      NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Table: service_requests
-- =============================================================
CREATE TABLE IF NOT EXISTS service_requests (
  id             CHAR(36)     NOT NULL,
  user_id        CHAR(36)     NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NOT NULL,
  category       ENUM('Plumbing','Electrical','Cleaning','Carpentry','Other') NOT NULL,
  address        VARCHAR(500) NOT NULL,
  preferred_time DATETIME     NOT NULL,
  status         ENUM('Pending','In Progress','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  image_url      VARCHAR(500)          DEFAULT NULL,
  created_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_service_requests_user_id (user_id),
  KEY idx_service_requests_status  (status),
  CONSTRAINT fk_service_requests_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Seed Data
-- Passwords are bcrypt hashes of "Password1!" (cost 12)
-- =============================================================
INSERT INTO users (id, name, email, password_hash) VALUES
  (
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Alice Johnson',
    'alice@example.com',
    '$2a$12$iWq6yBuuAH2LUnZfH5.WY.LQ3F9q8w9vBJm0DU7P3gE9t2RZ4JZoG'
  ),
  (
    'a1b2c3d4-0000-0000-0000-000000000002',
    'Bob Smith',
    'bob@example.com',
    '$2a$12$iWq6yBuuAH2LUnZfH5.WY.LQ3F9q8w9vBJm0DU7P3gE9t2RZ4JZoG'
  );

INSERT INTO service_requests
  (id, user_id, title, description, category, address, preferred_time, status)
VALUES
  (
    'req00001-0000-0000-0000-000000000001',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Fix leaking kitchen sink',
    'The kitchen sink has been leaking under the cabinet for two days. Water is pooling on the cabinet floor.',
    'Plumbing',
    '42 Maple Avenue, Springfield, IL 62701',
    '2025-09-15 10:00:00',
    'Pending'
  ),
  (
    'req00001-0000-0000-0000-000000000002',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Replace faulty circuit breaker',
    'The circuit breaker for the living room keeps tripping whenever I use the TV and air conditioner simultaneously.',
    'Electrical',
    '42 Maple Avenue, Springfield, IL 62701',
    '2025-09-18 14:00:00',
    'In Progress'
  ),
  (
    'req00001-0000-0000-0000-000000000003',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'Deep clean entire apartment',
    'Need a thorough deep-clean of a 2-bedroom, 1-bath apartment before moving out.',
    'Cleaning',
    '42 Maple Avenue, Springfield, IL 62701',
    '2025-09-20 09:00:00',
    'Completed'
  ),
  (
    'req00001-0000-0000-0000-000000000004',
    'a1b2c3d4-0000-0000-0000-000000000002',
    'Build custom bookshelf',
    'Looking for a carpenter to build a floor-to-ceiling bookshelf in the study. Dimensions approx 3m x 2.5m.',
    'Carpentry',
    '7 Oak Street, Chicago, IL 60601',
    '2025-09-25 11:00:00',
    'Pending'
  );
