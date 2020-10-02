const router = require('express').Router();

const {
    checkConnection,
    getURL,
    shortenURL
} = require('../controllers/index');

router.get('/', checkConnection);

router.get('/:id', getURL);

router.post('/url', shortenURL);

module.exports = router;