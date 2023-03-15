// MAINTAIN TABLES BY ORDER HERE WITH TABLES HAVING RELATIONS KEPT LATER THAN THOSE WHICH THEY HAVE A RELATION TO
module.exports.CREATE_TABLE_COLLEGE = `CREATE TABLE COLLEGE (
    college_id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	  customer serial,
    name character varying(100) NOT NULL,
    address character varying(400) NOT NULL,
    city character varying(30) NOT NULL,
    state character varying(30) NOT NULL,
    abbreviation character varying(10) NOT NULL,
    subscription character varying(10) NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

module.exports.CREATE_TABLE_CDUSER = `CREATE TABLE CDUSER (
	user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	college_id uuid NOT NULL REFERENCES college(college_id),
	first_name VARCHAR (20) NOT NULL, 
	last_name VARCHAR (20) NOT NULL,
	user_name VARCHAR (20) NOT NULL,
	roll_number VARCHAR (20) NOT NULL UNIQUE,
	email VARCHAR (355) NOT NULL UNIQUE,
	password VARCHAR (60) NOT NULL,
	activation_link VARCHAR(72),
	password_reset_link VARCHAR(72),
	active BOOLEAN NOT NULL DEFAULT 'n',
	verified BOOLEAN NOT NULL DEFAULT 'n',
	locked_out BOOLEAN NOT NULL DEFAULT 'n',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (roll_number, college_id)
);`;

