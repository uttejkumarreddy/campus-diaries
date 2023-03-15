module.exports.seedUsersTableData = [{
    _id: '2f638648-f0fe-4730-afd3-18682a3c5464',
    first_name: 'Sai Charan',
    last_name: 'Chakrala',
    roll_number: '1602-15-733-095',
    user_name: 'charan.chakrala',
    email: 'saicharan193@gmail.com',
    password: "admin",
    activated: true,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    password_reset_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    first_name: 'Bharadwaj',
    last_name: 'Sripathi',
    roll_number: '1602-15-733-065',
    user_name: 'bharadwaj.sripathi',
    email: 'sripathibharadwaj@gmail.com',
    password: "admin",
    activated: true,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    password_reset_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: 'b707a243-da5d-47c7-9402-db80ff15db6d',
    first_name: 'Rahul',
    last_name: 'Guntha',
    roll_number: '1602-15-733-086',
    user_name: 'rahul.guntha',
    email: 'grahul27111997@gmail.com',
    password: "admin",
    activated: true,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    password_reset_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: '041523b7-1a00-43eb-80a8-a4fa7a9b1f82',
    first_name: 'Uttej Kumar',
    last_name: 'Gade',
    roll_number: '1602-15-733-114',
    user_name: 'uttej.gade',
    email: 'uttej60@gmail.com',
    password: "$2b$10$f3jWcCmcyKsUMUgsovtjjuwYsdNoZ/Yp744OdZXfHNxTE4wUz2mOS", // helloworld
    activated: true,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    password_reset_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: 'd5d426d1-7698-4475-b3a5-05d8e8eb9338',
    first_name: 'Chaanakya',
    last_name: 'Yanamandra',
    roll_number: '1602-15-733-064',
    user_name: 'chaanakya.yanamandra',
    email: 'schaanakya@gmail.com',
    password: "admin",
    activated: true,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    password_reset_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: 'e4c54ab6-c826-4eea-8b58-b24a93296062',
    first_name: 'Gopal',
    last_name: 'Dharavath',
    roll_number: '1602-15-733-073',
    user_name: 'gopal.dharavath',
    email: 'gopaldharavath567@gmail.com',
    password: "admin",
    activated: false,
    verified: true,
    activation_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}, {
    _id: '332a9bb1-1426-41aa-ae46-53163cb7033d',
    first_name: 'Naveen',
    last_name: 'Khewji',
    roll_number: '1602-15-733-082',
    user_name: 'naveen.khewji',
    email: 'naveenkhewji@gmail.com',
    password: "admin",
    activated: true,
    verified: false,
    activation_link: 'https://www.google.co.in/',
    college_id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525'
}];

module.exports.seedCollegeTableData = [{
    _id: 'a7aa7ecc-f576-494a-b0a7-4915e5f6b525',
    college_name: 'Vasavi College of Engineering',
    address: 'Vasavi college, Ibrahim Bagh',
    city: 'Hyderabad',
    country: 'India',
    website: 'https://www.vce.ac.in/'
}, {
    _id: 'd22b722f-47df-4dca-bf4e-14b8c9ed5d24',
    college_name: 'Indian Institute of Technology Bombay',
    address: 'Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076',
    city: 'Mumbai',
    country: 'India',
    website: 'http://www.iitb.ac.in/'
}, {
    _id: '84ad8e74-f443-49b9-909e-f8716125fe2a',
    college_name: 'Indian Institute of Technology Kharagpur',
    address: 'Kharagpur, West Bengal 721302',
    city: 'Kharagpur',
    country: 'India',
    website: 'http://www.iitkgp.ac.in/'
}, {
    _id: 'c48a7b18-d8a1-4eb1-b45c-894181d76924',
    college_name: 'Indian Institute of Science',
    address: 'CV Raman Rd, Bengaluru, Karnataka 560012',
    city: 'Bengaluru',
    country: 'India',
    website: 'https://www.iisc.ac.in/'
}];

module.exports.seedUsersReportsTableData = [];

