-- CreateTable
CREATE TABLE "Niche" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "whyItWorks" TEXT NOT NULL,
    "targetCustomers" TEXT NOT NULL,
    "startupCostMin" INTEGER NOT NULL,
    "startupCostMax" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "demandSignals" TEXT NOT NULL,
    "moat" TEXT NOT NULL,
    "riskFlags" TEXT NOT NULL,
    "sources" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
