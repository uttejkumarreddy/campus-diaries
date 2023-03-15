// Queries will be executed in the order they are present here
module.exports.CREATE_TABLE_COLLEGE = `CREATE TABLE public.COLLEGE (
	id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(255) NOT NULL,
	address VARCHAR(400) NOT NULL,
	pincode VARCHAR(20) NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(100) NOT NULL,
	abbreviation VARCHAR(10) NOT NULL,
	subscription VARCHAR(10) NOT NULL,
	active boolean NOT NULL DEFAULT 'y',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

module.exports.CREATE_TABLE_ATTACHMENT = `CREATE TABLE public.ATTACHMENT (
	id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	record_table VARCHAR(30) NOT NULL,
	record_id VARCHAR(40) NOT NULL,
	uri VARCHAR(2083) NOT NULL,
	active boolean NOT NULL DEFAULT 'y',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

module.exports.CREATE_TABLE_GROUP = `CREATE TABLE public.GROUP (
	id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	name VARCHAR(40) NOT NULL,
	description VARCHAR(100),
	created_by uuid NOT NULL,
	admin uuid NOT NULL,
	active boolean NOT NULL DEFAULT 'y',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

module.exports.CREATE_TABLE_USERS = `CREATE TABLE USERS (
	id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	college_id uuid NOT NULL,
	first_name VARCHAR (20) NOT NULL,
	last_name VARCHAR (20) NOT NULL,
	user_name VARCHAR (20) NOT NULL,
	roll_number VARCHAR (20) NOT NULL,
	email VARCHAR (355) NOT NULL UNIQUE,
	password VARCHAR (126) NOT NULL,
	password_needs_reset BOOLEAN NOT NULL DEFAULT 'n',
	password_reset_link VARCHAR(72),
	activated BOOLEAN NOT NULL DEFAULT 'n',
	activation_link VARCHAR(72),
	verified BOOLEAN NOT NULL DEFAULT 'n',
	locked_out BOOLEAN NOT NULL DEFAULT 'n',
	deactivated BOOLEAN NOT NULL DEFAULT 'n',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (college_id, roll_number)
);`;

module.exports.CREATE_TABLE_POST = `CREATE TABLE POST (
	id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	title VARCHAR(40),
	content VARCHAR(400),
	short_description VARCHAR(100),
	posted_by uuid NOT NULL,
	posted_in uuid,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;