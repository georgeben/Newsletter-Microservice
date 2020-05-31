const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const SubscriberController = require('../controllers/subscriber.controller');

const api = makeInvoker(SubscriberController);

const router = Router();

router.get('/subscribers', api('fetchAllSubscribers'));
router.post('/subscribers', api('addSubscriber'));
router.post('/unsubscribe', api('unsubscribe'));
router.delete('/subscribers', api('deleteSubscriber'));

module.exports = router;
