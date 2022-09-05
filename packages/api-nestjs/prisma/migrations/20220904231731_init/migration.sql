-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'APPROVER', 'REQUESTOR', 'VOLUNTEER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Program" AS ENUM ('HOUSING_FIRST', 'INTEGRATED_SERVICES', 'SURVIVAL_SERVICES', 'HEALTH_SERVICES', 'EMPLOYMENT_SERVICES', 'RESEARCH_INNOVATION', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('CLOTHING', 'ENGAGEMENT', 'HOUSEHOLD', 'PERSONAL_HYGIENE', 'PET', 'TICKET', 'OTHER');

-- CreateEnum
CREATE TYPE "ItemPriority" AS ENUM ('URGENT', 'STANDARD');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'APPROVED', 'DENIED', 'FULFILLED', 'WISHLIST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HouseLocation" AS ENUM ('EASTLAKE', 'AURORA_HOUSE', 'CANADAY_HOUSE', 'CLEMENT_PLACE', 'COTTAGE_GROVE_COMMONS', 'ESTELLE', 'EVANS_HOUSE', 'INTERBAY_PLACE', 'KERNER_SCOTT_HOUSE', 'KEYS', 'LYON_BUILDING', 'MORRISON', 'RAINIER_HOUSE', 'UNION_HOTEL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "program" "Program" NOT NULL,
    "roles" "UserRole"[] DEFAULT ARRAY['REQUESTOR']::"UserRole"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerificationToken" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshTokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordResetTokenExpiresAt" TIMESTAMP(3),
    "passwordLastChangedAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ClientRequest" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "location" "HouseLocation" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priority" "ItemPriority" NOT NULL DEFAULT 'STANDARD',
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "requestId" TEXT,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientRequest" ADD CONSTRAINT "ClientRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ClientRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
