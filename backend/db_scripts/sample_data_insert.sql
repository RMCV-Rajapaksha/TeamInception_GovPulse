-- PostgreSQL Sample Data Script for GovPulse

-- Connect to the existing govpulse database
\c govpulse

-- Data insertion order respects foreign key constraints.
-- Tables with no dependencies are populated first.

-- 1. Insert sample data into CATEGORIES
INSERT INTO "CATEGORIES" ("category_name", "description") VALUES
('Road Infrastructure', 'Issues related to roads, bridges, and highways.'),
('Public Health', 'Concerns regarding public hospitals, clinics, and sanitation.'),
('Water Supply', 'Problems with clean water access and distribution.'),
('Waste Management', 'Issues related to garbage collection and disposal.');

-- 2. Insert sample data into USER
INSERT INTO "USER" ("first_name", "last_name", "name", "email", "nic", "role") VALUES
('John', 'Doe', 'John Doe', 'john.doe@email.com', '123456789V', 'Citizen'),
('Jane', 'Smith', 'Jane Smith', 'jane.smith@email.com', '987654321V', 'Citizen'),
('Alice', 'Johnson', 'Alice Johnson', 'alice.j@government.lk', '112233445V', 'Authority Representative');

-- 3. Insert sample data into AUTHORITIES
-- This table depends on CATEGORIES, so we select the category_id from the CATEGORIES table.
INSERT INTO "AUTHORITIES" ("name", "ministry", "hq_location", "location", "description", "category_id") VALUES
('Road Development Authority', 'Ministry of Transport', 'Colombo', 'Western Province', 'Responsible for road infrastructure maintenance.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure')),
('National Water Supply & Drainage Board', 'Ministry of Water Resources', 'Kandy', 'Central Province', 'Manages water supply and drainage systems.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Water Supply'));

-- 4. Insert sample data into ISSUE_STATUS
-- This table depends on AUTHORITIES.
INSERT INTO "ISSUE_STATUS" ("status_name", "authority_id") VALUES
('Pending Review', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('Assigned to Team', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('Completed', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'));

-- 5. Insert sample data into ISSUE
-- This table has multiple foreign key dependencies.
INSERT INTO "ISSUE" ("user_id", "title", "description", "district", "gs_division", "ds_division", "urgency_score", "status_id", "authority_id", "category_id", "approved_for_appointment_placing") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'john.doe@email.com'), 'Pothole on Main Street', 'A large pothole has formed on the main street, causing traffic issues.', 'Colombo', 'Colombo North', 'Colombo Central', 8, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure'), FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'jane.smith@email.com'), 'No clean water in our area', 'For the past three days, our neighborhood has not had a clean water supply.', 'Kandy', 'Kandy West', 'Gangawata Korale', 9, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Completed'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Water Supply'), TRUE);

-- 6. Insert sample data into ATTENDEES
INSERT INTO "ATTENDEES" ("nic", "name", "phone_no") VALUES
('334455667V', 'Michael Brown', '0771234567'),
('667788990V', 'Emily White', '0719876543');

-- 7. Insert sample data into APPOINTMENT
-- This table depends on USER, AUTHORITIES, and ISSUE.
INSERT INTO "APPOINTMENT" ("user_id", "authority_id", "issue_id", "date", "time_slot") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'john.doe@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street'), '2025-08-15', '10:00 - 11:00');

-- 8. Insert sample data into APPOINTMENT_ATTENDEES (Junction table)
-- This links the APPOINTMENT and ATTENDEES tables.
INSERT INTO "APPOINTMENT_ATTENDEES" ("appointment_id", "attendee_id") VALUES
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "date" = '2025-08-15'), (SELECT "attendee_id" FROM "ATTENDEES" WHERE "nic" = '334455667V')),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "date" = '2025-08-15'), (SELECT "attendee_id" FROM "ATTENDEES" WHERE "nic" = '667788990V'));

-- 9. Insert sample data into FREE_TIMES
-- This table depends on AUTHORITIES.
INSERT INTO "FREE_TIMES" ("authority_id", "date", "time_slots") VALUES
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), '2025-08-15', ARRAY['10:00 - 11:00', '11:30 - 12:30', '14:00 - 15:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), '2025-08-16', ARRAY['09:00 - 10:00', '13:00 - 14:00']);

-- 10. Insert sample data into UPVOTE
-- This table depends on USER and ISSUE.
INSERT INTO "UPVOTE" ("user_id", "issue_id", "comment") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'jane.smith@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street'), 'I agree, this is a serious problem!'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'john.doe@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'No clean water in our area'), 'Hope this gets resolved soon.');

-- 11. Insert sample data into EMBEDDING
-- This table depends on ISSUE.
INSERT INTO "EMBEDDING" ("issue_id", "vector", "description", "title") VALUES
((SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street'), 'some_vector_data_for_pothole', 'Description for pothole embedding.', 'Pothole Embedding Title');
