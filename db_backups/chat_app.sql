--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-17 00:13:51

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

--
-- TOC entry 4854 (class 0 OID 16643)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, avatar, online, created_at, email, password, role) FROM stdin;
2	Thanh Hoàng	http://localhost:3197/uploads/avatars/1749998664722-90869112.JPEG	f	2025-06-12 21:47:22.955686	thanhhoang4959@gmail.com	$2b$10$H03un0L/vZ0cttPYjxTWQuxKdggceU4LxnrpH1IS306OiuKTx4IUi	user
10	Tiến Hoàng	http://localhost:3197/uploads/avatars/1749999567983-419074724.jpg	f	2025-06-15 21:51:08.869749	tienhoang97@gmail.com	$2b$10$/9Q3kL7tu0Zu2Mo0hfTu1OdpucRTPm5o3CDx52yS2QOgxTG5AtLJq	user
11	Quyền Phạm	http://localhost:3197/uploads/avatars/1749999637959-506763018.jpg	f	2025-06-15 21:51:55.968674	quyenpham@gmail.com	$2b$10$nZKDLsfKX5jHYMjxkCmE..tvqhdEr9RBTYHoRdLv60zZWIMpluBJO	user
12	Lê Hoàng	http://localhost:3197/uploads/avatars/1749999678822-504180720.jpg	f	2025-06-15 21:52:13.657759	lehoang@gmail.com	$2b$10$RwqGtlduI44oFWA6MnE/3uVw.JaUuiPTzOHrPZ2H1yR1uBdpAE/06	user
13	Đen Lê	http://localhost:3197/uploads/avatars/1749999727501-754879207.jpg	f	2025-06-15 21:52:57.24064	denle@gmail.com	$2b$10$f2v/q2v7U9lPjkBCtcPZGesxdoANTEqVUdAAvEf4etYjoOkVhi7Qm	user
4	Nghi Phan	http://localhost:3197/uploads/avatars/1749998734300-59673392.JPEG	f	2025-06-12 21:48:03.437828	phantinhnghi@gmail.com	$2b$10$CTXxd5otPsOxmbK/FR3zqep519bRXbXpr3DGxKgYFQ8p1gLgJSona	user
5	Vi Phan	http://localhost:3197/uploads/avatars/1749998756294-85702384.jpg	f	2025-06-12 21:48:23.879462	viphan@gmail.com	$2b$10$UCfL5bex3zAXnfQiR8J4POEy5vR7sO3CraiOTDrt4Y5DiYRyPyFTi	user
7	Tuấn Phan	http://localhost:3197/uploads/avatars/1749998782096-352946669.jpg	f	2025-06-12 21:58:44.9932	phandinhtuan@gmail.com	$2b$10$HI2uHgrNJVquB.7VS5W9ze3A0u10R0B3Eq4VYiw7MhUhDUAAW7gna	user
14	Võ Ngọc Trung	http://localhost:3197/uploads/avatars/1749999770399-462550546.jpg	f	2025-06-15 21:54:22.819153	vongoctrung@gmail.com	$2b$10$6YT5UkaRBN2zv8sPaz4c/egmBWGHShzYxrp.85dikErIV9dAnP1W2	user
15	Thuận Nguyễn	http://localhost:3197/uploads/avatars/1749999811346-536012679.jpg	f	2025-06-15 21:54:43.365227	thuannguyen@gmail.com	$2b$10$GEdpADQ1x.y9K5asNiBI2OPHULjzxMMV4elRQyPyNWHxvSi5g/xnG	user
3	Khánh Linh	http://localhost:3197/uploads/avatars/1749998701940-663645302.JPEG	f	2025-06-12 21:47:49.055114	khanhlinh@gmail.com	$2b$10$POlDO422AbL2n.MpC3ijTOinv6Ik3lDjW5l8dEMBkYoK4AsOFsNmS	user
16	Nguyễn Thái	http://localhost:3197/uploads/avatars/1750000101209-959776645.jpg	f	2025-06-15 22:06:45.184624	nguyenthai@gmail.com	$2b$10$cSw.3eRa7taKdE9SOO/8a./jHlyUzfsadWEenBRe4TAVnoCX38jve	user
17	Kim Hoàn	http://localhost:3197/uploads/avatars/1750000113247-319351217.jpg	f	2025-06-15 22:06:56.201184	kimhoan@gmail.com	$2b$10$jsSSxyhfwp7bY8AJ7KCfpOsbWJ51ibVU.KUbFVGoyKA47guxZtaFS	user
1	Toàn Phan	http://localhost:3197/uploads/avatars/1749998844945-643415084.JPEG	t	2025-06-12 21:46:33.362117	toanphangl1997@gmail.com	$2b$10$AacU5ErW6bC40HzLes9l0OiTVThiS2FnH7GCjBgYsOyxXjscb3X5q	user
\.


