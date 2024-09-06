CREATE DATABASE `NCU_MRBS` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `NCU_MRBS`;

CREATE TABLE `User` (
  `identifier` varchar(12) NOT NULL,
  `chinesename` varchar(20) DEFAULT NULL,
  `email` varchar(35) DEFAULT NULL,
  `mobilePhone` varchar(12) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `privilege_level` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`identifier`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `User` (`identifier`, `chinesename`, `email`, `mobilePhone`, `unit`, `status`, `privilege_level`) VALUES ('admin', '管理員', 'tommy50508@gmail.com', '0912345678', 'NCU-IM', 1, 1);

CREATE TABLE `Operation` (
    `operation_id` int NOT NULL AUTO_INCREMENT,
    `operation_name` varchar(40) NOT NULL,
    PRIMARY KEY (`operation_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `Operation` (`operation_name`) VALUES ('login successfully'), ('login failed'), ('logout');

CREATE TABLE `Log` (
    `log_id` int NOT NULL AUTO_INCREMENT,
    `identifier` varchar(12) NOT NULL,
    `datetime` datetime DEFAULT CURRENT_TIMESTAMP,
    `IP` varchar(15) NOT NULL,
    `operation_id` int NOT NULL,
    PRIMARY KEY (`log_id`),
    FOREIGN KEY (`identifier`) REFERENCES `User` (`identifier`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `identifier_time` ON `Log` (`identifier`, `datetime`);

CREATE TABLE `Violation` (
  `violation_id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(12) NOT NULL,
  `datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(200) NOT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`violation_id`),
  FOREIGN KEY (`identifier`) REFERENCES `User` (`identifier`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Room` (
    `room_id` int NOT NULL AUTO_INCREMENT,
    `room_name` varchar(20) NOT NULL,
    `room_status` boolean NOT NULL,
    PRIMARY KEY (`room_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Reservation` (
    `reserve_id` int NOT NULL AUTO_INCREMENT,
    `identifier` varchar(12) NOT NULL,
    `room_id` int NOT NULL,
    `name` varchar(40) NOT NULL,
    `start_time` datetime NOT NULL,
    `end_time` datetime NOT NULL,
    `show` boolean NOT NULL,
    `ext` varchar(10),
    PRIMARY KEY (`reserve_id`),
    FOREIGN KEY (`identifier`) REFERENCES `User` (`identifier`),
    FOREIGN KEY (`room_id`) REFERENCES `Room` (`room_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;