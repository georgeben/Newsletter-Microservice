const express = require('express');
const { makeInvoker } = require('awilix-express');
const subscriberController = require('../controllers/subscribers.controller');

const router = express.Router();
const api = makeInvoker(subscriberController);

router.post('/', api('addSubscriber'));

module.exports = router;
