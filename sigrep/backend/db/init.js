const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS } = require('../constants');
const db = new Database(DB_PATH);

