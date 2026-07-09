const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', sessionController.getSessions);
router.get('/current', sessionController.getCurrentSession);
router.post('/', sessionController.createSession);
router.patch('/:id', sessionController.renameSession);
router.patch('/:id/archive', sessionController.archiveSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;
