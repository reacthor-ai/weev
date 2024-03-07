/*
  Warnings:

  - Added the required column `default` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `default` BOOLEAN NOT NULL,
    ADD COLUMN `type` ENUM('PROMPT_IMAGE', 'GENERAL_IMAGE') NOT NULL;
