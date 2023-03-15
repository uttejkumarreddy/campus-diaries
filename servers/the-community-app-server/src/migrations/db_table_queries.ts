export { };
const constants = require('../app_constants');

module.exports.createCollegeTable =
  `_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_name varchar(100) NOT NULL unique,
    address varchar(100),
    city varchar(20),
    country varchar(20),
    website varchar(2000),
    banner_image_url varchar(255),
    created_at timestamp DEFAULT NOW() NOT NULL,
    updated_at timestamp DEFAULT NOW() NOT NULL`;

module.exports.createUsersTable =
  `first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    roll_number varchar(30) NOT NULL,
    user_name varchar(20) NOT NULL unique,
    email varchar(100) NOT NULL unique,
    password varchar(255) NOT NULL,
    phone_number varchar(15),
    activated boolean NOT NULL DEFAULT FALSE,
    verified boolean NOT NULL DEFAULT FALSE,
    verification_document_link varchar(255),
    activation_link varchar(255),
    password_reset_link varchar(255),
    password_reset_time timestamp,
    locked_out boolean NOT NULL DEFAULT FALSE,
    deactivated boolean NOT NULL DEFAULT FALSE,
    deactivated_reason varchar(100),
    profile_picture_link varchar(255),
    profile_description varchar(100),
    current_year smallint,
    course varchar(30),
    section varchar(20),
    college_id uuid references ${constants.SCHEMA_NAME}.college(_id) NOT NULL,
    unique (roll_number, college_id),`;

module.exports.creatUsersReportsTable =
  `reported_by uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    reported_reason varchar(100) NOT NULL,
    reportee uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    status varchar(100) NOT NULL DEFAULT 'open',
    admin_comments varchar(200),`;

module.exports.createRoleTable =
  "name varchar(50) NOT NULL unique,";

module.exports.createUserHasRoleTable =
  `role_id uuid references ${constants.SCHEMA_NAME}.role(_id) NOT NULL,
    user_id uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,`;

module.exports.createUserSuggestionsTable =
  `item_id uuid references ${constants.SCHEMA_NAME}.store_item(_id) NOT NULL,
    suggested_by uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    suggested_to uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,`;

module.exports.createStoreItemTable =
  `name varchar(50) NOT NULL,
    description varchar(300),
    price smallint DEFAULT 0,
    status varchar(50) NOT NULL,
    owner_id uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    possessor_id uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    lent_date date,
    lent_duration smallint NOT NULL DEFAULT 21 CHECK(lent_duration >= 0 and lent_duration <= 21),
    restrict boolean NOT NULL DEFAULT FALSE,
    posted_date timestamp NOT NULL DEFAULT NOW(),
    expiration_period smallint NOT NULL DEFAULT 0 CHECK(expiration_period >= 0),
    item_intent varchar(50) NOT NULL DEFAULT 'post',
    report_reason varchar(50),
    reported_by uuid references ${constants.SCHEMA_NAME}.users(_id),`;

module.exports.createStoreItemCategoryTable =
  `name varchar(50) NOT NULL,
    verified boolean  NOT NULL DEFAULT FALSE,`;

module.exports.createStoreItemHasCategoryTable =
  `item_id uuid references ${constants.SCHEMA_NAME}.store_item(_id) NOT NULL,
    category_id uuid references ${constants.SCHEMA_NAME}.store_item_category(_id) NOT NULL,`;

module.exports.createStoreItemAttachmentsTable =
  `item_id uuid references ${constants.SCHEMA_NAME}.store_item(_id) NOT NULL,
    item_url varchar(255) NOT NULL,`;

module.exports.createChoiceTable =
  `description varchar(200),
    table_name varchar(30),
    field varchar(30),
    value_order smallint NOT NULL DEFAULT 0,`;

module.exports.createStoreUserItemCartTable =
  `item_id uuid references ${constants.SCHEMA_NAME}.store_item(_id) NOT NULL,
    user_id uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,`;

