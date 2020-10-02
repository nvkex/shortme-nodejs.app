const router = require('express').Router();

const {
    checkConnection
} = require('../controllers/index');

router.get('/', checkConnection);

