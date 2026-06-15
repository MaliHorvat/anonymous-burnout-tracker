-- Anketa burnout — ločena MySQL baza na NEOSERV (phpMyAdmin)

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` VARCHAR(191) NOT NULL,
  `clerk_org_id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `setup_completed` BOOLEAN NOT NULL DEFAULT true,
  `survey_title` VARCHAR(255) NOT NULL DEFAULT 'Anonimna anketa o zadovoljstvu in izgorelosti',
  `survey_subtitle` VARCHAR(500) NOT NULL DEFAULT 'Vaši odgovori so popolnoma anonimni.',
  `notes_enabled` BOOLEAN NOT NULL DEFAULT true,
  `notes_label` VARCHAR(255) NOT NULL DEFAULT 'Dodatne opombe (neobvezno)',
  `notes_placeholder` VARCHAR(500) NOT NULL DEFAULT 'Delite morebitne predloge, skrbi ali opombe.',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `organizations_clerk_org_id_key` (`clerk_org_id`),
  UNIQUE INDEX `organizations_slug_key` (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `survey_questions` (
  `id` VARCHAR(191) NOT NULL,
  `organization_id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `body` VARCHAR(500) NOT NULL,
  `label` VARCHAR(500) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `survey_questions_organization_id_key_key` (`organization_id`, `key`),
  INDEX `survey_questions_organization_id_sort_order_idx` (`organization_id`, `sort_order`),
  CONSTRAINT `survey_questions_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` VARCHAR(191) NOT NULL,
  `organization_id` VARCHAR(191) NOT NULL,
  `answers` JSON NULL,
  `workload` TINYINT NULL,
  `feeling_valued` TINYINT NULL,
  `enough_resources` TINYINT NULL,
  `work_life_balance` TINYINT NULL,
  `team_collaboration` TINYINT NULL,
  `manager_support` TINYINT NULL,
  `job_satisfaction` TINYINT NULL,
  `recommend_employer` TINYINT NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `submissions_organization_id_created_at_idx` (`organization_id`, `created_at`),
  INDEX `submissions_created_at_idx` (`created_at`),
  CONSTRAINT `submissions_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
