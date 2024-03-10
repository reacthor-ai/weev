-- AlterTable
ALTER TABLE `BrandVoice` MODIFY `type` VARCHAR(300) NOT NULL,
    MODIFY `title` VARCHAR(2048) NOT NULL,
    MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Organization` MODIFY `title` VARCHAR(2048) NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `title` VARCHAR(2048) NULL,
    MODIFY `description` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Project` MODIFY `title` VARCHAR(2048) NOT NULL,
    MODIFY `description` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Prompt` MODIFY `text` LONGTEXT NOT NULL;
