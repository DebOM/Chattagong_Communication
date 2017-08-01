
CREATE DATABASE IF NOT EXISTS chattagong;

USE chattagong;
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'rooms'
-- 
-- ---

DROP TABLE IF EXISTS rooms;
		
CREATE TABLE rooms (
  id VARCHAR(20) NOT NULL,
  room_name VARCHAR(30) NOT NULL,
  client VARCHAR(20) DEFAULT NULL,
  support_agent VARCHAR(20) DEFAULT NULL,
  is_active bit DEFAULT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'SupportTeam'
-- 
-- ---

DROP TABLE IF EXISTS SupportTeam;
		
CREATE TABLE supportTeam (
  id INTEGER(20) NOT NULL,
  user_name VARCHAR(30) NOT NULL,
  password VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'messages'
-- 
-- ---

DROP TABLE IF EXISTS messages;
		
CREATE TABLE messages (
  id INTEGER(20) NOT NULL,
  msg TEXT(500) NOT NULL,
  msg_from VARCHAR(30) NOT NULL,
  msg_to VARCHAR(30) NOT NULL,
  time_created TIMESTAMP NOT NULL,
  in_room VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE messages ADD FOREIGN KEY (in_room) REFERENCES rooms (id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE rooms ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE SupportTeam ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE messages ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO rooms (id,room_name,client,support_agent,is_active) VALUES
-- ('','','','','');
-- INSERT INTO SupportTeam (id,user_name,password) VALUES
-- ('','','');
-- INSERT INTO messages (id,text,from,to,time-created,room) VALUES
-- ('','','','','','');