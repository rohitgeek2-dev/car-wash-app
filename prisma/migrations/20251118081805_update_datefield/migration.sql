/*
  Migration: update `date` column from String to DateTime safely
  Preserves existing data by casting
*/

-- Alter `date` column type safely
ALTER TABLE "Appointment" 
ALTER COLUMN "date" TYPE TIMESTAMP(3) USING "date"::timestamp;

-- Re-create the unique index (if needed)
DROP INDEX IF EXISTS "Appointment_date_time_key";
CREATE UNIQUE INDEX "Appointment_date_time_key" ON "Appointment"("date", "time");
