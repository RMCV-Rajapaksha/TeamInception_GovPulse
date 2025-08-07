--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: APPOINTMENT; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APPOINTMENT" (
    appointment_id integer NOT NULL,
    user_id integer NOT NULL,
    authority_id integer NOT NULL,
    issue_id integer NOT NULL,
    date date,
    time_slot character varying(255)
);


ALTER TABLE public."APPOINTMENT" OWNER TO postgres;

--
-- Name: APPOINTMENT_ATTENDEES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."APPOINTMENT_ATTENDEES" (
    appointment_id integer NOT NULL,
    attendee_id integer NOT NULL
);


ALTER TABLE public."APPOINTMENT_ATTENDEES" OWNER TO postgres;

--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."APPOINTMENT_appointment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."APPOINTMENT_appointment_id_seq" OWNER TO postgres;

--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."APPOINTMENT_appointment_id_seq" OWNED BY public."APPOINTMENT".appointment_id;


--
-- Name: ATTENDEES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ATTENDEES" (
    attendee_id integer NOT NULL,
    nic character varying(255),
    name character varying(255),
    phone_no character varying(20)
);


ALTER TABLE public."ATTENDEES" OWNER TO postgres;

--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ATTENDEES_attendee_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ATTENDEES_attendee_id_seq" OWNER TO postgres;

--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ATTENDEES_attendee_id_seq" OWNED BY public."ATTENDEES".attendee_id;


--
-- Name: AUTHORITIES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AUTHORITIES" (
    authority_id integer NOT NULL,
    name character varying(255) NOT NULL,
    ministry character varying(255),
    hq_location character varying(255),
    location character varying(255),
    description text,
    category_id integer
);


ALTER TABLE public."AUTHORITIES" OWNER TO postgres;

--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AUTHORITIES_authority_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AUTHORITIES_authority_id_seq" OWNER TO postgres;

--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AUTHORITIES_authority_id_seq" OWNED BY public."AUTHORITIES".authority_id;


--
-- Name: CATEGORIES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CATEGORIES" (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public."CATEGORIES" OWNER TO postgres;

--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CATEGORIES_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CATEGORIES_category_id_seq" OWNER TO postgres;

--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CATEGORIES_category_id_seq" OWNED BY public."CATEGORIES".category_id;


--
-- Name: EMBEDDING; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EMBEDDING" (
    embedding_id integer NOT NULL,
    issue_id integer NOT NULL,
    vector text,
    description text,
    title character varying(255)
);


ALTER TABLE public."EMBEDDING" OWNER TO postgres;

--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EMBEDDING_embedding_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EMBEDDING_embedding_id_seq" OWNER TO postgres;

--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EMBEDDING_embedding_id_seq" OWNED BY public."EMBEDDING".embedding_id;


--
-- Name: FREE_TIMES; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FREE_TIMES" (
    authority_id integer NOT NULL,
    date date NOT NULL,
    time_slots text[]
);


ALTER TABLE public."FREE_TIMES" OWNER TO postgres;

--
-- Name: ISSUE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ISSUE" (
    issue_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    district character varying(255),
    gs_division character varying(255),
    ds_division character varying(255),
    urgency_score integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status_id integer,
    authority_id integer,
    category_id integer,
    image_urls text,
    approved_for_appointment_placing boolean DEFAULT false
);


ALTER TABLE public."ISSUE" OWNER TO postgres;

--
-- Name: ISSUE_STATUS; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ISSUE_STATUS" (
    status_id integer NOT NULL,
    status_name character varying(255) NOT NULL,
    authority_id integer
);


ALTER TABLE public."ISSUE_STATUS" OWNER TO postgres;

--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ISSUE_STATUS_status_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ISSUE_STATUS_status_id_seq" OWNER TO postgres;

--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ISSUE_STATUS_status_id_seq" OWNED BY public."ISSUE_STATUS".status_id;


--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ISSUE_issue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ISSUE_issue_id_seq" OWNER TO postgres;

--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ISSUE_issue_id_seq" OWNED BY public."ISSUE".issue_id;


--
-- Name: UPVOTE; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UPVOTE" (
    user_id integer NOT NULL,
    issue_id integer NOT NULL,
    comment text,
    time_stamp timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."UPVOTE" OWNER TO postgres;

--
-- Name: USER; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."USER" (
    user_id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    name character varying(255),
    email character varying(255) NOT NULL,
    nic character varying(255),
    role character varying(50),
    land_name character varying(255),
    profile_image_url text
);


ALTER TABLE public."USER" OWNER TO postgres;

--
-- Name: USER_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."USER_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."USER_user_id_seq" OWNER TO postgres;

--
-- Name: USER_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."USER_user_id_seq" OWNED BY public."USER".user_id;


--
-- Name: APPOINTMENT appointment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT" ALTER COLUMN appointment_id SET DEFAULT nextval('public."APPOINTMENT_appointment_id_seq"'::regclass);


--
-- Name: ATTENDEES attendee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ATTENDEES" ALTER COLUMN attendee_id SET DEFAULT nextval('public."ATTENDEES_attendee_id_seq"'::regclass);


