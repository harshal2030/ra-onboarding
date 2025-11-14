-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpire" DATETIME,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "passwordHash" TEXT,
    "type" TEXT,
    "pan_no" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
