/*
  Warnings:

  - The values [original,cool,warm,nature,sunshine] on the enum `ColorThemeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,accepted,declined] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ColorThemeType_new" AS ENUM ('ORIGINAL', 'COOL', 'WARM', 'NATURE', 'SUNSHINE');
ALTER TABLE "User" ALTER COLUMN "colorTheme" TYPE "ColorThemeType_new" USING ("colorTheme"::text::"ColorThemeType_new");
ALTER TYPE "ColorThemeType" RENAME TO "ColorThemeType_old";
ALTER TYPE "ColorThemeType_new" RENAME TO "ColorThemeType";
DROP TYPE "ColorThemeType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InvitationStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "Friendship" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TYPE "InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "InvitationStatus_old";
COMMIT;
