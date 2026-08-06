-- CreateTable
CREATE TABLE `Letter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `Letter_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `order` INTEGER NOT NULL,
    `letterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Music` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `letterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `Letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Music` ADD CONSTRAINT `Music_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `Letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
