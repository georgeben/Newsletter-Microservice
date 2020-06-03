const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const notificationController = require('../controllers/notification.controller');

const api = makeInvoker(notificationController);

const router = Router();

router.post('/notification/welcome', api('sendWelcomeMail'));

module.exports = router;
