const express = require('express');
const router = express.Router();
const solveController = require('../controllers/solve.controller');

router.get('/session/:sessionId', solveController.getSolves);
router.post('/', solveController.addSolve);
router.patch('/:id', solveController.updateSolve);
router.delete('/:id', solveController.deleteSolve);

module.exports = router;
