/*
  Warnings:

  - You are about to drop the column `end_date` on the `CommitTime` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `CommitTime` table. All the data in the column will be lost.
  - You are about to drop the column `target_time` on the `CommitTime` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `CommitTime` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `recorded_at` on the `DailyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `total_study_time` on the `DailyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `DailyRecord` table. All the data in the column will be lost.
  - You are about to drop the column `invitee_email` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `inviter_user_id` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `responded_at` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_1` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_2` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `due_date` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `is_completed` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `color_theme` on the `User` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `CommitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `CommitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetTime` to the `CommitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CommitTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordedAt` to the `DailyRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalStudyTime` to the `DailyRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DailyRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviteeEmail` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviterUserId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId1` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId2` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCompleted` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorTheme` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommitTime" DROP CONSTRAINT "CommitTime_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DailyRecord" DROP CONSTRAINT "DailyRecord_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_inviter_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user_id_1_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user_id_2_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_user_id_fkey";

-- AlterTable
ALTER TABLE "CommitTime" DROP COLUMN "end_date",
DROP COLUMN "start_date",
DROP COLUMN "target_time",
DROP COLUMN "user_id",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "targetTime" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "DailyRecord" DROP COLUMN "recorded_at",
DROP COLUMN "total_study_time",
DROP COLUMN "user_id",
ADD COLUMN     "recordedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalStudyTime" INTEGER NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "invitee_email",
DROP COLUMN "inviter_user_id",
DROP COLUMN "responded_at",
DROP COLUMN "user_id_1",
DROP COLUMN "user_id_2",
ADD COLUMN     "inviteeEmail" TEXT NOT NULL,
ADD COLUMN     "inviterUserId" TEXT NOT NULL,
ADD COLUMN     "respondedAt" TIMESTAMP(3),
ADD COLUMN     "userId1" TEXT NOT NULL,
ADD COLUMN     "userId2" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "due_date",
DROP COLUMN "is_completed",
DROP COLUMN "user_id",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "color_theme",
ADD COLUMN     "colorTheme" "ColorThemeType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_inviterUserId_fkey" FOREIGN KEY ("inviterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecord" ADD CONSTRAINT "DailyRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitTime" ADD CONSTRAINT "CommitTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
