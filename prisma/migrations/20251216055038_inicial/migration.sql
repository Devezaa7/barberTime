-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "usuarios_resetToken_idx" ON "usuarios"("resetToken");
