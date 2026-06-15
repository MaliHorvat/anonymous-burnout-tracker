-- Anketa burnout — ločena MySQL baza na NEOSERV (phpMyAdmin)

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` VARCHAR(191) NOT NULL,
  `clerk_org_id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `setup_completed` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `organizations_clerk_org_id_key` (`clerk_org_id`),
  UNIQUE INDEX `organizations_slug_key` (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` VARCHAR(191) NOT NULL,
  `organization_id` VARCHAR(191) NOT NULL,
  `workload` TINYINT NOT NULL,
  `feeling_valued` TINYINT NOT NULL,
  `enough_resources` TINYINT NOT NULL,
  `work_life_balance` TINYINT NOT NULL,
  `team_collaboration` TINYINT NOT NULL,
  `manager_support` TINYINT NOT NULL,
  `job_satisfaction` TINYINT NOT NULL,
  `recommend_employer` TINYINT NOT NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `submissions_organization_id_created_at_idx` (`organization_id`, `created_at`),
  INDEX `submissions_created_at_idx` (`created_at`),
  CONSTRAINT `submissions_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
