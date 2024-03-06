-- AlterTable
ALTER TABLE `BrandVoice` MODIFY `title` VARCHAR(300) NOT NULL,
    MODIFY `description` VARCHAR(600) NOT NULL;

-- AlterTable
ALTER TABLE `Organization` MODIFY `title` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `Prompt` MODIFY `text` VARCHAR(600) NOT NULL;
