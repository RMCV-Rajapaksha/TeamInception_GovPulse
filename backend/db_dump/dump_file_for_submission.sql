--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: APPOINTMENT; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."APPOINTMENT" (
    appointment_id integer NOT NULL,
    user_id integer NOT NULL,
    authority_id integer NOT NULL,
    issue_id integer,
    date date,
    time_slot character varying(255),
    official_comment text
);


ALTER TABLE public."APPOINTMENT" OWNER TO user1;

--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."APPOINTMENT_appointment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."APPOINTMENT_appointment_id_seq" OWNER TO user1;

--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."APPOINTMENT_appointment_id_seq" OWNED BY public."APPOINTMENT".appointment_id;


--
-- Name: ATTACHMENT; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."ATTACHMENT" (
    attachment_id integer NOT NULL,
    file_urls text[],
    appointment_id integer NOT NULL
);


ALTER TABLE public."ATTACHMENT" OWNER TO user1;

--
-- Name: ATTACHMENT_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."ATTACHMENT_attachment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ATTACHMENT_attachment_id_seq" OWNER TO user1;

--
-- Name: ATTACHMENT_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."ATTACHMENT_attachment_id_seq" OWNED BY public."ATTACHMENT".attachment_id;


--
-- Name: ATTENDEES; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."ATTENDEES" (
    attendee_id integer NOT NULL,
    nic character varying(255),
    name character varying(255),
    phone_no character varying(20),
    added_by character varying(50),
    appointment_id integer
);


ALTER TABLE public."ATTENDEES" OWNER TO user1;

--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."ATTENDEES_attendee_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ATTENDEES_attendee_id_seq" OWNER TO user1;

--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."ATTENDEES_attendee_id_seq" OWNED BY public."ATTENDEES".attendee_id;


--
-- Name: AUTHORITIES; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."AUTHORITIES" (
    authority_id integer NOT NULL,
    name character varying(255) NOT NULL,
    ministry character varying(255),
    location character varying(255),
    description text,
    category_id integer
);


ALTER TABLE public."AUTHORITIES" OWNER TO user1;

--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."AUTHORITIES_authority_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AUTHORITIES_authority_id_seq" OWNER TO user1;

--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."AUTHORITIES_authority_id_seq" OWNED BY public."AUTHORITIES".authority_id;