module.exports.createStoreItemTransactionTable =
  `requested_by uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    requested_to uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    status varchar(50) NOT NULL,
    verification_code varchar(255),
    request_type varchar(50),
    cancelled_by uuid references ${constants.SCHEMA_NAME}.users(_id),
    cancellation_reason varchar(300) NOT NULL,`;

module.exports.createStoreItemRequestTable =
  `requested_by uuid references ${constants.SCHEMA_NAME}.users(_id) NOT NULL,
    status varchar(50) NOT NULL,
    request_type varchar(50) NOT NULL,
    request_item_name varchar(100) NOT NULL,
    request_item_description varchar(300) NOT NULL,
    urgency smallint NOT NULL DEFAULT 0 CHECK(urgency >= 0),
    expiration_duration smallint NOT NULL CHECK(expiration_duration >= 0),`;


module.exports.setUpdatedAtTrigger =
  `CREATE OR REPLACE FUNCTION ${constants.SCHEMA_NAME}.set_updated_at_column()\n
    RETURNS trigger AS $$\n
        BEGIN\n
            NEW.updated_at = NOW();\n
            IF (TG_OP = 'INSERT') THEN \n
              NEW.created_at = NOW();\n
            END IF;\n
            RETURN NEW;\n
        END;\n
    $$ LANGUAGE 'plpgsql';\n
    CREATE TRIGGER {0}_setUpdatedAtTrigger BEFORE INSERT OR UPDATE ON {1} FOR EACH ROW EXECUTE PROCEDURE ${constants.SCHEMA_NAME}.set_updated_at_column();`

module.exports.hashPasswordBeforeInsertTrigger =
  `CREATE OR REPLACE FUNCTION ${constants.SCHEMA_NAME}.hash_password()\n
    RETURNS trigger AS $$\n
        BEGIN\n
            NEW.password = crypt(OLD.password, gen_salt('bf'));
            RETURN NEW;\n
        END;\n
    $$ LANGUAGE 'plpgsql';\n
    \n
    CREATE TRIGGER {0}_hashPasswordAfterInsert Before INSERT ON {1} FOR EACH ROW EXECUTE PROCEDURE ${constants.SCHEMA_NAME}.hash_password();`;

module.exports.setUpdatedAndCreatedByTrigger =
  `CREATE OR REPLACE FUNCTION ${constants.SCHEMA_NAME}.set_updated_by_column()\n
    RETURNS trigger AS $$\n
        BEGIN\n
            NEW.updated_by = NEW._id;\n
            IF (TG_OP = 'INSERT') THEN \n
               NEW.created_by = NEW._id;\n
            END IF;\n
            RETURN NEW;\n
        END;\n
    $$ LANGUAGE 'plpgsql';\n
    \n
    CREATE TRIGGER {0}_setUpdatedByTrigger BEFORE INSERT OR UPDATE ON {1} FOR EACH ROW EXECUTE PROCEDURE ${constants.SCHEMA_NAME}.set_updated_by_column();`;

module.exports.setUpdatedAndCreatedByForUserReportsTableTrigger =
  `CREATE OR REPLACE FUNCTION ${constants.SCHEMA_NAME}.set_user_reports_updated_by_column()\n
    RETURNS trigger AS $$\n
        BEGIN\n
            NEW.updated_by = NEW.reported_by;\n
            IF (TG_OP = 'INSERT') THEN \n
               NEW.created_by = NEW.reported_by;\n
            END IF;\n
            RETURN NEW;\n
        END;\n
    $$ LANGUAGE 'plpgsql';\n
    \n
    CREATE TRIGGER {0}_setUpdatedByTrigger BEFORE INSERT OR UPDATE ON {1} FOR EACH ROW EXECUTE PROCEDURE ${constants.SCHEMA_NAME}.set_user_reports_updated_by_column();`;