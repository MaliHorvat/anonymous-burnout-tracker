-- Anketa burnout — ločena MySQL baza na NEOSERV (phpMyAdmin)
-- Ustvari bazo v cPanel → MySQL Database Wizard, nato izberi bazo in zaženi ta SQL.

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` VARCHAR(191) NOT NULL,
  `workload` TINYINT NOT NULL,
  `feeling_valued` TINYINT NOT NULL,
  `enough_resources` TINYINT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `submissions_created_at_idx` (`created_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