--
-- Name: AUTHORITIES authority_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AUTHORITIES" ALTER COLUMN authority_id SET DEFAULT nextval('public."AUTHORITIES_authority_id_seq"'::regclass);


--
-- Name: CATEGORIES category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CATEGORIES" ALTER COLUMN category_id SET DEFAULT nextval('public."CATEGORIES_category_id_seq"'::regclass);


--
-- Name: EMBEDDING embedding_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EMBEDDING" ALTER COLUMN embedding_id SET DEFAULT nextval('public."EMBEDDING_embedding_id_seq"'::regclass);


--
-- Name: ISSUE issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE" ALTER COLUMN issue_id SET DEFAULT nextval('public."ISSUE_issue_id_seq"'::regclass);


--
-- Name: ISSUE_STATUS status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE_STATUS" ALTER COLUMN status_id SET DEFAULT nextval('public."ISSUE_STATUS_status_id_seq"'::regclass);


--
-- Name: USER user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USER" ALTER COLUMN user_id SET DEFAULT nextval('public."USER_user_id_seq"'::regclass);


--
-- Data for Name: APPOINTMENT; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APPOINTMENT" (appointment_id, user_id, authority_id, issue_id, date, time_slot) FROM stdin;
1	1	1	1	2025-08-15	10:00 - 11:00
\.


--
-- Data for Name: APPOINTMENT_ATTENDEES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."APPOINTMENT_ATTENDEES" (appointment_id, attendee_id) FROM stdin;
1	1
1	2
\.


--
-- Data for Name: ATTENDEES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ATTENDEES" (attendee_id, nic, name, phone_no) FROM stdin;
1	334455667V	Michael Brown	0771234567
2	667788990V	Emily White	0719876543
\.


--
-- Data for Name: AUTHORITIES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AUTHORITIES" (authority_id, name, ministry, hq_location, location, description, category_id) FROM stdin;
1	Road Development Authority	Ministry of Transport	Colombo	Western Province	Responsible for road infrastructure maintenance.	1
2	National Water Supply & Drainage Board	Ministry of Water Resources	Kandy	Central Province	Manages water supply and drainage systems.	3
\.


--
-- Data for Name: CATEGORIES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CATEGORIES" (category_id, category_name, description) FROM stdin;
1	Road Infrastructure	Issues related to roads, bridges, and highways.
2	Public Health	Concerns regarding public hospitals, clinics, and sanitation.
3	Water Supply	Problems with clean water access and distribution.
4	Waste Management	Issues related to garbage collection and disposal.
\.


--
-- Data for Name: EMBEDDING; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EMBEDDING" (embedding_id, issue_id, vector, description, title) FROM stdin;
1	1	some_vector_data_for_pothole	Description for pothole embedding.	Pothole Embedding Title
\.


--
-- Data for Name: FREE_TIMES; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FREE_TIMES" (authority_id, date, time_slots) FROM stdin;
1	2025-08-15	{"10:00 - 11:00","11:30 - 12:30","14:00 - 15:00"}
2	2025-08-16	{"09:00 - 10:00","13:00 - 14:00"}
\.


--
-- Data for Name: ISSUE; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ISSUE" (issue_id, user_id, title, description, district, gs_division, ds_division, urgency_score, created_at, status_id, authority_id, category_id, image_urls, approved_for_appointment_placing) FROM stdin;
1	1	Pothole on Main Street	A large pothole has formed on the main street, causing traffic issues.	Colombo	Colombo North	Colombo Central	8	2025-08-07 14:19:18.607709+05:30	1	1	1	\N	f
2	2	No clean water in our area	For the past three days, our neighborhood has not had a clean water supply.	Kandy	Kandy West	Gangawata Korale	9	2025-08-07 14:19:18.607709+05:30	3	2	3	\N	t
\.


--
-- Data for Name: ISSUE_STATUS; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ISSUE_STATUS" (status_id, status_name, authority_id) FROM stdin;
1	Pending Review	1
2	Assigned to Team	1
3	Completed	2
\.


--
-- Data for Name: UPVOTE; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UPVOTE" (user_id, issue_id, comment, time_stamp) FROM stdin;
2	1	I agree, this is a serious problem!	2025-08-07 14:19:18.615161+05:30
1	2	Hope this gets resolved soon.	2025-08-07 14:19:18.615161+05:30
\.


--
-- Data for Name: USER; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."USER" (user_id, first_name, last_name, name, email, nic, role, land_name, profile_image_url) FROM stdin;
1	John	Doe	John Doe	john.doe@email.com	123456789V	Citizen	\N	\N
2	Jane	Smith	Jane Smith	jane.smith@email.com	987654321V	Citizen	\N	\N
3	Alice	Johnson	Alice Johnson	alice.j@government.lk	112233445V	Authority Representative	\N	\N
\.


--
-- Name: APPOINTMENT_appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."APPOINTMENT_appointment_id_seq"', 1, true);


--
-- Name: ATTENDEES_attendee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ATTENDEES_attendee_id_seq"', 2, true);


