-- AlterTable
ALTER TABLE "Vocabulary" ALTER COLUMN "examples" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "audioUrl" DROP NOT NULL;