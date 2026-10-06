const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const { ROLES_VALIDOS, BCRYPT_SALT_ROUNDS } = require('../constants');

