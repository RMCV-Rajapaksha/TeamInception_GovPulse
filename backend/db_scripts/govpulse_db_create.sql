-- PostgreSQL Database Script for GovPulse

-- Drop database if it exists to allow for a clean creation
DROP DATABASE IF EXISTS govpulse;

-- Create the new database named govpulse
CREATE DATABASE govpulse;

-- Connect to the newly created database
\c govpulse

-- Drop tables if they exist to allow for a clean creation
DROP TABLE IF EXISTS "FREE_TIMES" CASCADE;
DROP TABLE IF EXISTS "APPOINTMENT_ATTENDEES" CASCADE;
DROP TABLE IF EXISTS "ATTENDEES" CASCADE;
DROP TABLE IF EXISTS "UPVOTE" CASCADE;
DROP TABLE IF EXISTS "APPOINTMENT" CASCADE;
DROP TABLE IF EXISTS "EMBEDDING" CASCADE;
DROP TABLE IF EXISTS "ISSUE" CASCADE;
DROP TABLE IF EXISTS "USER" CASCADE;
DROP TABLE IF EXISTS "CATEGORIES" CASCADE;
DROP TABLE IF EXISTS "AUTHORITIES" CASCADE;
DROP TABLE IF EXISTS "ISSUE_STATUS" CASCADE;

-- Create the ISSUE_STATUS table
-- This table holds different statuses for issues and is linked to authorities.
CREATE TABLE "ISSUE_STATUS" (
    "status_id" SERIAL PRIMARY KEY,
    "status_name" VARCHAR(255) NOT NULL,
    "authority_id" INTEGER
);

-- Create the CATEGORIES table
-- This table defines different categories for issues.
CREATE TABLE "CATEGORIES" (
    "category_id" SERIAL PRIMARY KEY,
    "category_name" VARCHAR(255) NOT NULL,
    "description" TEXT
);

-- Create the AUTHORITIES table
-- This table stores information about government authorities.
-- A new category_id is added to establish a 1:1 relationship with the CATEGORIES table.
CREATE TABLE "AUTHORITIES" (
    "authority_id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "ministry" VARCHAR(255),
    "hq_location" VARCHAR(255),
    "location" VARCHAR(255),
    "description" TEXT,
    "category_id" INTEGER UNIQUE
);

-- Create the USER table
-- This table holds user information.
CREATE TABLE "USER" (
    "user_id" SERIAL PRIMARY KEY,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "name" VARCHAR(255),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "nic" VARCHAR(255),
    "role" VARCHAR(50),
    "land_name" VARCHAR(255),
    "profile_image_url" TEXT
);

-- Create the ISSUE table
-- This is the core table that stores details about a reported issue.
-- The division column has been replaced by gs_division and ds_division.
-- A new boolean property has been added to track appointment approval.
CREATE TABLE "ISSUE" (
    "issue_id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "district" VARCHAR(255),
    "gs_division" VARCHAR(255),
    "ds_division" VARCHAR(255),
    "urgency_score" INTEGER,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "status_id" INTEGER,
    "authority_id" INTEGER,
    "category_id" INTEGER,
    "image_urls" TEXT,
    "approved_for_appointment_placing" BOOLEAN DEFAULT FALSE
);

-- Create the EMBEDDING table
-- This table stores vector embeddings for issues.
CREATE TABLE "EMBEDDING" (
    "embedding_id" SERIAL PRIMARY KEY,
    "issue_id" INTEGER NOT NULL,
    "vector" TEXT, -- Using TEXT for simplicity, a more specific vector type might be better in a production environment
    "description" TEXT,
    "title" VARCHAR(255)
);

-- Create the UPVOTE table
-- This table tracks upvotes for issues.
CREATE TABLE "UPVOTE" (
    "user_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "comment" TEXT,
    "time_stamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id", "issue_id")
);

-- Create the APPOINTMENT table
-- This table stores information about appointments related to issues.
-- The attendee tracking is now handled by the APPOINTMENT_ATTENDEES junction table.
CREATE TABLE "APPOINTMENT" (
    "appointment_id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "authority_id" INTEGER NOT NULL,
    "issue_id" INTEGER NOT NULL,
    "date" DATE,
    "time_slot" VARCHAR(255)
);

