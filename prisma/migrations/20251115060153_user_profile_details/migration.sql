/*
  Warnings:

  - You are about to drop the column `completed` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpire" DATETIME,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "passwordHash" TEXT,
    "type" TEXT,
    "pan_no" TEXT,
    "dateOfBirth" DATETIME,
    "nameOfFatherOrSpouse" TEXT,
    "sourceOfIncome" TEXT,
    "nationality" TEXT,
    "countryOfTax" TEXT DEFAULT 'India',
    "city" TEXT,
    "address" TEXT,
    "politicalExpose" TEXT,
    "gender" TEXT,
    "residentialStatus" TEXT,
    "maritalStatus" TEXT,
    "onboardingStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "currentStep", "email", "firstName", "id", "lastName", "middleName", "otp", "otpExpire", "pan_no", "passwordHash", "phone", "type") SELECT "createdAt", "currentStep", "email", "firstName", "id", "lastName", "middleName", "otp", "otpExpire", "pan_no", "passwordHash", "phone", "type" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