--
-- TOC entry 4856 (class 0 OID 16657)
-- Dependencies: 220
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, content, created_at) FROM stdin;
1	1	2	Aloha	2025-06-12 22:34:59.646899
2	2	1	Ahaha	2025-06-12 22:35:08.921937
3	1	3	Hello!	2025-06-14 20:39:16.821957
4	1	4	Hello!	2025-06-14 20:40:04.92863
5	1	5	Hello!	2025-06-14 20:40:08.145721
6	1	7	Hello!	2025-06-14 20:40:48.839735
7	1	2	Ahihi	2025-06-15 00:54:25.545876
8	1	2	Ihaha	2025-06-15 00:54:31.656888
9	1	2	Ahuhu	2025-06-15 00:54:35.791277
10	1	3	Hi am Biku81	2025-06-15 00:57:35.357393
11	1	3	Hi am Biku81	2025-06-15 00:57:37.137292
12	1	3	Hi am Biku81	2025-06-15 00:57:37.761351
13	1	3	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:39.116332
14	1	4	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:42.706683
15	1	5	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:45.036954
16	1	7	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:47.746344
17	1	7	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:50.34828
18	1	7	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:52.485032
19	1	5	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:54.663878
20	1	5	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:56.311962
21	1	4	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:57:59.7585
22	1	4	Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:58:01.76831
23	1	2	Hi am Biku81Hi am Biku81Hi am Biku81	2025-06-15 00:58:16.186793
24	1	2	ádasdasdasdádsdsadasd	2025-06-15 20:45:49.978564
25	2	1	ádssssssssssssssssssssssssssssssssssssssssssssssssssssssssss	2025-06-15 20:50:40.599954
26	1	2	ádasdasdassssssssssssssssssssssssssssssssssssssssssssssssssssssssss	2025-06-15 20:51:01.146963
27	1	2	ádasdasdasda	2025-06-15 20:59:14.662244
28	1	2	ádasdsa	2025-06-15 20:59:17.544403
29	2	1	ádasdasd	2025-06-15 20:59:22.82734
30	2	1	ádasdasdasd	2025-06-15 20:59:56.926342
31	2	1	345345345	2025-06-15 21:00:04.350997
32	1	2	123123123123	2025-06-15 21:00:29.233624
33	2	1	123123123	2025-06-15 21:00:32.911791
34	1	2	565656	2025-06-15 21:00:46.146731
35	2	1	9090909	2025-06-15 21:00:51.659011
36	1	2	123	2025-06-15 21:07:15.355275
37	2	1	456	2025-06-15 21:07:28.124835
38	1	10	Hello! Tiến Hoàng	2025-06-15 22:00:10.905106
39	1	11	Hello! Phạm Anh Quyền	2025-06-15 22:00:52.364073
40	1	12	Hello! Nguyễn Lê Hoàng	2025-06-15 22:01:30.500415
41	1	13	Hello! Đen Lê	2025-06-15 22:02:18.715336
42	1	14	Hello! Ngọc Trung	2025-06-15 22:03:04.806766
44	1	15	Hello! Nguyễn Văn Thuận	2025-06-15 22:03:53.251746
45	1	16	Hello! Nguyễn Hoàng Thái	2025-06-15 22:07:36.106585
46	1	17	Hello! Lê Kim Hoàn	2025-06-15 22:07:54.669561
47	1	3	Hi!	2025-06-16 17:05:45.369992
\.


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 219
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 47, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


-- Completed on 2025-06-17 00:13:52

--
-- PostgreSQL database dump complete
--

