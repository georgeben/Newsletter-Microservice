const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Subscribe to our newsletter',
    message: req.flash('subscriptionMessage'),
  });
});

module.exports = router;
