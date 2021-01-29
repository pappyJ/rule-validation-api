//importing the modules

const express = require('express');

const controller = require('../controllers');

const router = express.Router();

router
  .route('/')

  .get(controller.userProfile);

router
  .route('/validate-rule')

  .post(controller.validateRule);

module.exports = router;