-- Create the ATTENDEES table
-- This table holds information about attendees for appointments.
CREATE TABLE "ATTENDEES" (
    "attendee_id" SERIAL PRIMARY KEY,
    "nic" VARCHAR(255),
    "name" VARCHAR(255),
    "phone_no" VARCHAR(20)
);

-- Create the APPOINTMENT_ATTENDEES junction table
-- This table links the APPOINTMENT and ATTENDEES tables to establish an n:n relationship.
CREATE TABLE "APPOINTMENT_ATTENDEES" (
    "appointment_id" INTEGER NOT NULL,
    "attendee_id" INTEGER NOT NULL,
    PRIMARY KEY ("appointment_id", "attendee_id")
);

-- Create the FREE_TIMES table
-- This table tracks free time slots offered by authorities.
-- A composite primary key is used for uniqueness per authority per date.
CREATE TABLE "FREE_TIMES" (
    "authority_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "time_slots" TEXT[],
    PRIMARY KEY ("authority_id", "date")
);

-- Add Foreign Key Constraints
--------------------------------------------------

-- ISSUE_STATUS foreign key
ALTER TABLE "ISSUE_STATUS" ADD CONSTRAINT "fk_issue_status_authority" FOREIGN KEY ("authority_id") REFERENCES "AUTHORITIES"("authority_id");

-- AUTHORITIES foreign key
ALTER TABLE "AUTHORITIES" ADD CONSTRAINT "fk_authorities_category" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("category_id");

-- ISSUE foreign keys
ALTER TABLE "ISSUE" ADD CONSTRAINT "fk_issue_user" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id");
ALTER TABLE "ISSUE" ADD CONSTRAINT "fk_issue_status" FOREIGN KEY ("status_id") REFERENCES "ISSUE_STATUS"("status_id");
ALTER TABLE "ISSUE" ADD CONSTRAINT "fk_issue_authority" FOREIGN KEY ("authority_id") REFERENCES "AUTHORITIES"("authority_id");
ALTER TABLE "ISSUE" ADD CONSTRAINT "fk_issue_category" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("category_id");

-- EMBEDDING foreign key
ALTER TABLE "EMBEDDING" ADD CONSTRAINT "fk_embedding_issue" FOREIGN KEY ("issue_id") REFERENCES "ISSUE"("issue_id");

-- UPVOTE foreign keys
ALTER TABLE "UPVOTE" ADD CONSTRAINT "fk_upvote_user" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id");
ALTER TABLE "UPVOTE" ADD CONSTRAINT "fk_upvote_issue" FOREIGN KEY ("issue_id") REFERENCES "ISSUE"("issue_id");

-- APPOINTMENT foreign keys
ALTER TABLE "APPOINTMENT" ADD CONSTRAINT "fk_appointment_user" FOREIGN KEY ("user_id") REFERENCES "USER"("user_id");
ALTER TABLE "APPOINTMENT" ADD CONSTRAINT "fk_appointment_authority" FOREIGN KEY ("authority_id") REFERENCES "AUTHORITIES"("authority_id");
ALTER TABLE "APPOINTMENT" ADD CONSTRAINT "fk_appointment_issue" FOREIGN KEY ("issue_id") REFERENCES "ISSUE"("issue_id");

-- APPOINTMENT_ATTENDEES foreign keys
ALTER TABLE "APPOINTMENT_ATTENDEES" ADD CONSTRAINT "fk_appointment_attendees_appointment" FOREIGN KEY ("appointment_id") REFERENCES "APPOINTMENT"("appointment_id");
ALTER TABLE "APPOINTMENT_ATTENDEES" ADD CONSTRAINT "fk_appointment_attendees_attendee" FOREIGN KEY ("attendee_id") REFERENCES "ATTENDEES"("attendee_id");

-- FREE_TIMES foreign key
ALTER TABLE "FREE_TIMES" ADD CONSTRAINT "fk_free_times_authority" FOREIGN KEY ("authority_id") REFERENCES "AUTHORITIES"("authority_id");
