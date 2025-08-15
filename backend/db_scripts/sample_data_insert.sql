-- PostgreSQL Sample Data Script for GovPulse

-- Connect to the existing govpulse database
\c govpulse

-- Data insertion order respects foreign key constraints.
-- Tables with no dependencies are populated first.

-- 1. Insert 10 sample data records into CATEGORIES
INSERT INTO "CATEGORIES" ("category_name", "description") VALUES
('Road Infrastructure', 'Issues related to roads, bridges, and highways.'),
('Public Health', 'Concerns regarding public hospitals, clinics, and sanitation.'),
('Water Supply', 'Problems with clean water access and distribution.'),
('Waste Management', 'Issues related to garbage collection and disposal.'),
('Education', 'Matters concerning schools, universities, and educational policy.'),
('Public Safety', 'Concerns about law enforcement, fire services, and emergency response.'),
('Urban Development', 'Issues related to city planning, public spaces, and infrastructure projects.'),
('Agriculture', 'Matters related to farming, crop protection, and rural development.'),
('Environment & Wildlife', 'Concerns about deforestation, pollution, and wildlife conservation.'),
('Public Transport', 'Issues regarding bus services, train systems, and public transit management.');

-- 2. Insert 10 sample data records into USER
-- This includes the new home_address, dob, and clerk_user_id fields.
INSERT INTO "USER" ("first_name", "last_name", "name", "email", "password", "nic", "profile_image_url", "home_address", "dob", "clerk_user_id") VALUES
('Amal', 'Perera', 'Amal Perera', 'amal.perera@email.com', 'jkehashedpassword1', '851234567V', NULL, '45/A, Galle Road, Colombo 3', '1985-05-15', 'user_clerk_12345'),
('Nimali', 'Fernando', 'Nimali Fernando', 'nimali.f@email.com', 'jkehashedpassword2', '902345678V', NULL, '12/B, Kandy Road, Kadawatha', '1990-11-22', 'user_clerk_23456'),
('Kasun', 'Bandara', 'Kasun Bandara', 'kasun.b@email.com', 'jkehashedpassword3', '789012345V', NULL, '10, Temple Street, Kandy', '1978-03-10', 'user_clerk_34567'),
('Lakshmi', 'Gunawardena', 'Lakshmi Gunawardena', 'lakshmi.g@email.com', 'jkehashedpassword4', '921122334V', NULL, '55, Main Street, Negombo', '1992-07-04', 'user_clerk_45678'),
('Rajitha', 'De Silva', 'Rajitha De Silva', 'rajitha.ds@email.com', 'jkehashedpassword5', '887654321V', NULL, '15/C, High Level Road, Maharagama', '1988-09-18', 'user_clerk_56789'),
('Saman', 'Wijesinghe', 'Saman Wijesinghe', 'saman.w@email.com', 'jkehashedpassword6', '953456789V', NULL, '23, Hill Street, Nuwara Eliya', '1995-02-28', 'user_clerk_67890'),
('Priya', 'Kumara', 'Priya Kumara', 'priya.k@email.com', 'jkehashedpassword7', '825678901V', NULL, '8, Sea Street, Trincomalee', '1982-12-01', 'user_clerk_78901'),
('Dilani', 'Jayasinghe', 'Dilani Jayasinghe', 'dilani.j@email.com', 'jkehashedpassword8', '936789012V', NULL, '4, Lake Road, Anuradhapura', '1993-06-25', 'user_clerk_89012'),
('Jayantha', 'Rathnayake', 'Jayantha Rathnayake', 'jayantha.r@email.com', 'jkehashedpassword9', '891234567V', NULL, '33, First Cross Street, Jaffna', '1989-08-08', 'user_clerk_90123'),
('Anusha', 'Senanayake', 'Anusha Senanayake', 'anusha.s@email.com', 'jkehashedpassword10', '912345678V', NULL, '21, Palm Grove, Matara', '1991-04-14', 'user_clerk_10112');

