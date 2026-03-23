-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "planName" TEXT NOT NULL,
    "annualFee" REAL NOT NULL,
    "gstRate" REAL NOT NULL DEFAULT 18,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Service" ("annualFee", "createdAt", "id", "planName") SELECT "annualFee", "createdAt", "id", "planName" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_planName_key" ON "Service"("planName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
