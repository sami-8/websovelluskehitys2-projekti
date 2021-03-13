const express = require('express');
const pastesController = require('../controllers/pastes_controller');

const router = express.Router();

router.get('/', pastesController.validateGetPage, pastesController.getPage);
router.get('/random', pastesController.getRandom);
router.get('/:id', pastesController.getOne);
router.get('/:id/raw', pastesController.getOneRaw);
router.delete('/:id', pastesController.validateDeleteOne, pastesController.deleteOne);
router.post('/', pastesController.validateCreate, pastesController.create);
router.post('/raw', express.text({ type: '*/*' }), pastesController.createRaw);

module.exports = router;