-- 3. Insert 10 sample data records into AUTHORITIES
-- This table depends on CATEGORIES.
INSERT INTO "AUTHORITIES" ("name", "ministry", "location", "description", "category_id") VALUES
('Road Development Authority', 'Ministry of Transport and Highways', 'Western Province', 'Responsible for the development and maintenance of national roads.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure')),
('Ministry of Health', 'Ministry of Health', 'Colombo', 'Oversees all public health services, hospitals, and clinics.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Health')),
('National Water Supply & Drainage Board', 'Ministry of Water Supply', 'Central Province', 'Manages the countrys water supply and sanitation services.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Water Supply')),
('Urban Development Authority', 'Ministry of Urban Development', 'Colombo', 'Focuses on sustainable urban planning and development.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Urban Development')),
('National Solid Waste Management Center', 'Ministry of Environment', 'Western Province', 'Coordinates national strategies for waste management.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Waste Management')),
('Department of Education', 'Ministry of Education', 'Western Province', 'Regulates and oversees public education systems.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Education')),
('Sri Lanka Police', 'Ministry of Public Security', 'National', 'Ensures law and order across the country.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Safety')),
('Ministry of Agriculture', 'Ministry of Agriculture', 'Rajagiriya', 'Supports and regulates the agricultural sector.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Agriculture')),
('Department of Wildlife Conservation', 'Ministry of Wildlife', 'Colombo', 'Protects wildlife and manages national parks.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Environment & Wildlife')),
('Sri Lanka Transport Board', 'Ministry of Transport', 'National', 'Operates and regulates public bus transport services.', (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Transport'));

-- 4. Insert sample data into ISSUE_STATUS
-- This table depends on AUTHORITIES.
INSERT INTO "ISSUE_STATUS" ("status_name", "authority_id") VALUES
('Pending Review', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('Assigned to Team', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('Completed', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('In Progress', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board')),
('Scheduled for Inspection', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health')),
('Under Investigation', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police')),
('Resolved', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Urban Development Authority')),
('Received', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center')),
('Awaiting Approval', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education')),
('Rejected', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture'));

-- 5. Insert 10 sample data records into OFFICIAL
-- This new table depends on AUTHORITIES.
INSERT INTO "OFFICIAL" ("username", "password", "position", "authority_id") VALUES
('road_official_1', 'hashed_password_4', 'Deputy Director', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')),
('health_official_1', 'hashed_password_5', 'Senior Medical Officer', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health')),
('water_official_1', 'hashed_password_6', 'Senior Engineer', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board')),
('urban_official_1', 'hashed_password_7', 'City Planner', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Urban Development Authority')),
('waste_official_1', 'hashed_password_8', 'Zonal Manager', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center')),
('edu_official_1', 'hashed_password_9', 'Regional Director', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education')),
('police_official_1', 'hashed_password_10', 'Inspector', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police')),
('agri_official_1', 'hashed_password_11', 'Extension Officer', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture')),
('wildlife_official_1', 'hashed_password_12', 'Park Warden', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Wildlife Conservation')),
('transport_official_1', 'hashed_password_13', 'Route Manager', (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Transport Board'));

-- 6. Insert numerous sample data records into ISSUE
-- This table has multiple foreign key dependencies.
INSERT INTO "ISSUE" ("user_id", "title", "description", "district", "gs_division", "ds_division", "urgency_score", "status_id", "authority_id", "category_id", "image_urls", "approved_for_appointment_placing") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), 'Pothole on Main Street', 'A large pothole has formed on the main street, causing traffic issues and risk to vehicles.', 'Colombo', 'Colombo North', 'Colombo Central', 8.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure'), '["http://govpulse.lk/img/road1.jpg"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'nimali.f@email.com'), 'No clean water in our area', 'For the past five days, our neighborhood has not had a clean water supply.', 'Kandy', 'Kandy West', 'Gangawata Korale', 9.2, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'In Progress' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Water Supply'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'kasun.b@email.com'), 'Garbage not collected for weeks', 'The street garbage bins are overflowing. This is a major health hazard.', 'Galle', 'Galle East', 'Akmeemana', 7.8, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Received' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Waste Management'), '["http://govpulse.lk/img/garbage1.jpg"]', FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'lakshmi.g@email.com'), 'Street light broken', 'A street light near the school has been broken for over a month, making the area unsafe at night.', 'Gampaha', 'Gampaha North', 'Gampaha', 6.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Urban Development Authority')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Urban Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Urban Development'), '["http://govpulse.lk/img/light1.jpg"]', FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'rajitha.ds@email.com'), 'Need new textbooks for school', 'Our primary school is short on textbooks for grades 1-3. We need assistance.', 'Matara', 'Matara South', 'Welipitiya', 8.9, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Awaiting Approval' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Education'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'saman.w@email.com'), 'Corrupt official at local police station', 'I want to report an instance of an official demanding a bribe. I have evidence.', 'Nuwara Eliya', 'Nuwara Eliya Central', 'Nuwara Eliya', 9.9, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Under Investigation' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Safety'), '["http://govpulse.lk/doc/bribe_report.pdf"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'priya.k@email.com'), 'Wild elephant threat in village', 'A wild elephant has been seen regularly near our village, causing damage to crops and properties.', 'Trincomalee', 'Trincomalee East', 'Kinniya', 9.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Wildlife Conservation')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Wildlife Conservation'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Environment & Wildlife'), '["http://govpulse.lk/img/elephant1.mp4"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'dilani.j@email.com'), 'Expired food at local store', 'A local food store is selling expired food products. This is a public health concern.', 'Anuradhapura', 'Anuradhapura North', 'Anuradhapura', 9.0, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Scheduled for Inspection' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Health'), '["http://govpulse.lk/img/expired_food.jpg"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'jayantha.r@email.com'), 'Bus route has been changed without notice', 'The local bus route has been changed, making it difficult for many commuters.', 'Jaffna', 'Jaffna Central', 'Nallur', 7.0, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Transport Board')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Transport Board'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Transport'), NULL, FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'anusha.s@email.com'), 'Crop disease affecting paddy fields', 'A new disease is affecting our paddy crops, and we need expert advice and help.', 'Matara', 'Matara North', 'Akuressa', 8.2, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Agriculture'), '["http://govpulse.lk/img/paddy_disease.jpg"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), 'Damaged drainage system', 'The drainage system on our road is blocked, causing flooding during rain.', 'Colombo', 'Colombo South', 'Dehiwala', 7.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Assigned to Team' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure'), '["http://govpulse.lk/img/drainage.jpg"]', FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'nimali.f@email.com'), 'Public tap leaking excessively', 'The public water tap near our park is leaking severely, wasting a lot of water.', 'Kandy', 'Kandy East', 'Pathahewaheta', 6.8, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'In Progress' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Water Supply'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), 'Fallen tree on road', 'A large tree has fallen and is blocking a major road, causing a traffic jam.', 'Colombo', 'Colombo South', 'Homagama', 9.0, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure'), '["http://govpulse.lk/img/fallen_tree.jpg"]', FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'kasun.b@email.com'), 'Improper waste disposal in public park', 'There are large piles of garbage in the public park, attracting stray animals.', 'Galle', 'Galle Central', 'Habaraduwa', 8.1, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Received' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Waste Management'), '["http://govpulse.lk/img/park_garbage.jpg"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'lakshmi.g@email.com'), 'New school building is unfinished', 'Construction on a new school wing has stopped, and the building is exposed to the elements.', 'Gampaha', 'Gampaha South', 'Ja-Ela', 8.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Awaiting Approval' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Education'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'rajitha.ds@email.com'), 'Need police patrol in our neighborhood', 'There has been an increase in burglaries recently. We need more police presence.', 'Matara', 'Matara Central', 'Matara', 9.1, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Under Investigation' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Safety'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'saman.w@email.com'), 'Deforestation in protected area', 'Illegal logging is taking place in a nearby forest reserve. Urgent action is needed.', 'Nuwara Eliya', 'Nuwara Eliya East', 'Kotmale', 9.8, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Wildlife Conservation')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Wildlife Conservation'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Environment & Wildlife'), '["http://govpulse.lk/vid/logging_proof.mp4"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'priya.k@email.com'), 'Clinic has no doctors', 'The local public clinic has been without a doctor for over a month, and patients are suffering.', 'Trincomalee', 'Trincomalee West', 'Muttur', 9.3, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Scheduled for Inspection' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Health'), NULL, TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'dilani.j@email.com'), 'Lack of public transport on main route', 'The bus frequency on route 120 has decreased significantly, causing long waits for commuters.', 'Anuradhapura', 'Anuradhapura South', 'Kekirawa', 7.2, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Transport Board')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Transport Board'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Public Transport'), NULL, FALSE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'jayantha.r@email.com'), 'Lack of irrigation for paddy fields', 'Our paddy fields are suffering due to a lack of proper irrigation. The water channels are damaged.', 'Jaffna', 'Jaffna North', 'Thenmarachchi', 8.8, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Agriculture'), '["http://govpulse.lk/img/irrigation_issue.jpg"]', TRUE),
((SELECT "user_id" FROM "USER" WHERE "email" = 'anusha.s@email.com'), 'Damaged pedestrian bridge', 'The pedestrian bridge over the railway line is severely damaged and unsafe to use.', 'Matara', 'Matara South', 'Dickwella', 9.5, (SELECT "status_id" FROM "ISSUE_STATUS" WHERE "status_name" = 'Pending Review' AND "authority_id" = (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority')), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "category_id" FROM "CATEGORIES" WHERE "category_name" = 'Road Infrastructure'), '["http://govpulse.lk/img/bridge_damaged.jpg"]', TRUE);

-- 7. Insert sample data records into APPOINTMENT
-- This table depends on USER, AUTHORITIES, and ISSUE, and now includes a new official_comment.
INSERT INTO "APPOINTMENT" ("user_id", "authority_id", "issue_id", "date", "time_slot", "official_comment") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street'), '2025-08-15', '10:00 - 11:00', 'The issue has been reviewed, and an appointment for an inspection is scheduled.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'rajitha.ds@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Need new textbooks for school'), '2025-08-16', '14:00 - 15:00', 'Meeting to discuss the request for new textbooks.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'saman.w@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Corrupt official at local police station'), '2025-08-17', '09:30 - 10:30', 'Confidential meeting to gather details and evidence for the investigation.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'dilani.j@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Expired food at local store'), '2025-08-18', '11:00 - 12:00', 'Inspection team will visit the location with the user.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'kasun.b@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Improper waste disposal in public park'), '2025-08-19', '10:30 - 11:30', 'Scheduled a meeting to discuss waste management options in the area.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'lakshmi.g@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'New school building is unfinished'), '2025-08-20', '13:00 - 14:00', 'Meeting to assess the progress and find a solution for the construction.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'rajitha.ds@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Need police patrol in our neighborhood'), '2025-08-21', '15:00 - 16:00', 'Meeting with the resident group to discuss a new patrol schedule.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'priya.k@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Clinic has no doctors'), '2025-08-22', '09:00 - 10:00', 'Appointment to discuss the immediate staffing needs of the clinic.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'jayantha.r@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Lack of irrigation for paddy fields'), '2025-08-23', '11:00 - 12:00', 'Meeting to survey the damage to the water channels.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'anusha.s@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Damaged pedestrian bridge'), '2025-08-24', '10:00 - 11:00', 'Inspection of the damaged bridge is scheduled with the user.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Fallen tree on road'), '2025-08-25', '14:00 - 15:00', 'Assessment of the road blockage and discussion of a clearing plan.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'nimali.f@email.com'), (SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Public tap leaking excessively'), '2025-08-26', '13:00 - 14:00', 'Meeting to inspect the leaking tap and schedule a repair.');

-- 8. Insert sample data records into ATTENDEES
-- Attendees are inserted with a direct foreign key to APPOINTMENT.
INSERT INTO "ATTENDEES" ("nic", "name", "phone_no", "appointment_id", "added_by") VALUES
('912345678V', 'John Smith', '0771234567', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'The issue has been reviewed, and an appointment for an inspection is scheduled.'), 'user'),
('923456789V', 'Emily White', '0719876543', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'The issue has been reviewed, and an appointment for an inspection is scheduled.'), 'user'),
('954321098V', 'Lakshman Perera', '0755678901', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting to discuss the request for new textbooks.'), 'user'),
('889988776V', 'Sunil Mendis', '0701122334', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Confidential meeting to gather details and evidence for the investigation.'), 'user'),
('765432109V', 'Chathura Ranasinghe', '0789012345', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Scheduled a meeting to discuss waste management options in the area.'), 'user'),
('654321098V', 'Mahesh Fernando', '0761234567', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting to assess the progress and find a solution for the construction.'), 'official'),
('543210987V', 'Nuwantha Senaratne', '0729876543', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting with the resident group to discuss a new patrol schedule.'), 'user'),
('432109876V', 'Suresh Alahakoon', '0778765432', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Appointment to discuss the immediate staffing needs of the clinic.'), 'user'),
('321098765V', 'Dinuka Pathirana', '0712345678', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting to survey the damage to the water channels.'), 'official'),
('210987654V', 'Tharindu Jayawardena', '0754321098', (SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Inspection of the damaged bridge is scheduled with the user.'), 'user');

-- 9. Insert sample data records into FREE_TIMES
-- This table depends on AUTHORITIES.
INSERT INTO "FREE_TIMES" ("authority_id", "date", "time_slots") VALUES
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), '2025-08-15', ARRAY['10:00 - 11:00', '11:30 - 12:30', '14:00 - 15:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), '2025-08-16', ARRAY['09:00 - 10:00', '13:00 - 14:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), '2025-08-16', ARRAY['14:00 - 15:00', '15:30 - 16:30']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Solid Waste Management Center'), '2025-08-19', ARRAY['10:30 - 11:30', '14:00 - 15:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Department of Education'), '2025-08-20', ARRAY['13:00 - 14:00', '15:00 - 16:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Sri Lanka Police'), '2025-08-21', ARRAY['15:00 - 16:00', '16:30 - 17:30']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Health'), '2025-08-22', ARRAY['09:00 - 10:00', '11:00 - 12:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Ministry of Agriculture'), '2025-08-23', ARRAY['11:00 - 12:00', '14:00 - 15:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), '2025-08-24', ARRAY['10:00 - 11:00', '14:00 - 15:00']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'Road Development Authority'), '2025-08-25', ARRAY['14:00 - 15:00', '15:30 - 16:30']),
((SELECT "authority_id" FROM "AUTHORITIES" WHERE "name" = 'National Water Supply & Drainage Board'), '2025-08-26', ARRAY['13:00 - 14:00', '15:00 - 16:00']);

-- 10. Insert sample data records into UPVOTE
-- This table depends on USER and ISSUE.
INSERT INTO "UPVOTE" ("user_id", "issue_id", "comment") VALUES
((SELECT "user_id" FROM "USER" WHERE "email" = 'nimali.f@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street' AND "user_id" = (SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com')), 'I drive on this road daily. This is a serious problem!'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'kasun.b@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'No clean water in our area'), 'Hope this gets resolved soon. We are facing the same issue.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Garbage not collected for weeks'), 'I agree, the smell is unbearable.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'lakshmi.g@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street' AND "user_id" = (SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com')), 'Very dangerous for motorcycles.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'priya.k@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Fallen tree on road'), 'This has been a problem for days now!'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'dilani.j@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Improper waste disposal in public park'), 'I walk there often. It is a terrible sight.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'anusha.s@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'New school building is unfinished'), 'My children go to this school. We need this building completed.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'saman.w@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Need police patrol in our neighborhood'), 'This is happening to many of us in the area.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'jayantha.r@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Clinic has no doctors'), 'My elderly parents can''t get treatment. This is very urgent.'),
((SELECT "user_id" FROM "USER" WHERE "email" = 'amal.perera@email.com'), (SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Deforestation in protected area'), 'I have seen this happening as well. It is a disgrace.');

-- 11. Insert sample data records into EMBEDDING
-- This table depends on ISSUE.
INSERT INTO "EMBEDDING" ("issue_id", "vector", "description", "title") VALUES
((SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Pothole on Main Street'), 'some_vector_data_for_pothole_1', 'Embedding data for road damage issue.', 'Pothole Embedding Title'),
((SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Wild elephant threat in village'), 'some_vector_data_for_wildlife_threat', 'Embedding data for elephant threat issue.', 'Elephant Threat Embedding Title'),
((SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Fallen tree on road'), 'some_vector_data_for_fallen_tree', 'Embedding data for road blockage issue.', 'Fallen Tree Embedding Title'),
((SELECT "issue_id" FROM "ISSUE" WHERE "title" = 'Improper waste disposal in public park'), 'some_vector_data_for_waste_disposal', 'Embedding data for waste management issue.', 'Waste Disposal Embedding Title');

-- 12. Insert sample data records into ATTACHMENT
-- This new table depends on APPOINTMENT.
INSERT INTO "ATTACHMENT" ("appointment_id", "file_urls") VALUES
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'The issue has been reviewed, and an appointment for an inspection is scheduled.'), ARRAY['http://govpulse.lk/file/road_photo_1.jpg', 'http://govpulse.lk/file/report_summary.pdf']),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Confidential meeting to gather details and evidence for the investigation.'), ARRAY['http://govpulse.lk/file/evidence_photo.jpg']),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting to assess the progress and find a solution for the construction.'), ARRAY['http://govpulse.lk/file/school_photos.jpg']),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Inspection of the damaged bridge is scheduled with the user.'), ARRAY['http://govpulse.lk/file/bridge_report.pdf']);

-- 13. Insert sample data records into FEEDBACK
-- This new table depends on APPOINTMENT.
INSERT INTO "FEEDBACK" ("appointment_id", "rating", "comment") VALUES
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'The issue has been reviewed, and an appointment for an inspection is scheduled.'), 4, 'The meeting was productive and the authority was responsive.'),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Meeting to discuss the request for new textbooks.'), 5, 'Very helpful and positive outcome. We are optimistic about the support.'),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Scheduled a meeting to discuss waste management options in the area.'), 3, 'The meeting was helpful, but we still have a long way to go.'),
((SELECT "appointment_id" FROM "APPOINTMENT" WHERE "official_comment" = 'Appointment to discuss the immediate staffing needs of the clinic.'), 5, 'The authority was very understanding and is working on a solution.');