module.exports.seedRoleTableData = [{
    _id: '8d35b038-b2be-419e-aeae-228b634dda61',
    name: 'admin',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
},{
    _id: '52e7d5f7-ae5f-4f1c-a8a0-bcecc24d8e4a',
    name: 'super admin',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedUserHasRoleTableData = [{
    role_id: '8d35b038-b2be-419e-aeae-228b634dda61',
    user_id: '2f638648-f0fe-4730-afd3-18682a3c5464',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    role_id: '8d35b038-b2be-419e-aeae-228b634dda61',
    user_id: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    role_id: '8d35b038-b2be-419e-aeae-228b634dda61',
    user_id: '041523b7-1a00-43eb-80a8-a4fa7a9b1f82',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    role_id: '8d35b038-b2be-419e-aeae-228b634dda61',
    user_id: 'b707a243-da5d-47c7-9402-db80ff15db6d',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedUserSuggestionsTableData = [{
    item_id: '9f4c5685-8ec6-4b12-b6f9-f5938072fa77',
    suggested_by: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    suggested_to: 'd5d426d1-7698-4475-b3a5-05d8e8eb9338',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    item_id: 'c492213a-3bb3-46d3-b00c-e460af3d3ad4',
    suggested_by: 'd5d426d1-7698-4475-b3a5-05d8e8eb9338',
    suggested_to: '041523b7-1a00-43eb-80a8-a4fa7a9b1f82',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedStoreItemTableData = [{
    _id: '9f4c5685-8ec6-4b12-b6f9-f5938072fa77',
    name: 'Drafter',
    description: 'Nice drafter, please use it',
    status: 'Available for Sale',
    owner_id: '2f638648-f0fe-4730-afd3-18682a3c5464',
    possessor_id: '2f638648-f0fe-4730-afd3-18682a3c5464',
    lent_duration: '14',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    _id: 'c492213a-3bb3-46d3-b00c-e460af3d3ad4',
    name: 'ISM Notes',
    description: 'If you want, take it',
    status: 'Available to Borrow',
    owner_id: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    possessor_id: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    lent_duration: '21',
    created_by: 'b219eae8-d207-4950-9bd5-b6fe2531c031',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedStoreItemCategoryTableData = [{
    _id: 'a0c9176e-46f3-457e-81f7-6efe1471e94b',
    name: 'Stationery',
    verified: true,
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    _id: '5f3f04ea-e3d7-4c29-9d40-39db3aee09e9',
    name: 'Notes',
    verified: true,
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    _id: 'aac85a90-a968-4282-ba80-d4681b8792d1',
    name: 'Novels',
    verified: true,
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    _id: 'f5d06a74-26b1-472c-941d-adefa59c4ca7',
    name: 'Others',
    verified: true,
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
},  {
    _id: '4e1fca6e-4a5d-4b7a-9653-29da15faf7f2',
    name: 'Engineering Items',
    verified: false,
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedStoreItemHasCategoryTableData = [{
    item_id: '9f4c5685-8ec6-4b12-b6f9-f5938072fa77',
    category_id: 'a0c9176e-46f3-457e-81f7-6efe1471e94b',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
    item_id: 'c492213a-3bb3-46d3-b00c-e460af3d3ad4',
    category_id: '5f3f04ea-e3d7-4c29-9d40-39db3aee09e9',
    created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
    updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedChoiceTableData = [{
  table_name: 'store_item',
  field: 'status',
  description: 'Draft',
  created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
  updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
  table_name: 'store_item',
  field: 'status',
  description: 'Available to Buy',
  created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
  updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}, {
  table_name: 'store_item',
  field: 'status',
  description: 'Available to Sell',
  created_by: '2f638648-f0fe-4730-afd3-18682a3c5464',
  updated_by: '2f638648-f0fe-4730-afd3-18682a3c5464'
}];

module.exports.seedStoreItemAttachmentsTableData = [];
module.exports.seedStoreUserItemCartTableData = [];
module.exports.seedStoreItemTransactionTableData = [];
module.exports.seedStoreItemRequestTableData = [];