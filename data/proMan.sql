--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;



DROP TABLE IF EXISTS public.statuses;
DROP SEQUENCE IF EXISTS public.statuses_id_seq;
CREATE TABLE statuses (
    id serial not NULL,
    title text
);

DROP TABLE IF EXISTS public.boards;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
    id serial not NULL,
    title text,
    user_id int,
    public bool
);


DROP TABLE IF EXISTS public.cards;
DROP SEQUENCE IF EXISTS public.cards_id_seq;
CREATE TABLE cards (
    id serial not NULL,
    board_id int,
    title text,
    status_id int,
    card_order int
);


DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial not NULL,
    user_name text unique,
    password text
);


ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_status_id PRIMARY KEY (id);

ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_board_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_card_id PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);



ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);



INSERT INTO users VALUES (DEFAULT, 'admin', '$2b$12$jXWgU/asaN7kwaSdoVWuge1pWkg/Je4gSViTUMKipZBffr4To0XmS')
    RETURNING id;



INSERT INTO boards VALUES (DEFAULT, 'test_board', 1, true)
    RETURNING id;

INSERT INTO statuses VALUES (DEFAULT, 'new')
    RETURNING id;

INSERT INTO statuses VALUES (DEFAULT, 'in progress')
    RETURNING id;

INSERT INTO statuses VALUES (DEFAULT, 'testing')
    RETURNING id;

INSERT INTO statuses VALUES (DEFAULT, 'done')
    RETURNING id;

INSERT INTO cards VALUES (DEFAULT, 1, 'test', 1, 0)
    RETURNING id;
