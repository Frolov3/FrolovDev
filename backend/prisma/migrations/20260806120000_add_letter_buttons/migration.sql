-- CreateTable
CREATE TABLE `LetterButton` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `letterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LetterButton` ADD CONSTRAINT `LetterButton_letterId_fkey` FOREIGN KEY (`letterId`) REFERENCES `Letter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
