-- Создание таблиц для отслеживания посещений

-- Таблица для хранения посещений
CREATE TABLE IF NOT EXISTS "SiteVisit" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

-- Таблица для дневной статистики
CREATE TABLE IF NOT EXISTS "DailyStats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "calculations" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- Создание индексов
CREATE INDEX IF NOT EXISTS "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");
CREATE INDEX IF NOT EXISTS "SiteVisit_path_idx" ON "SiteVisit"("path");
CREATE INDEX IF NOT EXISTS "SiteVisit_ipAddress_idx" ON "SiteVisit"("ipAddress");

CREATE UNIQUE INDEX IF NOT EXISTS "DailyStats_date_key" ON "DailyStats"("date");
CREATE INDEX IF NOT EXISTS "DailyStats_date_idx" ON "DailyStats"("date");