--
-- Name: AUTHORITIES_authority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AUTHORITIES_authority_id_seq"', 2, true);


--
-- Name: CATEGORIES_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CATEGORIES_category_id_seq"', 4, true);


--
-- Name: EMBEDDING_embedding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EMBEDDING_embedding_id_seq"', 1, true);


--
-- Name: ISSUE_STATUS_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ISSUE_STATUS_status_id_seq"', 3, true);


--
-- Name: ISSUE_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ISSUE_issue_id_seq"', 2, true);


--
-- Name: USER_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."USER_user_id_seq"', 3, true);


--
-- Name: APPOINTMENT_ATTENDEES APPOINTMENT_ATTENDEES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT_ATTENDEES"
    ADD CONSTRAINT "APPOINTMENT_ATTENDEES_pkey" PRIMARY KEY (appointment_id, attendee_id);


--
-- Name: APPOINTMENT APPOINTMENT_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT "APPOINTMENT_pkey" PRIMARY KEY (appointment_id);


--
-- Name: ATTENDEES ATTENDEES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ATTENDEES"
    ADD CONSTRAINT "ATTENDEES_pkey" PRIMARY KEY (attendee_id);


--
-- Name: AUTHORITIES AUTHORITIES_category_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT "AUTHORITIES_category_id_key" UNIQUE (category_id);


--
-- Name: AUTHORITIES AUTHORITIES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT "AUTHORITIES_pkey" PRIMARY KEY (authority_id);


--
-- Name: CATEGORIES CATEGORIES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CATEGORIES"
    ADD CONSTRAINT "CATEGORIES_pkey" PRIMARY KEY (category_id);


--
-- Name: EMBEDDING EMBEDDING_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EMBEDDING"
    ADD CONSTRAINT "EMBEDDING_pkey" PRIMARY KEY (embedding_id);


--
-- Name: FREE_TIMES FREE_TIMES_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FREE_TIMES"
    ADD CONSTRAINT "FREE_TIMES_pkey" PRIMARY KEY (authority_id, date);


--
-- Name: ISSUE_STATUS ISSUE_STATUS_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE_STATUS"
    ADD CONSTRAINT "ISSUE_STATUS_pkey" PRIMARY KEY (status_id);


--
-- Name: ISSUE ISSUE_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT "ISSUE_pkey" PRIMARY KEY (issue_id);


--
-- Name: UPVOTE UPVOTE_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT "UPVOTE_pkey" PRIMARY KEY (user_id, issue_id);


--
-- Name: USER USER_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USER"
    ADD CONSTRAINT "USER_email_key" UNIQUE (email);


--
-- Name: USER USER_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."USER"
    ADD CONSTRAINT "USER_pkey" PRIMARY KEY (user_id);


--
-- Name: APPOINTMENT_ATTENDEES fk_appointment_attendees_appointment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT_ATTENDEES"
    ADD CONSTRAINT fk_appointment_attendees_appointment FOREIGN KEY (appointment_id) REFERENCES public."APPOINTMENT"(appointment_id);


--
-- Name: APPOINTMENT_ATTENDEES fk_appointment_attendees_attendee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT_ATTENDEES"
    ADD CONSTRAINT fk_appointment_attendees_attendee FOREIGN KEY (attendee_id) REFERENCES public."ATTENDEES"(attendee_id);


--
-- Name: APPOINTMENT fk_appointment_authority; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: APPOINTMENT fk_appointment_issue; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id);


--
-- Name: APPOINTMENT fk_appointment_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."APPOINTMENT"
    ADD CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id);


--
-- Name: AUTHORITIES fk_authorities_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AUTHORITIES"
    ADD CONSTRAINT fk_authorities_category FOREIGN KEY (category_id) REFERENCES public."CATEGORIES"(category_id);


--
-- Name: EMBEDDING fk_embedding_issue; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EMBEDDING"
    ADD CONSTRAINT fk_embedding_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id);


--
-- Name: FREE_TIMES fk_free_times_authority; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FREE_TIMES"
    ADD CONSTRAINT fk_free_times_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_authority; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_category FOREIGN KEY (category_id) REFERENCES public."CATEGORIES"(category_id);


--
-- Name: ISSUE fk_issue_status; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_status FOREIGN KEY (status_id) REFERENCES public."ISSUE_STATUS"(status_id);


--
-- Name: ISSUE_STATUS fk_issue_status_authority; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE_STATUS"
    ADD CONSTRAINT fk_issue_status_authority FOREIGN KEY (authority_id) REFERENCES public."AUTHORITIES"(authority_id);


--
-- Name: ISSUE fk_issue_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ISSUE"
    ADD CONSTRAINT fk_issue_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id);


--
-- Name: UPVOTE fk_upvote_issue; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT fk_upvote_issue FOREIGN KEY (issue_id) REFERENCES public."ISSUE"(issue_id);


--
-- Name: UPVOTE fk_upvote_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UPVOTE"
    ADD CONSTRAINT fk_upvote_user FOREIGN KEY (user_id) REFERENCES public."USER"(user_id);


--
-- PostgreSQL database dump complete
--

