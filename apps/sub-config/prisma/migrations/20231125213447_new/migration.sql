-- CreateTable
CREATE TABLE "SubConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profile" TEXT NOT NULL,
    "backend" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "subs" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SubConfig_profile_key" ON "SubConfig"("profile");
