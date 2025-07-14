/*
  Warnings:

  - You are about to drop the column `groups` on the `Divination` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Divination` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Divination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "questionFixedTime" DATETIME NOT NULL,
    "layout" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "links" TEXT,
    "previewImage" TEXT,
    "postId" INTEGER,
    CONSTRAINT "Divination_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Divination" ("id", "layout", "postId", "previewImage", "question", "questionFixedTime", "tags", "timestamp", "userId") SELECT "id", "layout", "postId", "previewImage", "question", "questionFixedTime", "tags", "timestamp", "userId" FROM "Divination";
DROP TABLE "Divination";
ALTER TABLE "new_Divination" RENAME TO "Divination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
