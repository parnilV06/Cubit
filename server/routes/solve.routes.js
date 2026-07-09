const express = require('express');
const router = express.Router();
const solveController = require('../controllers/solve.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/session/:sessionId', solveController.getSolves);
router.post('/', solveController.addSolve);
router.patch('/:id', solveController.updateSolve);
router.delete('/:id', solveController.deleteSolve);

module.exports = router;
