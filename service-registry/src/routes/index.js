const router = require('express').Router();
const { makeInvoker } = require('awilix-express');
const RegisterController = require('../controllers/register.controller');

const api = makeInvoker(RegisterController);

router.get('/list', api('getServices'));
router.get('/:name/:version', api('findService'));
router.put('/register', api('registerService'));
router.delete('/register', api('unregisterService'));

module.exports = router;
