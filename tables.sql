CREATE TABLE articles (
	name text,
	price text,
	author bigserial,
	guild bigserial,
	messageId bigserial,
	channel bigserial,
	link text,
	buyer bigserial,
	id bigserial
);

CREATE TABLE channels (
	id bigserial,
	guild bigserial,
	type text
);

CREATE TABLE moneys (
	guild bigserial,
	moneys text
);

CREATE TABLE sellers (
	member bigserial,
	guild bigserial,
	wishlist text[],
	stars bigserial[],
	profileMessageId bigserial,
	profileMessageChannel bigserial
);

CREATE TABLE valuations (
	seller bigserial,
	guild bigserial,
	author bigserial,
	note integer,
	comment text,
	star boolean
);

CREATE TABLE rewards (
	guild bigserial,
	stars bigserial,
	role bigserial
);

CREATE TABLE fidelity (
	member bigserial,
	nb bigserial
);

CREATE TABLE language (
	member bigserial,
	language text
);

CREATE TABLE votes (
	member bigserial,
	moment timestamp
);
