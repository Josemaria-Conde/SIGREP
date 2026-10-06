const express = require('express');
const router = express.Router();
const db = require('../db/init');
const { AppError } = require('../utils/errors');
const inventarioService = require('../services/inventarioService');

