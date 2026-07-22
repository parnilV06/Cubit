const express = require('express');
const router = express.Router();
const focusController = require('../controllers/focus.controller');

router.get('/', focusController.getFocusTracks);

module.exports = router;
