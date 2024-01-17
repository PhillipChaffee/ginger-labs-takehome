-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'COMPLETE');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(3000) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "json" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_url_idx" ON "Job"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Result_jobId_key" ON "Result"("jobId");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
