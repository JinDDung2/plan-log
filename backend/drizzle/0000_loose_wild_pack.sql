CREATE TABLE `daily_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`big_three` json NOT NULL,
	`brain_dump_items` json NOT NULL,
	`blocks` json NOT NULL,
	`gratitude` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_plans_user_id_date_unique` UNIQUE(`user_id`,`date`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`revoked_at` timestamp,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` enum('google','kakao') NOT NULL,
	`provider_id` varchar(191) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`picture` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_provider_provider_id_unique` UNIQUE(`provider`,`provider_id`)
);
--> statement-breakpoint
ALTER TABLE `daily_plans` ADD CONSTRAINT `daily_plans_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;