--
-- Name: CATEGORIES; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."CATEGORIES" (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public."CATEGORIES" OWNER TO user1;

--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."CATEGORIES_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CATEGORIES_category_id_seq" OWNER TO user1;

--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."CATEGORIES_category_id_seq" OWNED BY public."CATEGORIES".category_id;


--
-- Name: EMBEDDING; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."EMBEDDING" (
    embedding_id integer NOT NULL,
    issue_id integer NOT NULL,
    vector text,
    description text,
    title character varying(255)
);


ALTER TABLE public."EMBEDDING" OWNER TO user1;

--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."EMBEDDING_embedding_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."EMBEDDING_embedding_id_seq" OWNER TO user1;

--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."EMBEDDING_embedding_id_seq" OWNED BY public."EMBEDDING".embedding_id;


--
-- Name: FEEDBACK; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."FEEDBACK" (
    feedback_id integer NOT NULL,
    rating integer,
    comment text,
    appointment_id integer NOT NULL
);


ALTER TABLE public."FEEDBACK" OWNER TO user1;

--
-- Name: FEEDBACK_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."FEEDBACK_feedback_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FEEDBACK_feedback_id_seq" OWNER TO user1;

--
-- Name: FEEDBACK_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."FEEDBACK_feedback_id_seq" OWNED BY public."FEEDBACK".feedback_id;


--
-- Name: FREE_TIMES; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."FREE_TIMES" (
    authority_id integer NOT NULL,
    date date NOT NULL,
    time_slots text[]
);


ALTER TABLE public."FREE_TIMES" OWNER TO user1;

--
-- Name: ISSUE; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."ISSUE" (
    issue_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    district character varying(255),
    gs_division character varying(255),
    ds_division character varying(255),
    urgency_score real,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status_id integer,
    authority_id integer,
    category_id integer,
    image_urls text,
    approved_for_appointment_placing boolean DEFAULT false
);


ALTER TABLE public."ISSUE" OWNER TO user1;

--
-- Name: ISSUE_STATUS; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."ISSUE_STATUS" (
    status_id integer NOT NULL,
    status_name character varying(255) NOT NULL,
    authority_id integer
);


ALTER TABLE public."ISSUE_STATUS" OWNER TO user1;

--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."ISSUE_STATUS_status_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ISSUE_STATUS_status_id_seq" OWNER TO user1;

--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."ISSUE_STATUS_status_id_seq" OWNED BY public."ISSUE_STATUS".status_id;


--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."ISSUE_issue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ISSUE_issue_id_seq" OWNER TO user1;

--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."ISSUE_issue_id_seq" OWNED BY public."ISSUE".issue_id;


--
-- Name: OFFICIAL; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."OFFICIAL" (
    official_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password text NOT NULL,
    "position" character varying(255),
    authority_id integer
);


ALTER TABLE public."OFFICIAL" OWNER TO user1;

--
-- Name: OFFICIAL_official_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."OFFICIAL_official_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."OFFICIAL_official_id_seq" OWNER TO user1;

--
-- Name: OFFICIAL_official_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."OFFICIAL_official_id_seq" OWNED BY public."OFFICIAL".official_id;


--
-- Name: UPVOTE; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."UPVOTE" (
    user_id integer NOT NULL,
    issue_id integer NOT NULL,
    comment text,
    time_stamp timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."UPVOTE" OWNER TO user1;

--
-- Name: USER; Type: TABLE; Schema: public; Owner: user1
--

CREATE TABLE public."USER" (
    user_id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    name character varying(255),
    email character varying(255) NOT NULL,
    password text NOT NULL,
    nic character varying(255),
    profile_image_url text,
    home_address text,
    dob date,
    clerk_user_id character varying(255)
);


ALTER TABLE public."USER" OWNER TO user1;

--
-- Name: USER_user_id_seq; Type: SEQUENCE; Schema: public; Owner: user1
--

CREATE SEQUENCE public."USER_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."USER_user_id_seq" OWNER TO user1;

--
-- Name: USER_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user1
--

ALTER SEQUENCE public."USER_user_id_seq" OWNED BY public."USER".user_id;


--
-- Name: APPOINTMENT appointment_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."APPOINTMENT" ALTER COLUMN appointment_id SET DEFAULT nextval('public."APPOINTMENT_appointment_id_seq"'::regclass);


--
-- Name: ATTACHMENT attachment_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTACHMENT" ALTER COLUMN attachment_id SET DEFAULT nextval('public."ATTACHMENT_attachment_id_seq"'::regclass);


--
-- Name: ATTENDEES attendee_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTENDEES" ALTER COLUMN attendee_id SET DEFAULT nextval('public."ATTENDEES_attendee_id_seq"'::regclass);


--
-- Name: AUTHORITIES authority_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."AUTHORITIES" ALTER COLUMN authority_id SET DEFAULT nextval('public."AUTHORITIES_authority_id_seq"'::regclass);


--
-- Name: CATEGORIES category_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."CATEGORIES" ALTER COLUMN category_id SET DEFAULT nextval('public."CATEGORIES_category_id_seq"'::regclass);


--
-- Name: EMBEDDING embedding_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."EMBEDDING" ALTER COLUMN embedding_id SET DEFAULT nextval('public."EMBEDDING_embedding_id_seq"'::regclass);


--
-- Name: FEEDBACK feedback_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FEEDBACK" ALTER COLUMN feedback_id SET DEFAULT nextval('public."FEEDBACK_feedback_id_seq"'::regclass);


--
-- Name: ISSUE issue_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE" ALTER COLUMN issue_id SET DEFAULT nextval('public."ISSUE_issue_id_seq"'::regclass);


--
-- Name: ISSUE_STATUS status_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE_STATUS" ALTER COLUMN status_id SET DEFAULT nextval('public."ISSUE_STATUS_status_id_seq"'::regclass);


--
-- Name: OFFICIAL official_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."OFFICIAL" ALTER COLUMN official_id SET DEFAULT nextval('public."OFFICIAL_official_id_seq"'::regclass);


--
-- Name: USER user_id; Type: DEFAULT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."USER" ALTER COLUMN user_id SET DEFAULT nextval('public."USER_user_id_seq"'::regclass);


--
-- Data for Name: APPOINTMENT; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."APPOINTMENT" (appointment_id, user_id, authority_id, issue_id, date, time_slot, official_comment) FROM stdin;
1	1	1	1	2025-08-15	10:00 - 11:00	The issue has been reviewed, and an appointment for an inspection is scheduled.
2	5	6	5	2025-08-16	14:00 - 15:00	Meeting to discuss the request for new textbooks.
3	6	7	6	2025-08-17	09:30 - 10:30	Confidential meeting to gather details and evidence for the investigation.
4	8	2	8	2025-08-18	11:00 - 12:00	Inspection team will visit the location with the user.
5	3	5	14	2025-08-19	10:30 - 11:30	Scheduled a meeting to discuss waste management options in the area.
6	4	6	15	2025-08-20	13:00 - 14:00	Meeting to assess the progress and find a solution for the construction.
7	5	7	16	2025-08-21	15:00 - 16:00	Meeting with the resident group to discuss a new patrol schedule.
8	7	2	18	2025-08-22	09:00 - 10:00	Appointment to discuss the immediate staffing needs of the clinic.
9	9	8	20	2025-08-23	11:00 - 12:00	Meeting to survey the damage to the water channels.
10	10	1	21	2025-08-24	10:00 - 11:00	Inspection of the damaged bridge is scheduled with the user.
11	1	1	13	2025-08-25	14:00 - 15:00	Assessment of the road blockage and discussion of a clearing plan.
12	2	3	12	2025-08-26	13:00 - 14:00	Meeting to inspect the leaking tap and schedule a repair.
\.


--
-- Data for Name: ATTACHMENT; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."ATTACHMENT" (attachment_id, file_urls, appointment_id) FROM stdin;
1	{http://govpulse.lk/file/road_photo_1.jpg,http://govpulse.lk/file/report_summary.pdf}	1
2	{http://govpulse.lk/file/evidence_photo.jpg}	3
3	{http://govpulse.lk/file/school_photos.jpg}	6
4	{http://govpulse.lk/file/bridge_report.pdf}	10
\.


--
-- Data for Name: ATTENDEES; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."ATTENDEES" (attendee_id, nic, name, phone_no, added_by, appointment_id) FROM stdin;
1	912345678V	John Smith	0771234567	user	1
2	923456789V	Emily White	0719876543	user	1
3	954321098V	Lakshman Perera	0755678901	user	2
4	889988776V	Sunil Mendis	0701122334	user	3
5	765432109V	Chathura Ranasinghe	0789012345	user	5
6	654321098V	Mahesh Fernando	0761234567	official	6
7	543210987V	Nuwantha Senaratne	0729876543	user	7
8	432109876V	Suresh Alahakoon	0778765432	user	8
9	321098765V	Dinuka Pathirana	0712345678	official	9
10	210987654V	Tharindu Jayawardena	0754321098	user	10
\.


--
-- Data for Name: AUTHORITIES; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."AUTHORITIES" (authority_id, name, ministry, location, description, category_id) FROM stdin;
1	Road Development Authority	Ministry of Transport and Highways	Western Province	Responsible for the development and maintenance of national roads.	1
2	Ministry of Health	Ministry of Health	Colombo	Oversees all public health services, hospitals, and clinics.	2
3	National Water Supply & Drainage Board	Ministry of Water Supply	Central Province	Manages the countrys water supply and sanitation services.	3
4	Urban Development Authority	Ministry of Urban Development	Colombo	Focuses on sustainable urban planning and development.	7
5	National Solid Waste Management Center	Ministry of Environment	Western Province	Coordinates national strategies for waste management.	4
6	Department of Education	Ministry of Education	Western Province	Regulates and oversees public education systems.	5
7	Sri Lanka Police	Ministry of Public Security	National	Ensures law and order across the country.	6
8	Ministry of Agriculture	Ministry of Agriculture	Rajagiriya	Supports and regulates the agricultural sector.	8
9	Department of Wildlife Conservation	Ministry of Wildlife	Colombo	Protects wildlife and manages national parks.	9
10	Sri Lanka Transport Board	Ministry of Transport	National	Operates and regulates public bus transport services.	10
\.


--
-- Data for Name: CATEGORIES; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."CATEGORIES" (category_id, category_name, description) FROM stdin;
1	Road Infrastructure	Issues related to roads, bridges, and highways.
2	Public Health	Concerns regarding public hospitals, clinics, and sanitation.
3	Water Supply	Problems with clean water access and distribution.
4	Waste Management	Issues related to garbage collection and disposal.
5	Education	Matters concerning schools, universities, and educational policy.
6	Public Safety	Concerns about law enforcement, fire services, and emergency response.
7	Urban Development	Issues related to city planning, public spaces, and infrastructure projects.
8	Agriculture	Matters related to farming, crop protection, and rural development.
9	Environment & Wildlife	Concerns about deforestation, pollution, and wildlife conservation.
10	Public Transport	Issues regarding bus services, train systems, and public transit management.
\.


--
-- Data for Name: EMBEDDING; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."EMBEDDING" (embedding_id, issue_id, vector, description, title) FROM stdin;
1	1	some_vector_data_for_pothole_1	Embedding data for road damage issue.	Pothole Embedding Title
2	7	some_vector_data_for_wildlife_threat	Embedding data for elephant threat issue.	Elephant Threat Embedding Title
3	13	some_vector_data_for_fallen_tree	Embedding data for road blockage issue.	Fallen Tree Embedding Title
4	14	some_vector_data_for_waste_disposal	Embedding data for waste management issue.	Waste Disposal Embedding Title
\.


--
-- Data for Name: FEEDBACK; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."FEEDBACK" (feedback_id, rating, comment, appointment_id) FROM stdin;
1	4	The meeting was productive and the authority was responsive.	1
2	5	Very helpful and positive outcome. We are optimistic about the support.	2
3	3	The meeting was helpful, but we still have a long way to go.	5
4	5	The authority was very understanding and is working on a solution.	8
\.


--
-- Data for Name: FREE_TIMES; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."FREE_TIMES" (authority_id, date, time_slots) FROM stdin;
1	2025-08-15	{"10:00 - 11:00","11:30 - 12:30","14:00 - 15:00"}
3	2025-08-16	{"09:00 - 10:00","13:00 - 14:00"}
6	2025-08-16	{"14:00 - 15:00","15:30 - 16:30"}
5	2025-08-19	{"10:30 - 11:30","14:00 - 15:00"}
6	2025-08-20	{"13:00 - 14:00","15:00 - 16:00"}
7	2025-08-21	{"15:00 - 16:00","16:30 - 17:30"}
2	2025-08-22	{"09:00 - 10:00","11:00 - 12:00"}
8	2025-08-23	{"11:00 - 12:00","14:00 - 15:00"}
1	2025-08-24	{"10:00 - 11:00","14:00 - 15:00"}
1	2025-08-25	{"14:00 - 15:00","15:30 - 16:30"}
3	2025-08-26	{"13:00 - 14:00","15:00 - 16:00"}
\.


--
-- Data for Name: ISSUE; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."ISSUE" (issue_id, user_id, title, description, district, gs_division, ds_division, urgency_score, created_at, status_id, authority_id, category_id, image_urls, approved_for_appointment_placing) FROM stdin;
1	1	Pothole on Main Street	A large pothole has formed on the main street, causing traffic issues and risk to vehicles.	Colombo	Colombo North	Colombo Central	8.5	2025-08-15 11:22:28.437299+05:30	1	1	1	["http://govpulse.lk/img/road1.jpg"]	t
2	2	No clean water in our area	For the past five days, our neighborhood has not had a clean water supply.	Kandy	Kandy West	Gangawata Korale	9.2	2025-08-15 11:22:28.437299+05:30	4	3	3	\N	t
3	3	Garbage not collected for weeks	The street garbage bins are overflowing. This is a major health hazard.	Galle	Galle East	Akmeemana	7.8	2025-08-15 11:22:28.437299+05:30	8	5	4	["http://govpulse.lk/img/garbage1.jpg"]	f
4	4	Street light broken	A street light near the school has been broken for over a month, making the area unsafe at night.	Gampaha	Gampaha North	Gampaha	6.5	2025-08-15 11:22:28.437299+05:30	\N	4	7	["http://govpulse.lk/img/light1.jpg"]	f
5	5	Need new textbooks for school	Our primary school is short on textbooks for grades 1-3. We need assistance.	Matara	Matara South	Welipitiya	8.9	2025-08-15 11:22:28.437299+05:30	9	6	5	\N	t
6	6	Corrupt official at local police station	I want to report an instance of an official demanding a bribe. I have evidence.	Nuwara Eliya	Nuwara Eliya Central	Nuwara Eliya	9.9	2025-08-15 11:22:28.437299+05:30	6	7	6	["http://govpulse.lk/doc/bribe_report.pdf"]	t
7	7	Wild elephant threat in village	A wild elephant has been seen regularly near our village, causing damage to crops and properties.	Trincomalee	Trincomalee East	Kinniya	9.5	2025-08-15 11:22:28.437299+05:30	\N	9	9	["http://govpulse.lk/img/elephant1.mp4"]	t
8	8	Expired food at local store	A local food store is selling expired food products. This is a public health concern.	Anuradhapura	Anuradhapura North	Anuradhapura	9	2025-08-15 11:22:28.437299+05:30	5	2	2	["http://govpulse.lk/img/expired_food.jpg"]	t
9	9	Bus route has been changed without notice	The local bus route has been changed, making it difficult for many commuters.	Jaffna	Jaffna Central	Nallur	7	2025-08-15 11:22:28.437299+05:30	\N	10	10	\N	f
10	10	Crop disease affecting paddy fields	A new disease is affecting our paddy crops, and we need expert advice and help.	Matara	Matara North	Akuressa	8.2	2025-08-15 11:22:28.437299+05:30	\N	8	8	["http://govpulse.lk/img/paddy_disease.jpg"]	t
11	1	Damaged drainage system	The drainage system on our road is blocked, causing flooding during rain.	Colombo	Colombo South	Dehiwala	7.5	2025-08-15 11:22:28.437299+05:30	2	1	1	["http://govpulse.lk/img/drainage.jpg"]	f
12	2	Public tap leaking excessively	The public water tap near our park is leaking severely, wasting a lot of water.	Kandy	Kandy East	Pathahewaheta	6.8	2025-08-15 11:22:28.437299+05:30	4	3	3	\N	t
13	1	Fallen tree on road	A large tree has fallen and is blocking a major road, causing a traffic jam.	Colombo	Colombo South	Homagama	9	2025-08-15 11:22:28.437299+05:30	1	1	1	["http://govpulse.lk/img/fallen_tree.jpg"]	f
14	3	Improper waste disposal in public park	There are large piles of garbage in the public park, attracting stray animals.	Galle	Galle Central	Habaraduwa	8.1	2025-08-15 11:22:28.437299+05:30	8	5	4	["http://govpulse.lk/img/park_garbage.jpg"]	t
15	4	New school building is unfinished	Construction on a new school wing has stopped, and the building is exposed to the elements.	Gampaha	Gampaha South	Ja-Ela	8.5	2025-08-15 11:22:28.437299+05:30	9	6	5	\N	t
16	5	Need police patrol in our neighborhood	There has been an increase in burglaries recently. We need more police presence.	Matara	Matara Central	Matara	9.1	2025-08-15 11:22:28.437299+05:30	6	7	6	\N	t
17	6	Deforestation in protected area	Illegal logging is taking place in a nearby forest reserve. Urgent action is needed.	Nuwara Eliya	Nuwara Eliya East	Kotmale	9.8	2025-08-15 11:22:28.437299+05:30	\N	9	9	["http://govpulse.lk/vid/logging_proof.mp4"]	t
18	7	Clinic has no doctors	The local public clinic has been without a doctor for over a month, and patients are suffering.	Trincomalee	Trincomalee West	Muttur	9.3	2025-08-15 11:22:28.437299+05:30	5	2	2	\N	t
19	8	Lack of public transport on main route	The bus frequency on route 120 has decreased significantly, causing long waits for commuters.	Anuradhapura	Anuradhapura South	Kekirawa	7.2	2025-08-15 11:22:28.437299+05:30	\N	10	10	\N	f
20	9	Lack of irrigation for paddy fields	Our paddy fields are suffering due to a lack of proper irrigation. The water channels are damaged.	Jaffna	Jaffna North	Thenmarachchi	8.8	2025-08-15 11:22:28.437299+05:30	\N	8	8	["http://govpulse.lk/img/irrigation_issue.jpg"]	t
21	10	Damaged pedestrian bridge	The pedestrian bridge over the railway line is severely damaged and unsafe to use.	Matara	Matara South	Dickwella	9.5	2025-08-15 11:22:28.437299+05:30	1	1	1	["http://govpulse.lk/img/bridge_damaged.jpg"]	t
\.


--
-- Data for Name: ISSUE_STATUS; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."ISSUE_STATUS" (status_id, status_name, authority_id) FROM stdin;
1	Pending Review	1
2	Assigned to Team	1
3	Completed	1
4	In Progress	3
5	Scheduled for Inspection	2
6	Under Investigation	7
7	Resolved	4
8	Received	5
9	Awaiting Approval	6
10	Rejected	8
\.


--
-- Data for Name: OFFICIAL; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."OFFICIAL" (official_id, username, password, "position", authority_id) FROM stdin;
1	road_official_1	hashed_password_4	Deputy Director	1
2	health_official_1	hashed_password_5	Senior Medical Officer	2
3	water_official_1	hashed_password_6	Senior Engineer	3
4	urban_official_1	hashed_password_7	City Planner	4
5	waste_official_1	hashed_password_8	Zonal Manager	5
6	edu_official_1	hashed_password_9	Regional Director	6
7	police_official_1	hashed_password_10	Inspector	7
8	agri_official_1	hashed_password_11	Extension Officer	8
9	wildlife_official_1	hashed_password_12	Park Warden	9
10	transport_official_1	hashed_password_13	Route Manager	10
11	official2	$2b$10$3/UF3j2zeQr/yayxrbdAJ.s3fEDsaAHp0ymL5Zrtet5eaHW2Zf8cO	\N	1
12	officialAuth1	$2b$10$xdLvsNBirVOe1c9n0NeXnuKEGiWesNLbJYLe7Zea7lg2ZHftJUVXy	\N	1
13	officialAuth2	$2b$10$kvaa8r375EPf5xh2vxFyY.tcRbTDH5uDxRMuqAv8NCsQPbW7Urkay	\N	2
14	officialAuth3	$2b$10$t4Z5XBfHJs4Slz8.gTbPtONKsOlqKm0T6m4av27e.Rt62jA9YB6Fy	\N	3
15	officialAuth4	$2b$10$nxGHJ8rkLdd1MfsK2M4ZuOjj35Ylgww131aHDTHLDFxYDtJ3xwMDi	\N	4
16	officialAuth5	$2b$10$/JaLlQg3oPqH2ESlYOV9e.WWeQhEP5UsZTUdk1bCNcZiA4BVyhuZC	\N	5
17	officialAuth6	$2b$10$5biBuLsU7oXnS9BmZco46eOnfZkBzBa6JtqUZUWAXyGg8oYVcLHxe	\N	6
18	officialAuth7	$2b$10$.clpCaeVWQuqQCMrk.uBLOP3DptPsZHENT0v4Bbkao/dUSLmhYkXe	\N	7
19	officialAuth8	$2b$10$iHW5Q3cd8PzkmJMNh4jb3.KU9d0soCJ2lDi6IYHavs8oPChl9o78m	\N	8
20	officialAuth9	$2b$10$RyecXw/xYwQy9omO8JH5huQ4OORJ9cf9DBqap1DNIl/.znVIJtQvC	\N	9
21	officialAuth10	$2b$10$ZhQDrsE3ecfmh0XEIKk.UeUzUz86.CN.Mx/uJHaFPXt8si9UorD22	\N	10
\.


--
-- Data for Name: UPVOTE; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."UPVOTE" (user_id, issue_id, comment, time_stamp) FROM stdin;
2	1	I drive on this road daily. This is a serious problem!	2025-08-15 11:22:28.466568+05:30
3	2	Hope this gets resolved soon. We are facing the same issue.	2025-08-15 11:22:28.466568+05:30
1	3	I agree, the smell is unbearable.	2025-08-15 11:22:28.466568+05:30
4	1	Very dangerous for motorcycles.	2025-08-15 11:22:28.466568+05:30
7	13	This has been a problem for days now!	2025-08-15 11:22:28.466568+05:30
8	14	I walk there often. It is a terrible sight.	2025-08-15 11:22:28.466568+05:30
10	15	My children go to this school. We need this building completed.	2025-08-15 11:22:28.466568+05:30
6	16	This is happening to many of us in the area.	2025-08-15 11:22:28.466568+05:30
9	18	My elderly parents can't get treatment. This is very urgent.	2025-08-15 11:22:28.466568+05:30
1	17	I have seen this happening as well. It is a disgrace.	2025-08-15 11:22:28.466568+05:30
\.


--
-- Data for Name: USER; Type: TABLE DATA; Schema: public; Owner: user1
--

COPY public."USER" (user_id, first_name, last_name, name, email, password, nic, profile_image_url, home_address, dob, clerk_user_id) FROM stdin;
1	Amal	Perera	Amal Perera	amal.perera@email.com	jkehashedpassword1	851234567V	\N	45/A, Galle Road, Colombo 3	1985-05-15	user_clerk_12345
2	Nimali	Fernando	Nimali Fernando	nimali.f@email.com	jkehashedpassword2	902345678V	\N	12/B, Kandy Road, Kadawatha	1990-11-22	user_clerk_23456
3	Kasun	Bandara	Kasun Bandara	kasun.b@email.com	jkehashedpassword3	789012345V	\N	10, Temple Street, Kandy	1978-03-10	user_clerk_34567
4	Lakshmi	Gunawardena	Lakshmi Gunawardena	lakshmi.g@email.com	jkehashedpassword4	921122334V	\N	55, Main Street, Negombo	1992-07-04	user_clerk_45678
5	Rajitha	De Silva	Rajitha De Silva	rajitha.ds@email.com	jkehashedpassword5	887654321V	\N	15/C, High Level Road, Maharagama	1988-09-18	user_clerk_56789
6	Saman	Wijesinghe	Saman Wijesinghe	saman.w@email.com	jkehashedpassword6	953456789V	\N	23, Hill Street, Nuwara Eliya	1995-02-28	user_clerk_67890
7	Priya	Kumara	Priya Kumara	priya.k@email.com	jkehashedpassword7	825678901V	\N	8, Sea Street, Trincomalee	1982-12-01	user_clerk_78901
8	Dilani	Jayasinghe	Dilani Jayasinghe	dilani.j@email.com	jkehashedpassword8	936789012V	\N	4, Lake Road, Anuradhapura	1993-06-25	user_clerk_89012
9	Jayantha	Rathnayake	Jayantha Rathnayake	jayantha.r@email.com	jkehashedpassword9	891234567V	\N	33, First Cross Street, Jaffna	1989-08-08	user_clerk_90123
10	Anusha	Senanayake	Anusha Senanayake	anusha.s@email.com	jkehashedpassword10	912345678V	\N	21, Palm Grove, Matara	1991-04-14	user_clerk_10112
\.


--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."APPOINTMENT_appointment_id_seq"', 12, true);


--
-- Name: ATTACHMENT_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."ATTACHMENT_attachment_id_seq"', 4, true);


--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."ATTENDEES_attendee_id_seq"', 10, true);


--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."AUTHORITIES_authority_id_seq"', 10, true);


--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."CATEGORIES_category_id_seq"', 10, true);


--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."EMBEDDING_embedding_id_seq"', 4, true);


--
-- Name: FEEDBACK_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."FEEDBACK_feedback_id_seq"', 4, true);


--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."ISSUE_STATUS_status_id_seq"', 10, true);


--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."ISSUE_issue_id_seq"', 21, true);


--
-- Name: OFFICIAL_official_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."OFFICIAL_official_id_seq"', 21, true);


--
-- Name: USER_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user1
--

SELECT pg_catalog.setval('public."USER_user_id_seq"', 10, true);


--
-- Name: APPOINTMENT APPOINTMENT_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT "APPOINTMENT_pkey" PRIMARY KEY (appointment_id);


--
-- Name: ATTACHMENT ATTACHMENT_appointment_id_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTACHMENT"
    ADD CONSTRAINT "ATTACHMENT_appointment_id_key" UNIQUE (appointment_id);


--
-- Name: ATTACHMENT ATTACHMENT_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTACHMENT"
    ADD CONSTRAINT "ATTACHMENT_pkey" PRIMARY KEY (attachment_id);


--
-- Name: ATTENDEES ATTENDEES_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTENDEES"
    ADD CONSTRAINT "ATTENDEES_pkey" PRIMARY KEY (attendee_id);


--
-- Name: AUTHORITIES AUTHORITIES_category_id_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT "AUTHORITIES_category_id_key" UNIQUE (category_id);


--
-- Name: AUTHORITIES AUTHORITIES_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT "AUTHORITIES_pkey" PRIMARY KEY (authority_id);


--
-- Name: CATEGORIES CATEGORIES_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."CATEGORIES"
    ADD CONSTRAINT "CATEGORIES_pkey" PRIMARY KEY (category_id);


--
-- Name: EMBEDDING EMBEDDING_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."EMBEDDING"
    ADD CONSTRAINT "EMBEDDING_pkey" PRIMARY KEY (embedding_id);


--
-- Name: FEEDBACK FEEDBACK_appointment_id_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FEEDBACK"
    ADD CONSTRAINT "FEEDBACK_appointment_id_key" UNIQUE (appointment_id);


--
-- Name: FEEDBACK FEEDBACK_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FEEDBACK"
    ADD CONSTRAINT "FEEDBACK_pkey" PRIMARY KEY (feedback_id);


--
-- Name: FREE_TIMES FREE_TIMES_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FREE_TIMES"
    ADD CONSTRAINT "FREE_TIMES_pkey" PRIMARY KEY (authority_id, date);


--
-- Name: ISSUE_STATUS ISSUE_STATUS_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE_STATUS"
    ADD CONSTRAINT "ISSUE_STATUS_pkey" PRIMARY KEY (status_id);


--
-- Name: ISSUE ISSUE_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT "ISSUE_pkey" PRIMARY KEY (issue_id);


--
-- Name: OFFICIAL OFFICIAL_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."OFFICIAL"
    ADD CONSTRAINT "OFFICIAL_pkey" PRIMARY KEY (official_id);


--
-- Name: OFFICIAL OFFICIAL_username_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."OFFICIAL"
    ADD CONSTRAINT "OFFICIAL_username_key" UNIQUE (username);


--
-- Name: UPVOTE UPVOTE_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT "UPVOTE_pkey" PRIMARY KEY (user_id, issue_id);


--
-- Name: USER USER_clerk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."USER"
    ADD CONSTRAINT "USER_clerk_user_id_key" UNIQUE (clerk_user_id);


--
-- Name: USER USER_email_key; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."USER"
    ADD CONSTRAINT "USER_email_key" UNIQUE (email);


--
-- Name: USER USER_pkey; Type: CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."USER"
    ADD CONSTRAINT "USER_pkey" PRIMARY KEY (user_id);


--
-- Name: APPOINTMENT fk_appointment_authority; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: APPOINTMENT fk_appointment_issue; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id) ON DELETE CASCADE;


--
-- Name: APPOINTMENT fk_appointment_user; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id) ON DELETE CASCADE;


--
-- Name: ATTACHMENT fk_attachment_appointment; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTACHMENT"
    ADD CONSTRAINT fk_attachment_appointment FOREIGN KEY (appointment_id) REFERENCES public."APPOINTMENT"(appointment_id) ON DELETE CASCADE;


--
-- Name: ATTENDEES fk_attendee_appointment; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ATTENDEES"
    ADD CONSTRAINT fk_attendee_appointment FOREIGN KEY (appointment_id) REFERENCES public."APPOINTMENT"(appointment_id) ON DELETE CASCADE;


--
-- Name: AUTHORITIES fk_authorities_category; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT fk_authorities_category FOREIGN KEY (category_id) REFERENCES public."CATEGORIES"(category_id);


--
-- Name: EMBEDDING fk_embedding_issue; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."EMBEDDING"
    ADD CONSTRAINT fk_embedding_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id) ON DELETE CASCADE;


--
-- Name: FEEDBACK fk_feedback_appointment; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FEEDBACK"
    ADD CONSTRAINT fk_feedback_appointment FOREIGN KEY (appointment_id) REFERENCES public."APPOINTMENT"(appointment_id) ON DELETE CASCADE;


--
-- Name: FREE_TIMES fk_free_times_authority; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."FREE_TIMES"
    ADD CONSTRAINT fk_free_times_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_authority; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_category; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_category FOREIGN KEY (category_id) REFERENCES public."CATEGORIES"(category_id);


--
-- Name: ISSUE fk_issue_status; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_status FOREIGN KEY (status_id) REFERENCES public."ISSUE_STATUS"(status_id);


--
-- Name: ISSUE_STATUS fk_issue_status_authority; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE_STATUS"
    ADD CONSTRAINT fk_issue_status_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_user; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id) ON DELETE CASCADE;


--
-- Name: OFFICIAL fk_official_authority; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."OFFICIAL"
    ADD CONSTRAINT fk_official_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: UPVOTE fk_upvote_issue; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT fk_upvote_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id) ON DELETE CASCADE;


--
-- Name: UPVOTE fk_upvote_user; Type: FK CONSTRAINT; Schema: public; Owner: user1
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT fk_upvote_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

